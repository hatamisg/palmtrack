"use client";

import { useState, useEffect } from "react";
import { Expense } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Wallet, Edit, Trash2, Calendar } from "lucide-react";
import { format, isSameMonth } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import AddExpenseModal from "../modals/AddExpenseModal";
import EditExpenseModal from "../modals/EditExpenseModal";
import { createExpense, updateExpense, deleteExpense, getExpensesByGarden } from "@/lib/supabase/api/expenses";
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

interface TabPengeluaranProps {
  gardenId: string;
  expenses: Expense[];
}

export default function TabPengeluaran({ gardenId, expenses: initialExpenses }: TabPengeluaranProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, [gardenId]);

  const fetchExpenses = async () => {
    setIsLoading(true);
    const { data, error } = await getExpensesByGarden(gardenId);
    if (data) {
      setExpenses(data);
    } else if (error) {
      toast.error("Gagal memuat data pengeluaran: " + error);
      setExpenses(initialExpenses);
    }
    setIsLoading(false);
  };

  const handleAddExpense = async (expenseData: any) => {
    const { data, error } = await createExpense({
      ...expenseData,
      gardenId,
    });

    if (data) {
      setExpenses((prev) => [...prev, data]);
      setIsAddModalOpen(false);
      toast.success("Data pengeluaran berhasil ditambahkan!");
    } else if (error) {
      toast.error("Gagal menambahkan data pengeluaran: " + error);
    }
  };

  const handleEditExpense = async (expenseData: any) => {
    if (!selectedExpense) return;

    const { data, error } = await updateExpense(selectedExpense.id, {
      ...expenseData,
      gardenId,
    });

    if (data) {
      setExpenses((prev) => prev.map((e) => (e.id === selectedExpense.id ? data : e)));
      setIsEditModalOpen(false);
      setSelectedExpense(null);
      toast.success("Data pengeluaran berhasil diperbarui!");
    } else if (error) {
      toast.error("Gagal memperbarui data pengeluaran: " + error);
    }
  };

  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return;

    const { success, error } = await deleteExpense(expenseToDelete);

    if (success) {
      setExpenses((prev) => prev.filter((e) => e.id !== expenseToDelete));
      setExpenseToDelete(null);
      toast.success("Data pengeluaran berhasil dihapus!");
    } else if (error) {
      toast.error("Gagal menghapus data pengeluaran: " + error);
    }
  };

  const openEditModal = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };

  // Calculate summary
  const totalPengeluaran = expenses.reduce((sum, e) => sum + e.jumlah, 0);
  const now = new Date();
  const pengeluaranBulanIni = expenses
    .filter((e) => isSameMonth(new Date(e.tanggal), now))
    .reduce((sum, e) => sum + e.jumlah, 0);

  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
  );

  const getKategoriStyle = (kategori: string) => {
    switch (kategori) {
      case "Pupuk":
        return "bg-green-100 text-green-700 border-green-200";
      case "Pestisida":
        return "bg-red-100 text-red-700 border-red-200";
      case "Peralatan":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Tenaga Kerja":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Transportasi":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <div className="bg-red-100 p-1.5 sm:p-2 rounded-lg">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              </div>
              Pengeluaran
            </CardTitle>
            <Button onClick={() => setIsAddModalOpen(true)} size="sm" className="h-8 sm:h-9">
              <Plus className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline text-sm">Tambah</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="bg-red-50 rounded-xl p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-gray-600">Total Pengeluaran</p>
              <p className="text-base sm:text-xl md:text-2xl font-bold text-red-600 mt-0.5">
                Rp {totalPengeluaran >= 1000000 
                  ? `${(totalPengeluaran / 1000000).toFixed(1)}M` 
                  : totalPengeluaran.toLocaleString("id-ID")}
              </p>
              <p className="text-[9px] sm:text-xs text-gray-500 mt-0.5">{expenses.length} transaksi</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-gray-600">Bulan Ini</p>
              <p className="text-base sm:text-xl md:text-2xl font-bold text-orange-600 mt-0.5">
                Rp {pengeluaranBulanIni >= 1000000 
                  ? `${(pengeluaranBulanIni / 1000000).toFixed(1)}M` 
                  : pengeluaranBulanIni.toLocaleString("id-ID")}
              </p>
              <p className="text-[9px] sm:text-xs text-gray-500 mt-0.5">{format(now, "MMMM yyyy", { locale: id })}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense List - Card Style for Mobile */}
      <Card>
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-sm sm:text-base">Riwayat Pengeluaran</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          {sortedExpenses.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Wallet className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">Belum ada pengeluaran</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {sortedExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  {/* Date Badge */}
                  <div className="flex-shrink-0 text-center bg-white rounded-lg p-1.5 sm:p-2 shadow-sm min-w-[44px] sm:min-w-[52px]">
                    <p className="text-xs sm:text-sm font-bold text-gray-900">
                      {format(new Date(expense.tanggal), "d", { locale: id })}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase">
                      {format(new Date(expense.tanggal), "MMM", { locale: id })}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-1">
                          {expense.deskripsi}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Badge 
                            variant="outline" 
                            className={`text-[9px] sm:text-[10px] px-1.5 py-0 ${getKategoriStyle(expense.kategori)}`}
                          >
                            {expense.kategori}
                          </Badge>
                        </div>
                        {expense.catatan && (
                          <p className="text-[10px] sm:text-xs text-gray-500 mt-1 line-clamp-1">
                            {expense.catatan}
                          </p>
                        )}
                      </div>

                      {/* Amount & Actions */}
                      <div className="flex flex-col items-end gap-1">
                        <p className="text-xs sm:text-sm font-semibold text-red-600 whitespace-nowrap">
                          -Rp {expense.jumlah >= 1000000 
                            ? `${(expense.jumlah / 1000000).toFixed(1)}M` 
                            : expense.jumlah.toLocaleString("id-ID")}
                        </p>
                        <div className="flex items-center gap-0.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditModal(expense)}
                            className="h-7 w-7 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setExpenseToDelete(expense.id)}
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddExpenseModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddExpense}
      />

      <EditExpenseModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedExpense(null);
        }}
        onSubmit={handleEditExpense}
        expense={selectedExpense}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!expenseToDelete} onOpenChange={() => setExpenseToDelete(null)}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Apakah Anda yakin ingin menghapus data pengeluaran ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="mt-0">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteExpense} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
