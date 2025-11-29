import { Card } from "@/components/ui/card";
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
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100/50",
      iconBg: "bg-blue-100",
    },
    {
      title: "Total Luas",
      value: `${totalLuas.toFixed(1)} Ha`,
      subtitle: "Hektar",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100/50",
      iconBg: "bg-green-100",
    },
    {
      title: "Total Pohon",
      value: totalPohon.toLocaleString("id-ID"),
      subtitle: "Pohon produktif",
      icon: Trees,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100/50",
      iconBg: "bg-emerald-100",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card 
            key={index} 
            className={`${card.bgColor} border-0 overflow-hidden`}
          >
            <div className="p-3 sm:p-4 lg:p-5">
              {/* Mobile: Stacked layout */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                {/* Icon - Top on mobile, right on desktop */}
                <div className={`${card.iconBg} w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center order-first sm:order-last flex-shrink-0`}>
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${card.color}`} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wide">
                    {card.title}
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mt-0.5 sm:mt-1 truncate">
                    {card.value}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 hidden sm:block">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
