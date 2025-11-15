import Link from "next/link";
import { Garden } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {garden.nama}
            </h3>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-3 w-3 mr-1" />
              {garden.lokasi}
            </div>
          </div>
          <Badge variant={getStatusColor(garden.status)}>
            {garden.status}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Luas</p>
            <p className="text-base font-semibold text-gray-900">{garden.luas} Ha</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Jumlah Pohon</p>
            <p className="text-base font-semibold text-gray-900">
              {garden.jumlahPohon.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Varietas</p>
            <p className="text-base font-semibold text-gray-900">{garden.varietas}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Tahun Tanam</p>
            <p className="text-base font-semibold text-gray-900">{garden.tahunTanam}</p>
          </div>
        </div>

        {/* Location */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600">Lokasi Lengkap:</p>
          <p className="text-sm text-gray-900 mt-1">{garden.lokasiLengkap}</p>
        </div>

        {/* Last Update */}
        <div className="flex items-center text-xs text-gray-500 mb-4">
          <Calendar className="h-3 w-3 mr-1" />
          Update terakhir: {format(new Date(garden.updatedAt), "d MMM yyyy", { locale: id })}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/kebun/${garden.slug}`} className="flex-1">
            <Button className="w-full" variant="default" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Lihat Detail
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
