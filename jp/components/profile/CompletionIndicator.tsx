import { AlertCircle, CheckCircle2 } from "lucide-react";

type CompletionIndicatorProps = {
  completionPercentage?: number;
  missingFields?: string[];
};

export function CompletionIndicator({
  completionPercentage = 70,
  missingFields = ["PHONE", "LOCATION", "EDUCATION"],
}: CompletionIndicatorProps) {
  const isComplete = completionPercentage >= 100 || missingFields.length === 0;

  // SVG calculation for circular ring (radius 36, circumference ~226.19)
  const radius = 36;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (circumference * Math.min(100, Math.max(0, completionPercentage))) / 100;

  const strokeColor = isComplete
    ? "var(--color-success)"
    : completionPercentage >= 60
      ? "var(--color-error)"
      : "var(--color-error)";

  return (
    <section className="bg-surface border border-border rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all">
      {/* Left content: Status and field info */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5">
          {isComplete ? (
            <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-error shrink-0" />
          )}
          <h2 className="text-base font-semibold text-text-primary">
            {isComplete ? "Profile is complete" : "Profile needs attention"}
          </h2>
        </div>

        <p className="text-sm text-text-secondary max-w-lg leading-relaxed">
          {isComplete
            ? "Great job! Your profile has all required details to maximize AI job discovery and tailor resumes."
            : "Complete the missing fields to improve your chance of getting tailored matches and generating quality resumes."}
        </p>

        {/* Missing field tags or complete badge */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {isComplete ? (
            <span className="px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase text-success border border-success/30 rounded-md bg-success/5">
              ALL REQUIREMENTS MET
            </span>
          ) : (
            missingFields.map((field) => (
              <span
                key={field}
                className="px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase text-error border border-error/30 rounded-md bg-error/5"
              >
                {field}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Right content: Circular percentage progress ring */}
      <div className="flex items-center justify-start md:justify-end shrink-0">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
            {/* Background track circle */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="var(--color-border-light)"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Foreground progress circle */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-text-primary tracking-tight">
              {completionPercentage}%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

