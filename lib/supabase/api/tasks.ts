import { supabase, handleSupabaseError } from '../client';
import { Database } from '../types';
import { validateUUID } from '@/lib/utils';
import { resolveGardenId } from './gardens';

type Task = Database['public']['Tables']['tasks']['Row'];
type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

// Convert database row to app format
function convertFromDb(task: Task) {
  return {
    id: task.id,
    gardenId: task.garden_id,
    judul: task.judul,
    deskripsi: task.deskripsi || undefined,
    kategori: task.kategori as 'Pemupukan' | 'Panen' | 'Perawatan' | 'Penyemprotan' | 'Lainnya',
    prioritas: task.prioritas as 'High' | 'Normal' | 'Low',
    status: task.status as 'To Do' | 'In Progress' | 'Done',
    tanggalTarget: new Date(task.tanggal_target),
    assignedTo: task.assigned_to || undefined,
    createdAt: new Date(task.created_at),
    updatedAt: new Date(task.updated_at),
  };
}

// Convert app format to database format
function convertToDb(task: any): TaskInsert | TaskUpdate {
  return {
    garden_id: task.gardenId,
    judul: task.judul,
    deskripsi: task.deskripsi || null,
    kategori: task.kategori,
    prioritas: task.prioritas,
    status: task.status,
    tanggal_target: task.tanggalTarget instanceof Date
      ? task.tanggalTarget.toISOString().split('T')[0]
      : task.tanggalTarget,
    assigned_to: task.assignedTo || null,
  };
}

/**
 * Fetch all tasks for a garden
 * Accepts both UUID and slug formats for gardenId
 */
export async function getTasksByGarden(gardenIdOrSlug: string) {
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
      .from('tasks')
      .select('*')
      .eq('garden_id', gardenId)
      .order('tanggal_target', { ascending: true });

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
 * Create a new task
 * Accepts both UUID and slug formats for task.gardenId
 */
export async function createTask(task: any) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    // Resolve garden identifier (slug or UUID) to UUID
    const { id: gardenId, error: resolveError } = await resolveGardenId(task.gardenId);

    if (resolveError || !gardenId) {
      throw new Error(resolveError || 'Failed to resolve garden ID');
    }

    // Update task with resolved UUID
    const taskWithResolvedId = { ...task, gardenId };
    const taskData = convertToDb(taskWithResolvedId) as TaskInsert;

    const { data, error } = await (supabase as any)
      .from('tasks')
      .insert(taskData)
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
 * Update a task
 */
export async function updateTask(id: string, task: any) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    validateUUID(id, 'Task ID');

    const taskData = convertToDb(task) as TaskUpdate;

    const { data, error } = await (supabase as any)
      .from('tasks')
      .update(taskData)
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
 * Update task status
 */
export async function updateTaskStatus(id: string, status: 'To Do' | 'In Progress' | 'Done') {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    validateUUID(id, 'Task ID');

    const { data, error } = await (supabase as any)
      .from('tasks')
      .update({ status })
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
 * Delete a task
 */
export async function deleteTask(id: string) {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    validateUUID(id, 'Task ID');

    const { error } = await supabase
      .from('tasks')
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
