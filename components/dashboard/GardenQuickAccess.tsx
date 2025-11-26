import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GardenThumbnail } from "@/components/ui/garden-image";
import { Garden } from "@/types";
import { MapPin, ArrowRight, Trees } from "lucide-react";

interface GardenQuickAccessProps {
  gardens: Garden[];
}

export default function GardenQuickAccess({ gardens }: GardenQuickAccessProps) {
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
    <Card>
      <CardHeader className="pb-3 md:pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Trees className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
            Kebun Saya
          </CardTitle>
          <Link href="/kebun">
            <Button variant="ghost" size="sm" className="h-9">
              <span className="hidden md:inline">Lihat Semua</span>
              <span className="md:hidden text-xs">Semua</span>
              <ArrowRight className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="px-3 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {gardens.map((garden) => (
            <Link
              key={garden.id}
              href={`/kebun/${garden.slug}`}
              className="block p-3 md:p-4 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors border border-gray-200 tap-target"
            >
              <div className="flex gap-3">
                {/* Thumbnail */}
                <GardenThumbnail
                  src={(garden as any).imageUrl || (garden as any).image_url}
                  alt={garden.nama}
                />
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-sm md:text-base text-gray-900 truncate pr-2">
                      {garden.nama}
                    </h4>
                    <Badge variant={getStatusColor(garden.status)} className="text-xs flex-shrink-0">
                      {garden.status}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-gray-600 mb-2">
                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{garden.lokasi}</span>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <span className="text-gray-500">
                      <span className="font-medium text-gray-900">{garden.luas}</span> Ha
                    </span>
                    <span className="text-gray-500">
                      <span className="font-medium text-gray-900">{garden.jumlahPohon.toLocaleString("id-ID")}</span> pohon
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
