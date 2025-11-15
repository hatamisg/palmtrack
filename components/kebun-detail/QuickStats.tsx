import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Trees, Wrench, AlertTriangle } from "lucide-react";

interface QuickStatsProps {
  luas: number;
  jumlahPohon: number;
  upcomingMaintenances: number;
  openIssues: number;
}

export default function QuickStats({
  luas,
  jumlahPohon,
  upcomingMaintenances,
  openIssues,
}: QuickStatsProps) {
  const stats = [
    {
      label: "Luas Kebun",
      value: `${luas} Ha`,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Jumlah Pohon",
      value: jumlahPohon.toLocaleString("id-ID"),
      icon: Trees,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Perawatan Terjadwal",
      value: upcomingMaintenances,
      icon: Wrench,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: "Masalah Terbuka",
      value: openIssues,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
