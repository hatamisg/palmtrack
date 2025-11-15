import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trees className="h-5 w-5 text-green-600" />
            Kebun Saya
          </CardTitle>
          <Link href="/kebun">
            <Button variant="ghost" size="sm">
              Lihat Semua
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gardens.map((garden) => (
            <Link
              key={garden.id}
              href={`/kebun/${garden.slug}`}
              className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {garden.nama}
                  </h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    {garden.lokasi}
                  </div>
                </div>
                <Badge variant={getStatusColor(garden.status)}>
                  {garden.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500">Luas</p>
                  <p className="text-sm font-medium text-gray-900">
                    {garden.luas} Ha
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pohon</p>
                  <p className="text-sm font-medium text-gray-900">
                    {garden.jumlahPohon.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
