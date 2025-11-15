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
import { Garden } from "@/types";
import { useEffect } from "react";
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
    }
  }, [garden, setValue]);

  const onFormSubmit = (data: GardenFormData) => {
    // Generate new slug if name changed, otherwise keep existing slug
    const slug = data.nama !== garden?.nama ? generateSlug(data.nama) : (garden?.slug || generateSlug(data.nama));
    onSubmit({ ...data, slug });
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
          <DialogTitle>Edit Kebun</DialogTitle>
          <DialogDescription>
            Perbarui informasi kebun {garden?.nama}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Nama Kebun */}
          <div>
            <Label htmlFor="nama">
              Nama Kebun <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nama"
              placeholder="Contoh: Kebun Sawit Makmur"
              {...register("nama")}
            />
            {errors.nama && (
              <p className="text-sm text-red-500 mt-1">{errors.nama.message}</p>
            )}
          </div>

          {/* Lokasi Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lokasi">
                Provinsi/Kota <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lokasi"
                placeholder="Contoh: Riau"
                {...register("lokasi")}
              />
              {errors.lokasi && (
                <p className="text-sm text-red-500 mt-1">{errors.lokasi.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="varietas">
                Varietas <span className="text-red-500">*</span>
              </Label>
              <Select
                value={varietas}
                onValueChange={(value) => setValue("varietas", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tenera">Tenera</SelectItem>
                  <SelectItem value="Dura">Dura</SelectItem>
                  <SelectItem value="Pisifera">Pisifera</SelectItem>
                </SelectContent>
              </Select>
              {errors.varietas && (
                <p className="text-sm text-red-500 mt-1">{errors.varietas.message}</p>
              )}
            </div>
          </div>

          {/* Lokasi Lengkap */}
          <div>
            <Label htmlFor="lokasiLengkap">
              Lokasi Lengkap <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lokasiLengkap"
              placeholder="Contoh: Desa Suka Makmur, Kec. Tapung, Kab. Kampar, Riau"
              {...register("lokasiLengkap")}
            />
            {errors.lokasiLengkap && (
              <p className="text-sm text-red-500 mt-1">{errors.lokasiLengkap.message}</p>
            )}
          </div>

          {/* Numbers Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="luas">
                Luas (Ha) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="luas"
                type="number"
                step="0.1"
                placeholder="25.5"
                {...register("luas", { valueAsNumber: true })}
              />
              {errors.luas && (
                <p className="text-sm text-red-500 mt-1">{errors.luas.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="jumlahPohon">
                Jumlah Pohon <span className="text-red-500">*</span>
              </Label>
              <Input
                id="jumlahPohon"
                type="number"
                placeholder="3500"
                {...register("jumlahPohon", { valueAsNumber: true })}
              />
              {errors.jumlahPohon && (
                <p className="text-sm text-red-500 mt-1">{errors.jumlahPohon.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="tahunTanam">
                Tahun Tanam <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tahunTanam"
                type="number"
                placeholder="2020"
                {...register("tahunTanam", { valueAsNumber: true })}
              />
              {errors.tahunTanam && (
                <p className="text-sm text-red-500 mt-1">{errors.tahunTanam.message}</p>
              )}
            </div>
          </div>

          {/* Status */}
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
                <SelectItem value="Baik">Baik</SelectItem>
                <SelectItem value="Perlu Perhatian">Perlu Perhatian</SelectItem>
                <SelectItem value="Bermasalah">Bermasalah</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Batal
            </Button>
            <Button type="submit">Simpan Perubahan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
