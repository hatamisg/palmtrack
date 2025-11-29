"use client";

import { useState, useEffect } from "react";
import { Task } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, CheckCircle2, Clock, Filter, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import AddTaskModal from "../modals/AddTaskModal";
import EditTaskModal from "../modals/EditTaskModal";
import { createTask, updateTask, updateTaskStatus, deleteTask, getTasksByGarden } from "@/lib/supabase/api/tasks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TabTaskProps {
  gardenId: string;
  tasks: Task[];
}

export default function TabTask({ gardenId, tasks: initialTasks }: TabTaskProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [kategoriFilter, setKategoriFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch tasks from Supabase on mount
  useEffect(() => {
    fetchTasks();
  }, [gardenId]);

  const fetchTasks = async () => {
    setIsLoading(true);
    const { data, error } = await getTasksByGarden(gardenId);
    if (data) {
      setTasks(data);
    } else if (error) {
      toast.error("Gagal memuat task: " + error);
      // Fallback to initial tasks
      setTasks(initialTasks);
    }
    setIsLoading(false);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesKategori = kategoriFilter === "all" || task.kategori === kategoriFilter;
    return matchesStatus && matchesKategori;
  });

  // Group tasks by status
  const tasksByStatus = {
    "To Do": filteredTasks.filter((t) => t.status === "To Do"),
    "In Progress": filteredTasks.filter((t) => t.status === "In Progress"),
    Done: filteredTasks.filter((t) => t.status === "Done"),
  };

  const handleAddTask = async (taskData: any) => {
    const { data, error } = await createTask({
      ...taskData,
      gardenId,
    });

    if (data) {
      setTasks((prev) => [...prev, data]);
      setIsAddModalOpen(false);
      toast.success("Task berhasil ditambahkan!");
    } else if (error) {
      toast.error("Gagal menambahkan task: " + error);
    }
  };

  const handleEditTask = async (taskData: any) => {
    if (!selectedTask) return;

    const { data, error } = await updateTask(selectedTask.id, {
      ...taskData,
      gardenId,
    });

    if (data) {
      setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? data : t)));
      setIsEditModalOpen(false);
      setSelectedTask(null);
      toast.success("Task berhasil diperbarui!");
    } else if (error) {
      toast.error("Gagal memperbarui task: " + error);
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === "Done" ? "To Do" : "Done";
    const { data, error } = await updateTaskStatus(task.id, newStatus);

    if (data) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? data : t)));
      toast.success("Status task berhasil diubah!");
    } else if (error) {
      toast.error("Gagal mengubah status: " + error);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    const { success, error } = await deleteTask(taskToDelete);

    if (success) {
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete));
      setTaskToDelete(null);
      toast.success("Task berhasil dihapus!");
    } else if (error) {
      toast.error("Gagal menghapus task: " + error);
    }
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const getPriorityColor = (prioritas: string) => {
    switch (prioritas) {
      case "High":
        return "destructive";
      case "Normal":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 sm:pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <div className="bg-purple-100 p-1.5 sm:p-2 rounded-lg">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
              Task
            </CardTitle>
            <Button onClick={() => setIsAddModalOpen(true)} size="sm" className="h-9 rounded-xl bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Tambah</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500 hidden sm:block" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 sm:h-11 w-full sm:w-40 rounded-xl text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={kategoriFilter} onValueChange={setKategoriFilter}>
              <SelectTrigger className="h-10 sm:h-11 w-full sm:w-40 rounded-xl text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="Pemupukan">Pemupukan</SelectItem>
                <SelectItem value="Panen">Panen</SelectItem>
                <SelectItem value="Perawatan">Perawatan</SelectItem>
                <SelectItem value="Penyemprotan">Penyemprotan</SelectItem>
                <SelectItem value="Lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6">
            <div className="text-center p-2.5 sm:p-3 bg-gray-50 rounded-xl">
              <p className="text-[10px] sm:text-sm text-gray-600">To Do</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{tasksByStatus["To Do"].length}</p>
            </div>
            <div className="text-center p-2.5 sm:p-3 bg-blue-50 rounded-xl">
              <p className="text-[10px] sm:text-sm text-gray-600">In Progress</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-600">{tasksByStatus["In Progress"].length}</p>
            </div>
            <div className="text-center p-2.5 sm:p-3 bg-green-50 rounded-xl">
              <p className="text-[10px] sm:text-sm text-gray-600">Done</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">{tasksByStatus["Done"].length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Lists by Status - Stacked on mobile */}
      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <Card key={status} className="border-0 shadow-sm">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-sm sm:text-base">{status}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {statusTasks.length === 0 ? (
                <p className="text-center text-gray-500 py-6 sm:py-8 text-xs sm:text-sm">
                  Tidak ada task
                </p>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {statusTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-100"
                    >
                      <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <input
                          type="checkbox"
                          checked={task.status === "Done"}
                          onChange={() => handleToggleStatus(task)}
                          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`text-sm font-medium text-gray-900 ${
                              task.status === "Done" ? "line-through text-gray-500" : ""
                            }`}
                          >
                            {task.judul}
                          </h4>
                          {task.deskripsi && (
                            <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                              {task.deskripsi}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditModal(task)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                          >
                            <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setTaskToDelete(task.id)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant={getPriorityColor(task.prioritas)} className="text-[10px] sm:text-xs h-5">
                          {task.prioritas}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] sm:text-xs h-5 bg-white">
                          {task.kategori}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 mt-2">
                        <Clock className="h-3 w-3" />
                        <span>
                          Target: {format(new Date(task.tanggalTarget), "d MMM yyyy", { locale: id })}
                        </span>
                      </div>

                      {task.assignedTo && (
                        <div className="text-[10px] sm:text-xs text-gray-500 mt-1">
                          Ditugaskan: {task.assignedTo}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modals */}
      <AddTaskModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTask}
      />

      <EditTaskModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleEditTask}
        task={selectedTask}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus task ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
