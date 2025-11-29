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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { Garden } from "@/types";
import { useEffect, useState } from "react";
import { generateSlug } from "@/lib/utils";

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

interface EditGardenModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Garden, "id" | "createdAt" | "updatedAt">) => void;
  garden: Garden | null;
}

export default function EditGardenModal({ open, onClose, onSubmit, garden }: EditGardenModalProps) {
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

  // Update form values when garden prop changes
  useEffect(() => {
    if (garden) {
      setValue("nama", garden.nama);
      setValue("lokasi", garden.lokasi);
      setValue("lokasiLengkap", garden.lokasiLengkap);
      setValue("luas", garden.luas);
      setValue("jumlahPohon", garden.jumlahPohon);
      setValue("tahunTanam", garden.tahunTanam);
      setValue("varietas", garden.varietas);
      setValue("status", garden.status);
      setImageUrl(garden.imageUrl || null);
    }
  }, [garden, setValue]);

  const onFormSubmit = (data: GardenFormData) => {
    // Generate new slug if name changed, otherwise keep existing slug
    const slug = data.nama !== garden?.nama ? generateSlug(data.nama) : (garden?.slug || generateSlug(data.nama));
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto rounded-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base sm:text-lg">Edit Kebun</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Perbarui informasi kebun {garden?.nama}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Garden Image */}
          <div className="space-y-1.5">
            <Label className="text-xs sm:text-sm font-medium">Foto Kebun</Label>
            <ImageUpload
              value={imageUrl}
              onChange={setImageUrl}
              folder={`gardens/${garden?.id || 'new'}`}
              aspectRatio="video"
              placeholder="Upload foto kebun"
              className="mt-1"
            />
          </div>

          {/* Nama Kebun */}
          <div className="space-y-1.5">
            <Label htmlFor="nama" className="text-xs sm:text-sm font-medium">
              Nama Kebun <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nama"
              placeholder="Contoh: Kebun Sawit Makmur"
              className="h-11 text-base sm:text-sm rounded-xl"
              {...register("nama")}
            />
            {errors.nama && (
              <p className="text-xs text-red-500 mt-1">{errors.nama.message}</p>
            )}
          </div>

          {/* Lokasi Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="lokasi" className="text-xs sm:text-sm font-medium">
                Provinsi/Kota <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lokasi"
                placeholder="Contoh: Riau"
                className="h-11 text-base sm:text-sm rounded-xl"
                {...register("lokasi")}
              />
              {errors.lokasi && (
                <p className="text-xs text-red-500 mt-1">{errors.lokasi.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="varietas" className="text-xs sm:text-sm font-medium">
                Varietas <span className="text-red-500">*</span>
              </Label>
              <Select
                value={varietas}
                onValueChange={(value) => setValue("varietas", value)}
              >
                <SelectTrigger id="varietas" className="h-11 text-base sm:text-sm rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tenera">Tenera</SelectItem>
                  <SelectItem value="Dura">Dura</SelectItem>
                  <SelectItem value="Pisifera">Pisifera</SelectItem>
                </SelectContent>
              </Select>
              {errors.varietas && (
                <p className="text-xs text-red-500 mt-1">{errors.varietas.message}</p>
              )}
            </div>
          </div>

          {/* Lokasi Lengkap */}
          <div className="space-y-1.5">
            <Label htmlFor="lokasiLengkap" className="text-xs sm:text-sm font-medium">
              Lokasi Lengkap <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lokasiLengkap"
              placeholder="Desa, Kecamatan, Kabupaten"
              className="h-11 text-base sm:text-sm rounded-xl"
              {...register("lokasiLengkap")}
            />
            {errors.lokasiLengkap && (
              <p className="text-xs text-red-500 mt-1">{errors.lokasiLengkap.message}</p>
            )}
          </div>

          {/* Luas & Jumlah Pohon Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="luas" className="text-xs sm:text-sm font-medium">
                Luas (Ha) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="luas"
                type="number"
                step="0.1"
                placeholder="25.5"
                className="h-11 text-base sm:text-sm rounded-xl"
                {...register("luas", { valueAsNumber: true })}
              />
              {errors.luas && (
                <p className="text-xs text-red-500 mt-1">{errors.luas.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="jumlahPohon" className="text-xs sm:text-sm font-medium">
                Jumlah Pohon <span className="text-red-500">*</span>
              </Label>
              <Input
                id="jumlahPohon"
                type="number"
                placeholder="3500"
                className="h-11 text-base sm:text-sm rounded-xl"
                {...register("jumlahPohon", { valueAsNumber: true })}
              />
              {errors.jumlahPohon && (
                <p className="text-xs text-red-500 mt-1">{errors.jumlahPohon.message}</p>
              )}
            </div>
          </div>

          {/* Tahun Tanam & Status Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tahunTanam" className="text-xs sm:text-sm font-medium">
                Tahun Tanam <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tahunTanam"
                type="number"
                placeholder="2020"
                className="h-11 text-base sm:text-sm rounded-xl"
                {...register("tahunTanam", { valueAsNumber: true })}
              />
              {errors.tahunTanam && (
                <p className="text-xs text-red-500 mt-1">{errors.tahunTanam.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-xs sm:text-sm font-medium">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={status}
                onValueChange={(value: any) => setValue("status", value)}
              >
                <SelectTrigger id="status" className="h-11 text-base sm:text-sm rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baik">Baik</SelectItem>
                  <SelectItem value="Perlu Perhatian">Perlu Perhatian</SelectItem>
                  <SelectItem value="Bermasalah">Bermasalah</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>
              )}
            </div>
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
