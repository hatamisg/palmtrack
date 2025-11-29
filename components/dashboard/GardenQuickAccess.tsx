import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Garden } from "@/types";
import { MapPin, ArrowRight, Trees, Ruler, TreeDeciduous } from "lucide-react";

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

  const getImageUrl = (garden: Garden) => {
    return (garden as any).imageUrl || (garden as any).image_url || "/placeholder-garden.jpg";
  };

  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
            <div className="bg-green-100 p-1.5 sm:p-2 rounded-lg">
              <Trees className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-green-600" />
            </div>
            Kebun Saya
          </CardTitle>
          <Link href="/kebun">
            <Button variant="ghost" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm text-green-600 hover:text-green-700 hover:bg-green-50">
              <span className="hidden sm:inline">Lihat Semua</span>
              <span className="sm:hidden">Semua</span>
              <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {gardens.map((garden) => (
            <Link
              key={garden.id}
              href={`/kebun/${garden.slug}`}
              className="group block relative aspect-square rounded-xl overflow-hidden active:scale-[0.98] transition-transform"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={getImageUrl(garden)}
                  alt={garden.nama}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Status Badge - Top Right */}
              <div className="absolute top-2 right-2">
                <Badge 
                  variant={getStatusColor(garden.status)} 
                  className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 shadow-lg"
                >
                  <span className="hidden sm:inline">{garden.status}</span>
                  <span className="sm:hidden">{garden.status === "Perlu Perhatian" ? "Perhatian" : garden.status}</span>
                </Badge>
              </div>
              
              {/* Content Overlay - Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3.5">
                <h4 className="font-semibold text-sm sm:text-lg lg:text-xl text-white truncate mb-0.5 sm:mb-1 drop-shadow-md">
                  {garden.nama}
                </h4>
                
                <div className="flex items-center text-xs sm:text-sm text-white/80 mb-1.5 sm:mb-2">
                  <MapPin className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 mr-0.5 sm:mr-1 flex-shrink-0" />
                  <span className="truncate">{garden.lokasi}</span>
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-2.5 sm:gap-4 text-xs sm:text-sm text-white/90">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <Ruler className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                    <span className="font-medium">{garden.luas} Ha</span>
                  </div>
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <TreeDeciduous className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                    <span className="font-medium">{garden.jumlahPohon.toLocaleString("id-ID")}</span>
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
