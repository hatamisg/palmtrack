import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function GardenDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/50">
      {/* Hero Header Skeleton */}
      <div className="relative h-48 sm:h-56 lg:h-64 bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <Skeleton className="h-6 sm:h-8 w-48 sm:w-64 mb-2 bg-white/20" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-5 w-20 rounded-full bg-white/20" />
            <Skeleton className="h-5 w-24 rounded-full bg-white/20" />
            <Skeleton className="h-5 w-16 rounded-full bg-white/20" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        {/* Quick Stats Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-0 bg-white/80">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl" />
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-3 w-16 mb-1.5" />
                    <Skeleton className="h-5 sm:h-6 w-12" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="mb-4">
          <Skeleton className="h-10 sm:h-11 w-full rounded-xl" />
        </div>
        
        {/* Content Skeleton */}
        <Card className="border-0">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
