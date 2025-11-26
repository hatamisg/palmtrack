import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Trees, TrendingUp } from "lucide-react";

interface SummaryCardsProps {
  totalGardens: number;
  totalLuas: number;
  totalPohon: number;
}

export default function SummaryCards({
  totalGardens,
  totalLuas,
  totalPohon,
}: SummaryCardsProps) {
  const cards = [
    {
      title: "Total Kebun",
      value: totalGardens,
      subtitle: "Kebun aktif",
      icon: MapPin,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Luas",
      value: `${totalLuas.toFixed(1)} Ha`,
      subtitle: "Hektar",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Pohon",
      value: totalPohon.toLocaleString("id-ID"),
      subtitle: "Pohon produktif",
      icon: Trees,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-gray-600 truncate">
                    {card.title}
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1 md:mt-2">
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 md:mt-1 truncate">{card.subtitle}</p>
                </div>
                <div className={`${card.bgColor} p-2 md:p-3 rounded-lg flex-shrink-0`}>
                  <Icon className={`h-5 w-5 md:h-6 md:w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
