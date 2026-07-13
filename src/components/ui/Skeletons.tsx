import React from "react";
import { cn } from "../../utils/cn";

export const SkeletonText: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={cn("animate-pulse rounded bg-white/5 h-4 w-24", className)} />;
};

export const SkeletonInput: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-white/5 h-10 w-full border border-white/[0.02]",
        className
      )}
    />
  );
};

export const SkeletonButton: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={cn("animate-pulse rounded-xl bg-white/5 h-12 w-full", className)} />;
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        "w-full max-w-[480px] rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md p-6 shadow-2xl flex flex-col gap-6",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <SkeletonText className="h-6 w-16" />
      </div>

      {/* FROM Skeleton */}
      <div className="rounded-xl bg-neutral-900/40 p-4 border border-white/[0.03] flex flex-col gap-3">
        <SkeletonText className="h-3 w-10" />
        <div className="flex items-center gap-4">
          <SkeletonInput />
          <div className="w-28 shrink-0">
            <SkeletonInput />
          </div>
        </div>
      </div>

      {/* TO Skeleton */}
      <div className="rounded-xl bg-neutral-900/40 p-4 border border-white/[0.03] flex flex-col gap-3">
        <SkeletonText className="h-3 w-8" />
        <div className="flex items-center gap-4">
          <SkeletonInput />
          <div className="w-28 shrink-0">
            <SkeletonInput />
          </div>
        </div>
      </div>

      {/* Metadata Skeleton */}
      <div className="rounded-xl border border-white/[0.03] bg-neutral-950/40 p-4 space-y-3">
        <div className="flex justify-between">
          <SkeletonText className="h-3 w-24" />
          <SkeletonText className="h-3 w-16" />
        </div>
        <div className="h-[1px] bg-white/[0.02]" />
        <div className="flex justify-between">
          <SkeletonText className="h-3 w-12" />
          <SkeletonText className="h-3 w-10" />
        </div>
        <div className="flex justify-between">
          <SkeletonText className="h-3 w-8" />
          <SkeletonText className="h-3 w-6" />
        </div>
      </div>

      {/* Button Skeleton */}
      <SkeletonButton />
    </div>
  );
};
