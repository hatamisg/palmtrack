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
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <Link href="/" className="hover:text-primary">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/kebun" className="hover:text-primary">
          Kebun Saya
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-900 font-medium">{garden.nama}</span>
      </div>

      {/* Header Content */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{garden.nama}</h1>
            <Badge variant={getStatusColor(garden.status)}>{garden.status}</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm">{garden.lokasiLengkap}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Tanam: {garden.tahunTanam}
              </div>
              <span>•</span>
              <div>Varietas: {garden.varietas}</div>
              <span>•</span>
              <div>Update: {format(new Date(garden.updatedAt), "d MMM yyyy", { locale: id })}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}
