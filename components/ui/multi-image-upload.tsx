"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Camera, X, Loader2, Plus, ImagePlus } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { uploadImage, compressImage, validateImageFile } from "@/lib/supabase/storage";
import { toast } from "sonner";

interface MultiImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  folder: string;
  maxImages?: number;
  className?: string;
  disabled?: boolean;
}

export function MultiImageUpload({
  value = [],
  onChange,
  folder,
  maxImages = 5,
  className,
  disabled = false,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelect = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    const remainingSlots = maxImages - value.length;
    
    if (fileArray.length > remainingSlots) {
      toast.error(`Maksimal ${maxImages} gambar. Sisa slot: ${remainingSlots}`);
      return;
    }

    // Validate all files first
    for (const file of fileArray) {
      const validation = validateImageFile(file, 5);
      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }
    }

    setIsUploading(true);
    setUploadingCount(fileArray.length);

    const newUrls: string[] = [];

    try {
      for (const file of fileArray) {
        // Compress image
        const compressedFile = await compressImage(file, 1920, 0.8);

        // Upload to Supabase
        const { url, error } = await uploadImage(compressedFile, folder);

        if (error) {
          toast.error("Gagal upload: " + error);
          continue;
        }

        if (url) {
          newUrls.push(url);
        }

        setUploadingCount((prev) => prev - 1);
      }

      if (newUrls.length > 0) {
        onChange([...value, ...newUrls]);
        toast.success(`${newUrls.length} gambar berhasil diupload!`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Terjadi kesalahan saat upload");
    } finally {
      setIsUploading(false);
      setUploadingCount(0);
    }
  }, [folder, onChange, value, maxImages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFilesSelect(files);
    }
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  const handleClick = () => {
    if (!disabled && !isUploading && value.length < maxImages) {
      inputRef.current?.click();
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Image Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        {/* Existing Images */}
        {value.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
          >
            <Image
              src={url}
              alt={`Image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, 25vw"
            />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                onClick={() => handleRemove(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}

        {/* Upload Button */}
        {value.length < maxImages && (
          <button
            type="button"
            onClick={handleClick}
            disabled={disabled || isUploading}
            className={cn(
              "aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-colors",
              "border-gray-300 hover:border-primary bg-gray-50 hover:bg-gray-100",
              disabled && "opacity-50 cursor-not-allowed",
              isUploading && "cursor-wait"
            )}
          >
            {isUploading ? (
              <div className="flex flex-col items-center text-gray-500">
                <Loader2 className="h-6 w-6 animate-spin mb-1" />
                <span className="text-xs">{uploadingCount} file</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <Plus className="h-6 w-6 mb-1" />
                <span className="text-xs">Tambah</span>
              </div>
            )}
          </button>
        )}
      </div>

      {/* Info */}
      <p className="text-xs text-gray-500">
        {value.length}/{maxImages} gambar • JPG, PNG, WebP (max 5MB)
      </p>
    </div>
  );
}
