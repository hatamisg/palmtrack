"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff, Trees } from "lucide-react";
import { cn } from "@/lib/utils";

interface GardenImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "video" | "wide";
  size?: "sm" | "md" | "lg";
  showPlaceholder?: boolean;
}

export function GardenImage({
  src,
  alt,
  className,
  aspectRatio = "video",
  size = "md",
  showPlaceholder = true,
}: GardenImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
  }[aspectRatio];

  const placeholderIconSize = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  }[size];

  const hasValidImage = src && !error;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-green-100 to-green-200",
        aspectRatioClass,
        className
      )}
    >
      {hasValidImage ? (
        <>
          {/* Loading skeleton */}
          {loading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          
          <Image
            src={src}
            alt={alt}
            fill
            className={cn(
              "object-cover transition-opacity duration-300",
              loading ? "opacity-0" : "opacity-100"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={() => setLoading(false)}
            onError={() => {
              setError(true);
              setLoading(false);
            }}
          />
        </>
      ) : showPlaceholder ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-green-600/50">
          <Trees className={placeholderIconSize} />
        </div>
      ) : null}
    </div>
  );
}

// Thumbnail version for lists
export function GardenThumbnail({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [error, setError] = useState(false);

  const hasValidImage = src && !error;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-gradient-to-br from-green-100 to-green-200",
        "w-12 h-12 md:w-14 md:h-14 flex-shrink-0",
        className
      )}
    >
      {hasValidImage ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="56px"
          onError={() => setError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-green-600/50">
          <Trees className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}
