"use client";

import { useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import GardenHeader from "@/components/kebun-detail/GardenHeader";
import QuickStats from "@/components/kebun-detail/QuickStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabInformasi from "@/components/kebun-detail/tabs/TabInformasi";
import TabPanen from "@/components/kebun-detail/tabs/TabPanen";
import TabMasalah from "@/components/kebun-detail/tabs/TabMasalah";
import TabPerawatan from "@/components/kebun-detail/tabs/TabPerawatan";
import TabDokumentasi from "@/components/kebun-detail/tabs/TabDokumentasi";
import TabPengeluaran from "@/components/kebun-detail/tabs/TabPengeluaran";
import EditGardenModal from "@/components/kebun/EditGardenModal";
import { useGardens } from "@/lib/context/GardensContext";
import { useGardenWithRelations } from "@/lib/hooks/useGardenData";
import GardenDetailSkeleton from "@/components/kebun-detail/GardenDetailSkeleton";
import { toast } from "sonner";

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

  const handleEditGarden = async (gardenData: any) => {
    try {
      await updateGarden(id, gardenData);
      setIsEditModalOpen(false);
      toast.success("Data kebun berhasil diperbarui!");
      router.refresh();
    } catch (error) {
      toast.error("Gagal memperbarui data kebun");
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

  const { garden, harvests, issues, maintenances, documentation, expenses } = gardenData;

  // Calculate quick stats
  const openIssues = issues.filter((i: any) => i.status === "Open").length;
  const upcomingMaintenances = maintenances.filter(
    (m: any) => m.status === "Dijadwalkan" || m.status === "Terlambat"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Garden Header */}
        <GardenHeader garden={garden} onEdit={() => setIsEditModalOpen(true)} />

        {/* Quick Stats */}
        <QuickStats
          luas={garden.luas}
          jumlahPohon={garden.jumlahPohon}
          upcomingMaintenances={upcomingMaintenances}
          openIssues={openIssues}
        />

        {/* Tabs */}
        <div className="mt-4 md:mt-6">
          <Tabs defaultValue={defaultTab} className="w-full">
            <div className="overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              <TabsList className="inline-flex w-auto min-w-full md:grid md:w-full md:grid-cols-6 lg:w-auto">
                <TabsTrigger value="informasi" className="text-xs md:text-sm whitespace-nowrap">Informasi</TabsTrigger>
                <TabsTrigger value="panen" className="text-xs md:text-sm whitespace-nowrap">Panen</TabsTrigger>
                <TabsTrigger value="masalah" className="text-xs md:text-sm whitespace-nowrap">Masalah</TabsTrigger>
                <TabsTrigger value="perawatan" className="text-xs md:text-sm whitespace-nowrap">Perawatan</TabsTrigger>
                <TabsTrigger value="dokumentasi" className="text-xs md:text-sm whitespace-nowrap">Dokumentasi</TabsTrigger>
                <TabsTrigger value="pengeluaran" className="text-xs md:text-sm whitespace-nowrap">Pengeluaran</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="informasi" className="mt-4 md:mt-6">
              <TabInformasi
                garden={garden}
                harvests={harvests}
                issues={issues}
              />
            </TabsContent>

            <TabsContent value="panen" className="mt-4 md:mt-6">
              <TabPanen gardenId={garden.id} harvests={harvests} />
            </TabsContent>

            <TabsContent value="masalah" className="mt-4 md:mt-6">
              <TabMasalah gardenId={garden.id} issues={issues} />
            </TabsContent>

            <TabsContent value="perawatan" className="mt-4 md:mt-6">
              <TabPerawatan gardenId={garden.id} maintenances={maintenances} />
            </TabsContent>

            <TabsContent value="dokumentasi" className="mt-4 md:mt-6">
              <TabDokumentasi gardenId={garden.id} documentation={documentation} />
            </TabsContent>

            <TabsContent value="pengeluaran" className="mt-4 md:mt-6">
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
