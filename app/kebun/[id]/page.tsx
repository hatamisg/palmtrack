"use client";

import { useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import GardenHeader from "@/components/kebun-detail/GardenHeader";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabInformasi from "@/components/kebun-detail/tabs/TabInformasi";
import TabPanen from "@/components/kebun-detail/tabs/TabPanen";
import TabMasalah from "@/components/kebun-detail/tabs/TabMasalah";
import TabPerawatan from "@/components/kebun-detail/tabs/TabPerawatan";

import TabPengeluaran from "@/components/kebun-detail/tabs/TabPengeluaran";
import EditGardenModal from "@/components/kebun/EditGardenModal";
import { useGardens } from "@/lib/context/GardensContext";
import { useGardenWithRelations } from "@/lib/hooks/useGardenData";
import GardenDetailSkeleton from "@/components/kebun-detail/GardenDetailSkeleton";
import { toast } from "sonner";
import { deleteGarden } from "@/lib/supabase/api/gardens";

export default function DetailKebunPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const defaultTab = searchParams.get("tab") || "informasi";
  const { updateGarden } = useGardens();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch garden with all related data in a single optimized query
  const { data: gardenData, isLoading, error } = useGardenWithRelations(id);

  const handleEditGarden = async (formData: any) => {
    if (!gardenData?.garden?.id) {
      toast.error("ID kebun tidak ditemukan");
      return;
    }
    
    try {
      // Use the actual garden.id (UUID) from fetched data, not the URL param (which could be slug)
      await updateGarden(gardenData.garden.id, formData);
      setIsEditModalOpen(false);
      toast.success("Data kebun berhasil diperbarui!");
      router.refresh();
    } catch (error) {
      toast.error("Gagal memperbarui data kebun");
    }
  };

  const handleDeleteGarden = async () => {
    if (!gardenData?.garden?.id) {
      toast.error("ID kebun tidak ditemukan");
      return;
    }
    
    if (!confirm(`Apakah Anda yakin ingin menghapus kebun "${gardenData?.garden?.nama}"? Semua data terkait akan ikut terhapus.`)) {
      return;
    }
    
    try {
      // Use the actual garden.id (UUID) from fetched data
      const { error } = await deleteGarden(gardenData.garden.id);
      if (error) throw error;
      toast.success("Kebun berhasil dihapus");
      router.push("/kebun");
    } catch (error) {
      toast.error("Gagal menghapus kebun");
    }
  };

  // Loading state with skeleton
  if (isLoading) {
    return <GardenDetailSkeleton />;
  }

  // Error or not found
  if (error || !gardenData) {
    notFound();
  }

  const { garden, harvests, issues, maintenances, expenses } = gardenData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Garden Header */}
        <GardenHeader garden={garden} onEdit={() => setIsEditModalOpen(true)} onDelete={handleDeleteGarden} />

        {/* Tabs */}
        <div>
          <Tabs defaultValue={defaultTab} className="w-full">
            <div className="overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-1">
              <TabsList className="inline-flex w-auto min-w-full md:grid md:w-full md:grid-cols-5 bg-white shadow-sm rounded-xl p-1">
                <TabsTrigger value="informasi" className="text-[11px] sm:text-xs md:text-sm whitespace-nowrap rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white">Informasi</TabsTrigger>
                <TabsTrigger value="panen" className="text-[11px] sm:text-xs md:text-sm whitespace-nowrap rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white">Panen</TabsTrigger>
                <TabsTrigger value="masalah" className="text-[11px] sm:text-xs md:text-sm whitespace-nowrap rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white">Masalah</TabsTrigger>
                <TabsTrigger value="perawatan" className="text-[11px] sm:text-xs md:text-sm whitespace-nowrap rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white">Perawatan</TabsTrigger>
                <TabsTrigger value="pengeluaran" className="text-[11px] sm:text-xs md:text-sm whitespace-nowrap rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white">Pengeluaran</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="informasi" className="mt-3 sm:mt-4 md:mt-6">
              <TabInformasi
                garden={garden}
                harvests={harvests}
                issues={issues}
              />
            </TabsContent>

            <TabsContent value="panen" className="mt-3 sm:mt-4 md:mt-6">
              <TabPanen gardenId={garden.id} harvests={harvests} />
            </TabsContent>

            <TabsContent value="masalah" className="mt-3 sm:mt-4 md:mt-6">
              <TabMasalah gardenId={garden.id} issues={issues} />
            </TabsContent>

            <TabsContent value="perawatan" className="mt-3 sm:mt-4 md:mt-6">
              <TabPerawatan gardenId={garden.id} maintenances={maintenances} />
            </TabsContent>

            <TabsContent value="pengeluaran" className="mt-3 sm:mt-4 md:mt-6">
              <TabPengeluaran gardenId={garden.id} expenses={expenses} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Garden Modal */}
      <EditGardenModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditGarden}
        garden={garden}
      />
    </div>
  );
}
