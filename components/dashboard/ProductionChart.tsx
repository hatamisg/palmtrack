"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface ProductionChartProps {
  data: Array<{ name: string; value: number }>;
}

export default function ProductionChart({ data }: ProductionChartProps) {
  const totalProduction = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader className="pb-3 md:pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
            Produksi Bulan Ini
          </CardTitle>
          <div className="text-left md:text-right">
            <p className="text-xl md:text-2xl font-bold text-gray-900">
              {totalProduction.toFixed(1)} Ton
            </p>
            <p className="text-xs text-gray-500">Total produksi</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 md:px-6">
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                stroke="#6b7280"
              />
              <YAxis
                tick={{ fontSize: 10 }}
                stroke="#6b7280"
                label={{ value: "Ton", angle: -90, position: "insideLeft", fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
                formatter={(value: number) => [`${value.toFixed(2)} Ton`, "Produksi"]}
              />
              <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
