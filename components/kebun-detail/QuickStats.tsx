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
      label: "Luas",
      value: `${luas}`,
      unit: "Ha",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-500",
      lightBg: "bg-blue-50",
    },
    {
      label: "Pohon",
      value: jumlahPohon.toLocaleString("id-ID"),
      unit: "",
      icon: Trees,
      color: "text-green-600",
      bgColor: "bg-green-500",
      lightBg: "bg-green-50",
    },
    {
      label: "Perawatan",
      value: upcomingMaintenances,
      unit: "jadwal",
      icon: Wrench,
      color: "text-orange-600",
      bgColor: "bg-orange-500",
      lightBg: "bg-orange-50",
    },
    {
      label: "Masalah",
      value: openIssues,
      unit: "aktif",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-500",
      lightBg: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 md:mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.lightBg} rounded-xl p-2.5 sm:p-3 md:p-4 transition-all hover:shadow-md`}
          >
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-2 sm:gap-3">
              <div className={`${stat.bgColor} p-1.5 sm:p-2 rounded-lg flex-shrink-0`}>
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-gray-600 truncate">{stat.label}</p>
                <p className="text-sm sm:text-lg md:text-xl font-bold text-gray-900">
                  {stat.value}
                </p>
                {stat.unit && (
                  <p className="text-[9px] sm:text-xs text-gray-500 hidden sm:block">{stat.unit}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
