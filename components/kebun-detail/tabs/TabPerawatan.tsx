"use client";

import { useState, useEffect } from "react";
import { Maintenance } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PhotoGallery } from "@/components/ui/photo-gallery";
import { Plus, Calendar, CheckCircle2, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import AddMaintenanceModal from "../modals/AddMaintenanceModal";
import EditMaintenanceModal from "../modals/EditMaintenanceModal";
import { createMaintenance, updateMaintenance, updateMaintenanceStatus, deleteMaintenance, getMaintenancesByGarden } from "@/lib/supabase/api/maintenances";
import { createExpense } from "@/lib/supabase/api/expenses";
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

interface TabPerawatanProps {
  gardenId: string;
  maintenances: Maintenance[];
}

export default function TabPerawatan({ gardenId, maintenances: initialMaintenances }: TabPerawatanProps) {
  const [maintenances, setMaintenances] = useState<Maintenance[]>(initialMaintenances);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
  const [maintenanceToDelete, setMaintenanceToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch maintenances from Supabase on mount
  useEffect(() => {
    fetchMaintenances();
  }, [gardenId]);

  const fetchMaintenances = async () => {
    setIsLoading(true);
    const { data, error } = await getMaintenancesByGarden(gardenId);
    if (data) {
      setMaintenances(data);
    } else if (error) {
      toast.error("Gagal memuat perawatan: " + error);
      // Fallback to initial maintenances
      setMaintenances(initialMaintenances);
    }
    setIsLoading(false);
  };

  const [showAll, setShowAll] = useState(false);

  // Sort by newest first
  const sortedMaintenances = [...maintenances].sort(
    (a, b) => new Date(b.tanggalDijadwalkan).getTime() - new Date(a.tanggalDijadwalkan).getTime()
  );

  // Show only 5 items unless showAll is true
  const displayedMaintenances = showAll ? sortedMaintenances : sortedMaintenances.slice(0, 5);

  const dijadwalkan = maintenances.filter((m) => m.status === "Dijadwalkan").length;
  const selesai = maintenances.filter((m) => m.status === "Selesai").length;
  const terlambat = maintenances.filter((m) => m.status === "Terlambat").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selesai":
        return "success";
      case "Dijadwalkan":
        return "default";
      case "Terlambat":
        return "destructive";
      default:
        return "default";
    }
  };

  const handleAddMaintenance = async (maintenanceData: any, expenseData?: any) => {
    const { data, error } = await createMaintenance({
      ...maintenanceData,
      gardenId,
    });

    if (data) {
      setMaintenances((prev) => [...prev, data]);
      setIsAddModalOpen(false);
      toast.success("Jadwal perawatan berhasil ditambahkan!");

      // Create expense if included
      if (expenseData) {
        const { data: expenseResult, error: expenseError } = await createExpense({
          ...expenseData,
          gardenId,
        });

        if (expenseResult) {
          toast.success("Pengeluaran berhasil dicatat!");
        } else if (expenseError) {
          toast.error("Perawatan tersimpan, tapi gagal mencatat pengeluaran: " + expenseError);
        }
      }
    } else if (error) {
      toast.error("Gagal menambahkan perawatan: " + error);
    }
  };

  const handleEditMaintenance = async (maintenanceData: any) => {
    if (!selectedMaintenance) return;

    const { data, error } = await updateMaintenance(selectedMaintenance.id, {
      ...maintenanceData,
      gardenId,
    });

    if (data) {
      setMaintenances((prev) => prev.map((m) => (m.id === selectedMaintenance.id ? data : m)));
      setIsEditModalOpen(false);
      setSelectedMaintenance(null);
      toast.success("Perawatan berhasil diperbarui!");
    } else if (error) {
      toast.error("Gagal memperbarui perawatan: " + error);
    }
  };

  const handleMarkDone = async (maintenanceId: string) => {
    // Find the maintenance to check if it's recurring
    const maintenance = maintenances.find((m) => m.id === maintenanceId);
    
    const { data, error } = await updateMaintenanceStatus(maintenanceId, "Selesai");

    if (data) {
      setMaintenances((prev) => prev.map((m) => (m.id === maintenanceId ? data : m)));
      toast.success("Perawatan ditandai selesai!");

      // If recurring, create next schedule automatically
      if (maintenance?.isRecurring && maintenance?.recurringInterval) {
        const nextDate = new Date(data.tanggalSelesai || new Date());
        nextDate.setDate(nextDate.getDate() + maintenance.recurringInterval);

        // Check if there's already a scheduled maintenance with same title on or after nextDate
        const existingNext = maintenances.find(
          (m) =>
            m.judul === maintenance.judul &&
            m.status === "Dijadwalkan" &&
            m.id !== maintenanceId
        );

        if (existingNext) {
          // Already has a scheduled next, don't create duplicate
          toast.info("Jadwal berikutnya sudah ada");
        } else {
          const nextMaintenanceData = {
            jenisPerawatan: maintenance.jenisPerawatan,
            judul: maintenance.judul,
            tanggalDijadwalkan: nextDate,
            status: "Dijadwalkan" as const,
            detail: maintenance.detail,
            penanggungJawab: maintenance.penanggungJawab,
            isRecurring: true,
            recurringInterval: maintenance.recurringInterval,
            gardenId,
          };

          const { data: nextData, error: nextError } = await createMaintenance(nextMaintenanceData);

          if (nextData) {
            setMaintenances((prev) => [...prev, nextData]);
            toast.success(`Jadwal berikutnya: ${format(nextDate, "d MMM yyyy", { locale: id })}`);
          } else if (nextError) {
            toast.error("Gagal membuat jadwal berikutnya: " + nextError);
          }
        }
      }
    } else if (error) {
      toast.error("Gagal mengubah status: " + error);
    }
  };

  const handleDeleteMaintenance = async () => {
    if (!maintenanceToDelete) return;

    const { success, error } = await deleteMaintenance(maintenanceToDelete);

    if (success) {
      setMaintenances((prev) => prev.filter((m) => m.id !== maintenanceToDelete));
      setMaintenanceToDelete(null);
      toast.success("Perawatan berhasil dihapus!");
    } else if (error) {
      toast.error("Gagal menghapus perawatan: " + error);
    }
  };

  const openEditModal = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <Card>
        <CardHeader className="pb-3 md:pb-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Jadwal Perawatan
            </CardTitle>
            <Button onClick={() => setIsAddModalOpen(true)} size="sm" className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Jadwalkan Perawatan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <div className="text-center p-2 md:p-4 bg-blue-50 rounded-lg">
              <p className="text-xs md:text-sm text-gray-600">Dijadwalkan</p>
              <p className="text-xl md:text-3xl font-bold text-blue-600 mt-1">{dijadwalkan}</p>
            </div>
            <div className="text-center p-2 md:p-4 bg-green-50 rounded-lg">
              <p className="text-xs md:text-sm text-gray-600">Selesai</p>
              <p className="text-xl md:text-3xl font-bold text-green-600 mt-1">{selesai}</p>
            </div>
            <div className="text-center p-2 md:p-4 bg-red-50 rounded-lg">
              <p className="text-xs md:text-sm text-gray-600">Terlambat</p>
              <p className="text-xl md:text-3xl font-bold text-red-600 mt-1">{terlambat}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader className="pb-2 sm:pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base md:text-lg">Timeline Perawatan</CardTitle>
            {sortedMaintenances.length > 0 && (
              <span className="text-xs text-gray-500">{sortedMaintenances.length} total</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          {sortedMaintenances.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">Belum ada jadwal perawatan</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 md:space-y-4">
                {displayedMaintenances.map((maintenance, index) => (
                  <div
                    key={maintenance.id}
                    className={`flex gap-2 md:gap-4 pb-3 md:pb-4 ${
                      index < displayedMaintenances.length - 1 ? "border-b" : ""
                    }`}
                  >
                {/* Date */}
                <div className="flex-shrink-0 w-16 md:w-24 text-right">
                  <div className="text-xs md:text-sm font-medium text-gray-900">
                    {format(new Date(maintenance.tanggalDijadwalkan), "d MMM", { locale: id })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(maintenance.tanggalDijadwalkan), "yyyy", { locale: id })}
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="flex flex-col items-center pt-1">
                  <div
                    className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0 ${
                      maintenance.status === "Selesai"
                        ? "bg-green-500"
                        : maintenance.status === "Terlambat"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                  />
                  {index < sortedMaintenances.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 mt-1" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-3 md:pb-4 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm md:text-base text-gray-900 truncate">{maintenance.judul}</h4>
                      <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {maintenance.jenisPerawatan}
                        </Badge>
                        <Badge variant={getStatusColor(maintenance.status)} className="text-xs">
                          {maintenance.status}
                        </Badge>
                        {maintenance.isRecurring && (
                          <Badge variant="secondary" className="text-xs">
                            Berkala
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions - Stack on mobile */}
                    <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                      {maintenance.status === "Dijadwalkan" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkDone(maintenance.id)}
                          className="h-8 text-xs"
                        >
                          <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 md:mr-1" />
                          <span className="hidden md:inline">Selesai</span>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditModal(maintenance)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setMaintenanceToDelete(maintenance.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {maintenance.detail && (
                    <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2">{maintenance.detail}</p>
                  )}

                  {/* Photo Gallery */}
                  {maintenance.images && maintenance.images.length > 0 && (
                    <div className="mb-2">
                      <PhotoGallery photos={maintenance.images} maxVisible={3} expandInPlace />
                    </div>
                  )}

                  {maintenance.penanggungJawab && (
                    <p className="text-xs text-gray-500 truncate">
                      PJ: {maintenance.penanggungJawab}
                    </p>
                  )}

                  {maintenance.isRecurring && maintenance.recurringInterval && (
                    <p className="text-xs text-gray-500">
                      Berulang setiap {maintenance.recurringInterval} hari
                    </p>
                  )}

                  {maintenance.tanggalSelesai && (
                    <p className="text-xs text-green-600 mt-1">
                      Selesai: {format(new Date(maintenance.tanggalSelesai), "d MMM yyyy", { locale: id })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Show More/Less Button */}
          {sortedMaintenances.length > 5 && (
            <div className="mt-4 pt-3 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="w-full h-9 text-sm text-gray-600 hover:text-gray-900"
              >
                {showAll ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Tampilkan Lebih Sedikit
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Lihat Semua ({sortedMaintenances.length - 5} lainnya)
                  </>
                )}
              </Button>
            </div>
          )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddMaintenanceModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddMaintenance}
        gardenId={gardenId}
      />

      <EditMaintenanceModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMaintenance(null);
        }}
        onSubmit={handleEditMaintenance}
        maintenance={selectedMaintenance}
        gardenId={gardenId}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!maintenanceToDelete} onOpenChange={() => setMaintenanceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus jadwal perawatan ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMaintenance} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
