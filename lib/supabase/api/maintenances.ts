import { supabase, handleSupabaseError } from '../client';
import { Database } from '../types';
import { validateUUID } from '@/lib/utils';
import { resolveGardenId } from './gardens';

type Maintenance = Database['public']['Tables']['maintenances']['Row'];
type MaintenanceInsert = Database['public']['Tables']['maintenances']['Insert'];
type MaintenanceUpdate = Database['public']['Tables']['maintenances']['Update'];

// Convert database row to app format
function convertFromDb(maintenance: Maintenance) {
  return {
    id: maintenance.id,
    gardenId: maintenance.garden_id,
    jenisPerawatan: maintenance.jenis_perawatan as 'Pemupukan' | 'Penyemprotan' | 'Pemangkasan' | 'Pembersihan' | 'Lainnya',
    judul: maintenance.judul,
    tanggalDijadwalkan: new Date(maintenance.tanggal_dijadwalkan),
    status: maintenance.status as 'Dijadwalkan' | 'Selesai' | 'Terlambat',
    detail: maintenance.detail || undefined,
    penanggungJawab: maintenance.penanggung_jawab || undefined,
    isRecurring: maintenance.is_recurring,
    recurringInterval: maintenance.recurring_interval || undefined,
    tanggalSelesai: maintenance.tanggal_selesai ? new Date(maintenance.tanggal_selesai) : undefined,
    createdAt: new Date(maintenance.created_at),
    updatedAt: new Date(maintenance.updated_at),
  };
}

// Convert app format to database format
function convertToDb(maintenance: any): MaintenanceInsert | MaintenanceUpdate {
  return {
    garden_id: maintenance.gardenId,
    jenis_perawatan: maintenance.jenisPerawatan,
    judul: maintenance.judul,
    tanggal_dijadwalkan: maintenance.tanggalDijadwalkan instanceof Date
      ? maintenance.tanggalDijadwalkan.toISOString().split('T')[0]
      : maintenance.tanggalDijadwalkan,
    status: maintenance.status,
    detail: maintenance.detail || null,
    penanggung_jawab: maintenance.penanggungJawab || null,
    is_recurring: maintenance.isRecurring || false,
    recurring_interval: maintenance.recurringInterval || null,
    tanggal_selesai: maintenance.tanggalSelesai
      ? (maintenance.tanggalSelesai instanceof Date
          ? maintenance.tanggalSelesai.toISOString().split('T')[0]
          : maintenance.tanggalSelesai)
      : null,
  };
}

/**
 * Fetch all maintenances for a garden
 * Accepts both UUID and slug formats for gardenId
 */
export async function getMaintenancesByGarden(gardenIdOrSlug: string) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    // Resolve garden identifier (slug or UUID) to UUID
    const { id: gardenId, error: resolveError } = await resolveGardenId(gardenIdOrSlug);

    if (resolveError || !gardenId) {
      throw new Error(resolveError || 'Failed to resolve garden ID');
    }

    const { data, error } = await supabase
      .from('maintenances')
      .select('*')
      .eq('garden_id', gardenId)
      .order('tanggal_dijadwalkan', { ascending: true });

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
 * Create a new maintenance
 * Accepts both UUID and slug formats for maintenance.gardenId
 */
export async function createMaintenance(maintenance: any) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    // Resolve garden identifier (slug or UUID) to UUID
    const { id: gardenId, error: resolveError } = await resolveGardenId(maintenance.gardenId);

    if (resolveError || !gardenId) {
      throw new Error(resolveError || 'Failed to resolve garden ID');
    }

    // Update maintenance with resolved UUID
    const maintenanceWithResolvedId = { ...maintenance, gardenId };
    const maintenanceData = convertToDb(maintenanceWithResolvedId) as MaintenanceInsert;

    const { data, error } = await (supabase as any)
      .from('maintenances')
      .insert(maintenanceData)
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
 * Update a maintenance
 * Accepts both UUID and slug formats for maintenance.gardenId
 */
export async function updateMaintenance(id: string, maintenance: any) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    validateUUID(id, 'Maintenance ID');

    // Resolve garden identifier (slug or UUID) to UUID
    const { id: gardenId, error: resolveError } = await resolveGardenId(maintenance.gardenId);

    if (resolveError || !gardenId) {
      throw new Error(resolveError || 'Failed to resolve garden ID');
    }

    // Update maintenance with resolved UUID
    const maintenanceWithResolvedId = { ...maintenance, gardenId };
    const maintenanceData = convertToDb(maintenanceWithResolvedId) as MaintenanceUpdate;

    const { data, error } = await (supabase as any)
      .from('maintenances')
      .update(maintenanceData)
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
 * Update maintenance status
 */
export async function updateMaintenanceStatus(id: string, status: 'Dijadwalkan' | 'Selesai' | 'Terlambat') {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    validateUUID(id, 'Maintenance ID');

    const updateData: any = { status };

    if (status === 'Selesai') {
      updateData.tanggal_selesai = new Date().toISOString().split('T')[0];
    }

    const { data, error } = await (supabase as any)
      .from('maintenances')
      .update(updateData)
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
 * Delete a maintenance
 */
export async function deleteMaintenance(id: string) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    validateUUID(id, 'Maintenance ID');

    const { error } = await supabase
      .from('maintenances')
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
