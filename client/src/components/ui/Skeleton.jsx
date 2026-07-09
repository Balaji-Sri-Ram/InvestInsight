import React from 'react';
import { cn } from '../../utils/cn';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[var(--color-border)]/50", className)}
      {...props}
    />
  );
};

export const ReportSkeleton = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 w-full">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-border)] pb-8">
        <div className="space-y-3">
          <Skeleton className="h-12 w-[300px] md:w-[500px]" />
          <Skeleton className="h-6 w-24" />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-20" />
          </div>
          <div className="h-12 w-px bg-[var(--color-border)]"></div>
          <div className="flex flex-col items-end space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {[1, 2, 3].map((i) => (
            <section key={i} className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </section>
          ))}
          
          <section className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
