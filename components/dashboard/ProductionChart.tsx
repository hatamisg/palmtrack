"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, ChevronDown } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ProductionChartProps {
  data: Array<{ name: string; value: number }>;
}

// Custom Tooltip with dark theme and arrow
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div 
        className="relative z-50"
        style={{ 
          transform: 'translateX(-50%)',
          marginTop: '-10px'
        }}
      >
        <div className="bg-gray-900 text-white px-3 py-2 rounded-2xl shadow-xl min-w-[80px] text-center">
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium">{data.name}</p>
          <p className="text-sm sm:text-base font-bold">{payload[0].value.toFixed(1)} Ton</p>
        </div>
        {/* Arrow pointing down */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-2">
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-gray-900" />
        </div>
      </div>
    );
  }
  return null;
};

// Custom rounded bar shape (pill shape)
const RoundedBar = (props: any) => {
  const { x, y, width, height, fill, isActive } = props;
  const radius = width / 2;
  
  if (height <= 0) return null;
  
  return (
    <g>
      {/* Background pattern for inactive bars */}
      {!isActive && (
        <defs>
          <pattern
            id={`stripe-${x}`}
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="4" stroke="#d1d5db" strokeWidth="2" />
          </pattern>
        </defs>
      )}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={radius}
        ry={radius}
        fill={isActive ? fill : `url(#stripe-${x})`}
        className="transition-all duration-200"
      />
      {/* Highlight circle on top for active bar */}
      {isActive && (
        <circle
          cx={x + width / 2}
          cy={y}
          r={width / 2 + 2}
          fill="none"
          stroke="#fff"
          strokeWidth="3"
        />
      )}
    </g>
  );
};

export default function ProductionChart({ data }: ProductionChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  const totalProduction = data.reduce((sum, item) => sum + item.value, 0);
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  
  // Find index of max value
  const maxIndex = data.findIndex((d) => d.value === maxValue);

  // Prepare chart data with shortened names
  const chartData = data.map((item, index) => ({
    ...item,
    displayName: isMobile 
      ? item.name.substring(0, 3)
      : item.name.length > 8 
        ? item.name.substring(0, 6) + ".."
        : item.name,
    isMax: index === maxIndex,
  }));

  // Empty state
  if (data.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="p-4 sm:p-5 lg:p-6">
          <div className="flex flex-col items-center justify-center py-10 sm:py-12 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <TrendingUp className="h-7 w-7 text-gray-400" />
            </div>
            <p className="text-sm sm:text-base font-medium text-gray-600">Belum ada data produksi</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Data akan muncul setelah ada panen</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardContent className="p-4 sm:p-5 lg:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Total Panen
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">Produksi bulan ini</p>
            <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1 mt-1.5">
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                {totalProduction.toFixed(1)}
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400 font-medium">Ton</span>
              {totalProduction > 0 && (
                <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  {data.length} kebun
                </span>
              )}
            </div>
          </div>
          
          {/* Period selector */}
          <button className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-600 bg-white hover:bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-gray-200 transition-colors shadow-sm flex-shrink-0">
            <span className="font-medium">Bulan Ini</span>
            <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400" />
          </button>
        </div>

        {/* Chart Container */}
        <div className="h-[140px] sm:h-[160px] lg:h-[180px] w-full mt-3 sm:mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ 
                left: isMobile ? 5 : 10, 
                right: isMobile ? 5 : 10, 
                top: 25, 
                bottom: 5 
              }}
              barCategoryGap={isMobile ? "12%" : "18%"}
              onMouseMove={(state) => {
                if (state.activeTooltipIndex !== undefined) {
                  setActiveIndex(state.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <XAxis
                dataKey="displayName"
                tick={{ 
                  fontSize: isMobile ? 10 : 12, 
                  fill: "#9ca3af",
                  fontWeight: 500
                }}
                tickLine={false}
                axisLine={false}
                dy={8}
                interval={0}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={false}
                position={{ y: 0 }}
                allowEscapeViewBox={{ x: false, y: true }}
              />
              <Bar
                dataKey="value"
                maxBarSize={isMobile ? 22 : 32}
                shape={(props: any) => (
                  <RoundedBar 
                    {...props} 
                    isActive={props.index === maxIndex || props.index === activeIndex}
                  />
                )}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === maxIndex || index === activeIndex ? "#374151" : "#e5e7eb"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend hint */}
        <div className="flex items-center justify-center gap-4 mt-3 sm:mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gray-700" />
            <span className="text-[10px] sm:text-xs text-gray-500">Tertinggi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gray-200" />
            <span className="text-[10px] sm:text-xs text-gray-500">Lainnya</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
