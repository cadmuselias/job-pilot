import { MapPin, Briefcase, Calendar } from "lucide-react";

interface JobMetricsProps {
  salary?: string | null;
  location?: string | null;
  jobType?: string | null;
  foundAt?: string | null;
}

function formatRelativeDate(isoDateString?: string | null): string {
  if (!isoDateString) return "Recently";
  const date = new Date(isoDateString);
  if (isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) return "Just now";

  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) {
    return diffMins === 1 ? "1 min ago" : `${diffMins} mins ago`;
  }

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatJobType(type?: string | null): string {
  if (!type) return "—";
  const clean = type.toLowerCase().trim();
  if (clean === "fulltime" || clean === "full_time" || clean === "full-time") return "Full Time";
  if (clean === "parttime" || clean === "part_time" || clean === "part-time") return "Part Time";
  if (clean === "contract") return "Contract";
  if (clean === "remote") return "Remote";
  if (clean === "hybrid") return "Hybrid";
  return type;
}

export function JobMetrics({
  salary,
  location,
  jobType,
  foundAt,
}: JobMetricsProps) {
  const displaySalary = salary?.trim() ? salary : "Competitive";
  const displayLocation = location?.trim() ? location : "Remote";
  const displayJobType = formatJobType(jobType);
  const displayDateFound = formatRelativeDate(foundAt);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Salary Est. */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-xs flex items-center gap-3.5 min-w-0">
        <div className="w-11 h-11 rounded-xl bg-success-lightest flex items-center justify-center text-success font-bold text-base shrink-0">
          <span className="leading-none">$</span>
        </div>
        <div className="min-w-0">
          <div className="text-base font-bold text-text-primary truncate">
            {displaySalary}
          </div>
          <div className="text-[11px] font-semibold tracking-wider uppercase text-text-secondary mt-0.5">
            Salary Est.
          </div>
        </div>
      </div>

      {/* 2. Location */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-xs flex items-center gap-3.5 min-w-0">
        <div className="w-11 h-11 rounded-xl bg-info-lightest flex items-center justify-center text-info-medium shrink-0">
          <MapPin className="w-5 h-5 text-info-medium" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="text-base font-bold text-text-primary truncate">
            {displayLocation}
          </div>
          <div className="text-[11px] font-semibold tracking-wider uppercase text-text-secondary mt-0.5">
            Location
          </div>
        </div>
      </div>

      {/* 3. Job Type */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-xs flex items-center gap-3.5 min-w-0">
        <div className="w-11 h-11 rounded-xl bg-accent-muted flex items-center justify-center text-accent shrink-0">
          <Briefcase className="w-5 h-5 text-accent" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="text-base font-bold text-text-primary truncate">
            {displayJobType}
          </div>
          <div className="text-[11px] font-semibold tracking-wider uppercase text-text-secondary mt-0.5">
            Job Type
          </div>
        </div>
      </div>

      {/* 4. Date Found */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-xs flex items-center gap-3.5 min-w-0">
        <div className="w-11 h-11 rounded-xl bg-surface-secondary border border-border-light flex items-center justify-center text-text-secondary shrink-0">
          <Calendar className="w-5 h-5 text-text-secondary" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="text-base font-bold text-text-primary truncate">
            {displayDateFound}
          </div>
          <div className="text-[11px] font-semibold tracking-wider uppercase text-text-secondary mt-0.5">
            Date Found
          </div>
        </div>
      </div>
    </div>
  );
}
