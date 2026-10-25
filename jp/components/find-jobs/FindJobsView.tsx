"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { SearchControls } from "./SearchControls";
import {
  JobFilters,
  type MatchFilterOption,
  type SortOption,
  type MatchCounts,
} from "./JobFilters";
import { JobsTable } from "./JobsTable";
import { JobsPagination } from "./JobsPagination";
import { insforge } from "@/lib/insforge-client";
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
  const diffHours = Math.floor(diffMins / 24);
  if (diffHours < 24) return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return new Date(isoDateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Robust token resolver that checks in-memory client, document cookies,
 * and localStorage, keeping credentials synchronized across browser boundaries.
 */
function getActiveAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  // 1. Check in-memory InsForge client
  const clientAny = insforge as unknown as {
    tokenManager?: {
      getAccessToken?: () => string | null;
      getSession?: () => { accessToken?: string } | null;
    };
  };

  let token =
    clientAny.tokenManager?.getAccessToken?.() ||
    clientAny.tokenManager?.getSession?.()?.accessToken ||
    null;

  // 2. Check document.cookie
  if (!token && typeof document !== "undefined") {
    const match = document.cookie.match(new RegExp("(^|;\\s*)insforge_access_token=([^;]*)"));
    if (match) token = decodeURIComponent(match[2]);
  }

  // 3. Fallback scan across localStorage for persisted session tokens
  if (!token) {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes("insforge") || key.includes("token") || key.includes("auth"))) {
          const raw = localStorage.getItem(key);
          if (raw) {
            if (raw.startsWith("eyJ")) {
              token = raw;
              break;
            }
            try {
              const parsed = JSON.parse(raw);
              if (parsed?.accessToken) {
                token = parsed.accessToken;
                break;
              }
            } catch {}
          }
        }
      }
    } catch {}
  }

  // Ensure cookie is synchronized if token exists
  if (token && typeof document !== "undefined") {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `insforge_access_token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax${secure}`;
  }

  return token;
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

  const PAGE_SIZE = 20;

  // Load previously saved jobs from DB on initial mount
  useEffect(() => {
    if (initialJobs.length > 0) return;

    let isMounted = true;
    async function fetchSavedJobs() {
      try {
        const token = getActiveAuthToken();
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch("/api/agent/find", { headers });
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
            found_at: j.found_at,
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

    void fetchSavedJobs();

    return () => {
      isMounted = false;
    };
  }, [initialJobs.length]);

  // Compute live counts across the full loaded dataset
  const counts = useMemo<MatchCounts>(() => {
    let high = 0;
    let low = 0;
    for (const job of jobs) {
      if (job.match_score >= 70) {
        high++;
      } else {
        low++;
      }
    }
    return {
      all: jobs.length,
      high,
      low,
    };
  }, [jobs]);

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

    // Filter by match threshold tab
    if (matchFilter === "high") {
      list = list.filter((job) => job.match_score >= 70);
    } else if (matchFilter === "low") {
      list = list.filter((job) => job.match_score < 70);
    }

    // Sort jobs
    if (sortBy === "match") {
      list.sort((a, b) => b.match_score - a.match_score);
    } else if (sortBy === "newest") {
      list.sort((a, b) => {
        const timeA = a.found_at ? new Date(a.found_at).getTime() : 0;
        const timeB = b.found_at ? new Date(b.found_at).getTime() : 0;
        return timeB - timeA;
      });
    } else if (sortBy === "oldest") {
      list.sort((a, b) => {
        const timeA = a.found_at ? new Date(a.found_at).getTime() : 0;
        const timeB = b.found_at ? new Date(b.found_at).getTime() : 0;
        return timeA - timeB;
      });
    }

    return list;
  }, [jobs, filterQuery, matchFilter, sortBy]);

  // Paginated slice (20 per page)
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
      const token = getActiveAuthToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/agent/find", {
        method: "POST",
        headers,
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

      // Map newly scored jobs, preserving found_at
      const mappedDiscovered: MockJob[] = discoveredJobs.map((j) => ({
        id: j.id,
        company: j.company,
        title: j.title,
        match_score: j.match_score ?? 75,
        salary: j.salary || "Competitive",
        date_label: formatRelativeDate(j.found_at),
        found_at: j.found_at,
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
        <div className="bg-surface border border-error/30 rounded-xl px-4 py-3 flex items-center justify-between text-error shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-error shrink-0" aria-hidden="true" />
            <span className="text-sm font-medium">{searchError}</span>
          </div>
          {searchError.includes("log in") && (
            <Link
              href="/login?returnTo=/find-jobs"
              className="text-xs font-semibold underline hover:text-error/80 ml-3 shrink-0"
            >
              Log In
            </Link>
          )}
        </div>
      )}

      {/* Filter and Sorting Controls Bar with Segmented Tabs */}
      <JobFilters
        filterQuery={filterQuery}
        onFilterChange={handleFilterChange}
        matchFilter={matchFilter}
        onMatchFilterChange={handleMatchFilterChange}
        sortBy={sortBy}
        onSortByChange={handleSortByChange}
        counts={counts}
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
