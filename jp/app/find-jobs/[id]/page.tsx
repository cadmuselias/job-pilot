import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { JobHeader } from "@/components/job-details/JobHeader";
import { JobMetrics } from "@/components/job-details/JobMetrics";
import { MatchReasoning } from "@/components/job-details/MatchReasoning";
import { SkillsComparison } from "@/components/job-details/SkillsComparison";
import { JobDescriptionView } from "@/components/job-details/JobDescriptionView";
import { CompanyResearchCard } from "@/components/job-details/CompanyResearchCard";
import { ApplyButton } from "@/components/job-details/ApplyButton";
import { createInsforgeServer } from "@/lib/insforge-server";
import { MOCK_JOBS } from "@/components/find-jobs/mock-data";
import type { Job } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchJob(id: string): Promise<Job | null> {
  try {
    const insforge = await createInsforgeServer();
    const { data, error } = await insforge.database
      .from("jobs")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      return data as Job;
    }
  } catch (err) {
    console.warn("[find-jobs/[id]] Failed fetching job from DB, trying mock fallback:", err);
  }

  // Fallback to mock job data if navigating from demo mock jobs
  const mock = MOCK_JOBS.find((m) => m.id === id);
  if (mock) {
    const mockJob: Job = {
      id: mock.id,
      run_id: null,
      user_id: "demo-user",
      source: mock.source || "search",
      source_url: `https://www.google.com/search?q=${encodeURIComponent(`${mock.company} ${mock.title}`)}`,
      external_apply_url: `https://www.google.com/search?q=${encodeURIComponent(`${mock.company} ${mock.title}`)}`,
      title: mock.title,
      company: mock.company,
      location: mock.location || "Remote",
      salary: mock.salary,
      job_type: "Full Time",
      about_role: `We are looking for a ${mock.title} to join ${mock.company}. In this role, you will collaborate with cross-functional product and engineering teams to design, build, and scale high-impact systems while maintaining exceptional quality and performance.`,
      responsibilities: [
        `Architect, implement, and maintain reliable software solutions for ${mock.company}`,
        "Collaborate closely with product designers, engineers, and stakeholders",
        "Write clean, well-tested code and perform constructive peer code reviews",
        "Diagnose production issues and ensure high availability and responsiveness",
      ],
      requirements: [
        "Strong experience with modern TypeScript and component architectures",
        "Experience designing and consuming RESTful or GraphQL APIs",
        "Solid understanding of software engineering best practices, CI/CD, and testing",
        "Strong verbal and written communication skills with team collaboration mindset",
      ],
      nice_to_have: [
        "Experience with cloud services (AWS, GCP, or Azure)",
        "Knowledge of high-performance web and data applications",
      ],
      benefits: [
        "Comprehensive health, dental, and vision insurance",
        "Flexible paid time off and remote work allowance",
        "Annual learning and development stipend",
      ],
      about_company: `${mock.company} is an innovative company providing state-of-the-art tools and services to developers and enterprises worldwide.`,
      match_score: mock.match_score,
      match_reason: `The candidate possesses a strong background in software engineering aligning well with the technical requirements for ${mock.title} at ${mock.company}. Key proficiencies in modern web architecture, clean coding practices, and component engineering represent strong parity with the position demands.`,
      matched_skills: ["TypeScript", "React", "Next.js", "RESTful APIs", "Problem-solving"],
      missing_skills: ["Java (Spring Boot)"],
      company_research: null,
      found_at: mock.found_at || new Date().toISOString(),
    };
    return mockJob;
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await fetchJob(id);

  if (!job) {
    return {
      title: "Job Details | JobPilot",
      description: "View job details, AI match reasoning, and required skills.",
    };
  }

  return {
    title: `${job.title} at ${job.company} | JobPilot`,
    description: `Match score ${job.match_score ?? 85}%: Review AI match breakdown, required skills, and job description for ${job.title} at ${job.company}.`,
  };
}

function JobDetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Back button skeleton */}
      <div className="h-5 w-28 bg-surface-secondary rounded-md mb-6" />

      {/* Header Card Skeleton */}
      <div className="h-28 bg-surface border border-border rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-surface-secondary" />
          <div className="space-y-2">
            <div className="h-6 w-52 bg-surface-secondary rounded-md" />
            <div className="h-4 w-36 bg-surface-secondary/70 rounded-md" />
          </div>
        </div>
        <div className="h-9 w-32 bg-surface-secondary rounded-lg" />
      </div>

      {/* 4 Metrics Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-20 bg-surface border border-border rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="w-11 h-11 rounded-xl bg-surface-secondary shrink-0" />
            <div className="space-y-1.5 w-full">
              <div className="h-4 w-3/4 bg-surface-secondary rounded" />
              <div className="h-3 w-1/2 bg-surface-secondary/60 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* AI Match Reasoning Skeleton */}
      <div className="h-32 bg-surface border border-border rounded-2xl p-6 space-y-3">
        <div className="h-4 w-36 bg-surface-secondary rounded-md" />
        <div className="h-4 w-full bg-surface-secondary/60 rounded-md" />
        <div className="h-4 w-5/6 bg-surface-secondary/60 rounded-md" />
      </div>

      {/* Skills Comparison Skeleton */}
      <div className="h-36 bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div className="h-4 w-48 bg-surface-secondary rounded-md" />
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-surface-secondary rounded-full" />
          <div className="h-6 w-24 bg-surface-secondary rounded-full" />
          <div className="h-6 w-16 bg-surface-secondary rounded-full" />
        </div>
      </div>

      {/* Job Description Skeleton */}
      <div className="h-44 bg-surface border border-border rounded-2xl p-6 space-y-3">
        <div className="h-5 w-36 bg-surface-secondary rounded-md" />
        <div className="h-4 w-full bg-surface-secondary/60 rounded-md" />
        <div className="h-4 w-full bg-surface-secondary/60 rounded-md" />
        <div className="h-4 w-2/3 bg-surface-secondary/60 rounded-md" />
      </div>

      {/* Company Research Skeleton */}
      <div className="h-52 bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="h-5 w-40 bg-surface-secondary rounded-md" />
          <div className="h-9 w-36 bg-surface-secondary rounded-lg" />
        </div>
        <div className="space-y-2 text-center py-4">
          <div className="w-12 h-12 bg-surface-secondary rounded-xl mx-auto" />
          <div className="h-4 w-32 bg-surface-secondary rounded mx-auto" />
        </div>
      </div>

      {/* Apply Button Skeleton */}
      <div className="h-12 bg-surface-secondary rounded-xl w-full" />
    </div>
  );
}

async function JobDetailsContent({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
  const { id } = await paramsPromise;
  const job = await fetchJob(id);

  if (!job) {
    notFound();
  }

  const applyUrl = job.external_apply_url || job.source_url;

  return (
    <>
      {/* 1. Job Header Card with Back to Jobs Navigation */}
      <JobHeader
        title={job.title}
        company={job.company}
        matchScore={job.match_score}
        redirectUrl={applyUrl}
      />

      {/* 2. Key Metrics 4-Column Row */}
      <JobMetrics
        salary={job.salary}
        location={job.location}
        jobType={job.job_type}
        foundAt={job.found_at}
      />

      {/* 3. AI Match Reasoning */}
      <MatchReasoning reason={job.match_reason} />

      {/* 4. Required Skills vs Your Profile */}
      <SkillsComparison
        matchedSkills={job.matched_skills}
        missingSkills={job.missing_skills}
      />

      {/* 5. Job Description */}
      <JobDescriptionView
        aboutRole={job.about_role}
        responsibilities={job.responsibilities}
        requirements={job.requirements}
        niceToHave={job.nice_to_have}
        benefits={job.benefits}
      />

      {/* 6. Company Research Card (Empty state placeholder for Feature 13) */}
      <CompanyResearchCard company={job.company} />

      {/* 7. Bottom Full-width Apply Button */}
      <ApplyButton company={job.company} applyUrl={applyUrl} />
    </>
  );
}

export default function JobDetailsPage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Suspense fallback={<div className="h-16 w-full bg-surface border-b border-border" />}>
        <Navbar />
      </Suspense>

      <main className="flex-1 max-w-[860px] w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Suspense fallback={<JobDetailsSkeleton />}>
          <JobDetailsContent paramsPromise={params} />
        </Suspense>
      </main>
    </div>
  );
}
