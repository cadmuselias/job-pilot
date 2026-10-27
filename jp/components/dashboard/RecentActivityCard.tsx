"use client";

import Link from "next/link";
import { Clock } from "lucide-react";

export type ActivityItem = {
  id: string;
  type: "job_found" | "researched" | "tailored";
  title: string;
  timestamp: string;
  href?: string;
};

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    type: "tailored", // Purple
    title: "Found 8 jobs for Frontend Engineer",
    timestamp: "10 mins ago",
    href: "/find-jobs",
  },
  {
    id: "act-2",
    type: "researched", // Blue
    title: "Researched Stripe",
    timestamp: "1 hour ago",
  },
  {
    id: "act-3",
    type: "job_found", // Green
    title: "Found 12 jobs for React Developer",
    timestamp: "2 hours ago",
    href: "/find-jobs",
  },
  {
    id: "act-4",
    type: "tailored", // Purple
    title: "Researched Vercel",
    timestamp: "Yesterday",
  },
  {
    id: "act-5",
    type: "job_found", // Green
    title: "Found 10 jobs for Full Stack Engineer",
    timestamp: "Yesterday",
    href: "/find-jobs",
  },
];

type RecentActivityCardProps = {
  activities?: ActivityItem[];
};

export function RecentActivityCard({
  activities,
}: RecentActivityCardProps) {
  const items = activities !== undefined ? activities : DEFAULT_ACTIVITIES;

  const getDotStyles = (type: ActivityItem["type"]) => {
    switch (type) {
      case "researched":
        return {
          inner: "bg-info",
          outer: "ring-info-light bg-info-lightest",
        };
      case "job_found":
        return {
          inner: "bg-success-alt",
          outer: "ring-success-light bg-success-lightest",
        };
      case "tailored":
      default:
        return {
          inner: "bg-accent",
          outer: "ring-accent-light bg-accent-muted",
        };
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      <h3 className="text-base font-semibold text-text-primary mb-6">Recent Activity</h3>

      {items.length === 0 ? (
        <div className="flex-1 py-8 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-accent-muted flex items-center justify-center text-accent mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-text-primary">No recent activity yet</p>
          <p className="text-xs text-text-muted mt-1 max-w-[240px]">
            Discover jobs or research companies to track your pipeline here.
          </p>
          <Link
            href="/find-jobs"
            className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-dark transition-colors"
          >
            Find jobs &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-6 relative">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const styles = getDotStyles(item.type);

            return (
              <div key={item.id} className="relative flex items-start gap-4">
                {/* Connecting vertical line */}
                {!isLast && (
                  <div
                    aria-hidden="true"
                    className="absolute left-[7px] top-4 -bottom-6 w-[1.5px] bg-border-light"
                  />
                )}

                {/* Status node */}
                <div className="relative z-10 mt-1 flex items-center justify-center shrink-0">
                  <span
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ring-4 ${styles.outer}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${styles.inner}`} />
                  </span>
                </div>

                {/* Activity description and relative timestamp */}
                {item.href ? (
                  <Link href={item.href} className="flex-1 min-w-0 group">
                    <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors leading-tight">
                      {item.title}
                    </p>
                    <p className="text-xs text-text-muted mt-1">{item.timestamp}</p>
                  </Link>
                ) : (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary leading-tight">
                      {item.title}
                    </p>
                    <p className="text-xs text-text-muted mt-1">{item.timestamp}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
