"use client";

import { useState, useEffect } from "react";
import { Maintenance } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, CheckCircle2, Edit, Trash2 } from "lucide-react";
import { format, isPast, isFuture } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import AddMaintenanceModal from "../modals/AddMaintenanceModal";
import EditMaintenanceModal from "../modals/EditMaintenanceModal";
import { createMaintenance, updateMaintenance, updateMaintenanceStatus, deleteMaintenance, getMaintenancesByGarden } from "@/lib/supabase/api/maintenances";
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

  const sortedMaintenances = [...maintenances].sort(
    (a, b) => new Date(a.tanggalDijadwalkan).getTime() - new Date(b.tanggalDijadwalkan).getTime()
  );

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

  const handleAddMaintenance = async (maintenanceData: any) => {
    const { data, error } = await createMaintenance({
      ...maintenanceData,
      gardenId,
    });

    if (data) {
      setMaintenances((prev) => [...prev, data]);
      setIsAddModalOpen(false);
      toast.success("Jadwal perawatan berhasil ditambahkan!");
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
    const { data, error } = await updateMaintenanceStatus(maintenanceId, "Selesai");

    if (data) {
      setMaintenances((prev) => prev.map((m) => (m.id === maintenanceId ? data : m)));
      toast.success("Perawatan ditandai selesai!");
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
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Jadwal Perawatan
            </CardTitle>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Jadwalkan Perawatan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Dijadwalkan</p>
              <p className="text-3xl font-bold text-blue-600">{dijadwalkan}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Selesai</p>
              <p className="text-3xl font-bold text-green-600">{selesai}</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Terlambat</p>
              <p className="text-3xl font-bold text-red-600">{terlambat}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline Perawatan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedMaintenances.map((maintenance, index) => (
              <div
                key={maintenance.id}
                className={`flex gap-4 pb-4 ${
                  index < sortedMaintenances.length - 1 ? "border-b" : ""
                }`}
              >
                {/* Date */}
                <div className="flex-shrink-0 w-24 text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {format(new Date(maintenance.tanggalDijadwalkan), "d MMM", { locale: id })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(maintenance.tanggalDijadwalkan), "yyyy", { locale: id })}
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
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
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{maintenance.judul}</h4>
                      <div className="flex items-center gap-2 mt-1">
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
                    <div className="flex items-center gap-2">
                      {maintenance.status === "Dijadwalkan" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkDone(maintenance.id)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Selesai
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
                    <p className="text-sm text-gray-600 mb-2">{maintenance.detail}</p>
                  )}

                  {maintenance.penanggungJawab && (
                    <p className="text-xs text-gray-500">
                      Penanggung Jawab: {maintenance.penanggungJawab}
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
        </CardContent>
      </Card>

      {/* Modals */}
      <AddMaintenanceModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddMaintenance}
      />

      <EditMaintenanceModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMaintenance(null);
        }}
        onSubmit={handleEditMaintenance}
        maintenance={selectedMaintenance}
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
