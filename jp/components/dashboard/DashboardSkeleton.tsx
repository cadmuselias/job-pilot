export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-hidden="true">
      {/* Stat Cards Skeleton (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="h-4 w-28 bg-surface-secondary rounded-md" />
              <div className="h-8 w-20 bg-surface-secondary/70 rounded-md" />
            </div>
            <div className="h-4 w-32 bg-surface-secondary/50 rounded-md" />
          </div>
        ))}
      </div>

      {/* Middle Row Skeleton (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Skeleton */}
        <div className="h-96 bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between">
          <div className="h-5 w-36 bg-surface-secondary rounded-md mb-6" />
          <div className="space-y-5 flex-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-3.5 h-3.5 rounded-full bg-surface-secondary shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-3/4 bg-surface-secondary/80 rounded-md" />
                  <div className="h-3 w-20 bg-surface-secondary/50 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Research Activity Skeleton */}
        <div className="h-96 bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between">
          <div className="h-5 w-52 bg-surface-secondary rounded-md mb-6" />
          <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-4">
            {[30, 60, 40, 80, 100, 50, 20].map((h, idx) => (
              <div
                key={idx}
                style={{ height: `${h}%` }}
                className="w-7 bg-surface-secondary/60 rounded-t-md"
              />
            ))}
          </div>
          <div className="flex justify-between px-4 pt-2 border-t border-border/40">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-3 w-6 bg-surface-secondary/50 rounded-md" />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row Skeleton (2 columns: 8-col & 4-col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Jobs Found Over Time Skeleton (8 cols) */}
        <div className="lg:col-span-8 h-96 bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between">
          <div className="h-5 w-48 bg-surface-secondary rounded-md mb-6" />
          <div className="flex-1 bg-surface-secondary/30 rounded-xl" />
          <div className="flex justify-between px-4 pt-4 border-t border-border/40 mt-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-3 w-7 bg-surface-secondary/50 rounded-md" />
            ))}
          </div>
        </div>

        {/* Match Score Distribution Skeleton (4 cols) */}
        <div className="lg:col-span-4 h-96 bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between">
          <div className="h-5 w-44 bg-surface-secondary rounded-md mb-6" />
          <div className="flex-1 flex items-end justify-between gap-3 px-2 pb-4">
            {[15, 30, 65, 95, 45].map((h, idx) => (
              <div
                key={idx}
                style={{ height: `${h}%` }}
                className="w-6 bg-surface-secondary/60 rounded-t-md"
              />
            ))}
          </div>
          <div className="flex justify-between px-1 pt-2 border-t border-border/40">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-3 w-9 bg-surface-secondary/50 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
