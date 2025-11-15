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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                </div>
                <div className={`${card.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
