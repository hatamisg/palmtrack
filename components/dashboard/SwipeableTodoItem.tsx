"use client";

import Link from "next/link";
import { AlertCircle, Wrench, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SwipeableCard } from "@/components/ui/swipeable-card";
import { TodoItem } from "@/types";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useUndoToast } from "@/hooks/use-undo-toast";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { updateMaintenanceStatus } from "@/lib/supabase/api/maintenances";
import { updateIssueStatus } from "@/lib/supabase/api/issues";

interface SwipeableTodoItemProps {
  todo: TodoItem;
  onComplete?: (id: string) => void;
}

export default function SwipeableTodoItem({ todo, onComplete }: SwipeableTodoItemProps) {
  const { showUndoToast } = useUndoToast();
  const [isCompleted, setIsCompleted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isIssue = todo.type === "issue";
  const isMaintenance = todo.type === "maintenance";

  const isHighPriority = isIssue && todo.kategori === "Parah";
  const isMediumPriority = isIssue && todo.kategori === "Sedang";

  const targetTab = isIssue ? "masalah" : "perawatan";
  const link = `/kebun/${todo.gardenSlug}?tab=${targetTab}`;

  const handleSwipeComplete = async () => {
    setIsCompleted(true);
    
    showUndoToast({
      message: `"${todo.judul}" ditandai selesai`,
      duration: 5000,
      onUndo: () => {
        // Cancel the timeout if undo is clicked
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setIsCompleted(false);
      },
    });

    // Actually complete after 5 seconds if not undone
    timeoutRef.current = setTimeout(async () => {
      try {
        // Update status in database based on type
        if (isIssue) {
          const { data, error } = await updateIssueStatus(todo.id, "Resolved");
          if (error) {
            toast.error("Gagal menyelesaikan masalah: " + error);
            setIsCompleted(false);
            return;
          }
        } else if (isMaintenance) {
          const { data, error } = await updateMaintenanceStatus(todo.id, "Selesai");
          if (error) {
            toast.error("Gagal menyelesaikan perawatan: " + error);
            setIsCompleted(false);
            return;
          }
        }

        // Call parent callback if provided
        if (onComplete) {
          onComplete(todo.id);
        }
        
        toast.success("Todo diselesaikan!");
      } catch (error) {
        console.error("Error completing todo:", error);
        toast.error("Terjadi kesalahan");
        setIsCompleted(false);
      }
    }, 5000);
  };

  if (isCompleted) {
    return null;
  }

  return (
    <SwipeableCard
      onComplete={handleSwipeComplete}
      completeThreshold={80}
      className="rounded-lg"
    >
      <Link
        href={link}
        className="block p-3 md:p-3 border rounded-lg hover:bg-muted/50 active:bg-muted transition-colors tap-target bg-white"
      >
        <div className="flex items-start justify-between gap-2 md:gap-3">
          <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {isIssue ? (
                <AlertCircle
                  className={`h-4 w-4 md:h-5 md:w-5 ${
                    isHighPriority
                      ? "text-red-500"
                      : isMediumPriority
                      ? "text-orange-500"
                      : "text-yellow-500"
                  }`}
                />
              ) : (
                <Wrench className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-xs md:text-sm truncate">{todo.judul}</h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {todo.gardenName}
                {todo.areaTerdampak && ` • Area: ${todo.areaTerdampak}`}
                {todo.penanggungJawab && ` • PJ: ${todo.penanggungJawab}`}
              </p>
              <div className="flex flex-wrap gap-1 md:gap-1.5 mt-1.5 md:mt-2">
                <Badge
                  variant={isIssue ? "destructive" : "default"}
                  className="text-xs"
                >
                  {isIssue ? "Masalah" : "Perawatan"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {todo.kategori}
                </Badge>
                {todo.status && (
                  <Badge
                    variant={
                      todo.status === "Terlambat" ? "destructive" : "secondary"
                    }
                    className="text-xs"
                  >
                    {todo.status}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="flex-shrink-0 text-right">
            <div className="text-xs text-muted-foreground whitespace-nowrap">
              {format(new Date(todo.tanggal), "dd MMM", { locale: localeId })}
            </div>
          </div>
        </div>
      </Link>
    </SwipeableCard>
  );
}
