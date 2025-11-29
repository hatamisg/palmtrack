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
import { MultiImageUpload } from "@/components/ui/multi-image-upload";
import { Issue } from "@/types";

const issueSchema = z.object({
  judul: z.string().min(3, "Judul minimal 3 karakter"),
  deskripsi: z.string().min(5, "Deskripsi minimal 5 karakter"),
  areaTerdampak: z.string().min(3, "Area terdampak wajib diisi"),
  tingkatKeparahan: z.enum(["Parah", "Sedang", "Ringan"]),
  status: z.enum(["Open", "Resolved"]),
  tanggalLapor: z.string().min(1, "Tanggal lapor wajib diisi"),
  solusi: z.string().optional(),
});

type IssueFormData = z.infer<typeof issueSchema>;

interface EditIssueModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<Issue, "id" | "gardenId" | "createdAt" | "updatedAt">
  ) => void;
  issue: Issue | null;
  gardenId: string;
}

export default function EditIssueModal({
  open,
  onClose,
  onSubmit,
  issue,
  gardenId,
}: EditIssueModalProps) {
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
      setValue(
        "tanggalLapor",
        issue.tanggalLapor instanceof Date
          ? issue.tanggalLapor.toISOString().split("T")[0]
          : (issue.tanggalLapor as string)
      );
      setValue("solusi", issue.solusi || "");
      setPhotos(issue.fotoUrls || []);
    }
  }, [issue, setValue]);

  const onFormSubmit = (data: IssueFormData) => {
    onSubmit({
      ...data,
      tanggalLapor: new Date(data.tanggalLapor),
      fotoUrls: photos.length > 0 ? photos : undefined,
      tanggalSelesai: data.status === "Resolved" ? new Date() : undefined,
    } as any);
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto rounded-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base sm:text-lg">Edit Masalah</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Perbarui informasi masalah
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Judul */}
          <div className="space-y-1.5">
            <Label htmlFor="judul" className="text-xs sm:text-sm font-medium">
              Judul Masalah <span className="text-red-500">*</span>
            </Label>
            <Input
              id="judul"
              placeholder="Serangan Hama di Area A"
              className="h-11 text-base sm:text-sm rounded-xl"
              {...register("judul")}
            />
            {errors.judul && (
              <p className="text-xs text-red-500 mt-1">{errors.judul.message}</p>
            )}
          </div>

          {/* Deskripsi */}
          <div className="space-y-1.5">
            <Label htmlFor="deskripsi" className="text-xs sm:text-sm font-medium">
              Deskripsi <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="deskripsi"
              placeholder="Jelaskan masalah secara detail..."
              rows={2}
              className="text-base sm:text-sm rounded-xl resize-none"
              {...register("deskripsi")}
            />
            {errors.deskripsi && (
              <p className="text-xs text-red-500 mt-1">
                {errors.deskripsi.message}
              </p>
            )}
          </div>

          {/* Area Terdampak */}
          <div className="space-y-1.5">
            <Label htmlFor="areaTerdampak" className="text-xs sm:text-sm font-medium">
              Area Terdampak <span className="text-red-500">*</span>
            </Label>
            <Input
              id="areaTerdampak"
              placeholder="Blok A, Baris 5-10"
              className="h-11 text-base sm:text-sm rounded-xl"
              {...register("areaTerdampak")}
            />
            {errors.areaTerdampak && (
              <p className="text-xs text-red-500 mt-1">
                {errors.areaTerdampak.message}
              </p>
            )}
          </div>

          {/* Tingkat Keparahan & Status Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tingkatKeparahan" className="text-xs sm:text-sm font-medium">
                Keparahan <span className="text-red-500">*</span>
              </Label>
              <Select
                value={tingkatKeparahan}
                onValueChange={(value: any) =>
                  setValue("tingkatKeparahan", value)
                }
              >
                <SelectTrigger className="h-11 text-base sm:text-sm rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Parah">Parah</SelectItem>
                  <SelectItem value="Sedang">Sedang</SelectItem>
                  <SelectItem value="Ringan">Ringan</SelectItem>
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
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tanggal Lapor */}
          <div className="space-y-1.5">
            <Label htmlFor="tanggalLapor" className="text-xs sm:text-sm font-medium">
              Tanggal Lapor <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tanggalLapor"
              type="date"
              className="h-11 text-base sm:text-sm rounded-xl"
              {...register("tanggalLapor")}
            />
          </div>

          {/* Solusi */}
          <div className="space-y-1.5">
            <Label htmlFor="solusi" className="text-xs sm:text-sm font-medium">Solusi (Opsional)</Label>
            <Textarea
              id="solusi"
              placeholder="Langkah penyelesaian..."
              rows={2}
              className="text-base sm:text-sm rounded-xl resize-none"
              {...register("solusi")}
            />
          </div>

          {/* Foto Masalah */}
          <div className="space-y-1.5">
            <Label className="text-xs sm:text-sm font-medium">Foto Dokumentasi</Label>
            <p className="text-[10px] sm:text-xs text-gray-500 mb-2">
              Upload foto dokumentasi (max 5 foto)
            </p>
            <MultiImageUpload
              value={photos}
              onChange={setPhotos}
              folder={`issues/${gardenId}/${issue?.id || Date.now()}`}
              maxImages={5}
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
