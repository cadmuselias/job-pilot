"use client";

import { useState, useMemo } from "react";
import { SearchControls } from "./SearchControls";
import { JobFilters, type MatchFilterOption, type SortOption } from "./JobFilters";
import { JobsTable } from "./JobsTable";
import { JobsPagination } from "./JobsPagination";
import { MOCK_JOBS, type MockJob } from "./mock-data";

export function FindJobsView() {
  const [filterQuery, setFilterQuery] = useState("");
  const [matchFilter, setMatchFilter] = useState<MatchFilterOption>("all");
  const [sortBy, setSortBy] = useState<SortOption>("match");
  const [currentPage, setCurrentPage] = useState(1);
  const [resultMessage, setResultMessage] = useState<string | null>(
    "Found 8 jobs and saved 4 strong matches."
  );

  const PAGE_SIZE = 6;

  // Filter and sort mock jobs
  const filteredJobs = useMemo(() => {
    let list: MockJob[] = [...MOCK_JOBS];

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
      // Sort roughly by parsed salary number
      const parseSalary = (s: string) => {
        const match = s.match(/\$(\d+)k/);
        return match ? parseInt(match[1], 10) : 0;
      };
      list.sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
    }
    // "date" retains natural mock discovery order

    return list;
  }, [filterQuery, matchFilter, sortBy]);

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

  const handleSearchSubmit = (title: string, location: string) => {
    // In Feature 09 (mock UI), simulate immediate dynamic search update
    const roleTerm = title.trim() || "Frontend Engineer";
    const locTerm = location.trim() || "Remote";
    setResultMessage(
      `Found 8 jobs for "${roleTerm}" in ${locTerm} and saved 4 strong matches.`
    );
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Search Controls Card at Top */}
      <SearchControls
        initialJobTitle="Frontend Engineer"
        initialLocation="Remote, New York..."
        resultMessage={resultMessage}
        onSearch={handleSearchSubmit}
      />

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
