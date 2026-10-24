"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";

export type MatchFilterOption = "all" | "90+" | "80+" | "70+";
export type SortOption = "match" | "date" | "salary";

interface JobFiltersProps {
  filterQuery: string;
  onFilterChange: (query: string) => void;
  matchFilter: MatchFilterOption;
  onMatchFilterChange: (filter: MatchFilterOption) => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
}

const MATCH_LABELS: Record<MatchFilterOption, string> = {
  all: "All Matches",
  "90+": "Strong Matches (90%+)",
  "80+": "Good Matches (80%+)",
  "70+": "Fair Matches (70%+)",
};

const SORT_LABELS: Record<SortOption, string> = {
  match: "Match Score",
  date: "Newest First",
  salary: "Salary Estimate",
};

export function JobFilters({
  filterQuery,
  onFilterChange,
  matchFilter,
  onMatchFilterChange,
  sortBy,
  onSortByChange,
}: JobFiltersProps) {
  const [matchDropdownOpen, setMatchDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const matchRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (matchRef.current && !matchRef.current.contains(event.target as Node)) {
        setMatchDropdownOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      {/* Search Input for filtering company or role */}
      <div className="relative flex-1 max-w-md">
        <Search
          className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder="Filter by company or role..."
          className="w-full bg-surface border border-border sm:border-transparent sm:hover:border-border sm:focus:border-accent rounded-lg pl-10 pr-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
        />
      </div>

      {/* Filter and Sort Dropdowns */}
      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
        {/* Match Score Filter Dropdown */}
        <div className="relative" ref={matchRef}>
          <button
            type="button"
            onClick={() => {
              setMatchDropdownOpen(!matchDropdownOpen);
              setSortDropdownOpen(false);
            }}
            className="bg-surface hover:bg-surface-secondary text-text-primary text-sm font-medium px-3.5 py-2 rounded-lg border border-border inline-flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
            aria-expanded={matchDropdownOpen}
            aria-haspopup="listbox"
          >
            <span>{MATCH_LABELS[matchFilter]}</span>
            <ChevronDown
              className={`w-4 h-4 text-text-secondary transition-transform duration-150 ${
                matchDropdownOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          {matchDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-52 bg-surface border border-border rounded-xl shadow-lg py-1.5 z-20 animate-in fade-in-50 zoom-in-95">
              {(Object.keys(MATCH_LABELS) as MatchFilterOption[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onMatchFilterChange(option);
                    setMatchDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                    matchFilter === option
                      ? "text-accent font-semibold bg-accent-muted/40"
                      : "text-text-primary hover:bg-surface-secondary"
                  }`}
                >
                  <span>{MATCH_LABELS[option]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort By Dropdown */}
        <div className="relative" ref={sortRef}>
          <button
            type="button"
            onClick={() => {
              setSortDropdownOpen(!sortDropdownOpen);
              setMatchDropdownOpen(false);
            }}
            className="bg-surface hover:bg-surface-secondary text-text-primary text-sm font-medium px-3.5 py-2 rounded-lg border border-border inline-flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
            aria-expanded={sortDropdownOpen}
            aria-haspopup="listbox"
          >
            <span>{SORT_LABELS[sortBy]}</span>
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
