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

interface AddDocumentationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Documentation, "id" | "gardenId" | "createdAt" | "updatedAt">) => void;
}

export default function AddDocumentationModal({ open, onClose, onSubmit }: AddDocumentationModalProps) {
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Dokumentasi Baru</DialogTitle>
          <DialogDescription>
            Isi form di bawah untuk menambahkan dokumentasi baru
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Tipe */}
          <div>
            <Label htmlFor="tipe">
              Tipe <span className="text-red-500">*</span>
            </Label>
            <Select
              value={tipe}
              onValueChange={(value: any) => setValue("tipe", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="foto">Foto</SelectItem>
                <SelectItem value="dokumen">Dokumen</SelectItem>
                <SelectItem value="catatan">Catatan</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipe && (
              <p className="text-sm text-red-500 mt-1">{errors.tipe.message}</p>
            )}
          </div>

          {/* Judul */}
          <div>
            <Label htmlFor="judul">
              Judul <span className="text-red-500">*</span>
            </Label>
            <Input
              id="judul"
              placeholder={
                tipe === "foto"
                  ? "Contoh: Foto kondisi kebun Januari 2024"
                  : tipe === "dokumen"
                  ? "Contoh: Sertifikat Lahan"
                  : "Contoh: Catatan perawatan mingguan"
              }
              {...register("judul")}
            />
            {errors.judul && (
              <p className="text-sm text-red-500 mt-1">{errors.judul.message}</p>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              placeholder="Deskripsi tambahan (opsional)"
              rows={2}
              {...register("deskripsi")}
            />
            {errors.deskripsi && (
              <p className="text-sm text-red-500 mt-1">{errors.deskripsi.message}</p>
            )}
          </div>

          {/* Conditional Fields based on Tipe */}
          {(tipe === "foto" || tipe === "dokumen") && (
            <div>
              <Label htmlFor="fileUrl">
                URL {tipe === "foto" ? "Foto" : "Dokumen"}
              </Label>
              <Input
                id="fileUrl"
                type="url"
                placeholder="https://example.com/file.jpg (opsional - placeholder)"
                {...register("fileUrl")}
              />
              <p className="text-xs text-gray-500 mt-1">
                Placeholder untuk integrasi upload file di masa depan
              </p>
              {errors.fileUrl && (
                <p className="text-sm text-red-500 mt-1">{errors.fileUrl.message}</p>
              )}
            </div>
          )}

          {tipe === "catatan" && (
            <div>
              <Label htmlFor="content">Isi Catatan</Label>
              <Textarea
                id="content"
                placeholder="Tulis catatan Anda di sini..."
                rows={6}
                {...register("content")}
              />
              {errors.content && (
                <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
              )}
            </div>
          )}

          {/* Kategori */}
          <div>
            <Label htmlFor="kategori">Kategori</Label>
            <Input
              id="kategori"
              placeholder="Contoh: Perawatan, Panen, Umum (opsional)"
              {...register("kategori")}
            />
            {errors.kategori && (
              <p className="text-sm text-red-500 mt-1">{errors.kategori.message}</p>
            )}
          </div>

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
