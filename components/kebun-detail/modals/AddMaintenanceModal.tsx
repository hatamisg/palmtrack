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
import { Checkbox } from "@/components/ui/checkbox";
import { Maintenance } from "@/types";

const maintenanceSchema = z.object({
  jenisPerawatan: z.enum(["Pemupukan", "Penyemprotan", "Pemangkasan", "Pembersihan", "Lainnya"]),
  judul: z.string().min(3, "Judul minimal 3 karakter"),
  tanggalDijadwalkan: z.string().min(1, "Tanggal dijadwalkan wajib diisi"),
  status: z.enum(["Dijadwalkan", "Selesai", "Terlambat"]),
  detail: z.string().optional(),
  penanggungJawab: z.string().optional(),
  isRecurring: z.boolean(),
  recurringInterval: z.number().min(1, "Interval minimal 1 hari").optional(),
});

type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

interface AddMaintenanceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Maintenance, "id" | "gardenId" | "createdAt" | "updatedAt" | "tanggalSelesai">) => void;
}

export default function AddMaintenanceModal({ open, onClose, onSubmit }: AddMaintenanceModalProps) {
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

  const onFormSubmit = (data: MaintenanceFormData) => {
    const submitData: any = {
      ...data,
      tanggalDijadwalkan: new Date(data.tanggalDijadwalkan),
    };

    // Only include recurringInterval if isRecurring is true
    if (!data.isRecurring) {
      delete submitData.recurringInterval;
    }

    onSubmit(submitData);
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
          <DialogTitle>Tambah Jadwal Perawatan Baru</DialogTitle>
          <DialogDescription>
            Isi form di bawah untuk menambahkan jadwal perawatan baru
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Jenis Perawatan & Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jenisPerawatan">
                Jenis Perawatan <span className="text-red-500">*</span>
              </Label>
              <Select
                value={jenisPerawatan}
                onValueChange={(value: any) => setValue("jenisPerawatan", value)}
              >
                <SelectTrigger>
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
              {errors.jenisPerawatan && (
                <p className="text-sm text-red-500 mt-1">{errors.jenisPerawatan.message}</p>
              )}
            </div>

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
                  <SelectItem value="Dijadwalkan">Dijadwalkan</SelectItem>
                  <SelectItem value="Selesai">Selesai</SelectItem>
                  <SelectItem value="Terlambat">Terlambat</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
              )}
            </div>
          </div>

          {/* Judul */}
          <div>
            <Label htmlFor="judul">
              Judul Perawatan <span className="text-red-500">*</span>
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

          {/* Tanggal Dijadwalkan */}
          <div>
            <Label htmlFor="tanggalDijadwalkan">
              Tanggal Dijadwalkan <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tanggalDijadwalkan"
              type="date"
              {...register("tanggalDijadwalkan")}
            />
            {errors.tanggalDijadwalkan && (
              <p className="text-sm text-red-500 mt-1">{errors.tanggalDijadwalkan.message}</p>
            )}
          </div>

          {/* Detail */}
          <div>
            <Label htmlFor="detail">Detail Perawatan</Label>
            <Textarea
              id="detail"
              placeholder="Detail tambahan tentang perawatan..."
              rows={3}
              {...register("detail")}
            />
            {errors.detail && (
              <p className="text-sm text-red-500 mt-1">{errors.detail.message}</p>
            )}
          </div>

          {/* Penanggung Jawab */}
          <div>
            <Label htmlFor="penanggungJawab">Penanggung Jawab</Label>
            <Input
              id="penanggungJawab"
              placeholder="Nama penanggung jawab (opsional)"
              {...register("penanggungJawab")}
            />
            {errors.penanggungJawab && (
              <p className="text-sm text-red-500 mt-1">{errors.penanggungJawab.message}</p>
            )}
          </div>

          {/* Recurring Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isRecurring"
              checked={isRecurring}
              onCheckedChange={(checked) => setValue("isRecurring", checked as boolean)}
            />
            <Label
              htmlFor="isRecurring"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Perawatan Berkala
            </Label>
          </div>

          {/* Recurring Interval - Conditional */}
          {isRecurring && (
            <div>
              <Label htmlFor="recurringInterval">
                Interval Pengulangan (hari) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="recurringInterval"
                type="number"
                min="1"
                placeholder="Contoh: 30"
                {...register("recurringInterval", { valueAsNumber: true })}
              />
              {errors.recurringInterval && (
                <p className="text-sm text-red-500 mt-1">{errors.recurringInterval.message}</p>
              )}
            </div>
          )}

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
