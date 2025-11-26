"use client";

import { toast } from "sonner";
import { useState, useCallback } from "react";

interface UndoToastOptions {
  message: string;
  duration?: number;
  onUndo?: () => void;
}

export function useUndoToast() {
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const showUndoToast = useCallback(
    ({ message, duration = 5000, onUndo }: UndoToastOptions) => {
      let timeoutId: NodeJS.Timeout;

      const toastId = toast(message, {
        duration,
        action: {
          label: "Undo",
          onClick: () => {
            clearTimeout(timeoutId);
            onUndo?.();
            toast.dismiss(toastId);
          },
        },
      });

      // Auto-dismiss after duration
      timeoutId = setTimeout(() => {
        toast.dismiss(toastId);
      }, duration);

      return toastId;
    },
    []
  );

  return { showUndoToast };
}
