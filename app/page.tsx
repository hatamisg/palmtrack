import { Suspense } from "react";
import { getAllGardens } from "@/lib/supabase/api/gardens";
import { getAllHarvests } from "@/lib/supabase/api/harvests";
import SummaryCards from "@/components/dashboard/SummaryCards";
import TodoListNew from "@/components/dashboard/TodoListNew";
import ProductionChart from "@/components/dashboard/ProductionChart";
import GardenQuickAccess from "@/components/dashboard/GardenQuickAccess";

export default async function DashboardPage() {
  // Fetch data from database
  const { data: gardens } = await getAllGardens();
  const { data: harvests } = await getAllHarvests();

  const gardensList = gardens || [];
  const harvestsList = harvests || [];

  // Calculate summary data
  const totalGardens = gardensList.length;
  const totalLuas = gardensList.reduce((sum, g) => sum + g.luas, 0);
  const totalPohon = gardensList.reduce((sum, g) => sum + g.jumlahPohon, 0);

  // Calculate monthly production (current month)
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyProduction = gardensList.map((garden) => {
    const gardenHarvests = harvestsList.filter(
      (h) =>
        h.gardenId === garden.id &&
        new Date(h.tanggal).getMonth() === currentMonth &&
        new Date(h.tanggal).getFullYear() === currentYear
    );
    const total = gardenHarvests.reduce((sum, h) => sum + h.jumlahKg, 0);
    return {
      name: garden.nama.replace("Kebun Sawit ", ""),
      value: total / 1000, // Convert to tons
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Overview manajemen kebun kelapa sawit Anda
          </p>
        </div>

        {/* Summary Cards */}
        <Suspense fallback={<div>Loading...</div>}>
          <SummaryCards
            totalGardens={totalGardens}
            totalLuas={totalLuas}
            totalPohon={totalPohon}
          />
        </Suspense>

        {/* Daftar To-Do Terpusat */}
        <div className="mt-8">
          <Suspense fallback={<div>Loading...</div>}>
            <TodoListNew />
          </Suspense>
        </div>

        {/* Produksi Bulan Ini */}
        <div className="mt-8">
          <Suspense fallback={<div>Loading...</div>}>
            <ProductionChart data={monthlyProduction} />
          </Suspense>
        </div>

        {/* Kebun Saya Quick Access */}
        <div className="mt-8">
          <Suspense fallback={<div>Loading...</div>}>
            <GardenQuickAccess gardens={gardensList.slice(0, 6)} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
