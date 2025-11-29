"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Harvest } from "@/types";
import { X } from "lucide-react";

const harvestSchema = z.object({
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  jumlahKg: z.number().positive("Jumlah harus lebih dari 0"),
  hargaPerKg: z.number().positive("Harga harus lebih dari 0"),
  kualitas: z.enum(["Baik Sekali", "Baik", "Cukup", "Kurang"]),
  catatan: z.string().optional(),
});

type HarvestFormData = z.infer<typeof harvestSchema>;

interface AddHarvestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Harvest, "id" | "gardenId" | "createdAt" | "totalNilai">) => void;
}

export default function AddHarvestModal({ open, onClose, onSubmit }: AddHarvestModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<HarvestFormData>({
    resolver: zodResolver(harvestSchema),
    defaultValues: {
      tanggal: "",
      jumlahKg: 0,
      hargaPerKg: 0,
      kualitas: "Baik",
      catatan: "",
    },
  });

  const kualitas = watch("kualitas");
  const jumlahKg = watch("jumlahKg");
  const hargaPerKg = watch("hargaPerKg");
  const totalNilai = jumlahKg * hargaPerKg;

  const onFormSubmit = (data: HarvestFormData) => {
    onSubmit({
      ...data,
      tanggal: new Date(data.tanggal),
      totalNilai,
    } as any);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="sticky top-0 z-10 bg-white border-b px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base sm:text-lg">Tambah Data Panen</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0 -mr-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="px-4 py-4 sm:px-6 space-y-4">
          {/* Tanggal */}
          <div>
            <Label htmlFor="tanggal" className="text-sm">
              Tanggal Panen <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tanggal"
              type="date"
              className="mt-1.5 h-11"
              {...register("tanggal")}
            />
            {errors.tanggal && (
              <p className="text-xs text-red-500 mt-1">{errors.tanggal.message}</p>
            )}
          </div>

          {/* Jumlah & Harga */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="jumlahKg" className="text-sm">
                Jumlah (Kg) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="jumlahKg"
                type="number"
                step="0.1"
                placeholder="1500"
                className="mt-1.5 h-11"
                {...register("jumlahKg", { valueAsNumber: true })}
              />
              {errors.jumlahKg && (
                <p className="text-xs text-red-500 mt-1">{errors.jumlahKg.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="hargaPerKg" className="text-sm">
                Harga/Kg (Rp) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="hargaPerKg"
                type="number"
                placeholder="2500"
                className="mt-1.5 h-11"
                {...register("hargaPerKg", { valueAsNumber: true })}
              />
              {errors.hargaPerKg && (
                <p className="text-xs text-red-500 mt-1">{errors.hargaPerKg.message}</p>
              )}
            </div>
          </div>

          {/* Total Nilai */}
          <div className="bg-green-50 rounded-xl p-3 sm:p-4">
            <p className="text-xs text-gray-600 mb-1">Total Nilai</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">
              Rp {totalNilai.toLocaleString("id-ID")}
            </p>
          </div>

          {/* Kualitas */}
          <div>
            <Label htmlFor="kualitas" className="text-sm">
              Kualitas <span className="text-red-500">*</span>
            </Label>
            <Select value={kualitas} onValueChange={(value: any) => setValue("kualitas", value)}>
              <SelectTrigger id="kualitas" className="mt-1.5 h-11">
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

          {/* Catatan */}
          <div>
            <Label htmlFor="catatan" className="text-sm">Catatan</Label>
            <Textarea
              id="catatan"
              placeholder="Catatan tambahan..."
              rows={3}
              className="mt-1.5"
              {...register("catatan")}
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 h-11">
              Batal
            </Button>
            <Button type="submit" className="flex-1 h-11">
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
