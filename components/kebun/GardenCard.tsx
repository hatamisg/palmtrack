import Link from "next/link";
import { Garden } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GardenImage } from "@/components/ui/garden-image";
import { MapPin, Trees, Calendar, Trash2, Eye, Pencil } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface GardenCardProps {
  garden: Garden;
  onDelete: () => void;
  onEdit: () => void;
}

export default function GardenCard({ garden, onDelete, onEdit }: GardenCardProps) {
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

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm(`Apakah Anda yakin ingin menghapus kebun "${garden.nama}"?`)) {
      onDelete();
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit();
  };

  // Disable swipe on kebun page to prevent accidental deletion
  // Only use traditional delete button
  return (
    <Card className="hover:shadow-lg transition-shadow active:scale-[0.98] overflow-hidden">
      {/* Garden Image */}
      <GardenImage
        src={(garden as any).imageUrl || (garden as any).image_url}
        alt={garden.nama}
        aspectRatio="video"
        size="md"
        className="w-full"
      />
      
      <CardContent className="p-4 md:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 truncate">
              {garden.nama}
            </h3>
            <div className="flex items-center text-xs md:text-sm text-gray-600">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{garden.lokasi}</span>
            </div>
          </div>
          <Badge variant={getStatusColor(garden.status)} className="flex-shrink-0 text-xs">
            {garden.status}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-4">
          <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-0.5 md:mb-1">Luas</p>
            <p className="text-sm md:text-base font-semibold text-gray-900">{garden.luas} Ha</p>
          </div>
          <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-0.5 md:mb-1">Jumlah Pohon</p>
            <p className="text-sm md:text-base font-semibold text-gray-900">
              {garden.jumlahPohon.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-0.5 md:mb-1">Varietas</p>
            <p className="text-sm md:text-base font-semibold text-gray-900 truncate">{garden.varietas}</p>
          </div>
          <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-0.5 md:mb-1">Tahun Tanam</p>
            <p className="text-sm md:text-base font-semibold text-gray-900">{garden.tahunTanam}</p>
          </div>
        </div>

        {/* Location */}
        <div className="mb-3 md:mb-4 p-2 md:p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600">Lokasi Lengkap:</p>
          <p className="text-xs md:text-sm text-gray-900 mt-1 line-clamp-2">{garden.lokasiLengkap}</p>
        </div>

        {/* Last Update */}
        <div className="flex items-center text-xs text-gray-500 mb-3 md:mb-4">
          <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="truncate">Update terakhir: {format(new Date(garden.updatedAt), "d MMM yyyy", { locale: id })}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/kebun/${garden.slug}`} className="flex-1">
            <Button className="w-full h-10 md:h-9" variant="default" size="sm">
              <Eye className="h-4 w-4 mr-1 md:mr-2" />
              <span className="text-xs md:text-sm">Lihat Detail</span>
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleEdit} className="h-10 w-10 md:h-9 md:w-auto p-0 md:px-3">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete} className="h-10 w-10 md:h-9 md:w-auto p-0 md:px-3">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
