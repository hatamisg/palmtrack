"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task } from "@/types";

const taskSchema = z.object({
  judul: z.string().min(3, "Judul minimal 3 karakter"),
  deskripsi: z.string().optional(),
  kategori: z.enum(["Pemupukan", "Panen", "Perawatan", "Penyemprotan", "Lainnya"]),
  prioritas: z.enum(["High", "Normal", "Low"]),
  status: z.enum(["To Do", "In Progress", "Done"]),
  tanggalTarget: z.string().min(1, "Tanggal target wajib diisi"),
  assignedTo: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface EditTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Task, "id" | "gardenId" | "createdAt" | "updatedAt">) => void;
  task: Task | null;
}

export default function EditTaskModal({ open, onClose, onSubmit, task }: EditTaskModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      judul: "",
      deskripsi: "",
      kategori: "Perawatan",
      prioritas: "Normal",
      status: "To Do",
      tanggalTarget: "",
      assignedTo: "",
    },
  });

  const kategori = watch("kategori");
  const prioritas = watch("prioritas");
  const status = watch("status");

  // Update form values when task prop changes
  useEffect(() => {
    if (task) {
      setValue("judul", task.judul);
      setValue("deskripsi", task.deskripsi || "");
      setValue("kategori", task.kategori);
      setValue("prioritas", task.prioritas);
      setValue("status", task.status);
      setValue("tanggalTarget", task.tanggalTarget instanceof Date
        ? task.tanggalTarget.toISOString().split('T')[0]
        : task.tanggalTarget as string
      );
      setValue("assignedTo", task.assignedTo || "");
    }
  }, [task, setValue]);

  const onFormSubmit = (data: TaskFormData) => {
    onSubmit({
      ...data,
      tanggalTarget: new Date(data.tanggalTarget),
    } as any);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto rounded-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base sm:text-lg">Edit Task</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Perbarui informasi task
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Judul */}
          <div className="space-y-1.5">
            <Label htmlFor="judul" className="text-xs sm:text-sm font-medium">
              Judul Task <span className="text-red-500">*</span>
            </Label>
            <Input
              id="judul"
              placeholder="Contoh: Pemupukan area A"
              className="h-11 text-base sm:text-sm rounded-xl"
              {...register("judul")}
            />
            {errors.judul && (
              <p className="text-xs text-red-500 mt-1">{errors.judul.message}</p>
            )}
          </div>

          {/* Deskripsi */}
          <div className="space-y-1.5">
            <Label htmlFor="deskripsi" className="text-xs sm:text-sm font-medium">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              placeholder="Deskripsi detail task..."
              rows={2}
              className="text-base sm:text-sm rounded-xl resize-none"
              {...register("deskripsi")}
            />
          </div>

          {/* Kategori & Prioritas Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="kategori" className="text-xs sm:text-sm font-medium">
                Kategori <span className="text-red-500">*</span>
              </Label>
              <Select
                value={kategori}
                onValueChange={(value: any) => setValue("kategori", value)}
              >
                <SelectTrigger className="h-11 text-base sm:text-sm rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pemupukan">Pemupukan</SelectItem>
                  <SelectItem value="Panen">Panen</SelectItem>
                  <SelectItem value="Perawatan">Perawatan</SelectItem>
                  <SelectItem value="Penyemprotan">Penyemprotan</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prioritas" className="text-xs sm:text-sm font-medium">
                Prioritas <span className="text-red-500">*</span>
              </Label>
              <Select
                value={prioritas}
                onValueChange={(value: any) => setValue("prioritas", value)}
              >
                <SelectTrigger className="h-11 text-base sm:text-sm rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status & Tanggal Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-xs sm:text-sm font-medium">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={status}
                onValueChange={(value: any) => setValue("status", value)}
              >
                <SelectTrigger className="h-11 text-base sm:text-sm rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tanggalTarget" className="text-xs sm:text-sm font-medium">
                Tanggal Target <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tanggalTarget"
                type="date"
                className="h-11 text-base sm:text-sm rounded-xl"
                {...register("tanggalTarget")}
              />
            </div>
          </div>

          {/* Assigned To */}
          <div className="space-y-1.5">
            <Label htmlFor="assignedTo" className="text-xs sm:text-sm font-medium">Ditugaskan Kepada</Label>
            <Input
              id="assignedTo"
              placeholder="Nama penanggung jawab (opsional)"
              className="h-11 text-base sm:text-sm rounded-xl"
              {...register("assignedTo")}
            />
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="h-11 rounded-xl w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button 
              type="submit"
              className="h-11 rounded-xl w-full sm:w-auto bg-green-600 hover:bg-green-700"
            >
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
