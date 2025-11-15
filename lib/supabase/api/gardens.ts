import { supabase, handleSupabaseError, isSupabaseConfigured } from '../client';
import { Database } from '../types';
import { validateUUID, identifyIdType } from '@/lib/utils';

type Garden = Database['public']['Tables']['gardens']['Row'];
type GardenInsert = Database['public']['Tables']['gardens']['Insert'];
type GardenUpdate = Database['public']['Tables']['gardens']['Update'];

// Convert database row to app format
function convertFromDb(garden: Garden) {
  return {
    id: garden.id,
    nama: garden.nama,
    slug: garden.slug || '',
    lokasi: garden.lokasi,
    lokasiLengkap: garden.lokasi_lengkap,
    luas: Number(garden.luas),
    jumlahPohon: garden.jumlah_pohon,
    tahunTanam: garden.tahun_tanam,
    varietas: garden.varietas,
    status: garden.status,
    createdAt: new Date(garden.created_at),
    updatedAt: new Date(garden.updated_at),
  };
}

// Convert app format to database format
function convertToDb(garden: any): GardenInsert | GardenUpdate {
  return {
    nama: garden.nama,
    slug: garden.slug,
    lokasi: garden.lokasi,
    lokasi_lengkap: garden.lokasiLengkap,
    luas: garden.luas,
    jumlah_pohon: garden.jumlahPohon,
    tahun_tanam: garden.tahunTanam,
    varietas: garden.varietas,
    status: garden.status,
  };
}

/**
 * Fetch all gardens
 */
export async function getAllGardens() {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('gardens')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      data: data?.map(convertFromDb) || [],
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleSupabaseError(error),
    };
  }
}

/**
 * Fetch a single garden by ID or slug
 * Supports both UUID and slug formats
 */
export async function getGardenById(idOrSlug: string) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    const idType = identifyIdType(idOrSlug);
    let query = supabase.from('gardens').select('*');

    if (idType === 'uuid') {
      // Search by UUID
      query = query.eq('id', idOrSlug);
    } else {
      // Search by slug (default for anything that's not a UUID)
      query = query.eq('slug', idOrSlug);
    }

    const { data, error } = await query.single();

    if (error) throw error;

    return {
      data: data ? convertFromDb(data) : null,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleSupabaseError(error),
    };
  }
}

/**
 * Fetch a single garden by slug (alias for getGardenById)
 */
export async function getGardenBySlug(slug: string) {
  return getGardenById(slug);
}

/**
 * Resolve a garden identifier (UUID or slug) to its UUID
 * This is useful for API functions that need the actual UUID for foreign key relationships
 */
export async function resolveGardenId(idOrSlug: string): Promise<{ id: string | null; error: string | null }> {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    const idType = identifyIdType(idOrSlug);

    // If it's already a UUID, return it directly
    if (idType === 'uuid') {
      return { id: idOrSlug, error: null };
    }

    // If it's a slug, fetch the garden to get its UUID
    const { data, error } = await getGardenById(idOrSlug);

    if (error || !data) {
      return {
        id: null,
        error: error || `Garden not found with identifier: ${idOrSlug}`,
      };
    }

    return { id: data.id, error: null };
  } catch (error) {
    return {
      id: null,
      error: handleSupabaseError(error),
    };
  }
}

/**
 * Create a new garden
 */
export async function createGarden(garden: any) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    const gardenData = convertToDb(garden) as GardenInsert;

    const { data, error } = await (supabase as any)
      .from('gardens')
      .insert(gardenData)
      .select();

    if (error) throw error;

    return {
      data: data && data.length > 0 ? convertFromDb(data[0]) : null,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleSupabaseError(error),
    };
  }
}

/**
 * Update an existing garden
 */
export async function updateGarden(id: string, garden: any) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    validateUUID(id, 'Garden ID');

    const gardenData = convertToDb(garden) as GardenUpdate;

    const { data, error } = await (supabase as any)
      .from('gardens')
      .update(gardenData)
      .eq('id', id)
      .select();

    if (error) throw error;

    return {
      data: data && data.length > 0 ? convertFromDb(data[0]) : null,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleSupabaseError(error),
    };
  }
}

/**
 * Delete a garden
 */
