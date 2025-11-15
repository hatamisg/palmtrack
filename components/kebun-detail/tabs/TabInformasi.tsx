"use client";

import { Garden, Harvest, Issue } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subMonths } from "date-fns";
import { id } from "date-fns/locale";
import { AlertCircle, TrendingUp } from "lucide-react";

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
      month: format(monthDate, "MMM yyyy", { locale: id }),
      value: totalKg / 1000, // Convert to tons
    });
  }

  // Calculate productivity
  const avgProduction = productionData.length > 0
    ? productionData.reduce((sum, d) => sum + d.value, 0) / productionData.length
    : 0;
  const productivityPerHa = avgProduction / garden.luas;

  // Recent activities - only issues (last 10 activities)
  const activities = issues
    .map((i) => ({
      type: "issue" as const,
      date: i.updatedAt,
      title: i.judul,
      status: i.status,
      tingkatKeparahan: i.tingkatKeparahan,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Info Cards */}
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Kebun</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nama Kebun</p>
                  <p className="text-base font-semibold text-gray-900">{garden.nama}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lokasi</p>
                  <p className="text-base font-semibold text-gray-900">{garden.lokasi}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Luas</p>
                  <p className="text-base font-semibold text-gray-900">{garden.luas} Hektar</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jumlah Pohon</p>
                  <p className="text-base font-semibold text-gray-900">
                    {garden.jumlahPohon.toLocaleString("id-ID")} pohon
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Tahun Tanam</p>
                  <p className="text-base font-semibold text-gray-900">{garden.tahunTanam}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Varietas</p>
                  <p className="text-base font-semibold text-gray-900">{garden.varietas}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant={garden.status === "Baik" ? "success" : garden.status === "Perlu Perhatian" ? "warning" : "destructive"}>
                    {garden.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Umur Tanaman</p>
                  <p className="text-base font-semibold text-gray-900">
                    {new Date().getFullYear() - garden.tahunTanam} tahun
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600 mb-1">Alamat Lengkap</p>
              <p className="text-base text-gray-900">{garden.lokasiLengkap}</p>
            </div>
          </CardContent>
        </Card>

        {/* Production Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Grafik Produksi (6 Bulan Terakhir)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                    label={{ value: "Ton", angle: -90, position: "insideLeft", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value.toFixed(2)} Ton`, "Produksi"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">Rata-rata Produksi/Bulan</p>
                <p className="text-xl font-bold text-gray-900">{avgProduction.toFixed(2)} Ton</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Produktivitas/Ha</p>
                <p className="text-xl font-bold text-gray-900">{productivityPerHa.toFixed(2)} Ton/Ha</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Summary & Activity */}
      <div className="space-y-6">
        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total Panen</p>
                <p className="text-2xl font-bold text-gray-900">{harvests.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Nilai</p>
                <p className="text-xl font-bold text-green-600">
                  {(harvests.reduce((sum, h) => sum + h.totalNilai, 0) / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total Masalah</p>
                <p className="text-2xl font-bold text-gray-900">{issues.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Terbuka</p>
                <p className="text-xl font-bold text-red-600">
                  {issues.filter((i) => i.status === "Open").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Masalah Terkini</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Belum ada masalah</p>
            ) : (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={activity.status === "Open" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {activity.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {activity.tingkatKeparahan}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {format(new Date(activity.date), "d MMM", { locale: id })}
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
