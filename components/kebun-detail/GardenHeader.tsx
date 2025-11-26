import Link from "next/link";
import { Garden } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, MapPin, Calendar, Edit } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface GardenHeaderProps {
  garden: Garden;
  onEdit?: () => void;
}

export default function GardenHeader({ garden, onEdit }: GardenHeaderProps) {
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
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-xs md:text-sm text-gray-600 mb-3 md:mb-4 overflow-x-auto hide-scrollbar">
        <Link href="/" className="hover:text-primary whitespace-nowrap">
          Dashboard
        </Link>
        <ChevronRight className="h-3 w-3 md:h-4 md:w-4 mx-1 md:mx-2 flex-shrink-0" />
        <Link href="/kebun" className="hover:text-primary whitespace-nowrap">
          Kebun Saya
        </Link>
        <ChevronRight className="h-3 w-3 md:h-4 md:w-4 mx-1 md:mx-2 flex-shrink-0" />
        <span className="text-gray-900 font-medium truncate">{garden.nama}</span>
      </div>

      {/* Header Content */}
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 truncate">{garden.nama}</h1>
              <Badge variant={getStatusColor(garden.status)} className="flex-shrink-0 text-xs">
                {garden.status}
              </Badge>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <div className="flex items-start text-gray-600">
                <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm line-clamp-2">{garden.lokasiLengkap}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
                <div className="flex items-center whitespace-nowrap">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1 flex-shrink-0" />
                  Tanam: {garden.tahunTanam}
                </div>
                <span className="hidden md:inline">•</span>
                <div className="whitespace-nowrap">Varietas: {garden.varietas}</div>
                <span className="hidden md:inline">•</span>
                <div className="whitespace-nowrap">Update: {format(new Date(garden.updatedAt), "d MMM yyyy", { locale: id })}</div>
              </div>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={onEdit} className="flex-shrink-0 h-9">
            <Edit className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
            <span className="hidden md:inline">Edit</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
