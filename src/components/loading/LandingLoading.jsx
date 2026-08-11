import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "size-4",
  md: "size-6",
  lg: "size-10",
  xl: "size-14",
};

const textClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

export default function LandingLoading({
  label = "Loading...",
  size = "md",
  fullScreen = false,
  className,
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "flex items-center justify-center gap-2 text-muted-foreground",
        fullScreen && "min-h-screen bg-background",
        className,
      )}
    >
      <Loader
        className={cn("animate-spin text-primary", sizeClasses[size])}
        aria-hidden="true"
      />
      <span className={cn("font-bold tracking-wide", textClasses[size])}>{label}</span>
    </div>
  );
}
