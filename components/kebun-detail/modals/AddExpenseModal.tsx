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
import { Expense } from "@/types";
import { X } from "lucide-react";

const expenseSchema = z.object({
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  kategori: z.enum(["Pupuk", "Pestisida", "Peralatan", "Tenaga Kerja", "Transportasi", "Lainnya"]),
  deskripsi: z.string().min(1, "Deskripsi wajib diisi"),
  jumlah: z.number().positive("Jumlah harus lebih dari 0"),
  catatan: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Expense, "id" | "gardenId" | "createdAt" | "updatedAt">) => void;
}

export default function AddExpenseModal({ open, onClose, onSubmit }: AddExpenseModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      tanggal: "",
      kategori: "Pupuk",
      deskripsi: "",
      jumlah: 0,
      catatan: "",
    },
  });

  const kategori = watch("kategori");

  const onFormSubmit = (data: ExpenseFormData) => {
    onSubmit({
      ...data,
      tanggal: new Date(data.tanggal),
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
            <DialogTitle className="text-base sm:text-lg">Tambah Pengeluaran</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0 -mr-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="px-4 py-4 sm:px-6 space-y-4">
          {/* Tanggal & Kategori */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="tanggal" className="text-sm">
                Tanggal <span className="text-red-500">*</span>
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

            <div>
              <Label htmlFor="kategori" className="text-sm">
                Kategori <span className="text-red-500">*</span>
              </Label>
              <Select value={kategori} onValueChange={(value: any) => setValue("kategori", value)}>
                <SelectTrigger id="kategori" className="mt-1.5 h-11">
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
          </div>

          {/* Deskripsi */}
          <div>
            <Label htmlFor="deskripsi" className="text-sm">
              Deskripsi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="deskripsi"
              placeholder="Misal: Pembelian pupuk NPK 500kg"
              className="mt-1.5 h-11"
              {...register("deskripsi")}
            />
            {errors.deskripsi && (
              <p className="text-xs text-red-500 mt-1">{errors.deskripsi.message}</p>
            )}
          </div>

          {/* Jumlah */}
          <div>
            <Label htmlFor="jumlah" className="text-sm">
              Jumlah (Rp) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="jumlah"
              type="number"
              placeholder="1500000"
              className="mt-1.5 h-11"
              {...register("jumlah", { valueAsNumber: true })}
            />
            {errors.jumlah && (
              <p className="text-xs text-red-500 mt-1">{errors.jumlah.message}</p>
            )}
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
