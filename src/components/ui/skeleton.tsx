import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-muted animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

// Enhanced skeleton components for dashboard
export const StatCardSkeleton = () => (
  <div className="group relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/80 to-white/40 p-6 shadow-xl backdrop-blur-xl">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="mb-4 flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  </div>
);

export const QuickStatsSkeleton = () => (
  <div className="relative mb-12 overflow-hidden rounded-3xl border border-white/30 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 shadow-2xl backdrop-blur-xl">
    <div className="mb-6 flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-2xl" />
      <div>
        <Skeleton className="mb-2 h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="group rounded-2xl border border-white/30 bg-white/50 p-6 text-center backdrop-blur-sm"
        >
          <Skeleton className="mx-auto mb-3 h-12 w-12 rounded-xl" />
          <Skeleton className="mx-auto mb-1 h-8 w-16" />
          <Skeleton className="mx-auto h-3 w-20" />
        </div>
      ))}
    </div>
  </div>
);

export const SectionHeaderSkeleton = () => (
  <div className="mb-8 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <Skeleton className="h-14 w-14 rounded-2xl" />
      <div>
        <Skeleton className="mb-2 h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  </div>
);

export { Skeleton };
