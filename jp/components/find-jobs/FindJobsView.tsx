"use client";

import { useState, useMemo, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { SearchControls } from "./SearchControls";
import { JobFilters, type MatchFilterOption, type SortOption } from "./JobFilters";
import { JobsTable } from "./JobsTable";
import { JobsPagination } from "./JobsPagination";
import type { MockJob } from "./mock-data";
import type { Job } from "@/types";

interface FindJobsViewProps {
  initialJobs?: MockJob[];
}

function formatRelativeDate(isoDateString?: string): string {
  if (!isoDateString) return "Recently";
  const diffMs = Date.now() - new Date(isoDateString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return diffMins <= 1 ? "Just now" : `${diffMins} mins ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return new Date(isoDateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function FindJobsView({ initialJobs = [] }: FindJobsViewProps) {
  const [jobs, setJobs] = useState<MockJob[]>(initialJobs);
  const [filterQuery, setFilterQuery] = useState("");
  const [matchFilter, setMatchFilter] = useState<MatchFilterOption>("all");
  const [sortBy, setSortBy] = useState<SortOption>("match");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(
    initialJobs.length > 0
      ? `Displaying ${initialJobs.length} saved jobs in your pipeline.`
      : null
  );

  const PAGE_SIZE = 6;

  // On mount, load previously saved jobs for authenticated user from DB
  useEffect(() => {
    if (initialJobs.length > 0) return;

    let isMounted = true;
    async function loadSavedJobs() {
      try {
        const res = await fetch("/api/agent/find");
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
          const mapped: MockJob[] = (data.jobs as Job[]).map((j) => ({
            id: j.id,
            company: j.company,
            title: j.title,
            match_score: j.match_score ?? 75,
            salary: j.salary || "Competitive",
            date_label: formatRelativeDate(j.found_at),
            location: j.location || "Remote",
            source: j.source,
          }));
          setJobs(mapped);
          setResultMessage(`Displaying ${mapped.length} saved jobs in your pipeline.`);
        }
      } catch (err) {
        console.warn("[FindJobsView] Error fetching saved jobs:", err);
      }
    }

    loadSavedJobs();
    return () => {
      isMounted = false;
    };
  }, [initialJobs.length]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let list: MockJob[] = [...jobs];

    // Filter by text query (company or role)
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase().trim();
      list = list.filter(
        (job) =>
          job.company.toLowerCase().includes(q) ||
          job.title.toLowerCase().includes(q)
      );
    }

    // Filter by match threshold
    if (matchFilter === "90+") {
      list = list.filter((job) => job.match_score >= 90);
    } else if (matchFilter === "80+") {
      list = list.filter((job) => job.match_score >= 80);
    } else if (matchFilter === "70+") {
      list = list.filter((job) => job.match_score >= 70);
    }

    // Sort jobs
    if (sortBy === "match") {
      list.sort((a, b) => b.match_score - a.match_score);
    } else if (sortBy === "salary") {
      const parseSalary = (s: string) => {
        const match = s.match(/\$(\d+)k/) || s.match(/€(\d+)k/) || s.match(/£(\d+)k/);
        return match ? parseInt(match[1], 10) : 0;
      };
      list.sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
    }

    return list;
  }, [jobs, filterQuery, matchFilter, sortBy]);

  // Paginated slice
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredJobs.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredJobs, currentPage]);

  const totalPages = Math.ceil(filteredJobs.length / PAGE_SIZE) || 1;

  const handleFilterChange = (query: string) => {
    setFilterQuery(query);
    setCurrentPage(1);
  };

  const handleMatchFilterChange = (filter: MatchFilterOption) => {
    setMatchFilter(filter);
    setCurrentPage(1);
  };

  const handleSortByChange = (sort: SortOption) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handleSearchSubmit = async (title: string, location: string) => {
    setIsSearching(true);
    setSearchError(null);

    try {
      const res = await fetch("/api/agent/find", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle: title,
          location,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status === 401) {
          setSearchError("Please log in to discover and score jobs.");
          return;
        }
        setSearchError(data.error || "Failed discovering jobs. Please try again.");
        return;
      }

      const discoveredJobs: Job[] = data.jobs || [];

      // Set ONLY the newly searched jobs — sample jobs are completely gone!
      const mappedDiscovered: MockJob[] = discoveredJobs.map((j) => ({
        id: j.id,
        company: j.company,
        title: j.title,
        match_score: j.match_score ?? 75,
        salary: j.salary || "Competitive",
        date_label: formatRelativeDate(j.found_at),
        location: j.location || "Remote",
        source: j.source,
      }));

      setJobs(mappedDiscovered);

      setResultMessage(
        `Found ${data.count} jobs and saved ${data.strongMatchesCount} strong matches.`
      );
      setCurrentPage(1);
    } catch (err: unknown) {
      console.error("[FindJobsView] Job discovery error:", err);
      setSearchError("Network error while searching for jobs. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Controls Card at Top */}
      <SearchControls
        initialJobTitle=""
        initialLocation=""
        resultMessage={resultMessage}
        isLoading={isSearching}
        onSearch={handleSearchSubmit}
      />

      {/* Error Alert if search failed */}
      {searchError && (
        <div className="bg-surface border border-error/30 rounded-xl px-4 py-3 flex items-center gap-2.5 text-error shadow-2xs">
          <AlertCircle className="w-4 h-4 text-error shrink-0" aria-hidden="true" />
          <span className="text-sm font-medium">{searchError}</span>
        </div>
      )}

      {/* Filter and Sorting Controls Bar */}
      <JobFilters
        filterQuery={filterQuery}
        onFilterChange={handleFilterChange}
        matchFilter={matchFilter}
        onMatchFilterChange={handleMatchFilterChange}
        sortBy={sortBy}
        onSortByChange={handleSortByChange}
      />

      {/* Jobs Table Card with Integrated Pagination */}
      <JobsTable
        jobs={paginatedJobs}
        pagination={
          filteredJobs.length > 0 ? (
            <JobsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalResults={filteredJobs.length}
              pageSize={PAGE_SIZE}
              onPageChange={(p) => setCurrentPage(p)}
            />
          ) : null
        }
      />
    </div>
  );
}
