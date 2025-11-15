import { supabase, handleSupabaseError } from '../client';
import { Database } from '../types';
import { validateUUID } from '@/lib/utils';
import { resolveGardenId } from './gardens';

type Harvest = Database['public']['Tables']['harvests']['Row'];
type HarvestInsert = Database['public']['Tables']['harvests']['Insert'];

// Convert database row to app format
function convertFromDb(harvest: Harvest) {
  return {
    id: harvest.id,
    gardenId: harvest.garden_id,
    tanggal: new Date(harvest.tanggal),
    jumlahKg: Number(harvest.jumlah_kg),
    hargaPerKg: Number(harvest.harga_per_kg),
    totalNilai: Number(harvest.total_nilai),
    kualitas: harvest.kualitas as 'Baik Sekali' | 'Baik' | 'Cukup' | 'Kurang',
    catatan: harvest.catatan || undefined,
    createdAt: new Date(harvest.created_at),
  };
}

// Convert app format to database format
function convertToDb(harvest: any): HarvestInsert {
  return {
    garden_id: harvest.gardenId,
    tanggal: harvest.tanggal instanceof Date
      ? harvest.tanggal.toISOString().split('T')[0]
      : harvest.tanggal,
    jumlah_kg: harvest.jumlahKg,
    harga_per_kg: harvest.hargaPerKg,
    kualitas: harvest.kualitas,
    catatan: harvest.catatan || null,
  };
}

/**
 * Fetch all harvests across all gardens
 */
export async function getAllHarvests() {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('harvests')
      .select('*')
      .order('tanggal', { ascending: false });

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
 * Fetch all harvests for a garden
 * Accepts both UUID and slug formats for gardenId
 */
export async function getHarvestsByGarden(gardenIdOrSlug: string) {
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
      .from('harvests')
      .select('*')
      .eq('garden_id', gardenId)
      .order('tanggal', { ascending: false });

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
 * Create a new harvest
 * Accepts both UUID and slug formats for harvest.gardenId
 */
export async function createHarvest(harvest: any) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    // Resolve garden identifier (slug or UUID) to UUID
    const { id: gardenId, error: resolveError } = await resolveGardenId(harvest.gardenId);

    if (resolveError || !gardenId) {
      throw new Error(resolveError || 'Failed to resolve garden ID');
    }

    // Update harvest with resolved UUID
    const harvestWithResolvedId = { ...harvest, gardenId };
    const harvestData = convertToDb(harvestWithResolvedId);

    const { data, error } = await (supabase as any)
      .from('harvests')
      .insert(harvestData)
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
 * Update an existing harvest
 * Accepts both UUID and slug formats for harvest.gardenId
 */
export async function updateHarvest(id: string, harvest: any) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    validateUUID(id, 'Harvest ID');

    // Resolve garden identifier (slug or UUID) to UUID
    const { id: gardenId, error: resolveError } = await resolveGardenId(harvest.gardenId);

    if (resolveError || !gardenId) {
      throw new Error(resolveError || 'Failed to resolve garden ID');
    }

    // Update harvest with resolved UUID
    const harvestWithResolvedId = { ...harvest, gardenId };
    const harvestData = convertToDb(harvestWithResolvedId);

    const { data, error } = await (supabase as any)
      .from('harvests')
      .update(harvestData)
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
 * Delete a harvest
 */
export async function deleteHarvest(id: string) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    validateUUID(id, 'Harvest ID');

    const { error } = await supabase
      .from('harvests')
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
