"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { MultiImageUpload } from "@/components/ui/multi-image-upload";
import { Maintenance } from "@/types";
import { X, Wallet, RefreshCw } from "lucide-react";

const maintenanceSchema = z.object({
  jenisPerawatan: z.enum(["Pemupukan", "Penyemprotan", "Pemangkasan", "Pembersihan", "Lainnya"]),
  judul: z.string().min(3, "Judul minimal 3 karakter"),
  tanggalDijadwalkan: z.string().min(1, "Tanggal wajib diisi"),
  status: z.enum(["Dijadwalkan", "Selesai", "Terlambat"]),
  detail: z.string().optional(),
  penanggungJawab: z.string().optional(),
  isRecurring: z.boolean(),
  recurringInterval: z.number().min(1, "Interval minimal 1 hari").optional(),
  includeExpense: z.boolean(),
  expenseKategori: z.enum(["Pupuk", "Pestisida", "Peralatan", "Tenaga Kerja", "Transportasi", "Lainnya"]).optional(),
  expenseDeskripsi: z.string().optional(),
  expenseJumlah: z.number().optional(),
  expenseCatatan: z.string().optional(),
});

type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

interface AddMaintenanceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Maintenance, "id" | "gardenId" | "createdAt" | "updatedAt" | "tanggalSelesai">, expenseData?: any) => void;
  gardenId: string;
}

