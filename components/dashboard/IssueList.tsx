import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Issue } from "@/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { AlertTriangle, ChevronRight, CheckCircle2 } from "lucide-react";
import { gardens } from "@/lib/data/mock-data";

interface IssueListProps {
  issues: Issue[];
}

export default function IssueList({ issues }: IssueListProps) {
  const getSeverityColor = (tingkat: string) => {
    switch (tingkat) {
      case "Parah":
        return "destructive";
      case "Sedang":
        return "warning";
      case "Ringan":
        return "secondary";
      default:
        return "default";
    }
  };

  const getSeverityBg = (tingkat: string) => {
    switch (tingkat) {
      case "Parah":
        return "bg-red-100";
      case "Sedang":
        return "bg-orange-100";
      case "Ringan":
        return "bg-yellow-100";
      default:
        return "bg-gray-100";
    }
  };

  const getSeverityIcon = (tingkat: string) => {
    switch (tingkat) {
      case "Parah":
        return "text-red-600";
      case "Sedang":
        return "text-orange-600";
      case "Ringan":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getGardenName = (gardenId: string) => {
    const garden = gardens.find((g) => g.id === gardenId);
    return garden?.nama || "Unknown";
  };

  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="flex items-center justify-between text-sm sm:text-base lg:text-lg">
          <div className="flex items-center gap-2">
            <div className="bg-red-100 p-1.5 sm:p-2 rounded-lg">
              <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-red-600" />
            </div>
            Masalah Aktif
          </div>
          {issues.length > 0 && (
            <Badge variant="secondary" className="text-[10px] sm:text-xs bg-red-50 text-red-700 border-red-200">
              {issues.length} masalah
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
            <div className="bg-green-100 p-3 sm:p-4 rounded-full mb-3">
              <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <p className="text-sm sm:text-base font-medium text-gray-700">
              Tidak ada masalah aktif
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Semua kebun dalam kondisi baik
            </p>
          </div>
        ) : (
          <div className="space-y-1.5 sm:space-y-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-1">
            {issues.map((issue) => (
              <Link
                key={issue.id}
                href={`/kebun/${issue.gardenId}?tab=masalah`}
                className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 border border-gray-100 rounded-xl hover:bg-gray-50/80 active:bg-gray-100 transition-all duration-150 bg-white hover:border-gray-200 hover:shadow-sm"
              >
                {/* Icon */}
                <div className={`flex-shrink-0 p-1.5 sm:p-2 rounded-lg ${getSeverityBg(issue.tingkatKeparahan)}`}>
                  <AlertTriangle className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${getSeverityIcon(issue.tingkatKeparahan)}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-xs sm:text-sm text-gray-900 truncate">
                        {issue.judul}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">
                        {getGardenName(issue.gardenId)} • {issue.areaTerdampak}
                      </p>
                    </div>
                    
                    {/* Date badge */}
                    <div className="flex-shrink-0 text-[10px] sm:text-xs text-gray-400 bg-gray-50 px-1.5 sm:px-2 py-0.5 rounded">
                      {format(new Date(issue.tanggalLapor), "dd MMM", { locale: id })}
                    </div>
                  </div>
                  
                  {/* Tags row */}
                  <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                    <Badge variant={getSeverityColor(issue.tingkatKeparahan)} className="text-[10px] sm:text-xs h-4 sm:h-5 px-1.5">
                      {issue.tingkatKeparahan}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] sm:text-xs h-4 sm:h-5 px-1.5 bg-white">
                      {issue.status}
                    </Badge>
                  </div>
                </div>

                {/* Arrow indicator */}
                <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0 hidden sm:block" />
              </Link>
            ))}
          </div>
        )}
        {issues.length > 0 && (
          <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-100">
            <Link
              href="/kebun"
              className="text-xs sm:text-sm text-primary hover:text-primary/80 font-medium flex items-center justify-center gap-1"
            >
              Lihat semua masalah
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
