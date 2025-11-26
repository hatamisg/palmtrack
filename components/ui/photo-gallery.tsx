"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface PhotoGalleryProps {
  photos: string[];
  className?: string;
  maxVisible?: number;
}

export function PhotoGallery({ photos, className, maxVisible = 3 }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!photos || photos.length === 0) return null;

  const visiblePhotos = photos.slice(0, maxVisible);
  const remainingCount = photos.length - maxVisible;

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  
  const goNext = () => {
    if (selectedIndex !== null && selectedIndex < photos.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };
  
  const goPrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  return (
    <>
      {/* Thumbnail Grid */}
      <div className={cn("flex gap-2", className)}>
        {visiblePhotos.map((photo, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <Image
              src={photo}
              alt={`Photo ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
            {index === maxVisible - 1 && remainingCount > 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">+{remainingCount}</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Counter */}
          <div className="absolute top-4 left-4 text-white text-sm">
            {selectedIndex + 1} / {photos.length}
          </div>

          {/* Navigation */}
          {selectedIndex > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {selectedIndex < photos.length - 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}

          {/* Image */}
          <div 
            className="relative max-w-[90vw] max-h-[80vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[selectedIndex]}
              alt={`Photo ${selectedIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}

// Compact version for cards
export function PhotoThumbnails({ photos, className }: { photos: string[]; className?: string }) {
  if (!photos || photos.length === 0) return null;

  return (
    <div className={cn("flex gap-1", className)}>
      {photos.slice(0, 3).map((photo, index) => (
        <div
          key={index}
          className="relative w-10 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0"
        >
          <Image
            src={photo}
            alt={`Photo ${index + 1}`}
            fill
            className="object-cover"
            sizes="40px"
          />
          {index === 2 && photos.length > 3 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold text-xs">+{photos.length - 3}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
