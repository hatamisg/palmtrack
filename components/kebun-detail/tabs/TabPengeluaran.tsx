"use client";

import { useState, useEffect } from "react";
import { Expense } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingDown, Edit, Trash2 } from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth, isSameMonth } from "date-fns";
import { id } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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

  // Fetch expenses from Supabase on mount
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

  // Current month expenses
  const now = new Date();
  const pengeluaranBulanIni = expenses
    .filter((e) => isSameMonth(new Date(e.tanggal), now))
    .reduce((sum, e) => sum + e.jumlah, 0);

  // Biggest category
  const kategoriBesar = expenses.reduce((acc, e) => {
    acc[e.kategori] = (acc[e.kategori] || 0) + e.jumlah;
    return acc;
  }, {} as Record<string, number>);

  const kategoriTerbesar = Object.entries(kategoriBesar).sort((a, b) => b[1] - a[1])[0];

  // Average per month (last 6 months)
  const sixMonthsAgo = subMonths(now, 6);
  const recentExpenses = expenses.filter((e) => new Date(e.tanggal) >= sixMonthsAgo);
  const rataRataPerBulan = recentExpenses.length > 0 ? recentExpenses.reduce((sum, e) => sum + e.jumlah, 0) / 6 : 0;

  // Chart data (last 6 months)
  const chartData = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    const monthExpenses = expenses.filter((e) => {
      const expenseDate = new Date(e.tanggal);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    });

    const total = monthExpenses.reduce((sum, e) => sum + e.jumlah, 0);

    chartData.push({
      bulan: format(monthDate, "MMM yy", { locale: id }),
      total: total / 1000000, // Convert to millions
    });
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Total Pengeluaran</p>
            <p className="text-2xl font-bold text-red-600 mt-2">
              Rp {(totalPengeluaran / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-gray-500 mt-1">{expenses.length} transaksi</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Pengeluaran Bulan Ini</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              Rp {(pengeluaranBulanIni / 1000000).toFixed(1)}M
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Kategori Terbesar</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {kategoriTerbesar ? kategoriTerbesar[0] : '-'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {kategoriTerbesar ? `Rp ${(kategoriTerbesar[1] / 1000000).toFixed(1)}M` : ''}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Rata-rata per Bulan</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              Rp {(rataRataPerBulan / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-gray-500 mt-1">6 bulan terakhir</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Grafik Pengeluaran 6 Bulan Terakhir
            </CardTitle>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Pengeluaran
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                  label={{ value: "Juta Rp", angle: -90, position: "insideLeft", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value: any) => [`Rp ${value.toFixed(2)}M`, "Total"]}
                />
                <Bar dataKey="total" fill="#dc2626" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Expense List */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pengeluaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tanggal</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Kategori</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Deskripsi</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Jumlah</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {expenses.slice(0, 20).map((expense) => (
                  <tr key={expense.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">
                      {format(new Date(expense.tanggal), "d MMMM yyyy", { locale: id })}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          expense.kategori === "Pupuk"
                            ? "bg-green-100 text-green-800"
                            : expense.kategori === "Pestisida"
                            ? "bg-red-100 text-red-800"
                            : expense.kategori === "Peralatan"
                            ? "bg-blue-100 text-blue-800"
                            : expense.kategori === "Tenaga Kerja"
                            ? "bg-yellow-100 text-yellow-800"
                            : expense.kategori === "Transportasi"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {expense.kategori}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {expense.deskripsi}
                      {expense.catatan && (
                        <p className="text-xs text-gray-500 mt-1">{expense.catatan}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-red-600">
                      Rp {expense.jumlah.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(expense)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setExpenseToDelete(expense.id)}
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data pengeluaran ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteExpense} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
