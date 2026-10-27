"use client";

export type StatCardItem = {
  id: string;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    label: string;
    isNegative?: boolean;
  };
  subtitle?: string;
};

const DEFAULT_STATS: StatCardItem[] = [
  {
    id: "total-jobs",
    label: "Total Jobs Found",
    value: "284",
    trend: {
      value: "+12%",
      label: "vs last week",
    },
  },
  {
    id: "avg-match",
    label: "Avg. Match Rate",
    value: "82%",
    trend: {
      value: "+3%",
      label: "vs last week",
    },
  },
  {
    id: "companies-researched",
    label: "Companies Researched",
    value: "35",
    subtitle: "Total researched",
  },
  {
    id: "jobs-this-week",
    label: "Jobs This Week",
    value: "28",
    subtitle: "New this week",
  },
];

type StatCardGridProps = {
  stats?: StatCardItem[];
};

export function StatCardGrid({ stats = DEFAULT_STATS }: StatCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-surface border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-all hover:border-border-muted"
        >
          <div>
            <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
            <p className="text-3xl sm:text-[32px] font-bold text-text-primary tracking-tight mt-1.5 mb-3">
              {stat.value}
            </p>
          </div>

          <div className="flex items-center min-h-[22px]">
            {stat.trend ? (
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-sm ${
                    stat.trend.isNegative
                      ? "bg-error/10 text-error"
                      : "bg-success-lightest text-success-darker"
                  }`}
                >
                  {stat.trend.value}
                </span>
                <span className="text-xs text-text-muted ml-2">{stat.trend.label}</span>
              </div>
            ) : stat.subtitle ? (
              <span className="text-xs text-text-muted">{stat.subtitle}</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
