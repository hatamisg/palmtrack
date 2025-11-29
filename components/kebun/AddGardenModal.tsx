"use client";

import { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { Garden } from "@/types";
import { generateSlug } from "@/lib/utils";
import { X } from "lucide-react";

const gardenSchema = z.object({
  nama: z.string().min(3, "Nama kebun minimal 3 karakter"),
  lokasi: z.string().min(2, "Lokasi wajib diisi"),
  lokasiLengkap: z.string().min(5, "Lokasi lengkap wajib diisi"),
  luas: z.number().positive("Luas harus lebih dari 0"),
  jumlahPohon: z.number().positive("Jumlah pohon harus lebih dari 0").int("Harus bilangan bulat"),
  tahunTanam: z.number().min(1980, "Tahun tanam minimal 1980").max(new Date().getFullYear(), "Tahun tanam tidak valid"),
  varietas: z.string().min(1, "Varietas wajib dipilih"),
  status: z.enum(["Baik", "Perlu Perhatian", "Bermasalah"]),
});

type GardenFormData = z.infer<typeof gardenSchema>;

interface AddGardenModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Garden, "id" | "createdAt" | "updatedAt">) => void;
}

export default function AddGardenModal({ open, onClose, onSubmit }: AddGardenModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<GardenFormData>({
    resolver: zodResolver(gardenSchema),
    defaultValues: {
      nama: "",
      lokasi: "",
      lokasiLengkap: "",
      luas: 0,
      jumlahPohon: 0,
      tahunTanam: new Date().getFullYear(),
      varietas: "Tenera",
      status: "Baik",
    },
  });

  const status = watch("status");
  const varietas = watch("varietas");

  const onFormSubmit = (data: GardenFormData) => {
    const slug = generateSlug(data.nama);
    onSubmit({ ...data, slug, imageUrl: imageUrl || undefined } as any);
    reset();
    setImageUrl(null);
  };

  const handleClose = () => {
    reset();
    setImageUrl(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="sticky top-0 z-10 bg-white border-b px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base sm:text-lg">Tambah Kebun Baru</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0 -mr-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="px-4 py-4 sm:px-6 space-y-4">
          {/* Garden Image */}
          <div>
            <Label className="text-sm">Foto Kebun</Label>
            <ImageUpload
              value={imageUrl}
              onChange={setImageUrl}
              folder={`gardens/new-${Date.now()}`}
              aspectRatio="video"
              placeholder="Upload foto kebun"
              className="mt-2"
            />
          </div>

          {/* Nama Kebun */}
          <div>
            <Label htmlFor="nama" className="text-sm">
              Nama Kebun <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nama"
              placeholder="Contoh: Kebun Sawit Makmur"
              className="mt-1.5 h-11"
              {...register("nama")}
            />
            {errors.nama && (
              <p className="text-xs text-red-500 mt-1">{errors.nama.message}</p>
            )}
          </div>

          {/* Lokasi & Varietas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="lokasi" className="text-sm">
                Provinsi/Kota <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lokasi"
                placeholder="Riau"
                className="mt-1.5 h-11"
                {...register("lokasi")}
              />
              {errors.lokasi && (
                <p className="text-xs text-red-500 mt-1">{errors.lokasi.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="varietas" className="text-sm">
                Varietas <span className="text-red-500">*</span>
              </Label>
              <Select value={varietas} onValueChange={(value) => setValue("varietas", value)}>
                <SelectTrigger id="varietas" className="mt-1.5 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tenera">Tenera</SelectItem>
                  <SelectItem value="Dura">Dura</SelectItem>
                  <SelectItem value="Pisifera">Pisifera</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lokasi Lengkap */}
          <div>
            <Label htmlFor="lokasiLengkap" className="text-sm">
              Alamat Lengkap <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lokasiLengkap"
              placeholder="Desa, Kecamatan, Kabupaten"
              className="mt-1.5 h-11"
              {...register("lokasiLengkap")}
            />
            {errors.lokasiLengkap && (
              <p className="text-xs text-red-500 mt-1">{errors.lokasiLengkap.message}</p>
            )}
          </div>

          {/* Numbers - 2 columns on mobile */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="luas" className="text-sm">
                Luas (Ha) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="luas"
                type="number"
                step="0.1"
                placeholder="25.5"
                className="mt-1.5 h-11"
                {...register("luas", { valueAsNumber: true })}
              />
              {errors.luas && (
                <p className="text-xs text-red-500 mt-1">{errors.luas.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="jumlahPohon" className="text-sm">
                Jumlah Pohon <span className="text-red-500">*</span>
              </Label>
              <Input
                id="jumlahPohon"
                type="number"
                placeholder="3500"
                className="mt-1.5 h-11"
                {...register("jumlahPohon", { valueAsNumber: true })}
              />
              {errors.jumlahPohon && (
                <p className="text-xs text-red-500 mt-1">{errors.jumlahPohon.message}</p>
              )}
            </div>
          </div>

          {/* Tahun & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="tahunTanam" className="text-sm">
                Tahun Tanam <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tahunTanam"
                type="number"
                placeholder="2020"
                className="mt-1.5 h-11"
                {...register("tahunTanam", { valueAsNumber: true })}
              />
              {errors.tahunTanam && (
                <p className="text-xs text-red-500 mt-1">{errors.tahunTanam.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="status" className="text-sm">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select value={status} onValueChange={(value: any) => setValue("status", value)}>
                <SelectTrigger id="status" className="mt-1.5 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baik">Baik</SelectItem>
                  <SelectItem value="Perlu Perhatian">Perlu Perhatian</SelectItem>
                  <SelectItem value="Bermasalah">Bermasalah</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
