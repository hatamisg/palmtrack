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
import { Harvest } from "@/types";
import { useEffect } from "react";

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

  // Calculate total nilai
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Data Panen</DialogTitle>
          <DialogDescription>
            Isi form di bawah untuk menambahkan data panen baru
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Tanggal */}
          <div>
            <Label htmlFor="tanggal">
              Tanggal Panen <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tanggal"
              type="date"
              className="h-11 md:h-10 text-base md:text-sm"
              {...register("tanggal")}
            />
            {errors.tanggal && (
              <p className="text-sm text-red-500 mt-1">{errors.tanggal.message}</p>
            )}
          </div>

          {/* Jumlah & Harga Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jumlahKg">
                Jumlah (Kg) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="jumlahKg"
                type="number"
                step="0.1"
                placeholder="1500"
                {...register("jumlahKg", { valueAsNumber: true })}
              />
              {errors.jumlahKg && (
                <p className="text-sm text-red-500 mt-1">{errors.jumlahKg.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="hargaPerKg">
                Harga per Kg (Rp) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="hargaPerKg"
                type="number"
                placeholder="2500"
                {...register("hargaPerKg", { valueAsNumber: true })}
              />
              {errors.hargaPerKg && (
                <p className="text-sm text-red-500 mt-1">{errors.hargaPerKg.message}</p>
              )}
            </div>
          </div>

          {/* Total Nilai (Read-only, calculated) */}
          <div>
            <Label>Total Nilai</Label>
            <div className="p-3 bg-gray-100 rounded-md border border-gray-200">
              <p className="text-xl font-bold text-green-600">
                Rp {totalNilai.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          {/* Kualitas */}
          <div>
            <Label htmlFor="kualitas">
              Kualitas <span className="text-red-500">*</span>
            </Label>
            <Select
              value={kualitas}
              onValueChange={(value: any) => setValue("kualitas", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Baik Sekali">Baik Sekali</SelectItem>
                <SelectItem value="Baik">Baik</SelectItem>
                <SelectItem value="Cukup">Cukup</SelectItem>
                <SelectItem value="Kurang">Kurang</SelectItem>
              </SelectContent>
            </Select>
            {errors.kualitas && (
              <p className="text-sm text-red-500 mt-1">{errors.kualitas.message}</p>
            )}
          </div>

          {/* Catatan */}
          <div>
            <Label htmlFor="catatan">Catatan</Label>
            <Textarea
              id="catatan"
              placeholder="Catatan tambahan tentang panen..."
              rows={3}
              {...register("catatan")}
            />
            {errors.catatan && (
              <p className="text-sm text-red-500 mt-1">{errors.catatan.message}</p>
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
