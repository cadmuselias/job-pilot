/**
 * Arbeitnow API Client
 * Provides zero-key, public job feed integration for JobPilot.
 * Fetches recent postings and performs weighted client/server matching on
 * title, tags, description, and location.
 */

export interface ArbeitnowRawJob {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number;
}

export interface ArbeitnowResponse {
  data: ArbeitnowRawJob[];
  links?: Record<string, string | null>;
  meta?: Record<string, unknown>;
}

export interface DiscoveredCandidateJob {
  slug: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  url: string;
  tags: string[];
  jobTypes: string[];
  rawHtmlDescription: string;
  plainDescription: string;
  createdAt: number;
}

/**
 * Strips HTML tags, entities, and excessive whitespace from description strings.
 */
export function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fetches recent jobs from Arbeitnow and filters by query criteria.
 */
export async function fetchArbeitnowJobs(
  jobTitle = "",
  location = "",
  limit = 8
): Promise<DiscoveredCandidateJob[]> {
  const url = "https://www.arbeitnow.com/api/job-board-api";
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": "JobPilot-Agent/1.0",
    },
    next: { revalidate: 180 }, // Cache up to 3 mins for efficiency
  });

  if (!res.ok) {
    throw new Error(`Arbeitnow API request failed with status: ${res.status}`);
  }

  const payload: ArbeitnowResponse = await res.json();
  const rawJobs = payload.data || [];

  if (rawJobs.length === 0) {
    return [];
  }

  const titleTokens = jobTitle
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 1);

  const locLower = location.toLowerCase().trim();
  const isRemoteQuery =
    locLower.includes("remote") || locLower === "any" || locLower === "";

  // Score each job for relevance
  const scoredCandidates = rawJobs.map((job) => {
    let relevance = 0;
    const titleLower = (job.title || "").toLowerCase();
    const tagsLower = (job.tags || []).map((t) => t.toLowerCase());
    const descLower = (job.description || "").toLowerCase();
    const jobLocLower = (job.location || "").toLowerCase();

    // 1. Title keyword matching
    for (const token of titleTokens) {
      if (titleLower.includes(token)) {
        relevance += 12;
      } else if (tagsLower.some((t) => t.includes(token))) {
        relevance += 6;
      } else if (descLower.includes(token)) {
        relevance += 2;
      }
    }

    // 2. Location & Remote matching
    if (isRemoteQuery && job.remote) {
      relevance += 5;
    }
    if (locLower && !isRemoteQuery) {
      if (jobLocLower.includes(locLower)) {
        relevance += 8;
      } else if (job.remote) {
        relevance += 3;
      }
    }

    // 3. Prefer developer/software/tech roles if generic search
    if (
      titleLower.includes("engineer") ||
      titleLower.includes("developer") ||
      titleLower.includes("architect") ||
      titleLower.includes("frontend") ||
      titleLower.includes("fullstack") ||
      titleLower.includes("backend")
    ) {
      relevance += 3;
    }

    return { job, relevance };
  });

  // If user searched a title, filter out items with 0 relevance
  let filtered = scoredCandidates;
  if (titleTokens.length > 0) {
    const withMatches = scoredCandidates.filter((item) => item.relevance > 0);
    if (withMatches.length > 0) {
      filtered = withMatches;
    }
  }

  // Sort descending by relevance
  filtered.sort((a, b) => b.relevance - a.relevance);

  const topJobs = filtered.slice(0, Math.min(Math.max(limit, 4), 12)).map(({ job }) => {
    const plainDesc = stripHtml(job.description);
    return {
      slug: job.slug,
      title: job.title,
      company: job.company_name,
      location: job.location || (job.remote ? "Remote" : "Global / Remote"),
      isRemote: Boolean(job.remote),
      url: job.url,
      tags: Array.isArray(job.tags) ? job.tags : [],
      jobTypes: Array.isArray(job.job_types) ? job.job_types : ["Full-time"],
      rawHtmlDescription: job.description,
      plainDescription: plainDesc,
      createdAt: job.created_at || Math.floor(Date.now() / 1000),
    };
  });

  return topJobs;
}
