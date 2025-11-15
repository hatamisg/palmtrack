import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Issue } from "@/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { AlertTriangle } from "lucide-react";
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

  const getGardenName = (gardenId: string) => {
    const garden = gardens.find((g) => g.id === gardenId);
    return garden?.nama || "Unknown";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          Masalah Aktif
        </CardTitle>
      </CardHeader>
      <CardContent>
        {issues.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Tidak ada masalah aktif</p>
          </div>
        ) : (
          <div className="space-y-3">
            {issues.map((issue) => (
              <Link
                key={issue.id}
                href={`/kebun/${issue.gardenId}?tab=masalah`}
                className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getSeverityColor(issue.tingkatKeparahan)}>
                        {issue.tingkatKeparahan}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-gray-900 truncate">
                      {issue.judul}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {getGardenName(issue.gardenId)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Area: {issue.areaTerdampak}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 shrink-0">
                    {format(new Date(issue.tanggalLapor), "d MMM", {
                      locale: id,
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-4">
          <Link
            href="/kebun"
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Lihat semua masalah →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
