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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TodoItem } from "@/types";
import { createHarvest } from "@/lib/supabase/api/harvests";
import { updateTaskStatus } from "@/lib/supabase/api/tasks";
import { toast } from "sonner";
import { format } from "date-fns";

const harvestSchema = z.object({
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  jumlahKg: z.number().positive("Jumlah harus lebih dari 0"),
  hargaPerKg: z.number().positive("Harga harus lebih dari 0"),
  kualitas: z.enum(["Baik Sekali", "Baik", "Cukup", "Kurang"]),
  catatan: z.string().optional(),
});

type HarvestFormData = z.infer<typeof harvestSchema>;

interface HarvestRecordModalProps {
  open: boolean;
  onClose: () => void;
  todo: TodoItem | null;
  onSuccess?: () => void;
}

export default function HarvestRecordModal({
  open,
  onClose,
  todo,
  onSuccess,
}: HarvestRecordModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<HarvestFormData>({
    resolver: zodResolver(harvestSchema),
    defaultValues: {
      tanggal: format(new Date(), "yyyy-MM-dd"),
      jumlahKg: 0,
      hargaPerKg: 2500,
      kualitas: "Baik",
      catatan: "",
    },
  });

  const kualitas = watch("kualitas");
  const jumlahKg = watch("jumlahKg");
  const hargaPerKg = watch("hargaPerKg");
  const totalNilai = jumlahKg * hargaPerKg;

  const onFormSubmit = async (data: HarvestFormData) => {
    if (!todo) return;

    try {
      // Create harvest record
      const { data: harvestData, error: harvestError } = await createHarvest({
        gardenId: todo.gardenId,
        tanggal: new Date(data.tanggal),
        jumlahKg: data.jumlahKg,
        hargaPerKg: data.hargaPerKg,
        totalNilai: data.jumlahKg * data.hargaPerKg,
        kualitas: data.kualitas,
        catatan: data.catatan || `Dari jadwal: ${todo.judul}`,
      });

      if (harvestError) {
        toast.error("Gagal menyimpan data panen: " + harvestError);
        return;
      }

      // Mark task as done
      const { error: taskError } = await updateTaskStatus(todo.id, "Done");

      if (taskError) {
        toast.error("Gagal menyelesaikan tugas: " + taskError);
        return;
      }

      toast.success("Data panen berhasil dicatat!");
      reset();
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Error recording harvest:", error);
      toast.error("Terjadi kesalahan");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!todo) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto rounded-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base sm:text-lg">Catat Hasil Panen</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {todo.gardenName} • {todo.judul}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="tanggal" className="text-xs sm:text-sm font-medium">
              Tanggal Panen <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tanggal"
              type="date"
              className="h-11 text-base sm:text-sm rounded-xl"
              {...register("tanggal")}
            />
            {errors.tanggal && (
              <p className="text-xs text-red-500 mt-1">
                {errors.tanggal.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="jumlahKg" className="text-xs sm:text-sm font-medium">
                Jumlah (Kg) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="jumlahKg"
                type="number"
                step="0.1"
                placeholder="1500"
                className="h-11 text-base sm:text-sm rounded-xl"
                {...register("jumlahKg", { valueAsNumber: true })}
              />
              {errors.jumlahKg && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.jumlahKg.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hargaPerKg" className="text-xs sm:text-sm font-medium">
                Harga/Kg (Rp) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="hargaPerKg"
                type="number"
                placeholder="2500"
                className="h-11 text-base sm:text-sm rounded-xl"
                {...register("hargaPerKg", { valueAsNumber: true })}
              />
              {errors.hargaPerKg && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.hargaPerKg.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs sm:text-sm font-medium">Total Nilai</Label>
            <div className="p-3 sm:p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-lg sm:text-xl font-bold text-green-600">
                Rp {totalNilai.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="kualitas" className="text-xs sm:text-sm font-medium">
              Kualitas <span className="text-red-500">*</span>
            </Label>
            <Select
              value={kualitas}
              onValueChange={(value: any) => setValue("kualitas", value)}
            >
              <SelectTrigger id="kualitas" className="h-11 text-base sm:text-sm rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Baik Sekali">Baik Sekali</SelectItem>
                <SelectItem value="Baik">Baik</SelectItem>
                <SelectItem value="Cukup">Cukup</SelectItem>
                <SelectItem value="Kurang">Kurang</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="catatan" className="text-xs sm:text-sm font-medium">Catatan</Label>
            <Textarea
              id="catatan"
              placeholder="Catatan tambahan..."
              rows={2}
              className="text-base sm:text-sm rounded-xl resize-none"
              {...register("catatan")}
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
              disabled={isSubmitting}
              className="h-11 rounded-xl w-full sm:w-auto bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Panen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