export default function AddMaintenanceModal({ open, onClose, onSubmit, gardenId }: AddMaintenanceModalProps) {
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
      includeExpense: false,
      expenseKategori: "Pupuk",
      expenseDeskripsi: "",
      expenseJumlah: undefined,
      expenseCatatan: "",
    },
  });

  const jenisPerawatan = watch("jenisPerawatan");
  const status = watch("status");
  const isRecurring = watch("isRecurring");
  const includeExpense = watch("includeExpense");
  const expenseKategori = watch("expenseKategori");

  const getDefaultExpenseKategori = (jenis: string) => {
    switch (jenis) {
      case "Pemupukan": return "Pupuk";
      case "Penyemprotan": return "Pestisida";
      default: return "Lainnya";
    }
  };

  const onFormSubmit = (data: MaintenanceFormData) => {
    const maintenanceData: any = {
      jenisPerawatan: data.jenisPerawatan,
      judul: data.judul,
      tanggalDijadwalkan: new Date(data.tanggalDijadwalkan),
      status: data.status,
      detail: data.detail,
      penanggungJawab: data.penanggungJawab,
      isRecurring: data.isRecurring,
      images: photos.length > 0 ? photos : undefined,
    };

    if (data.isRecurring && data.recurringInterval) {
      maintenanceData.recurringInterval = data.recurringInterval;
    }

    let expenseData = undefined;
    if (data.includeExpense && data.expenseJumlah && data.expenseJumlah > 0) {
      expenseData = {
        tanggal: new Date(data.tanggalDijadwalkan),
        kategori: data.expenseKategori || "Lainnya",
        deskripsi: data.expenseDeskripsi || `Biaya ${data.judul}`,
        jumlah: data.expenseJumlah,
        catatan: data.expenseCatatan || `Pengeluaran untuk perawatan: ${data.judul}`,
      };
    }

    onSubmit(maintenanceData, expenseData);
    reset();
    setPhotos([]);
  };

  const handleClose = () => {
    reset();
    setPhotos([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="sticky top-0 z-10 bg-white border-b px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base sm:text-lg">Jadwalkan Perawatan</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0 -mr-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="px-4 py-4 sm:px-6 space-y-4">
          {/* Jenis & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="jenisPerawatan" className="text-sm">Jenis <span className="text-red-500">*</span></Label>
              <Select
                value={jenisPerawatan}
                onValueChange={(value: any) => {
                  setValue("jenisPerawatan", value);
                  setValue("expenseKategori", getDefaultExpenseKategori(value) as any);
                }}
              >
                <SelectTrigger id="jenisPerawatan" className="mt-1.5 h-11">
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

            <div>
              <Label htmlFor="status" className="text-sm">Status <span className="text-red-500">*</span></Label>
              <Select value={status} onValueChange={(value: any) => setValue("status", value)}>
                <SelectTrigger id="status" className="mt-1.5 h-11">
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
          <div>
            <Label htmlFor="judul" className="text-sm">Judul <span className="text-red-500">*</span></Label>
            <Input
              id="judul"
              placeholder="Contoh: Pemupukan area A"
              className="mt-1.5 h-11"
              {...register("judul")}
            />
            {errors.judul && <p className="text-xs text-red-500 mt-1">{errors.judul.message}</p>}
          </div>

          {/* Tanggal */}
          <div>
            <Label htmlFor="tanggalDijadwalkan" className="text-sm">Tanggal <span className="text-red-500">*</span></Label>
            <Input
              id="tanggalDijadwalkan"
              type="date"
              className="mt-1.5 h-11"
              {...register("tanggalDijadwalkan")}
            />
            {errors.tanggalDijadwalkan && <p className="text-xs text-red-500 mt-1">{errors.tanggalDijadwalkan.message}</p>}
          </div>

          {/* Detail */}
          <div>
            <Label htmlFor="detail" className="text-sm">Detail</Label>
            <Textarea
              id="detail"
              placeholder="Detail tambahan..."
              rows={2}
              className="mt-1.5"
              {...register("detail")}
            />
          </div>

          {/* PJ */}
          <div>
            <Label htmlFor="penanggungJawab" className="text-sm">Penanggung Jawab</Label>
            <Input
              id="penanggungJawab"
              placeholder="Nama PJ (opsional)"
              className="mt-1.5 h-11"
              {...register("penanggungJawab")}
            />
          </div>

          {/* Recurring Section */}
          <div className="bg-blue-50 rounded-xl p-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isRecurring"
                checked={isRecurring}
                onCheckedChange={(checked) => setValue("isRecurring", checked as boolean)}
              />
              <Label htmlFor="isRecurring" className="text-sm font-medium flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-blue-600" />
                Perawatan Berkala
              </Label>
            </div>
            
            {isRecurring && (
              <div className="mt-3">
                <Label htmlFor="recurringInterval" className="text-sm">Interval (hari) <span className="text-red-500">*</span></Label>
                <Input
                  id="recurringInterval"
                  type="number"
                  min="1"
                  placeholder="30"
                  className="mt-1.5 h-11"
                  {...register("recurringInterval", { valueAsNumber: true })}
                />
              </div>
            )}
          </div>

          {/* Foto */}
          <div>
            <Label className="text-sm">Foto Dokumentasi</Label>
            <p className="text-xs text-gray-500 mb-2">Upload foto perawatan</p>
            <MultiImageUpload
              value={photos}
              onChange={setPhotos}
              folder={`maintenances/${gardenId}/${Date.now()}`}
              maxImages={4}
            />
          </div>

          {/* Expense Section */}
          <div className="bg-red-50 rounded-xl p-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeExpense"
                checked={includeExpense}
                onCheckedChange={(checked) => setValue("includeExpense", checked as boolean)}
              />
              <Label htmlFor="includeExpense" className="text-sm font-medium flex items-center gap-2">
                <Wallet className="h-4 w-4 text-red-600" />
                Tambahkan Pengeluaran
              </Label>
            </div>
            
            {includeExpense && (
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expenseKategori" className="text-sm">Kategori</Label>
                    <Select value={expenseKategori} onValueChange={(value: any) => setValue("expenseKategori", value)}>
                      <SelectTrigger id="expenseKategori" className="mt-1.5 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pupuk">Pupuk</SelectItem>
                        <SelectItem value="Pestisida">Pestisida</SelectItem>
                        <SelectItem value="Peralatan">Peralatan</SelectItem>
                        <SelectItem value="Tenaga Kerja">Tenaga Kerja</SelectItem>
                        <SelectItem value="Transportasi">Transportasi</SelectItem>
                        <SelectItem value="Lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="expenseJumlah" className="text-sm">Jumlah (Rp) <span className="text-red-500">*</span></Label>
                    <Input
                      id="expenseJumlah"
                      type="number"
                      placeholder="1500000"
                      className="mt-1.5 h-11"
                      {...register("expenseJumlah", { valueAsNumber: true })}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Deskripsi</Label>
                  <Input
                    placeholder="Misal: Pembelian pupuk NPK"
                    className="mt-1.5 h-11"
                    {...register("expenseDeskripsi")}
                  />
                </div>
              </div>
            )}
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
