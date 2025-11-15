"use client";

import { useState } from "react";
import { useGardens } from "@/lib/context/GardensContext";
import { Garden } from "@/types";
import { Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GardenCard from "@/components/kebun/GardenCard";
import AddGardenModal from "@/components/kebun/AddGardenModal";
import EditGardenModal from "@/components/kebun/EditGardenModal";

export default function KebunPage() {
  const { gardens, loading, createGarden, updateGarden, deleteGarden } = useGardens();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGarden, setSelectedGarden] = useState<Garden | null>(null);

  // Filter gardens
  const filteredGardens = gardens.filter((garden) => {
    const matchesSearch = garden.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         garden.lokasi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || garden.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddGarden = async (newGarden: Omit<Garden, "id" | "createdAt" | "updatedAt">) => {
    const success = await createGarden(newGarden);
    if (success) {
      setIsAddModalOpen(false);
    }
  };

  const handleEditGarden = async (updatedData: Omit<Garden, "id" | "createdAt" | "updatedAt">) => {
    if (!selectedGarden) return;

    const success = await updateGarden(selectedGarden.id, updatedData);
    if (success) {
      setIsEditModalOpen(false);
      setSelectedGarden(null);
    }
  };

  const handleDeleteGarden = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kebun ini?")) {
      await deleteGarden(id);
    }
  };

  const openEditModal = (garden: Garden) => {
    setSelectedGarden(garden);
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kebun Saya</h1>
            <p className="mt-2 text-sm text-gray-600">
              Kelola semua kebun kelapa sawit Anda
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kebun
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari nama kebun atau lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Baik">Baik</SelectItem>
                  <SelectItem value="Perlu Perhatian">Perlu Perhatian</SelectItem>
                  <SelectItem value="Bermasalah">Bermasalah</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Total Kebun</p>
            <p className="text-2xl font-bold text-gray-900">{filteredGardens.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Total Luas</p>
            <p className="text-2xl font-bold text-gray-900">
              {filteredGardens.reduce((sum, g) => sum + g.luas, 0).toFixed(1)} Ha
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Total Pohon</p>
            <p className="text-2xl font-bold text-gray-900">
              {filteredGardens.reduce((sum, g) => sum + g.jumlahPohon, 0).toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Status Baik</p>
            <p className="text-2xl font-bold text-green-600">
              {filteredGardens.filter((g) => g.status === "Baik").length}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-gray-500">Memuat data kebun...</p>
          </div>
        ) : filteredGardens.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500">Tidak ada kebun yang sesuai dengan filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGardens.map((garden) => (
              <GardenCard
                key={garden.id}
                garden={garden}
                onDelete={() => handleDeleteGarden(garden.id)}
                onEdit={() => openEditModal(garden)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Garden Modal */}
      <AddGardenModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddGarden}
      />

      {/* Edit Garden Modal */}
      <EditGardenModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedGarden(null);
        }}
        onSubmit={handleEditGarden}
        garden={selectedGarden}
      />
    </div>
  );
}
