"use client";

import { useState, useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { SearchControls } from "./SearchControls";
import { JobFilters, type MatchFilterOption, type SortOption } from "./JobFilters";
import { JobsTable } from "./JobsTable";
import { JobsPagination } from "./JobsPagination";
import { MOCK_JOBS, type MockJob } from "./mock-data";
import type { Job } from "@/types";

interface FindJobsViewProps {
  initialJobs?: MockJob[];
}

export function FindJobsView({ initialJobs }: FindJobsViewProps) {
  const [jobs, setJobs] = useState<MockJob[]>(
    initialJobs && initialJobs.length > 0 ? initialJobs : MOCK_JOBS
  );
  const [filterQuery, setFilterQuery] = useState("");
  const [matchFilter, setMatchFilter] = useState<MatchFilterOption>("all");
  const [sortBy, setSortBy] = useState<SortOption>("match");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(
    initialJobs && initialJobs.length > 0
      ? `Displaying ${initialJobs.length} saved jobs in your pipeline.`
      : "Found 8 jobs and saved 4 strong matches."
  );

  const PAGE_SIZE = 6;

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
        const match = s.match(/\$(\d+)k/);
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

      if (discoveredJobs.length > 0) {
        const mappedDiscovered: MockJob[] = discoveredJobs.map((j) => ({
          id: j.id,
          company: j.company,
          title: j.title,
          match_score: j.match_score ?? 75,
          salary: j.salary || "Competitive",
          date_label: "Just now",
          location: j.location || "Remote",
          source: j.source,
        }));

        setJobs((prev) => {
          const newIds = new Set(mappedDiscovered.map((j) => j.id));
          const remaining = prev.filter((j) => !newIds.has(j.id));
          return [...mappedDiscovered, ...remaining];
        });
      }

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
        initialJobTitle="Frontend Engineer"
        initialLocation="Remote, New York..."
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
