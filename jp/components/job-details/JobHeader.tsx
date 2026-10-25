import Link from "next/link";
import { Building2, ChevronLeft, ExternalLink } from "lucide-react";

interface JobHeaderProps {
  title: string;
  company: string;
  matchScore: number | null;
  redirectUrl?: string | null;
}

export function JobHeader({
  title,
  company,
  matchScore,
  redirectUrl,
}: JobHeaderProps) {
  return (
    <div>
      {/* Back to Jobs Navigation */}
      <Link
        href="/find-jobs"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors mb-6 group"
      >
        <ChevronLeft
          className="w-4 h-4 text-text-secondary group-hover:text-text-primary transition-colors"
          aria-hidden="true"
        />
        <span>Back to Jobs</span>
      </Link>

      {/* Main Header Card */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          {/* Company Logo / Building Icon Placeholder */}
          <div className="w-14 h-14 rounded-2xl bg-surface-secondary border border-border-light flex items-center justify-center text-text-secondary shrink-0">
            <Building2 className="w-7 h-7 text-text-secondary" aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-text-primary tracking-tight truncate">
              {title}
            </h1>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-sm font-medium text-text-secondary">
                {company}
              </span>
              {matchScore !== null && (
                <>
                  <span className="text-text-muted text-xs">•</span>
                  <span className="bg-success-lightest text-success-foreground border border-success-light/60 px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center">
                    {matchScore}% Match Score
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* View Job Post External Action Button */}
        {redirectUrl ? (
          <a
            href={redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface hover:bg-surface-secondary border border-border text-sm font-medium text-text-primary transition-colors shadow-2xs shrink-0"
          >
            <ExternalLink className="w-4 h-4 text-text-secondary" aria-hidden="true" />
            <span>View Job Post</span>
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border text-sm font-medium text-text-muted opacity-60 cursor-not-allowed shrink-0"
          >
            <ExternalLink className="w-4 h-4 text-text-muted" aria-hidden="true" />
            <span>View Job Post</span>
          </button>
        )}
      </div>
    </div>
  );
}
