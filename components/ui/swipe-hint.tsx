"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./button";

interface SwipeHintProps {
  storageKey?: string;
  showOnce?: boolean;
}

export function SwipeHint({ storageKey = "swipe-hint-shown", showOnce = true }: SwipeHintProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if hint was already shown
    if (showOnce && typeof window !== "undefined") {
      const hasShown = localStorage.getItem(storageKey);
      if (!hasShown) {
        // Show hint after 1 second
        setTimeout(() => setShow(true), 1000);
      }
    } else {
      setTimeout(() => setShow(true), 1000);
    }
  }, [storageKey, showOnce]);

  const handleClose = () => {
    setShow(false);
    if (showOnce && typeof window !== "undefined") {
      localStorage.setItem(storageKey, "true");
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50"
        >
          <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-sm">💡 Tips: Swipe Gestures</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-6 w-6 p-0 hover:bg-primary-foreground/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 flex-shrink-0" />
                <span>Swipe kiri untuk hapus</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 flex-shrink-0" />
                <span>Swipe kanan untuk selesai</span>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleClose}
              className="w-full mt-3 h-8"
            >
              Mengerti
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
