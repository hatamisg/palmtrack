import { Suspense } from "react";
import { getAllGardens } from "@/lib/supabase/api/gardens";
import { getAllHarvests } from "@/lib/supabase/api/harvests";
import SummaryCards from "@/components/dashboard/SummaryCards";
import TodoListNew from "@/components/dashboard/TodoListNew";
import ProductionChart from "@/components/dashboard/ProductionChart";
import GardenQuickAccess from "@/components/dashboard/GardenQuickAccess";
import { SwipeHint } from "@/components/ui/swipe-hint";

// Loading skeleton components
function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}

function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

export default async function DashboardPage() {
  const { data: gardens } = await getAllGardens();
  const { data: harvests } = await getAllHarvests();

  const gardensList = gardens || [];
  const harvestsList = harvests || [];

  const totalGardens = gardensList.length;
  const totalLuas = gardensList.reduce((sum, g) => sum + g.luas, 0);
  const totalPohon = gardensList.reduce((sum, g) => sum + g.jumlahPohon, 0);

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
      value: total / 1000,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        {/* Header */}
        <div className="mb-3 sm:mb-4 lg:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-500">
            Overview manajemen kebun kelapa sawit
          </p>
        </div>

        {/* Summary Cards */}
        <Suspense fallback={<SummaryCardsSkeleton />}>
          <SummaryCards
            totalGardens={totalGardens}
            totalLuas={totalLuas}
            totalPohon={totalPohon}
          />
        </Suspense>

        {/* Garden Quick Access */}
        <div className="mt-3 sm:mt-4 lg:mt-6">
          <Suspense fallback={<CardSkeleton />}>
            <GardenQuickAccess gardens={gardensList.slice(0, 4)} />
          </Suspense>
        </div>

        {/* Main Content Grid - Stack on mobile, side by side on desktop */}
        <div className="mt-3 sm:mt-4 lg:mt-6 flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
          {/* Todo List */}
          <div className="w-full lg:w-1/2">
            <Suspense fallback={<CardSkeleton />}>
              <TodoListNew />
            </Suspense>
          </div>

          {/* Production Chart */}
          <div className="w-full lg:w-1/2">
            <Suspense fallback={<CardSkeleton />}>
              <ProductionChart data={monthlyProduction} />
            </Suspense>
          </div>
        </div>

        {/* Swipe Hint - Mobile only */}
        <div className="lg:hidden">
          <SwipeHint storageKey="dashboard-todo-swipe-hint" />
        </div>
      </div>
    </div>
  );
}
