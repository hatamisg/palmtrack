"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
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
import { Expense } from "@/types";

const expenseSchema = z.object({
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  kategori: z.enum(["Pupuk", "Pestisida", "Peralatan", "Tenaga Kerja", "Transportasi", "Lainnya"]),
  deskripsi: z.string().min(1, "Deskripsi wajib diisi"),
  jumlah: z.number().positive("Jumlah harus lebih dari 0"),
  catatan: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface EditExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Expense, "id" | "gardenId" | "createdAt" | "updatedAt">) => void;
  expense: Expense | null;
}

export default function EditExpenseModal({ open, onClose, onSubmit, expense }: EditExpenseModalProps) {
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

  // Update form values when expense prop changes
  useEffect(() => {
    if (expense) {
      setValue("tanggal", expense.tanggal instanceof Date
        ? expense.tanggal.toISOString().split('T')[0]
        : expense.tanggal as string
      );
      setValue("kategori", expense.kategori);
      setValue("deskripsi", expense.deskripsi);
      setValue("jumlah", expense.jumlah);
      setValue("catatan", expense.catatan || "");
    }
  }, [expense, setValue]);

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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto rounded-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base sm:text-lg">Edit Pengeluaran</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Perbarui informasi data pengeluaran
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Tanggal & Kategori Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tanggal" className="text-xs sm:text-sm font-medium">
                Tanggal <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tanggal"
                type="date"
                className="h-11 text-base sm:text-sm rounded-xl"
                {...register("tanggal")}
              />
              {errors.tanggal && (
                <p className="text-xs text-red-500 mt-1">{errors.tanggal.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="kategori" className="text-xs sm:text-sm font-medium">
                Kategori <span className="text-red-500">*</span>
              </Label>
              <Select
                value={kategori}
                onValueChange={(value: any) => setValue("kategori", value)}
              >
                <SelectTrigger className="h-11 text-base sm:text-sm rounded-xl">
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
          <div className="space-y-1.5">
            <Label htmlFor="deskripsi" className="text-xs sm:text-sm font-medium">
              Deskripsi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="deskripsi"
              placeholder="Pembelian pupuk NPK 500kg"
              className="h-11 text-base sm:text-sm rounded-xl"
              {...register("deskripsi")}
            />
            {errors.deskripsi && (
              <p className="text-xs text-red-500 mt-1">{errors.deskripsi.message}</p>
            )}
          </div>

          {/* Jumlah */}
          <div className="space-y-1.5">
            <Label htmlFor="jumlah" className="text-xs sm:text-sm font-medium">
              Jumlah (Rp) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="jumlah"
              type="number"
              placeholder="1500000"
              className="h-11 text-base sm:text-sm rounded-xl"
              {...register("jumlah", { valueAsNumber: true })}
            />
            {errors.jumlah && (
              <p className="text-xs text-red-500 mt-1">{errors.jumlah.message}</p>
            )}
          </div>

          {/* Catatan */}
          <div className="space-y-1.5">
            <Label htmlFor="catatan" className="text-xs sm:text-sm font-medium">Catatan</Label>
            <Textarea
              id="catatan"
              placeholder="Catatan tambahan..."
              rows={2}
              className="text-base sm:text-sm rounded-xl resize-none"
              {...register("catatan")}
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
