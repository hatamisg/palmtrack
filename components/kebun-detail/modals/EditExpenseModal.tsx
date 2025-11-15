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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Pengeluaran</DialogTitle>
          <DialogDescription>
            Perbarui informasi data pengeluaran
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Tanggal */}
          <div>
            <Label htmlFor="tanggal">
              Tanggal <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tanggal"
              type="date"
              {...register("tanggal")}
            />
            {errors.tanggal && (
              <p className="text-sm text-red-500 mt-1">{errors.tanggal.message}</p>
            )}
          </div>

          {/* Kategori */}
          <div>
            <Label htmlFor="kategori">
              Kategori <span className="text-red-500">*</span>
            </Label>
            <Select
              value={kategori}
              onValueChange={(value: any) => setValue("kategori", value)}
            >
              <SelectTrigger>
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
            {errors.kategori && (
              <p className="text-sm text-red-500 mt-1">{errors.kategori.message}</p>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <Label htmlFor="deskripsi">
              Deskripsi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="deskripsi"
              placeholder="Misal: Pembelian pupuk NPK 500kg"
              {...register("deskripsi")}
            />
            {errors.deskripsi && (
              <p className="text-sm text-red-500 mt-1">{errors.deskripsi.message}</p>
            )}
          </div>

          {/* Jumlah */}
          <div>
            <Label htmlFor="jumlah">
              Jumlah (Rp) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="jumlah"
              type="number"
              placeholder="1500000"
              {...register("jumlah", { valueAsNumber: true })}
            />
            {errors.jumlah && (
              <p className="text-sm text-red-500 mt-1">{errors.jumlah.message}</p>
            )}
          </div>

          {/* Catatan */}
          <div>
            <Label htmlFor="catatan">Catatan</Label>
            <Textarea
              id="catatan"
              placeholder="Catatan tambahan tentang pengeluaran..."
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
            <Button type="submit">Simpan Perubahan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
