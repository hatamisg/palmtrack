"use client";

import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { ReactNode, useState } from "react";
import { Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeableCardProps {
  children: ReactNode;
  onDelete?: () => void;
  onComplete?: () => void;
  deleteThreshold?: number;
  completeThreshold?: number;
  className?: string;
  disabled?: boolean;
}

export function SwipeableCard({
  children,
  onDelete,
  onComplete,
  deleteThreshold = -100,
  completeThreshold = 100,
  className,
  disabled = false,
}: SwipeableCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const x = useMotionValue(0);

  // Transform for background opacity
  const deleteOpacity = useTransform(
    x,
    [deleteThreshold, 0],
    [1, 0]
  );
  
  const completeOpacity = useTransform(
    x,
    [0, completeThreshold],
    [0, 1]
  );

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Swipe left to delete
    if (offset < deleteThreshold || velocity < -500) {
      if (onDelete && !disabled) {
        setIsDeleting(true);
        setTimeout(() => {
          onDelete();
        }, 200);
      } else {
        x.set(0);
      }
    }
    // Swipe right to complete
    else if (offset > completeThreshold || velocity > 500) {
      if (onComplete && !disabled) {
        setIsCompleting(true);
        setTimeout(() => {
          onComplete();
        }, 200);
      } else {
        x.set(0);
      }
    }
    // Return to center
    else {
      x.set(0);
    }
  };

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className="relative overflow-hidden">
      {/* Delete Background (Left) */}
      {onDelete && (
        <motion.div
          className="absolute inset-0 bg-red-500 flex items-center justify-end pr-6"
          style={{ opacity: deleteOpacity }}
        >
          <Trash2 className="h-6 w-6 text-white" />
        </motion.div>
      )}

      {/* Complete Background (Right) */}
      {onComplete && (
        <motion.div
          className="absolute inset-0 bg-green-500 flex items-center justify-start pl-6"
          style={{ opacity: completeOpacity }}
        >
          <Check className="h-6 w-6 text-white" />
        </motion.div>
      )}

      {/* Swipeable Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: onDelete ? deleteThreshold * 1.5 : 0, right: onComplete ? completeThreshold * 1.5 : 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x }}
        animate={
          isDeleting
            ? { x: -500, opacity: 0 }
            : isCompleting
            ? { x: 500, opacity: 0 }
            : {}
        }
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn("relative bg-white touch-pan-y", className)}
      >
        {children}
      </motion.div>
    </div>
  );
}
