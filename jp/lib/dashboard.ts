import type { StatCardItem } from "@/components/dashboard/StatCardGrid";
import type { ActivityItem } from "@/components/dashboard/RecentActivityCard";
import type { DayActivity } from "@/components/dashboard/CompanyResearchChart";
import type { TimeDataPoint } from "@/components/dashboard/JobsOverTimeChart";
import type { DistributionBucket } from "@/components/dashboard/ScoreDistributionChart";

export type DashboardJobSummary = {
  id: string;
  match_score: number | null;
  found_at: string | null;
  company_research: unknown | null;
};

export type DashboardAgentRunSummary = {
  id: string;
  status: string;
  job_title_searched: string | null;
  location_searched: string | null;
  jobs_found: number | null;
  started_at: string;
  completed_at: string | null;
};

export type DashboardResearchedJobSummary = {
  id: string;
  company: string;
  title: string;
  found_at: string;
  company_research: unknown | null;
};

/**
 * Computes the 4 dashboard stat cards from genuine InsForge user jobs.
 * Calculates rolling 7-day metrics, week-over-week deltas, and clean empty states.
 */
export function calculateDashboardStats(
  jobs: DashboardJobSummary[] | null | undefined
): StatCardItem[] {
  const safeJobs = jobs || [];
  const totalJobs = safeJobs.length;

  // Time boundaries (rolling 7 days & prior 7 days)
  const now = Date.now();
  const msInDay = 24 * 60 * 60 * 1000;
  const sevenDaysAgo = now - 7 * msInDay;
  const fourteenDaysAgo = now - 14 * msInDay;

  // Filter jobs by time windows using found_at
  const currentWeekJobs = safeJobs.filter((job) => {
    if (!job.found_at) return false;
    const time = new Date(job.found_at).getTime();
    return !isNaN(time) && time >= sevenDaysAgo;
  });

  const priorWeekJobs = safeJobs.filter((job) => {
    if (!job.found_at) return false;
    const time = new Date(job.found_at).getTime();
    return !isNaN(time) && time >= fourteenDaysAgo && time < sevenDaysAgo;
  });

  // 1. Total Jobs Found
  let totalJobsTrend: StatCardItem["trend"] | undefined;
  let totalJobsSubtitle: string | undefined;

  if (totalJobs === 0) {
    totalJobsSubtitle = "Run discovery to start";
  } else if (priorWeekJobs.length > 0) {
    const diff = currentWeekJobs.length - priorWeekJobs.length;
    const pct = Math.round((diff / priorWeekJobs.length) * 100);
    const sign = pct >= 0 ? "+" : "";
    totalJobsTrend = {
      value: `${sign}${pct}%`,
      label: "vs last week",
      isNegative: pct < 0,
    };
  } else if (currentWeekJobs.length > 0) {
    totalJobsTrend = {
      value: `+${currentWeekJobs.length}`,
      label: "new this week",
      isNegative: false,
    };
  } else {
    totalJobsSubtitle = "Lifetime discovered";
  }

  // 2. Avg. Match Rate
  let avgMatchValue = "0%";
  let avgMatchTrend: StatCardItem["trend"] | undefined;
  let avgMatchSubtitle: string | undefined;

  const scoredJobs = safeJobs.filter(
    (job) => typeof job.match_score === "number" && !isNaN(job.match_score)
  );

  if (scoredJobs.length === 0) {
    avgMatchValue = "0%";
    avgMatchSubtitle = totalJobs === 0 ? "No scored roles yet" : "No match scores yet";
  } else {
    const sumScore = scoredJobs.reduce((acc, j) => acc + (j.match_score ?? 0), 0);
    const overallAvg = Math.round(sumScore / scoredJobs.length);
    avgMatchValue = `${overallAvg}%`;

    const currentWeekScored = currentWeekJobs.filter(
      (job) => typeof job.match_score === "number" && !isNaN(job.match_score)
    );
    const priorWeekScored = priorWeekJobs.filter(
      (job) => typeof job.match_score === "number" && !isNaN(job.match_score)
    );

    if (currentWeekScored.length > 0 && priorWeekScored.length > 0) {
      const currentAvg =
        currentWeekScored.reduce((acc, j) => acc + (j.match_score ?? 0), 0) /
        currentWeekScored.length;
      const priorAvg =
        priorWeekScored.reduce((acc, j) => acc + (j.match_score ?? 0), 0) /
        priorWeekScored.length;
      const diff = Math.round(currentAvg - priorAvg);
      const sign = diff >= 0 ? "+" : "";
      avgMatchTrend = {
        value: `${sign}${diff}%`,
        label: "vs last week",
        isNegative: diff < 0,
      };
    } else {
      avgMatchSubtitle = `Across ${scoredJobs.length} scored ${
        scoredJobs.length === 1 ? "role" : "roles"
      }`;
    }
  }

  // 3. Companies Researched
  const companiesResearchedCount = safeJobs.filter(
    (job) => job.company_research !== null && job.company_research !== undefined
  ).length;

  const companiesResearchedSubtitle =
    totalJobs === 0
      ? "0 dossiers generated"
      : `${companiesResearchedCount} of ${totalJobs} researched`;

  // 4. Jobs This Week
  const jobsThisWeekCount = currentWeekJobs.length;
  const jobsThisWeekSubtitle =
    jobsThisWeekCount === 0 ? "None in last 7 days" : "New in last 7 days";

  return [
    {
      id: "total-jobs",
      label: "Total Jobs Found",
      value: totalJobs.toLocaleString(),
      trend: totalJobsTrend,
      subtitle: totalJobsSubtitle,
    },
    {
      id: "avg-match",
      label: "Avg. Match Rate",
      value: avgMatchValue,
      trend: avgMatchTrend,
      subtitle: avgMatchSubtitle,
    },
    {
      id: "companies-researched",
      label: "Companies Researched",
      value: companiesResearchedCount.toLocaleString(),
      subtitle: companiesResearchedSubtitle,
    },
    {
      id: "jobs-this-week",
      label: "Jobs This Week",
      value: jobsThisWeekCount.toLocaleString(),
      subtitle: jobsThisWeekSubtitle,
    },
  ];
}

