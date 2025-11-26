"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Camera, Upload, X, Loader2, ImagePlus } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { uploadImage, compressImage, validateImageFile } from "@/lib/supabase/storage";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  folder: string;
  className?: string;
  aspectRatio?: "square" | "video" | "wide";
  placeholder?: string;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  folder,
  className,
  aspectRatio = "video",
  placeholder = "Upload gambar",
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
  }[aspectRatio];

  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file
    const validation = validateImageFile(file, 5);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setIsUploading(true);

    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      // Compress image
      const compressedFile = await compressImage(file, 1920, 0.8);

      // Upload to Supabase
      const { url, error } = await uploadImage(compressedFile, folder);

      if (error) {
        toast.error("Gagal upload: " + error);
        setPreview(value || null);
        return;
      }

      if (url) {
        onChange(url);
        toast.success("Gambar berhasil diupload!");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Terjadi kesalahan saat upload");
      setPreview(value || null);
    } finally {
      setIsUploading(false);
    }
  }, [folder, onChange, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      inputRef.current?.click();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <div
        onClick={handleClick}
        className={cn(
          "relative overflow-hidden rounded-lg border-2 border-dashed cursor-pointer transition-colors",
          aspectRatioClass,
          preview || value
            ? "border-transparent"
            : "border-gray-300 hover:border-primary bg-gray-50 hover:bg-gray-100",
          disabled && "opacity-50 cursor-not-allowed",
          isUploading && "cursor-wait"
        )}
      >
        {/* Preview Image */}
        {(preview || value) && (
          <Image
            src={preview || value || ""}
            alt="Preview"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}

        {/* Upload Placeholder */}
        {!preview && !value && !isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <ImagePlus className="h-8 w-8 md:h-10 md:w-10 mb-2" />
            <span className="text-xs md:text-sm text-center px-4">{placeholder}</span>
            <span className="text-xs text-gray-400 mt-1">JPG, PNG, WebP (max 5MB)</span>
          </div>
        )}

        {/* Loading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="flex flex-col items-center text-white">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <span className="text-sm">Mengupload...</span>
            </div>
          </div>
        )}

        {/* Remove Button */}
        {(preview || value) && !isUploading && !disabled && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {/* Change Button */}
        {(preview || value) && !isUploading && !disabled && (
          <div className="absolute bottom-2 left-2 right-2 flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              <Camera className="h-3 w-3 mr-1" />
              Ganti
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
