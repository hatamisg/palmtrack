"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Task, "id" | "gardenId" | "createdAt" | "updatedAt">) => void;
}

export default function AddTaskModal({ open, onClose, onSubmit }: AddTaskModalProps) {
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Task Baru</DialogTitle>
          <DialogDescription>
            Isi form di bawah untuk menambahkan task baru
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Judul */}
          <div>
            <Label htmlFor="judul">
              Judul Task <span className="text-red-500">*</span>
            </Label>
            <Input
              id="judul"
              placeholder="Contoh: Pemupukan area A"
              {...register("judul")}
            />
            {errors.judul && (
              <p className="text-sm text-red-500 mt-1">{errors.judul.message}</p>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              placeholder="Deskripsi detail task..."
              rows={3}
              {...register("deskripsi")}
            />
            {errors.deskripsi && (
              <p className="text-sm text-red-500 mt-1">{errors.deskripsi.message}</p>
            )}
          </div>

          {/* Kategori & Prioritas Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="kategori">
                Kategori <span className="text-red-500">*</span>
              </Label>
              <Select
                value={kategori}
                onValueChange={(value: any) => setValue("kategori", value)}
              >
                <SelectTrigger>
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
              {errors.kategori && (
                <p className="text-sm text-red-500 mt-1">{errors.kategori.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="prioritas">
                Prioritas <span className="text-red-500">*</span>
              </Label>
              <Select
                value={prioritas}
                onValueChange={(value: any) => setValue("prioritas", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              {errors.prioritas && (
                <p className="text-sm text-red-500 mt-1">{errors.prioritas.message}</p>
              )}
            </div>
          </div>

          {/* Status & Tanggal Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={status}
                onValueChange={(value: any) => setValue("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="tanggalTarget">
                Tanggal Target <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tanggalTarget"
                type="date"
                {...register("tanggalTarget")}
              />
              {errors.tanggalTarget && (
                <p className="text-sm text-red-500 mt-1">{errors.tanggalTarget.message}</p>
              )}
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <Label htmlFor="assignedTo">Ditugaskan Kepada</Label>
            <Input
              id="assignedTo"
              placeholder="Nama penanggung jawab (opsional)"
              {...register("assignedTo")}
            />
            {errors.assignedTo && (
              <p className="text-sm text-red-500 mt-1">{errors.assignedTo.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
