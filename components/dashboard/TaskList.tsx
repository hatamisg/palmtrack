import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Clock, AlertCircle } from "lucide-react";
import { gardens } from "@/lib/data/mock-data";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const getPriorityColor = (prioritas: string) => {
    switch (prioritas) {
      case "High":
        return "destructive";
      case "Normal":
        return "default";
      case "Low":
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
          <AlertCircle className="h-5 w-5 text-orange-600" />
          Task Mendesak
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Tidak ada task mendesak</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <Link
                key={task.id}
                href={`/kebun/${task.gardenId}?tab=task`}
                className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getPriorityColor(task.prioritas)}>
                        {task.prioritas}
                      </Badge>
                      <Badge variant="outline">{task.kategori}</Badge>
                    </div>
                    <h4 className="font-medium text-gray-900 truncate">
                      {task.judul}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {getGardenName(task.gardenId)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
                    <Clock className="h-3 w-3" />
                    <span>
                      {format(new Date(task.tanggalTarget), "d MMM", {
                        locale: id,
                      })}
                    </span>
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
            Lihat semua task →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
