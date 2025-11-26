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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-gray-600 truncate">{stat.label}</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900 mt-1 md:mt-2 truncate">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-2 md:p-3 rounded-lg self-end md:self-auto flex-shrink-0`}>
                  <Icon className={`h-4 w-4 md:h-6 md:w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
