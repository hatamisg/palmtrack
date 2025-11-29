"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { MultiImageUpload } from "@/components/ui/multi-image-upload";
import { Maintenance } from "@/types";

const maintenanceSchema = z.object({
  jenisPerawatan: z.enum([
    "Pemupukan",
    "Penyemprotan",
    "Pemangkasan",
    "Pembersihan",
    "Lainnya",
  ]),
  judul: z.string().min(3, "Judul minimal 3 karakter"),
  tanggalDijadwalkan: z.string().min(1, "Tanggal dijadwalkan wajib diisi"),
  status: z.enum(["Dijadwalkan", "Selesai", "Terlambat"]),
  detail: z.string().optional(),
  penanggungJawab: z.string().optional(),
  isRecurring: z.boolean(),
  recurringInterval: z.number().min(1, "Interval minimal 1 hari").optional(),
});

type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

interface EditMaintenanceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<
      Maintenance,
      "id" | "gardenId" | "createdAt" | "updatedAt" | "tanggalSelesai"
    >
  ) => void;
  maintenance: Maintenance | null;
  gardenId?: string;
}

export default function EditMaintenanceModal({
  open,
  onClose,
  onSubmit,
  maintenance,
  gardenId,
}: EditMaintenanceModalProps) {
  const [photos, setPhotos] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      jenisPerawatan: "Pemupukan",
      judul: "",
      tanggalDijadwalkan: "",
      status: "Dijadwalkan",
      detail: "",
      penanggungJawab: "",
      isRecurring: false,
      recurringInterval: undefined,
    },
  });

  const jenisPerawatan = watch("jenisPerawatan");
  const status = watch("status");
  const isRecurring = watch("isRecurring");

  // Update form values when maintenance prop changes
  useEffect(() => {
    if (maintenance) {
      setValue("jenisPerawatan", maintenance.jenisPerawatan);
      setValue("judul", maintenance.judul);
      setValue(
        "tanggalDijadwalkan",
        maintenance.tanggalDijadwalkan instanceof Date
          ? maintenance.tanggalDijadwalkan.toISOString().split("T")[0]
          : (maintenance.tanggalDijadwalkan as string)
      );
      setValue("status", maintenance.status);
      setValue("detail", maintenance.detail || "");
      setValue("penanggungJawab", maintenance.penanggungJawab || "");
      setValue("isRecurring", maintenance.isRecurring);
      setValue("recurringInterval", maintenance.recurringInterval || undefined);
      setPhotos(maintenance.images || []);
    }
  }, [maintenance, setValue]);

  const onFormSubmit = (data: MaintenanceFormData) => {
    const submitData: any = {
      ...data,
      tanggalDijadwalkan: new Date(data.tanggalDijadwalkan),
      images: photos.length > 0 ? photos : undefined,
    };

    // Only include recurringInterval if isRecurring is true
    if (!data.isRecurring) {
      delete submitData.recurringInterval;
    }

    onSubmit(submitData);
    reset();
    setPhotos([]);
  };

  const handleClose = () => {
    reset();
    setPhotos([]);
    onClose();
  };

  // Get the actual garden ID for folder path
  const actualGardenId = gardenId || maintenance?.gardenId || "unknown";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto rounded-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base sm:text-lg">Edit Jadwal Perawatan</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Perbarui informasi perawatan
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Jenis Perawatan & Status Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="jenisPerawatan" className="text-xs sm:text-sm font-medium">
                Jenis <span className="text-red-500">*</span>
              </Label>
              <Select
                value={jenisPerawatan}
                onValueChange={(value: any) =>
                  setValue("jenisPerawatan", value)
                }
              >
                <SelectTrigger className="h-11 text-base sm:text-sm rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pemupukan">Pemupukan</SelectItem>
                  <SelectItem value="Penyemprotan">Penyemprotan</SelectItem>
                  <SelectItem value="Pemangkasan">Pemangkasan</SelectItem>
                  <SelectItem value="Pembersihan">Pembersihan</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                  <SelectItem value="Dijadwalkan">Dijadwalkan</SelectItem>
                  <SelectItem value="Selesai">Selesai</SelectItem>
                  <SelectItem value="Terlambat">Terlambat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Judul */}
          <div className="space-y-1.5">
            <Label htmlFor="judul" className="text-xs sm:text-sm font-medium">
              Judul Perawatan <span className="text-red-500">*</span>
            </Label>
            <Input
              id="judul"
              placeholder="Pemupukan area A"
              className="h-11 text-base sm:text-sm rounded-xl"
              {...register("judul")}
            />
            {errors.judul && (
              <p className="text-xs text-red-500 mt-1">{errors.judul.message}</p>
            )}
          </div>

          {/* Tanggal Dijadwalkan */}
          <div className="space-y-1.5">
            <Label htmlFor="tanggalDijadwalkan" className="text-xs sm:text-sm font-medium">
              Tanggal <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tanggalDijadwalkan"
              type="date"
              className="h-11 text-base sm:text-sm rounded-xl"
              {...register("tanggalDijadwalkan")}
            />
          </div>

          {/* Detail */}
          <div className="space-y-1.5">
            <Label htmlFor="detail" className="text-xs sm:text-sm font-medium">Detail Perawatan</Label>
            <Textarea
              id="detail"
              placeholder="Detail tambahan..."
              rows={2}
              className="text-base sm:text-sm rounded-xl resize-none"
              {...register("detail")}
            />
          </div>

          {/* Penanggung Jawab */}
          <div className="space-y-1.5">
            <Label htmlFor="penanggungJawab" className="text-xs sm:text-sm font-medium">Penanggung Jawab</Label>
            <Input
              id="penanggungJawab"
              placeholder="Nama penanggung jawab"
              className="h-11 text-base sm:text-sm rounded-xl"
              {...register("penanggungJawab")}
            />
          </div>

          {/* Recurring Checkbox */}
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
            <Checkbox
              id="isRecurring"
              checked={isRecurring}
              onCheckedChange={(checked) =>
                setValue("isRecurring", checked as boolean)
              }
            />
            <Label
              htmlFor="isRecurring"
              className="text-xs sm:text-sm font-medium leading-none"
            >
              Perawatan Berkala
            </Label>
          </div>

          {/* Recurring Interval - Conditional */}
          {isRecurring && (
            <div className="space-y-1.5">
              <Label htmlFor="recurringInterval" className="text-xs sm:text-sm font-medium">
                Interval (hari) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="recurringInterval"
                type="number"
                min="1"
                placeholder="30"
                className="h-11 text-base sm:text-sm rounded-xl"
                {...register("recurringInterval", { valueAsNumber: true })}
              />
            </div>
          )}

          {/* Foto Perawatan */}
          <div className="space-y-1.5">
            <Label className="text-xs sm:text-sm font-medium">Foto Dokumentasi</Label>
            <p className="text-[10px] sm:text-xs text-gray-500 mb-2">
              Upload foto sebelum/sesudah (max 4 foto)
            </p>
            <MultiImageUpload
              value={photos}
              onChange={setPhotos}
              folder={`maintenances/${actualGardenId}/${maintenance?.id || Date.now()}`}
              maxImages={4}
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
