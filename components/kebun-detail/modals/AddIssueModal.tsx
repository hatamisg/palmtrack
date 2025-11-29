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
import { Issue } from "@/types";
import { X, Wallet } from "lucide-react";

const issueSchema = z.object({
  judul: z.string().min(3, "Judul minimal 3 karakter"),
  deskripsi: z.string().min(5, "Deskripsi minimal 5 karakter"),
  areaTerdampak: z.string().min(3, "Area terdampak wajib diisi"),
  tingkatKeparahan: z.enum(["Parah", "Sedang", "Ringan"]),
  status: z.enum(["Open", "Resolved"]),
  tanggalLapor: z.string().min(1, "Tanggal wajib diisi"),
  solusi: z.string().optional(),
  includeExpense: z.boolean(),
  expenseKategori: z.enum(["Pupuk", "Pestisida", "Peralatan", "Tenaga Kerja", "Transportasi", "Lainnya"]).optional(),
  expenseDeskripsi: z.string().optional(),
  expenseJumlah: z.number().optional(),
  expenseCatatan: z.string().optional(),
});

type IssueFormData = z.infer<typeof issueSchema>;

interface AddIssueModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Issue, "id" | "gardenId" | "createdAt" | "updatedAt">, expenseData?: any) => void;
  gardenId: string;
}

export default function AddIssueModal({ open, onClose, onSubmit, gardenId }: AddIssueModalProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      judul: "",
      deskripsi: "",
      areaTerdampak: "",
      tingkatKeparahan: "Sedang",
      status: "Open",
      tanggalLapor: "",
      solusi: "",
      includeExpense: false,
      expenseKategori: "Pestisida",
      expenseDeskripsi: "",
      expenseJumlah: undefined,
      expenseCatatan: "",
    },
  });

  const tingkatKeparahan = watch("tingkatKeparahan");
  const status = watch("status");
  const includeExpense = watch("includeExpense");
  const expenseKategori = watch("expenseKategori");

  const onFormSubmit = (data: IssueFormData) => {
    const issueData = {
      judul: data.judul,
      deskripsi: data.deskripsi,
      areaTerdampak: data.areaTerdampak,
      tingkatKeparahan: data.tingkatKeparahan,
      status: data.status,
      tanggalLapor: new Date(data.tanggalLapor),
      solusi: data.solusi,
      fotoUrls: photos.length > 0 ? photos : undefined,
    };

    let expenseData = undefined;
    if (data.includeExpense && data.expenseJumlah && data.expenseJumlah > 0) {
      expenseData = {
        tanggal: new Date(data.tanggalLapor),
        kategori: data.expenseKategori || "Lainnya",
        deskripsi: data.expenseDeskripsi || `Biaya penanganan: ${data.judul}`,
        jumlah: data.expenseJumlah,
        catatan: data.expenseCatatan || `Pengeluaran untuk masalah: ${data.judul}`,
      };
    }

    onSubmit(issueData as any, expenseData);
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
            <DialogTitle className="text-base sm:text-lg">Laporkan Masalah</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0 -mr-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="px-4 py-4 sm:px-6 space-y-4">
          {/* Judul */}
          <div>
            <Label htmlFor="judul" className="text-sm">Judul Masalah <span className="text-red-500">*</span></Label>
            <Input
              id="judul"
              placeholder="Contoh: Serangan Hama di Area A"
              className="mt-1.5 h-11"
              {...register("judul")}
            />
            {errors.judul && <p className="text-xs text-red-500 mt-1">{errors.judul.message}</p>}
          </div>

          {/* Deskripsi */}
          <div>
            <Label htmlFor="deskripsi" className="text-sm">Deskripsi <span className="text-red-500">*</span></Label>
            <Textarea
              id="deskripsi"
              placeholder="Jelaskan masalah secara detail..."
              rows={3}
              className="mt-1.5"
              {...register("deskripsi")}
            />
            {errors.deskripsi && <p className="text-xs text-red-500 mt-1">{errors.deskripsi.message}</p>}
          </div>

          {/* Area Terdampak */}
          <div>
            <Label htmlFor="areaTerdampak" className="text-sm">Area Terdampak <span className="text-red-500">*</span></Label>
            <Input
              id="areaTerdampak"
              placeholder="Contoh: Blok A, Baris 5-10"
              className="mt-1.5 h-11"
              {...register("areaTerdampak")}
            />
            {errors.areaTerdampak && <p className="text-xs text-red-500 mt-1">{errors.areaTerdampak.message}</p>}
          </div>

          {/* Tingkat & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="tingkatKeparahan" className="text-sm">Tingkat <span className="text-red-500">*</span></Label>
              <Select value={tingkatKeparahan} onValueChange={(value: any) => setValue("tingkatKeparahan", value)}>
                <SelectTrigger id="tingkatKeparahan" className="mt-1.5 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Parah">Parah</SelectItem>
                  <SelectItem value="Sedang">Sedang</SelectItem>
                  <SelectItem value="Ringan">Ringan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="issueStatus" className="text-sm">Status <span className="text-red-500">*</span></Label>
              <Select value={status} onValueChange={(value: any) => setValue("status", value)}>
                <SelectTrigger id="issueStatus" className="mt-1.5 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tanggal */}
          <div>
            <Label htmlFor="tanggalLapor" className="text-sm">Tanggal Lapor <span className="text-red-500">*</span></Label>
            <Input
              id="tanggalLapor"
              type="date"
              className="mt-1.5 h-11"
              {...register("tanggalLapor")}
            />
            {errors.tanggalLapor && <p className="text-xs text-red-500 mt-1">{errors.tanggalLapor.message}</p>}
          </div>

          {/* Solusi */}
          <div>
            <Label htmlFor="solusi" className="text-sm">Solusi</Label>
            <Textarea
              id="solusi"
              placeholder="Langkah penyelesaian..."
              rows={2}
              className="mt-1.5"
              {...register("solusi")}
            />
          </div>

          {/* Foto */}
          <div>
            <Label className="text-sm">Foto Masalah</Label>
            <p className="text-xs text-gray-500 mb-2">Upload foto dokumentasi</p>
            <MultiImageUpload
              value={photos}
              onChange={setPhotos}
              folder={`issues/${gardenId}/${Date.now()}`}
              maxImages={5}
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
                    <Label htmlFor="issueExpenseKategori" className="text-sm">Kategori</Label>
                    <Select value={expenseKategori} onValueChange={(value: any) => setValue("expenseKategori", value)}>
                      <SelectTrigger id="issueExpenseKategori" className="mt-1.5 h-11">
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
                    <Label htmlFor="issueExpenseJumlah" className="text-sm">Jumlah (Rp) <span className="text-red-500">*</span></Label>
                    <Input
                      id="issueExpenseJumlah"
                      type="number"
                      placeholder="1500000"
                      className="mt-1.5 h-11"
                      {...register("expenseJumlah", { valueAsNumber: true })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="issueExpenseDeskripsi" className="text-sm">Deskripsi</Label>
                  <Input
                    id="issueExpenseDeskripsi"
                    placeholder="Misal: Pembelian pestisida"
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
