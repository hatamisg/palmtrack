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
import { Documentation } from "@/types";

const documentationSchema = z.object({
  tipe: z.enum(["foto", "dokumen", "catatan"]),
  judul: z.string().min(3, "Judul minimal 3 karakter"),
  deskripsi: z.string().optional(),
  fileUrl: z.string().optional(),
  content: z.string().optional(),
  kategori: z.string().optional(),
});

type DocumentationFormData = z.infer<typeof documentationSchema>;

interface EditDocumentationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Documentation, "id" | "gardenId" | "createdAt" | "updatedAt">) => void;
  documentation: Documentation | null;
}

export default function EditDocumentationModal({
  open,
  onClose,
  onSubmit,
  documentation
}: EditDocumentationModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DocumentationFormData>({
    resolver: zodResolver(documentationSchema),
    defaultValues: {
      tipe: "foto",
      judul: "",
      deskripsi: "",
      fileUrl: "",
      content: "",
      kategori: "",
    },
  });

  const tipe = watch("tipe");

  // Update form values when documentation prop changes
  useEffect(() => {
    if (documentation) {
      setValue("tipe", documentation.tipe);
      setValue("judul", documentation.judul);
      setValue("deskripsi", documentation.deskripsi || "");
      setValue("fileUrl", documentation.fileUrl || "");
      setValue("content", documentation.content || "");
      setValue("kategori", documentation.kategori || "");
    }
  }, [documentation, setValue]);

  const onFormSubmit = (data: DocumentationFormData) => {
    onSubmit(data as any);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto rounded-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base sm:text-lg">Edit Dokumentasi</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Perbarui informasi dokumentasi
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Tipe */}
          <div className="space-y-1.5">
            <Label htmlFor="tipe" className="text-xs sm:text-sm font-medium">
              Tipe <span className="text-red-500">*</span>
            </Label>
            <Select
              value={tipe}
              onValueChange={(value: any) => setValue("tipe", value)}
            >
              <SelectTrigger className="h-11 text-base sm:text-sm rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="foto">Foto</SelectItem>
                <SelectItem value="dokumen">Dokumen</SelectItem>
                <SelectItem value="catatan">Catatan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Judul */}
          <div className="space-y-1.5">
            <Label htmlFor="judul" className="text-xs sm:text-sm font-medium">
              Judul <span className="text-red-500">*</span>
            </Label>
            <Input
              id="judul"
              placeholder={
                tipe === "foto"
                  ? "Foto kondisi kebun"
                  : tipe === "dokumen"
                  ? "Sertifikat Lahan"
                  : "Catatan perawatan"
              }
              className="h-11 text-base sm:text-sm rounded-xl"
              {...register("judul")}
            />
            {errors.judul && (
              <p className="text-xs text-red-500 mt-1">{errors.judul.message}</p>
            )}
          </div>

          {/* Deskripsi */}
          <div className="space-y-1.5">
            <Label htmlFor="deskripsi" className="text-xs sm:text-sm font-medium">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              placeholder="Deskripsi tambahan (opsional)"
              rows={2}
              className="text-base sm:text-sm rounded-xl resize-none"
              {...register("deskripsi")}
            />
          </div>

          {/* Conditional Fields based on Tipe */}
          {(tipe === "foto" || tipe === "dokumen") && (
            <div className="space-y-1.5">
              <Label htmlFor="fileUrl" className="text-xs sm:text-sm font-medium">
                URL {tipe === "foto" ? "Foto" : "Dokumen"}
              </Label>
              <Input
                id="fileUrl"
                type="url"
                placeholder="https://example.com/file.jpg"
                className="h-11 text-base sm:text-sm rounded-xl"
                {...register("fileUrl")}
              />
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                Placeholder untuk integrasi upload file
              </p>
            </div>
          )}

          {tipe === "catatan" && (
            <div className="space-y-1.5">
              <Label htmlFor="content" className="text-xs sm:text-sm font-medium">Isi Catatan</Label>
              <Textarea
                id="content"
                placeholder="Tulis catatan Anda di sini..."
                rows={4}
                className="text-base sm:text-sm rounded-xl resize-none"
                {...register("content")}
              />
            </div>
          )}

          {/* Kategori */}
          <div className="space-y-1.5">
            <Label htmlFor="kategori" className="text-xs sm:text-sm font-medium">Kategori</Label>
            <Input
              id="kategori"
              placeholder="Perawatan, Panen, Umum (opsional)"
              className="h-11 text-base sm:text-sm rounded-xl"
              {...register("kategori")}
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
