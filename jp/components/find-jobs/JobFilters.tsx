"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";

export type MatchFilterOption = "all" | "high" | "low";
export type SortOption = "match" | "newest" | "oldest";

export interface MatchCounts {
  all: number;
  high: number;
  low: number;
}

interface JobFiltersProps {
  filterQuery: string;
  onFilterChange: (query: string) => void;
  matchFilter: MatchFilterOption;
  onMatchFilterChange: (filter: MatchFilterOption) => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  counts: MatchCounts;
}

const TABS: { id: MatchFilterOption; label: string; countKey: keyof MatchCounts }[] = [
  { id: "all", label: "All Matches", countKey: "all" },
  { id: "high", label: "High Match (≥70%)", countKey: "high" },
  { id: "low", label: "Low Match (<70%)", countKey: "low" },
];

const SORT_LABELS: Record<SortOption, string> = {
  match: "Match Score",
  newest: "Newest First",
  oldest: "Oldest First",
};

export function JobFilters({
  filterQuery,
  onFilterChange,
  matchFilter,
  onMatchFilterChange,
  sortBy,
  onSortByChange,
  counts,
}: JobFiltersProps) {
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      {/* Segmented Match Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-surface-secondary border border-border rounded-xl overflow-x-auto max-w-full">
        {TABS.map((tab) => {
          const isActive = matchFilter === tab.id;
          const count = counts[tab.countKey] ?? 0;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onMatchFilterChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-surface text-text-primary font-semibold shadow-2xs border border-border/70"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface/50 border border-transparent"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                  isActive
                    ? "bg-accent-muted text-accent font-semibold"
                    : "bg-surface-tertiary text-text-muted font-medium"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input and Sort Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 lg:max-w-xl lg:justify-end">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => onFilterChange(e.target.value)}
            placeholder="Filter by company or role..."
            className="w-full bg-surface border border-border sm:hover:border-border sm:focus:border-accent rounded-lg pl-10 pr-9 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
          />
          {filterQuery && (
            <button
              type="button"
              onClick={() => onFilterChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer p-0.5 rounded-md"
              title="Clear search"
              aria-label="Clear search input"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative shrink-0" ref={sortRef}>
          <button
            type="button"
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
            className="w-full sm:w-auto bg-surface hover:bg-surface-secondary text-text-primary text-sm font-medium px-3.5 py-2 rounded-lg border border-border inline-flex items-center justify-between sm:justify-start gap-2 cursor-pointer transition-colors shadow-2xs"
            aria-expanded={sortDropdownOpen}
            aria-haspopup="listbox"
          >
            <span className="text-text-secondary text-xs">Sort:</span>
            <span className="font-semibold text-text-primary">{SORT_LABELS[sortBy]}</span>
            <ChevronDown
              className={`w-4 h-4 text-text-secondary transition-transform duration-150 ${
                sortDropdownOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          {sortDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-48 bg-surface border border-border rounded-xl shadow-lg py-1.5 z-20 animate-in fade-in-50 zoom-in-95">
              {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onSortByChange(option);
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                    sortBy === option
                      ? "text-accent font-semibold bg-accent-muted/40"
                      : "text-text-primary hover:bg-surface-secondary"
                  }`}
                >
                  <span>{SORT_LABELS[option]}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
