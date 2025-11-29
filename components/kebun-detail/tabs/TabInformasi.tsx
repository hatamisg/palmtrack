"use client";

import { Garden, Harvest, Issue } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { format, subMonths } from "date-fns";
import { id } from "date-fns/locale";
import { AlertCircle, TrendingUp, Leaf, MapPin, Calendar, TreeDeciduous, Ruler } from "lucide-react";

interface TabInformasiProps {
  garden: Garden;
  harvests: Harvest[];
  issues: Issue[];
}

export default function TabInformasi({ garden, harvests, issues }: TabInformasiProps) {
  // Prepare production chart data (last 6 months)
  const productionData = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(new Date(), i);
    const monthHarvests = harvests.filter((h) => {
      const harvestDate = new Date(h.tanggal);
      return (
        harvestDate.getMonth() === monthDate.getMonth() &&
        harvestDate.getFullYear() === monthDate.getFullYear()
      );
    });
    const totalKg = monthHarvests.reduce((sum, h) => sum + h.jumlahKg, 0);
    productionData.push({
      month: format(monthDate, "MMM", { locale: id }),
      value: totalKg / 1000,
    });
  }

  // Calculate productivity
  const avgProduction = productionData.length > 0
    ? productionData.reduce((sum, d) => sum + d.value, 0) / productionData.length
    : 0;
  const productivityPerHa = avgProduction / garden.luas;

  // Recent issues
  const recentIssues = issues
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
          <CardContent className="p-3 sm:p-4 md:p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-green-500 p-1.5 rounded-lg">
                <Leaf className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
              </div>
              <span className="text-xs sm:text-sm text-green-700 font-medium">Total Panen</span>
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-800">{harvests.length}</p>
            <p className="text-[10px] sm:text-xs text-green-600 mt-1">
              Nilai: Rp {(harvests.reduce((sum, h) => sum + h.totalNilai, 0) / 1000000).toFixed(1)}M
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200">
          <CardContent className="p-3 sm:p-4 md:p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-red-500 p-1.5 rounded-lg">
                <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
              </div>
              <span className="text-xs sm:text-sm text-red-700 font-medium">Masalah</span>
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-red-800">
              {issues.filter((i) => i.status === "Open").length}
            </p>
            <p className="text-[10px] sm:text-xs text-red-600 mt-1">
              dari {issues.length} total masalah
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Production Chart */}
      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base md:text-lg">
            <div className="bg-green-100 p-1.5 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            Produksi 6 Bulan Terakhir
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-4 md:px-6">
          <div className="h-48 sm:h-56 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productionData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10 }} 
                  stroke="#9ca3af"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  stroke="#9ca3af"
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)} Ton`, "Produksi"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Stats below chart */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t">
            <div className="text-center sm:text-left">
              <p className="text-[10px] sm:text-xs text-gray-500">Rata-rata/Bulan</p>
              <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900">{avgProduction.toFixed(2)} Ton</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[10px] sm:text-xs text-gray-500">Produktivitas/Ha</p>
              <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900">{productivityPerHa.toFixed(2)} Ton</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Garden Info */}
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-sm sm:text-base md:text-lg">Detail Kebun</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <InfoItem icon={Ruler} label="Luas" value={`${garden.luas} Hektar`} />
              <InfoItem icon={TreeDeciduous} label="Pohon" value={`${garden.jumlahPohon.toLocaleString("id-ID")}`} />
              <InfoItem icon={Calendar} label="Tahun Tanam" value={garden.tahunTanam.toString()} />
              <InfoItem icon={Leaf} label="Varietas" value={garden.varietas} />
            </div>
            
            <div className="pt-3 border-t">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500">Alamat Lengkap</p>
                  <p className="text-xs sm:text-sm text-gray-900">{garden.lokasiLengkap}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <span className="text-xs sm:text-sm text-gray-500">Status Kebun</span>
              <Badge variant={garden.status === "Baik" ? "success" : garden.status === "Perlu Perhatian" ? "warning" : "destructive"}>
                {garden.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-500">Umur Tanaman</span>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                {new Date().getFullYear() - garden.tahunTanam} tahun
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Issues */}
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-sm sm:text-base md:text-lg">Masalah Terkini</CardTitle>
          </CardHeader>
          <CardContent>
            {recentIssues.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">Tidak ada masalah</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentIssues.map((issue, index) => (
                  <div key={index} className="flex gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      issue.status === "Open" ? "bg-red-100" : "bg-gray-200"
                    }`}>
                      <AlertCircle className={`h-4 w-4 ${
                        issue.status === "Open" ? "text-red-600" : "text-gray-500"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {issue.judul}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <Badge
                          variant={issue.status === "Open" ? "destructive" : "secondary"}
                          className="text-[10px] sm:text-xs px-1.5 py-0"
                        >
                          {issue.status}
                        </Badge>
                        <span className="text-[10px] sm:text-xs text-gray-500">
                          {format(new Date(issue.updatedAt), "d MMM", { locale: id })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="bg-gray-100 p-1.5 rounded-lg flex-shrink-0">
        <Icon className="h-3.5 w-3.5 text-gray-600" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] sm:text-xs text-gray-500">{label}</p>
        <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
}
