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

export default function KebunPage() {
  const { gardens, loading, createGarden } = useGardens();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Header */}
        <div className="flex flex-col gap-3 mb-4 md:mb-8">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Kebun Saya</h1>
              <p className="mt-1 md:mt-2 text-xs md:text-sm text-gray-600">
                Kelola semua kebun kelapa sawit Anda
              </p>
            </div>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              size="sm"
              className="flex-shrink-0"
            >
              <Plus className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Tambah Kebun</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm mb-4 md:mb-6">
          <div className="flex flex-col md:grid md:grid-cols-3 gap-3 md:gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari nama kebun atau lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-11">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
            <p className="text-xs md:text-sm text-gray-600">Total Kebun</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{filteredGardens.length}</p>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
            <p className="text-xs md:text-sm text-gray-600">Total Luas</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
              {filteredGardens.reduce((sum, g) => sum + g.luas, 0).toFixed(1)} Ha
            </p>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
            <p className="text-xs md:text-sm text-gray-600">Total Pohon</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
              {filteredGardens.reduce((sum, g) => sum + g.jumlahPohon, 0).toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
            <p className="text-xs md:text-sm text-gray-600">Status Baik</p>
            <p className="text-xl md:text-2xl font-bold text-green-600 mt-1">
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
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {filteredGardens.map((garden) => (
              <GardenCard
                key={garden.id}
                garden={garden}
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
    </div>
  );
}
