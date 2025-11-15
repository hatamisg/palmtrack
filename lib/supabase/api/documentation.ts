import { supabase, handleSupabaseError } from '../client';
import { Database } from '../types';
import { validateUUID } from '@/lib/utils';
import { resolveGardenId } from './gardens';

type Documentation = Database['public']['Tables']['documentation']['Row'];
type DocumentationInsert = Database['public']['Tables']['documentation']['Insert'];
type DocumentationUpdate = Database['public']['Tables']['documentation']['Update'];

// Convert database row to app format
function convertFromDb(doc: Documentation) {
  return {
    id: doc.id,
    gardenId: doc.garden_id,
    tipe: doc.tipe as 'foto' | 'dokumen' | 'catatan',
    judul: doc.judul,
    deskripsi: doc.deskripsi || undefined,
    fileUrl: doc.file_url || undefined,
    content: doc.content || undefined,
    kategori: doc.kategori || undefined,
    createdAt: new Date(doc.created_at),
    updatedAt: new Date(doc.updated_at),
  };
}

// Convert app format to database format for insert
function convertToDbInsert(doc: any): DocumentationInsert {
  return {
    garden_id: doc.gardenId,
    tipe: doc.tipe,
    judul: doc.judul,
    deskripsi: doc.deskripsi || null,
    file_url: doc.fileUrl || null,
    content: doc.content || null,
    kategori: doc.kategori || null,
  };
}

// Convert app format to database format for update
function convertToDbUpdate(doc: any): DocumentationUpdate {
  return {
    garden_id: doc.gardenId,
    tipe: doc.tipe,
    judul: doc.judul,
    deskripsi: doc.deskripsi || null,
    file_url: doc.fileUrl || null,
    content: doc.content || null,
    kategori: doc.kategori || null,
  };
}

/**
 * Fetch all documentation for a garden
 * Accepts both UUID and slug formats for gardenId
 */
export async function getDocumentationByGarden(gardenIdOrSlug: string) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    // Resolve garden identifier (slug or UUID) to UUID
    const { id: gardenId, error: resolveError } = await resolveGardenId(gardenIdOrSlug);

    if (resolveError || !gardenId) {
      throw new Error(resolveError || 'Failed to resolve garden ID');
    }

    const { data, error } = await (supabase as any)
      .from('documentation')
      .select('*')
      .eq('garden_id', gardenId)
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
 * Fetch documentation by type
 * Accepts both UUID and slug formats for gardenId
 */
export async function getDocumentationByType(gardenIdOrSlug: string, tipe: 'foto' | 'dokumen' | 'catatan') {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    // Resolve garden identifier (slug or UUID) to UUID
    const { id: gardenId, error: resolveError } = await resolveGardenId(gardenIdOrSlug);

    if (resolveError || !gardenId) {
      throw new Error(resolveError || 'Failed to resolve garden ID');
    }

    const { data, error } = await (supabase as any)
      .from('documentation')
      .select('*')
      .eq('garden_id', gardenId)
      .eq('tipe', tipe)
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
 * Create new documentation
 * Accepts both UUID and slug formats for doc.gardenId
 */
export async function createDocumentation(doc: any) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    // Resolve garden identifier (slug or UUID) to UUID
    const { id: gardenId, error: resolveError } = await resolveGardenId(doc.gardenId);

    if (resolveError || !gardenId) {
      throw new Error(resolveError || 'Failed to resolve garden ID');
    }

    // Update doc with resolved UUID
    const docWithResolvedId = { ...doc, gardenId };
    const docData = convertToDbInsert(docWithResolvedId);

    const { data, error } = await (supabase as any)
      .from('documentation')
      .insert(docData)
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
 * Update documentation
 * Accepts both UUID and slug formats for doc.gardenId
 */
export async function updateDocumentation(id: string, doc: any) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    validateUUID(id, 'Documentation ID');

    // Resolve garden identifier (slug or UUID) to UUID
    const { id: gardenId, error: resolveError } = await resolveGardenId(doc.gardenId);

    if (resolveError || !gardenId) {
      throw new Error(resolveError || 'Failed to resolve garden ID');
    }

    // Update documentation with resolved UUID
    const docWithResolvedId = { ...doc, gardenId };
    const docData = convertToDbUpdate(docWithResolvedId);

    const { data, error } = await (supabase as any)
      .from('documentation')
      .update(docData)
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
 * Delete documentation
 */
export async function deleteDocumentation(id: string) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    validateUUID(id, 'Documentation ID');

    const { error } = await (supabase as any)
      .from('documentation')
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
