import Link from "next/link";
import { Garden } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GardenImage } from "@/components/ui/garden-image";
import { MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface GardenCardProps {
  garden: Garden;
}

export default function GardenCard({ garden }: GardenCardProps) {
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

  return (
    <Link href={`/kebun/${garden.slug}`} className="block">
      <Card className="hover:shadow-lg transition-shadow active:scale-[0.98] overflow-hidden flex flex-col h-full cursor-pointer">
        {/* Garden Image */}
        <GardenImage
          src={(garden as any).imageUrl || (garden as any).image_url}
          alt={garden.nama}
          aspectRatio="video"
          size="md"
          className="w-full"
        />
        
        <CardContent className="p-2.5 sm:p-4 md:p-6 flex flex-col flex-1">
          {/* Header */}
          <div className="mb-2 sm:mb-3 md:mb-4">
            <div className="flex items-start justify-between gap-1 mb-1">
              <h3 className="text-xs sm:text-sm md:text-lg font-semibold text-gray-900 line-clamp-1">
                {garden.nama}
              </h3>
              <Badge variant={getStatusColor(garden.status)} className="flex-shrink-0 text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2">
                <span className="hidden sm:inline">{garden.status}</span>
                <span className="sm:hidden">{garden.status === "Perlu Perhatian" ? "Perhatian" : garden.status}</span>
              </Badge>
            </div>
            <div className="flex items-center text-[10px] sm:text-xs md:text-sm text-gray-600">
              <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 flex-shrink-0" />
              <span className="truncate">{garden.lokasi}</span>
            </div>
          </div>

          {/* Stats - 2x2 grid */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-3 mb-2 sm:mb-3 md:mb-4">
            <div className="bg-gray-50 p-1.5 sm:p-2 md:p-3 rounded-md sm:rounded-lg">
              <p className="text-[9px] sm:text-xs text-gray-500">Luas</p>
              <p className="text-[11px] sm:text-sm md:text-base font-semibold text-gray-900">{garden.luas} Ha</p>
            </div>
            <div className="bg-gray-50 p-1.5 sm:p-2 md:p-3 rounded-md sm:rounded-lg">
              <p className="text-[9px] sm:text-xs text-gray-500">Pohon</p>
              <p className="text-[11px] sm:text-sm md:text-base font-semibold text-gray-900">
                {garden.jumlahPohon.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="bg-gray-50 p-1.5 sm:p-2 md:p-3 rounded-md sm:rounded-lg">
              <p className="text-[9px] sm:text-xs text-gray-500">Varietas</p>
              <p className="text-[11px] sm:text-sm md:text-base font-semibold text-gray-900 truncate">{garden.varietas}</p>
            </div>
            <div className="bg-gray-50 p-1.5 sm:p-2 md:p-3 rounded-md sm:rounded-lg">
              <p className="text-[9px] sm:text-xs text-gray-500">Tahun</p>
              <p className="text-[11px] sm:text-sm md:text-base font-semibold text-gray-900">{garden.tahunTanam}</p>
            </div>
          </div>

          {/* Location - hidden on very small screens */}
          <div className="hidden sm:block mb-2 sm:mb-3 md:mb-4 p-2 md:p-3 bg-blue-50 rounded-lg">
            <p className="text-[10px] sm:text-xs text-gray-600">Lokasi Lengkap:</p>
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-900 mt-0.5 sm:mt-1 line-clamp-2">{garden.lokasiLengkap}</p>
          </div>

          {/* Last Update */}
          <div className="mt-auto flex items-center text-[9px] sm:text-xs text-gray-500">
            <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 flex-shrink-0" />
            <span className="truncate">
              <span className="hidden sm:inline">Update: </span>
              {format(new Date(garden.updatedAt), "d MMM yy", { locale: id })}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