/**
 * Converts an ISO date string into a friendly relative time label.
 */
export function formatRelativeTime(isoString: string | null | undefined): string {
  if (!isoString) return "Recently";
  const time = new Date(isoString).getTime();
  if (isNaN(time)) return "Recently";

  const diffMs = Date.now() - time;
  if (diffMs < 0) return "Just now";

  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Just now";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin} ${diffMin === 1 ? "min" : "mins"} ago`;
  }

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  // Format month and day (e.g. "Oct 24")
  const date = new Date(time);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Merges agent runs and researched jobs into a sorted chronological activity list.
 */
export function formatDashboardActivities(
  agentRuns: DashboardAgentRunSummary[] | null | undefined,
  researchedJobs: DashboardResearchedJobSummary[] | null | undefined
): ActivityItem[] {
  const runs = agentRuns || [];
  const jobs = researchedJobs || [];

  const runItems: (ActivityItem & { sortTime: number })[] = runs.map((run) => {
    const count = run.jobs_found ?? 0;
    const titleSuffix = run.job_title_searched
      ? ` for ${run.job_title_searched.trim()}`
      : "";
    const isRunning = run.status === "running";

    const title = isRunning
      ? `Searching jobs${titleSuffix}`
      : `Found ${count} ${count === 1 ? "job" : "jobs"}${titleSuffix}`;

    const timestampIso = run.completed_at || run.started_at;
    const sortTime = new Date(timestampIso).getTime() || 0;

    return {
      id: `run-${run.id}`,
      type: "job_found" as const,
      title,
      timestamp: formatRelativeTime(timestampIso),
      href: "/find-jobs",
      sortTime,
    };
  });

  const jobItems: (ActivityItem & { sortTime: number })[] = jobs.map((job) => {
    const company = job.company?.trim() || "Company";
    const timestampIso = job.found_at;
    const sortTime = new Date(timestampIso).getTime() || 0;

    return {
      id: `research-${job.id}`,
      type: "researched" as const,
      title: `Researched ${company}`,
      timestamp: formatRelativeTime(timestampIso),
      href: `/find-jobs/${job.id}`,
      sortTime,
    };
  });

  const merged = [...runItems, ...jobItems];
  merged.sort((a, b) => b.sortTime - a.sortTime);

  return merged.slice(0, 5).map((item) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    timestamp: item.timestamp,
    href: item.href,
  }));
}

