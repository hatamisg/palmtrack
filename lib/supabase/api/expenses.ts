import { supabase, handleSupabaseError } from '../client';
import { validateUUID } from '@/lib/utils';
import { resolveGardenId } from './gardens';

// Note: expenses table types not yet generated in Database types
// Using any types temporarily until Supabase types are regenerated

// Convert database row to app format
function convertFromDb(expense: any) {
  return {
    id: expense.id,
    gardenId: expense.garden_id,
    tanggal: new Date(expense.tanggal),
    kategori: expense.kategori as 'Pupuk' | 'Pestisida' | 'Peralatan' | 'Tenaga Kerja' | 'Transportasi' | 'Lainnya',
    deskripsi: expense.deskripsi,
    jumlah: Number(expense.jumlah),
    catatan: expense.catatan || undefined,
    createdAt: new Date(expense.created_at),
    updatedAt: new Date(expense.updated_at),
  };
}

// Convert app format to database format
function convertToDb(expense: any): any {
  return {
    garden_id: expense.gardenId,
    tanggal: expense.tanggal instanceof Date
      ? expense.tanggal.toISOString().split('T')[0]
      : expense.tanggal,
    kategori: expense.kategori,
    deskripsi: expense.deskripsi,
    jumlah: expense.jumlah,
    catatan: expense.catatan || null,
  };
}

/**
 * Fetch all expenses for a garden
 * Accepts both UUID and slug formats for gardenId
 */
export async function getExpensesByGarden(gardenIdOrSlug: string) {
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
      .from('expenses')
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
 * Create a new expense
 * Accepts both UUID and slug formats for expense.gardenId
 */
export async function createExpense(expense: any) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    // Resolve garden identifier (slug or UUID) to UUID
    const { id: gardenId, error: resolveError } = await resolveGardenId(expense.gardenId);

    if (resolveError || !gardenId) {
      throw new Error(resolveError || 'Failed to resolve garden ID');
    }

    // Update expense with resolved UUID
    const expenseWithResolvedId = { ...expense, gardenId };
    const expenseData = convertToDb(expenseWithResolvedId);

    const { data, error } = await (supabase as any)
      .from('expenses')
      .insert(expenseData)
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
 * Update an existing expense
 * Accepts both UUID and slug formats for expense.gardenId
 */
export async function updateExpense(id: string, expense: any) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    validateUUID(id, 'Expense ID');

    // Resolve garden identifier (slug or UUID) to UUID
    const { id: gardenId, error: resolveError } = await resolveGardenId(expense.gardenId);

    if (resolveError || !gardenId) {
      throw new Error(resolveError || 'Failed to resolve garden ID');
    }

    // Update expense with resolved UUID
    const expenseWithResolvedId = { ...expense, gardenId };
    const expenseData = convertToDb(expenseWithResolvedId);

    const { data, error } = await (supabase as any)
      .from('expenses')
      .update(expenseData)
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
 * Delete an expense
 */
export async function deleteExpense(id: string) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    validateUUID(id, 'Expense ID');

    const { error } = await (supabase as any)
      .from('expenses')
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
