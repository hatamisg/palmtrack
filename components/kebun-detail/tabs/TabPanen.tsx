"use client";

import { useState, useEffect } from "react";
import { Harvest } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import AddHarvestModal from "../modals/AddHarvestModal";
import EditHarvestModal from "../modals/EditHarvestModal";
import { createHarvest, updateHarvest, deleteHarvest, getHarvestsByGarden } from "@/lib/supabase/api/harvests";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TabPanenProps {
  gardenId: string;
  harvests: Harvest[];
}

export default function TabPanen({ gardenId, harvests: initialHarvests }: TabPanenProps) {
  const [harvests, setHarvests] = useState<Harvest[]>(initialHarvests);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedHarvest, setSelectedHarvest] = useState<Harvest | null>(null);
  const [harvestToDelete, setHarvestToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch harvests from Supabase on mount
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
      setHarvests((prev) => prev.map((h) => (h.id === selectedHarvest.id ? data : h)));
      setIsEditModalOpen(false);
      setSelectedHarvest(null);
      toast.success("Data panen berhasil diperbarui!");
    } else if (error) {
      toast.error("Gagal memperbarui data panen: " + error);
    }
  };

  const handleDeleteHarvest = async () => {
    if (!harvestToDelete) return;

    const { success, error } = await deleteHarvest(harvestToDelete);

    if (success) {
      setHarvests((prev) => prev.filter((h) => h.id !== harvestToDelete));
      setHarvestToDelete(null);
      toast.success("Data panen berhasil dihapus!");
    } else if (error) {
      toast.error("Gagal menghapus data panen: " + error);
    }
  };

  const openEditModal = (harvest: Harvest) => {
    setSelectedHarvest(harvest);
    setIsEditModalOpen(true);
  };

  // Calculate summary
  const totalPanen = harvests.reduce((sum, h) => sum + h.jumlahKg, 0);
  const totalNilai = harvests.reduce((sum, h) => sum + h.totalNilai, 0);
  const avgHargaPerKg = harvests.length > 0 ? totalNilai / totalPanen : 0;
  const avgKualitas = harvests.length > 0
    ? harvests.filter((h) => h.kualitas === "Baik Sekali" || h.kualitas === "Baik").length / harvests.length * 100
    : 0;

  // Chart data (last 6 harvests)
  const chartData = harvests
    .slice(-6)
    .map((h) => ({
      tanggal: format(new Date(h.tanggal), "d MMM", { locale: id }),
      kg: h.jumlahKg,
    }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Total Panen</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {(totalPanen / 1000).toFixed(2)} Ton
            </p>
            <p className="text-xs text-gray-500 mt-1">{harvests.length} kali panen</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Total Nilai</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              Rp {(totalNilai / 1000000).toFixed(1)}M
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Rata-rata Harga</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              Rp {avgHargaPerKg.toFixed(0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">per kg</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Kualitas Baik</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {avgKualitas.toFixed(0)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Grafik Produksi Terakhir
            </CardTitle>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Panen
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="tanggal" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                  label={{ value: "Kg", angle: -90, position: "insideLeft", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="kg" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Harvest List */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Panen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tanggal</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Jumlah (Kg)</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Harga/Kg</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Total Nilai</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Kualitas</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {harvests.slice(-10).reverse().map((harvest) => (
                  <tr key={harvest.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">
                      {format(new Date(harvest.tanggal), "d MMMM yyyy", { locale: id })}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium">
                      {harvest.jumlahKg.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4 text-sm text-right">
                      Rp {harvest.hargaPerKg.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-green-600">
                      Rp {(harvest.totalNilai / 1000000).toFixed(2)}M
                    </td>
                    <td className="py-3 px-4 text-sm text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          harvest.kualitas === "Baik Sekali"
                            ? "bg-green-100 text-green-800"
                            : harvest.kualitas === "Baik"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {harvest.kualitas}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(harvest)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setHarvestToDelete(harvest.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!harvestToDelete} onOpenChange={() => setHarvestToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data panen ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteHarvest} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
