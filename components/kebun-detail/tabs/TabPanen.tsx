"use client";

import { useState, useEffect } from "react";
import { Harvest } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, Edit, Calendar, Leaf } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import AddHarvestModal from "../modals/AddHarvestModal";
import EditHarvestModal from "../modals/EditHarvestModal";
import ScheduleHarvestModal from "../modals/ScheduleHarvestModal";
import {
  createHarvest,
  updateHarvest,
  getHarvestsByGarden,
} from "@/lib/supabase/api/harvests";
import { createTask } from "@/lib/supabase/api/tasks";


interface TabPanenProps {
  gardenId: string;
  harvests: Harvest[];
}

export default function TabPanen({
  gardenId,
  harvests: initialHarvests,
}: TabPanenProps) {
  const [harvests, setHarvests] = useState<Harvest[]>(initialHarvests);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedHarvest, setSelectedHarvest] = useState<Harvest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  useEffect(() => {
    fetchHarvests();
  }, [gardenId]);

  const fetchHarvests = async () => {
    setIsLoading(true);
    const { data, error } = await getHarvestsByGarden(gardenId);
    if (data) {
      setHarvests(data);
    } else if (error) {
      toast.error("Gagal memuat data panen: " + error);
      setHarvests(initialHarvests);
    }
    setIsLoading(false);
  };

  const handleAddHarvest = async (harvestData: any) => {
    const { data, error } = await createHarvest({
      ...harvestData,
      gardenId,
    });

    if (data) {
      setHarvests((prev) => [...prev, data]);
      setIsAddModalOpen(false);
      toast.success("Data panen berhasil ditambahkan!");
    } else if (error) {
      toast.error("Gagal menambahkan data panen: " + error);
    }
  };

  const handleEditHarvest = async (harvestData: any) => {
    if (!selectedHarvest) return;

    const { data, error } = await updateHarvest(selectedHarvest.id, {
      ...harvestData,
      gardenId,
    });

    if (data) {
      setHarvests((prev) =>
        prev.map((h) => (h.id === selectedHarvest.id ? data : h))
      );
      setIsEditModalOpen(false);
      setSelectedHarvest(null);
      toast.success("Data panen berhasil diperbarui!");
    } else if (error) {
      toast.error("Gagal memperbarui data panen: " + error);
    }
  };

  const openEditModal = (harvest: Harvest) => {
    setSelectedHarvest(harvest);
    setIsEditModalOpen(true);
  };

  const handleScheduleHarvest = async (data: any) => {
    const { data: taskData, error } = await createTask({
      gardenId,
      judul: data.judul,
      deskripsi: data.deskripsi,
      kategori: "Panen",
      prioritas: data.prioritas,
      status: "To Do",
      tanggalTarget: new Date(data.tanggalTarget),
      assignedTo: data.assignedTo,
    });

    if (taskData) {
      setIsScheduleModalOpen(false);
      toast.success("Jadwal panen berhasil dibuat! Cek di Dashboard.");
    } else if (error) {
      toast.error("Gagal membuat jadwal: " + error);
    }
  };

  // Calculate summary
  const totalPanen = harvests.reduce((sum, h) => sum + h.jumlahKg, 0);
  const totalNilai = harvests.reduce((sum, h) => sum + h.totalNilai, 0);
  const avgHargaPerKg = harvests.length > 0 ? totalNilai / totalPanen : 0;
  const avgKualitas =
    harvests.length > 0
      ? (harvests.filter(
          (h) => h.kualitas === "Baik Sekali" || h.kualitas === "Baik"
        ).length /
          harvests.length) *
        100
      : 0;

  // Chart data (last 6 harvests)
  const chartData = harvests.slice(-6).map((h) => ({
    tanggal: format(new Date(h.tanggal), "d MMM", { locale: id }),
    kg: h.jumlahKg,
  }));

  // Timeline data (sorted by date, newest first)
  const timelineData = [...harvests]
    .sort(
      (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header with Action Buttons */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
          <div className="bg-green-100 p-1.5 sm:p-2 rounded-lg">
            <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          </div>
          <span className="hidden sm:inline">Manajemen</span> Panen
        </h2>
        <div className="flex gap-1.5 sm:gap-2">
          <Button
            onClick={() => setIsScheduleModalOpen(true)}
            size="sm"
            variant="outline"
            className="h-9 rounded-xl"
          >
            <Calendar className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Jadwalkan</span>
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} size="sm" className="h-9 rounded-xl bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Catat</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-gray-600">Total Panen</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5 sm:mt-1">
              {(totalPanen / 1000).toFixed(2)} Ton
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
              {harvests.length} kali panen
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-gray-600">Total Nilai</p>
            <p className="text-lg sm:text-xl font-bold text-green-600 mt-0.5 sm:mt-1">
              Rp {(totalNilai / 1000000).toFixed(1)}M
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-gray-600">Rata-rata Harga</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5 sm:mt-1">
              Rp {avgHargaPerKg.toFixed(0)}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">per kg</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-gray-600">Kualitas Baik</p>
            <p className="text-lg sm:text-xl font-bold text-green-600 mt-0.5 sm:mt-1">
              {avgKualitas.toFixed(0)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Timeline Panen Terakhir
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 sm:space-y-4">
            {timelineData.length === 0 ? (
              <p className="text-xs sm:text-sm text-gray-500 text-center py-4">
                Belum ada data panen
              </p>
            ) : (
              timelineData.map((harvest, index) => (
                <div key={harvest.id} className="flex gap-2 sm:gap-3">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                        index === 0 ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                    {index < timelineData.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 mt-1" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-3 sm:pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          {format(new Date(harvest.tanggal), "d MMMM yyyy", {
                            locale: id,
                          })}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                          <span className="text-xs sm:text-sm text-gray-600">
                            {harvest.jumlahKg.toLocaleString("id-ID")} kg
                          </span>
                          <span className="text-[10px] sm:text-xs text-gray-400">•</span>
                          <span className="text-xs sm:text-sm text-green-600 font-medium">
                            Rp {(harvest.totalNilai / 1000000).toFixed(2)}M
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant={
                            harvest.kualitas === "Baik Sekali"
                              ? "success"
                              : harvest.kualitas === "Baik"
                                ? "default"
                                : "secondary"
                          }
                          className="text-[10px] sm:text-xs flex-shrink-0 h-5"
                        >
                          {harvest.kualitas}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(harvest)}
                          className="h-6 w-6 sm:h-7 sm:w-7 p-0"
                        >
                          <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chart - At Bottom */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Grafik Produksi Terakhir
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-48 sm:h-64 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="tanggal"
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="kg" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddHarvestModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddHarvest}
      />

      <EditHarvestModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedHarvest(null);
        }}
        onSubmit={handleEditHarvest}
        harvest={selectedHarvest}
      />

      <ScheduleHarvestModal
        open={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSubmit={handleScheduleHarvest}
      />

    </div>
  );
}
