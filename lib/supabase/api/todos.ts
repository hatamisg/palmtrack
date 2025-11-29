// API functions for centralized todos (combining maintenances, issues, and tasks)
import { TodoItem, Maintenance, Issue, Task } from '@/types';
import { getAllGardens } from './gardens';
import { getMaintenancesByGarden } from './maintenances';
import { getIssuesByGarden } from './issues';
import { getTasksByGarden } from './tasks';

/**
 * Get all todos (maintenances + issues) from all gardens
 * Returns a unified list of pending items sorted by date
 */
export async function getAllTodos(): Promise<TodoItem[]> {
  try {
    // Get all gardens first
    const { data: gardens, error } = await getAllGardens();

    if (error || !gardens || gardens.length === 0) {
      return [];
    }

    const todos: TodoItem[] = [];

    // Fetch maintenances and issues for each garden
    for (const garden of gardens) {
      // Get maintenances (only Dijadwalkan and Terlambat)
      const { data: maintenances } = await getMaintenancesByGarden(garden.id);

      if (maintenances) {
        const pendingMaintenances = maintenances.filter(
          (m: Maintenance) => m.status === 'Dijadwalkan' || m.status === 'Terlambat'
        );

        // Convert maintenances to TodoItems
        for (const maintenance of pendingMaintenances) {
          todos.push({
            id: maintenance.id,
            gardenId: garden.id,
            gardenName: garden.nama,
            gardenSlug: garden.slug,
            type: 'maintenance',
            judul: maintenance.judul,
            tanggal: maintenance.tanggalDijadwalkan,
            kategori: maintenance.jenisPerawatan,
            status: maintenance.status,
            penanggungJawab: maintenance.penanggungJawab,
            deskripsi: maintenance.detail,
          });
        }
      }

      // Get issues (only Open)
      const { data: issues } = await getIssuesByGarden(garden.id);

      if (issues) {
        const openIssues = issues.filter((i: Issue) => i.status === 'Open');

        // Convert issues to TodoItems
        for (const issue of openIssues) {
          todos.push({
            id: issue.id,
            gardenId: garden.id,
            gardenName: garden.nama,
            gardenSlug: garden.slug,
            type: 'issue',
            judul: issue.judul,
            tanggal: issue.tanggalLapor,
            kategori: issue.tingkatKeparahan,
            status: issue.status,
            areaTerdampak: issue.areaTerdampak,
            deskripsi: issue.deskripsi,
          });
        }
      }

      // Get tasks (only To Do and In Progress)
      const { data: tasks } = await getTasksByGarden(garden.id);

      if (tasks) {
        const pendingTasks = tasks.filter(
          (t: Task) => t.status === 'To Do' || t.status === 'In Progress'
        );

        // Convert tasks to TodoItems
        for (const task of pendingTasks) {
          todos.push({
            id: task.id,
            gardenId: garden.id,
            gardenName: garden.nama,
            gardenSlug: garden.slug,
            type: 'task',
            judul: task.judul,
            tanggal: task.tanggalTarget,
            kategori: task.kategori,
            status: task.status,
            prioritas: task.prioritas,
            assignedTo: task.assignedTo,
            deskripsi: task.deskripsi,
          });
        }
      }
    }

    // Sort by date (earliest first)
    todos.sort((a, b) => {
      const dateA = new Date(a.tanggal).getTime();
      const dateB = new Date(b.tanggal).getTime();
      return dateA - dateB;
    });

    return todos;
  } catch (error) {
    console.error('Error fetching todos:', error);
    return [];
  }
}

/**
 * Get count of pending todos
 */
export async function getPendingTodosCount(): Promise<number> {
  const todos = await getAllTodos();
  return todos.length;
}

/**
 * Get todos grouped by date categories
 */
export interface TodosByDate {
  overdue: TodoItem[];
  today: TodoItem[];
  tomorrow: TodoItem[];
  thisWeek: TodoItem[];
  later: TodoItem[];
}

export async function getTodosGroupedByDate(): Promise<TodosByDate> {
  const todos = await getAllTodos();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const grouped: TodosByDate = {
    overdue: [],
    today: [],
    tomorrow: [],
    thisWeek: [],
    later: [],
  };

  for (const todo of todos) {
    const todoDate = new Date(todo.tanggal);
    const todoDateOnly = new Date(
      todoDate.getFullYear(),
      todoDate.getMonth(),
      todoDate.getDate()
    );

    if (todoDateOnly < today) {
      grouped.overdue.push(todo);
    } else if (todoDateOnly.getTime() === today.getTime()) {
      grouped.today.push(todo);
    } else if (todoDateOnly.getTime() === tomorrow.getTime()) {
      grouped.tomorrow.push(todo);
    } else if (todoDateOnly <= endOfWeek) {
      grouped.thisWeek.push(todo);
    } else {
      grouped.later.push(todo);
    }
  }

  return grouped;
}
