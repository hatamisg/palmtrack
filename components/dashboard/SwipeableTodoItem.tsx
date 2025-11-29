"use client";

import Link from "next/link";
import { AlertCircle, Wrench, CheckSquare, Leaf, ClipboardList, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SwipeableCard } from "@/components/ui/swipeable-card";
import { TodoItem } from "@/types";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useUndoToast } from "@/hooks/use-undo-toast";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { updateMaintenanceStatus } from "@/lib/supabase/api/maintenances";
import { updateIssueStatus } from "@/lib/supabase/api/issues";
import { updateTaskStatus } from "@/lib/supabase/api/tasks";
import HarvestRecordModal from "./HarvestRecordModal";

interface SwipeableTodoItemProps {
  todo: TodoItem;
  onComplete?: (id: string) => void;
}

export default function SwipeableTodoItem({
  todo,
  onComplete,
}: SwipeableTodoItemProps) {
  const { showUndoToast } = useUndoToast();
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isIssue = todo.type === "issue";
  const isMaintenance = todo.type === "maintenance";
  const isTask = todo.type === "task";
  const isHarvestTask = isTask && todo.kategori === "Panen";

  const isHighPriority =
    (isIssue && todo.kategori === "Parah") ||
    (isTask && todo.prioritas === "High");
  const isMediumPriority =
    (isIssue && todo.kategori === "Sedang") ||
    (isTask && todo.prioritas === "Normal");

  const targetTab = isIssue ? "masalah" : isMaintenance ? "perawatan" : "tugas";
  const link = `/kebun/${todo.gardenSlug}?tab=${targetTab}`;

  // Icon background colors
  const getIconBg = () => {
    if (isIssue) return isHighPriority ? "bg-red-100" : isMediumPriority ? "bg-orange-100" : "bg-yellow-100";
    if (isTask && todo.kategori === "Panen") return "bg-green-100";
    if (isTask) return isHighPriority ? "bg-red-100" : "bg-purple-100";
    return "bg-blue-100";
  };

  const handleSwipeComplete = async () => {
    if (isHarvestTask) {
      setShowHarvestModal(true);
      return;
    }

    setIsCompleted(true);

    showUndoToast({
      message: `"${todo.judul}" ditandai selesai`,
      duration: 5000,
      onUndo: () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setIsCompleted(false);
      },
    });

    timeoutRef.current = setTimeout(async () => {
      try {
        if (isIssue) {
          const { error } = await updateIssueStatus(todo.id, "Resolved");
          if (error) {
            toast.error("Gagal menyelesaikan masalah: " + error);
            setIsCompleted(false);
            return;
          }
        } else if (isMaintenance) {
          const { error } = await updateMaintenanceStatus(todo.id, "Selesai");
          if (error) {
            toast.error("Gagal menyelesaikan perawatan: " + error);
            setIsCompleted(false);
            return;
          }
        } else if (isTask) {
          const { error } = await updateTaskStatus(todo.id, "Done");
          if (error) {
            toast.error("Gagal menyelesaikan tugas: " + error);
            setIsCompleted(false);
            return;
          }
        }

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

  const handleHarvestSuccess = () => {
    setIsCompleted(true);
    if (onComplete) {
      onComplete(todo.id);
    }
  };

  if (isCompleted) {
    return null;
  }

  const cardContent = (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Icon */}
      <div className={`flex-shrink-0 p-1.5 sm:p-2 rounded-lg ${getIconBg()}`}>
        {isIssue ? (
          <AlertCircle
            className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
              isHighPriority
                ? "text-red-600"
                : isMediumPriority
                  ? "text-orange-600"
                  : "text-yellow-600"
            }`}
          />
        ) : isTask ? (
          todo.kategori === "Panen" ? (
            <Leaf className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
          ) : (
            <CheckSquare
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                isHighPriority ? "text-red-600" : "text-purple-600"
              }`}
            />
          )
        ) : (
          <Wrench className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-xs sm:text-sm text-gray-900 truncate">
              {todo.judul}
            </h4>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">
              {todo.gardenName}
              {todo.areaTerdampak && ` • ${todo.areaTerdampak}`}
            </p>
          </div>
          
          {/* Date badge */}
          <div className="flex-shrink-0 text-[10px] sm:text-xs text-gray-400 bg-gray-50 px-1.5 sm:px-2 py-0.5 rounded">
            {format(new Date(todo.tanggal), "dd MMM", { locale: localeId })}
          </div>
        </div>
        
        {/* Tags row */}
        <div className="flex items-center gap-1 mt-1.5 sm:mt-2 flex-wrap">
          <Badge
            variant={isIssue ? "destructive" : isTask ? "default" : "secondary"}
            className="text-[10px] sm:text-xs h-4 sm:h-5 px-1.5"
          >
            {isIssue ? "Masalah" : isTask ? "Tugas" : "Perawatan"}
          </Badge>
          <Badge variant="outline" className="text-[10px] sm:text-xs h-4 sm:h-5 px-1.5 bg-white">
            {todo.kategori}
          </Badge>
          {isTask && todo.prioritas && (
            <Badge
              variant={
                todo.prioritas === "High"
                  ? "destructive"
                  : todo.prioritas === "Normal"
                    ? "default"
                    : "secondary"
              }
              className="text-[10px] sm:text-xs h-4 sm:h-5 px-1.5"
            >
              {todo.prioritas}
            </Badge>
          )}
          
          {/* Harvest action button */}
          {isHarvestTask && (
            <Button
              size="sm"
              variant="default"
              className="h-5 sm:h-6 text-[10px] sm:text-xs px-2 ml-auto bg-green-600 hover:bg-green-700"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowHarvestModal(true);
              }}
            >
              <ClipboardList className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
              Catat
            </Button>
          )}
        </div>
      </div>

      {/* Arrow indicator */}
      <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0 hidden sm:block" />
    </div>
  );

  return (
    <>
      <SwipeableCard
        onComplete={handleSwipeComplete}
        completeThreshold={80}
        className="rounded-xl"
      >
        <Link
          href={link}
          className="block p-2.5 sm:p-3 border border-gray-100 rounded-xl hover:bg-gray-50/80 active:bg-gray-100 transition-all duration-150 bg-white hover:border-gray-200 hover:shadow-sm"
        >
          {cardContent}
        </Link>
      </SwipeableCard>

      <HarvestRecordModal
        open={showHarvestModal}
        onClose={() => setShowHarvestModal(false)}
        todo={todo}
        onSuccess={handleHarvestSuccess}
      />
    </>
  );
}
