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
import { Issue } from "@/types";

const issueSchema = z.object({
  judul: z.string().min(3, "Judul minimal 3 karakter"),
  deskripsi: z.string().min(5, "Deskripsi minimal 5 karakter"),
  areaTerdampak: z.string().min(3, "Area terdampak wajib diisi"),
  tingkatKeparahan: z.enum(["Parah", "Sedang", "Ringan"]),
  status: z.enum(["Open", "Resolved"]),
  tanggalLapor: z.string().min(1, "Tanggal lapor wajib diisi"),
  solusi: z.string().optional(),
  fotoUrls: z.string().optional(), // Placeholder for future file upload
});

type IssueFormData = z.infer<typeof issueSchema>;

interface EditIssueModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Issue, "id" | "gardenId" | "createdAt" | "updatedAt">) => void;
  issue: Issue | null;
}

export default function EditIssueModal({ open, onClose, onSubmit, issue }: EditIssueModalProps) {
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
      fotoUrls: "",
    },
  });

  const tingkatKeparahan = watch("tingkatKeparahan");
  const status = watch("status");

  // Update form values when issue prop changes
  useEffect(() => {
    if (issue) {
      setValue("judul", issue.judul);
      setValue("deskripsi", issue.deskripsi);
      setValue("areaTerdampak", issue.areaTerdampak);
      setValue("tingkatKeparahan", issue.tingkatKeparahan);
      setValue("status", issue.status);
      setValue("tanggalLapor", issue.tanggalLapor instanceof Date
        ? issue.tanggalLapor.toISOString().split('T')[0]
        : issue.tanggalLapor as string
      );
      setValue("solusi", issue.solusi || "");
      setValue("fotoUrls", issue.fotoUrls && issue.fotoUrls.length > 0 ? issue.fotoUrls[0] : "");
    }
  }, [issue, setValue]);

  const onFormSubmit = (data: IssueFormData) => {
    onSubmit({
      ...data,
      tanggalLapor: new Date(data.tanggalLapor),
      fotoUrls: data.fotoUrls ? [data.fotoUrls] : undefined,
      tanggalSelesai: data.status === "Resolved" ? new Date() : undefined,
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
          <DialogTitle>Edit Masalah</DialogTitle>
          <DialogDescription>
            Perbarui informasi masalah {issue?.judul}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Judul */}
          <div>
            <Label htmlFor="judul">
              Judul Masalah <span className="text-red-500">*</span>
            </Label>
            <Input
              id="judul"
              placeholder="Contoh: Serangan Hama di Area A"
              {...register("judul")}
            />
            {errors.judul && (
              <p className="text-sm text-red-500 mt-1">{errors.judul.message}</p>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <Label htmlFor="deskripsi">
              Deskripsi <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="deskripsi"
              placeholder="Jelaskan masalah secara detail..."
              rows={3}
              {...register("deskripsi")}
            />
            {errors.deskripsi && (
              <p className="text-sm text-red-500 mt-1">{errors.deskripsi.message}</p>
            )}
          </div>

          {/* Area Terdampak */}
          <div>
            <Label htmlFor="areaTerdampak">
              Area Terdampak <span className="text-red-500">*</span>
            </Label>
            <Input
              id="areaTerdampak"
              placeholder="Contoh: Blok A, Baris 5-10"
              {...register("areaTerdampak")}
            />
            {errors.areaTerdampak && (
              <p className="text-sm text-red-500 mt-1">{errors.areaTerdampak.message}</p>
            )}
          </div>

          {/* Tingkat Keparahan & Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tingkatKeparahan">
                Tingkat Keparahan <span className="text-red-500">*</span>
              </Label>
              <Select
                value={tingkatKeparahan}
                onValueChange={(value: any) => setValue("tingkatKeparahan", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Parah">Parah</SelectItem>
                  <SelectItem value="Sedang">Sedang</SelectItem>
                  <SelectItem value="Ringan">Ringan</SelectItem>
                </SelectContent>
              </Select>
              {errors.tingkatKeparahan && (
                <p className="text-sm text-red-500 mt-1">{errors.tingkatKeparahan.message}</p>
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
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
              )}
            </div>
          </div>

          {/* Tanggal Lapor */}
          <div>
            <Label htmlFor="tanggalLapor">
              Tanggal Lapor <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tanggalLapor"
              type="date"
              {...register("tanggalLapor")}
            />
            {errors.tanggalLapor && (
              <p className="text-sm text-red-500 mt-1">{errors.tanggalLapor.message}</p>
            )}
          </div>

          {/* Solusi */}
          <div>
            <Label htmlFor="solusi">Solusi (Opsional)</Label>
            <Textarea
              id="solusi"
              placeholder="Langkah-langkah penyelesaian yang telah atau akan dilakukan..."
              rows={3}
              {...register("solusi")}
            />
            {errors.solusi && (
              <p className="text-sm text-red-500 mt-1">{errors.solusi.message}</p>
            )}
          </div>

          {/* Foto URLs - Placeholder */}
          <div>
            <Label htmlFor="fotoUrls">Foto URL (Opsional - Placeholder)</Label>
            <Input
              id="fotoUrls"
              placeholder="https://example.com/image.jpg"
              {...register("fotoUrls")}
            />
            <p className="text-xs text-gray-500 mt-1">
              Fitur upload foto akan ditambahkan di masa mendatang
            </p>
            {errors.fotoUrls && (
              <p className="text-sm text-red-500 mt-1">{errors.fotoUrls.message}</p>
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
