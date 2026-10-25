"use client";

import { useState } from "react";
import { Search, Sparkles, Loader2 } from "lucide-react";

interface SearchControlsProps {
  initialJobTitle?: string;
  initialLocation?: string;
  onSearch?: (title: string, location: string) => void;
  resultMessage?: string | null;
  isLoading?: boolean;
}

export function SearchControls({
  initialJobTitle = "",
  initialLocation = "",
  onSearch,
  resultMessage = "Found 8 jobs and saved 4 strong matches.",
  isLoading = false,
}: SearchControlsProps) {
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [location, setLocation] = useState(initialLocation);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(jobTitle, location);
    }
  };

  return (
    <section className="bg-surface border border-border rounded-2xl p-6 shadow-xs">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
          {/* Job Title Field */}
          <div>
            <label
              htmlFor="job-title-input"
              className="text-xs font-semibold tracking-wider text-text-secondary uppercase mb-2 block"
            >
              Job Title
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="job-title-input"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Frontend Engineer"
                className="w-full bg-surface border border-border rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors shadow-2xs"
              />
            </div>
          </div>

          {/* Location Field */}
          <div>
            <label
              htmlFor="location-input"
              className="text-xs font-semibold tracking-wider text-text-secondary uppercase mb-2 block"
            >
              Location
            </label>
            <input
              id="location-input"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Remote, New York..."
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors shadow-2xs"
            />
          </div>

          {/* Submit Action Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto bg-accent hover:bg-accent-dark text-white text-sm font-medium px-5 py-2.5 rounded-lg inline-flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer shadow-xs h-[42px] shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 text-white animate-spin" aria-hidden="true" />
                  <span>Discovering Jobs...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-white" aria-hidden="true" />
                  <span>Find Jobs</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Success Notification Banner */}
      {resultMessage && (
        <div className="mt-4 bg-success-lightest border border-success-light/80 rounded-xl px-4 py-3 flex items-center gap-2.5 text-success-foreground transition-all">
          <Sparkles className="w-4 h-4 text-success shrink-0" aria-hidden="true" />
          <span className="text-sm font-medium">{resultMessage}</span>
        </div>
      )}
    </section>
  );
}
