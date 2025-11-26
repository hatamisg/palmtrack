"use client";

import * as React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <Input
          type="date"
          ref={ref}
          className={cn(
            // Base styles
            "w-full",
            // Mobile optimizations
            "h-11 md:h-10", // Larger on mobile for easier tapping
            "text-base md:text-sm", // Larger text on mobile
            // Date picker specific
            "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
            "[&::-webkit-calendar-picker-indicator]:opacity-60",
            "[&::-webkit-calendar-picker-indicator]:hover:opacity-100",
            // Mobile: larger tap target for calendar icon
            "[&::-webkit-calendar-picker-indicator]:w-6",
            "[&::-webkit-calendar-picker-indicator]:h-6",
            "[&::-webkit-calendar-picker-indicator]:md:w-4",
            "[&::-webkit-calendar-picker-indicator]:md:h-4",
            // Error state
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

DateInput.displayName = "DateInput";