/**
 * Groups user job discoveries by day over the current rolling week.
 */
export function calculateJobsOverTime(
  jobs: DashboardJobSummary[] | null | undefined
): TimeDataPoint[] {
  const safeJobs = jobs || [];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const counts: Record<string, number> = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  for (const job of safeJobs) {
    if (!job.found_at) continue;
    const time = new Date(job.found_at).getTime();
    if (isNaN(time)) continue;

    const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(time).getDay()];
    if (time >= sevenDaysAgo && counts[dayName] !== undefined) {
      counts[dayName] += 1;
    }
  }

  const totalInWeek = Object.values(counts).reduce((a, b) => a + b, 0);
  if (totalInWeek === 0 && safeJobs.length > 0) {
    for (const job of safeJobs) {
      if (!job.found_at) continue;
      const time = new Date(job.found_at).getTime();
      if (isNaN(time)) continue;
      const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(time).getDay()];
      if (counts[dayName] !== undefined) {
        counts[dayName] += 1;
      }
    }
  }

  return days.map((day) => ({ day, count: counts[day] }));
}

/**
 * Buckets match scores into 5 standardized distribution brackets.
 */
export function calculateScoreDistribution(
  jobs: DashboardJobSummary[] | null | undefined
): DistributionBucket[] {
  const safeJobs = jobs || [];
  const scoredJobs = safeJobs.filter(
    (job) => typeof job.match_score === "number" && !isNaN(job.match_score)
  );

  let b5060 = 0;
  let b6070 = 0;
  let b7080 = 0;
  let b8090 = 0;
  let b90100 = 0;

  for (const job of scoredJobs) {
    const s = job.match_score as number;
    if (s < 60) {
      b5060++;
    } else if (s < 70) {
      b6070++;
    } else if (s < 80) {
      b7080++;
    } else if (s < 90) {
      b8090++;
    } else {
      b90100++;
    }
  }

  return [
    { range: "50-60%", count: b5060 },
    { range: "60-70%", count: b6070 },
    { range: "70-80%", count: b7080 },
    { range: "80-90%", count: b8090 },
    { range: "90-100%", count: b90100 },
  ];
}

/**
 * Groups researched companies by day over the current rolling week.
 */
export function calculateCompanyResearchActivity(
  jobs: DashboardJobSummary[] | null | undefined
): DayActivity[] {
  const safeJobs = jobs || [];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const counts: Record<string, number> = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };

  const researchedJobs = safeJobs.filter(
    (job) => job.company_research !== null && job.company_research !== undefined
  );

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  for (const job of researchedJobs) {
    if (!job.found_at) continue;
    const time = new Date(job.found_at).getTime();
    if (isNaN(time)) continue;

    const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(time).getDay()];
    if (time >= sevenDaysAgo && counts[dayName] !== undefined) {
      counts[dayName] += 1;
    }
  }

  const totalInWeek = Object.values(counts).reduce((a, b) => a + b, 0);
  if (totalInWeek === 0 && researchedJobs.length > 0) {
    for (const job of researchedJobs) {
      if (!job.found_at) continue;
      const time = new Date(job.found_at).getTime();
      if (isNaN(time)) continue;
      const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(time).getDay()];
      if (counts[dayName] !== undefined) {
        counts[dayName] += 1;
      }
    }
  }

  return days.map((day) => ({ day, count: counts[day] }));
}