export async function deleteGarden(id: string) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    validateUUID(id, 'Garden ID');

    const { error } = await supabase
      .from('gardens')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error),
    };
  }
}

/**
 * Search gardens by name or location
 */
export async function searchGardens(query: string) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('gardens')
      .select('*')
      .or(`nama.ilike.%${query}%,lokasi.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      data: data?.map(convertFromDb) || [],
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleSupabaseError(error),
    };
  }
}

/**
 * Filter gardens by status
 */
export async function getGardensByStatus(status: string) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('gardens')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      data: data?.map(convertFromDb) || [],
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleSupabaseError(error),
    };
  }
}

/**
 * Fetch a garden with all related data in a single query
 * This is optimized to reduce multiple API calls
 */
export async function getGardenWithRelations(idOrSlug: string) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    const idType = identifyIdType(idOrSlug);
    let query = supabase.from('gardens').select(`
      *,
      harvests(*),
      issues(*),
      maintenances(*),
      documentation(*),
      expenses(*)
    `);

    if (idType === 'uuid') {
      query = query.eq('id', idOrSlug);
    } else {
      query = query.eq('slug', idOrSlug);
    }

    const { data, error } = await query.single();

    if (error) throw error;

    if (!data) {
      return {
        data: null,
        error: 'Garden not found',
      };
    }

    // Type assertion for joined data
    const gardenWithRelations = data as any;

    // Convert all data to app format
    return {
      data: {
        garden: convertFromDb(data),
        harvests: (gardenWithRelations.harvests || []).map((h: any) => ({
          id: h.id,
          gardenId: h.garden_id,
          tanggal: new Date(h.tanggal),
          jumlahKg: Number(h.jumlah_kg),
          hargaPerKg: Number(h.harga_per_kg),
          totalNilai: Number(h.total_nilai),
          kualitas: h.kualitas,
          catatan: h.catatan || undefined,
          createdAt: new Date(h.created_at),
        })),
        issues: (gardenWithRelations.issues || []).map((i: any) => ({
          id: i.id,
          gardenId: i.garden_id,
          judul: i.judul,
          deskripsi: i.deskripsi,
          areaTerdampak: i.area_terdampak,
          tingkatKeparahan: i.tingkat_keparahan,
          status: i.status,
          fotoUrls: i.foto_urls || undefined,
          solusi: i.solusi || undefined,
          tanggalLapor: new Date(i.tanggal_lapor),
          tanggalSelesai: i.tanggal_selesai ? new Date(i.tanggal_selesai) : undefined,
          createdAt: new Date(i.created_at),
          updatedAt: new Date(i.updated_at),
        })),
        maintenances: (gardenWithRelations.maintenances || []).map((m: any) => ({
          id: m.id,
          gardenId: m.garden_id,
          jenisPerawatan: m.jenis_perawatan,
          judul: m.judul,
          tanggalDijadwalkan: new Date(m.tanggal_dijadwalkan),
          status: m.status,
          detail: m.detail || undefined,
          penanggungJawab: m.penanggung_jawab || undefined,
          isRecurring: m.is_recurring,
          recurringInterval: m.recurring_interval || undefined,
          tanggalSelesai: m.tanggal_selesai ? new Date(m.tanggal_selesai) : undefined,
          createdAt: new Date(m.created_at),
          updatedAt: new Date(m.updated_at),
        })),
        documentation: (gardenWithRelations.documentation || []).map((d: any) => ({
          id: d.id,
          gardenId: d.garden_id,
          tipe: d.tipe,
          judul: d.judul,
          deskripsi: d.deskripsi || undefined,
          fileUrl: d.file_url || undefined,
          content: d.content || undefined,
          kategori: d.kategori || undefined,
          createdAt: new Date(d.created_at),
          updatedAt: new Date(d.updated_at),
        })),
        expenses: (gardenWithRelations.expenses || []).map((e: any) => ({
          id: e.id,
          gardenId: e.garden_id,
          tanggal: new Date(e.tanggal),
          kategori: e.kategori,
          deskripsi: e.deskripsi,
          jumlah: Number(e.jumlah),
          catatan: e.catatan || undefined,
          createdAt: new Date(e.created_at),
          updatedAt: new Date(e.updated_at),
        })),
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleSupabaseError(error),
    };
  }
}
