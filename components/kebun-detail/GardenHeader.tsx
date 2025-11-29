import Link from "next/link";
import Image from "next/image";
import { Garden } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Calendar, Edit, Trash2, TreeDeciduous, Ruler } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface GardenHeaderProps {
  garden: Garden;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function GardenHeader({ garden, onEdit, onDelete }: GardenHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Baik":
        return "success";
      case "Perlu Perhatian":
        return "warning";
      case "Bermasalah":
        return "destructive";
      default:
        return "default";
    }
  };

  const getImageUrl = () => {
    return (garden as any).imageUrl || (garden as any).image_url || "/placeholder-garden.jpg";
  };

  return (
    <div className="mb-4 md:mb-6">
      {/* Hero Section with Image */}
      <div className="relative rounded-xl overflow-hidden">
        {/* Background Image */}
        <div className="relative h-40 sm:h-48 md:h-56 lg:h-64">
          <Image
            src={getImageUrl()}
            alt={garden.nama}
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>

        {/* Top Bar - Back & Actions */}
        <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between">
          <Link href="/kebun">
            <Button variant="secondary" size="sm" className="h-8 sm:h-9 bg-white/90 hover:bg-white shadow-lg">
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1 text-sm">Kembali</span>
            </Button>
          </Link>
          
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={onEdit} className="h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3 bg-white/90 hover:bg-white shadow-lg">
              <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline ml-1.5 text-sm">Edit</span>
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete} className="h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3 shadow-lg">
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline ml-1.5 text-sm">Hapus</span>
            </Button>
          </div>
        </div>

        {/* Content Overlay - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6">
          {/* Garden Name & Status */}
          <div className="flex items-start justify-between gap-2 mb-1 sm:mb-2">
            <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg line-clamp-2">
              {garden.nama}
            </h1>
            <Badge variant={getStatusColor(garden.status)} className="flex-shrink-0 text-[10px] sm:text-xs shadow-lg">
              {garden.status}
            </Badge>
          </div>
          
          {/* Location */}
          <div className="flex items-center text-white/90 text-[11px] sm:text-sm md:text-base mb-2 sm:mb-3">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{garden.lokasiLengkap}</span>
          </div>

          {/* Quick Info Pills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 sm:px-3 sm:py-1">
              <Ruler className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-white" />
              <span className="text-[10px] sm:text-xs text-white font-medium">{garden.luas} Ha</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 sm:px-3 sm:py-1">
              <TreeDeciduous className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-white" />
              <span className="text-[10px] sm:text-xs text-white font-medium">{garden.jumlahPohon.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 sm:px-3 sm:py-1">
              <Calendar className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-white" />
              <span className="text-[10px] sm:text-xs text-white font-medium">{garden.tahunTanam}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-xs text-white font-medium">{garden.varietas}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
