import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { createInsforgeServer } from "@/lib/insforge-server";
import { calculateProfileCompletion } from "@/lib/utils";
import {
  calculateDashboardStats,
  formatDashboardActivities,
  calculateJobsOverTime,
  calculateScoreDistribution,
  calculateCompanyResearchActivity,
  type DashboardJobSummary,
  type DashboardAgentRunSummary,
  type DashboardResearchedJobSummary,
} from "@/lib/dashboard";
import type { StatCardItem } from "@/components/dashboard/StatCardGrid";
import type { ActivityItem } from "@/components/dashboard/RecentActivityCard";
import type { DayActivity } from "@/components/dashboard/CompanyResearchChart";
import type { TimeDataPoint } from "@/components/dashboard/JobsOverTimeChart";
import type { DistributionBucket } from "@/components/dashboard/ScoreDistributionChart";
import type { Profile } from "@/types";

export const metadata: Metadata = {
  title: "Dashboard | JobPilot",
  description:
    "Review your AI-powered job search analytics, recent matching activity, and pipeline performance.",
};

async function DashboardContent() {
  await connection();
  const insforge = await createInsforgeServer();
  const { data: authData } = await insforge.auth.getCurrentUser();
  const user = authData?.user;

  let profile: Profile | null = null;
  let stats: StatCardItem[] | undefined;
  let activities: ActivityItem[] | undefined;
  let companyResearchData: DayActivity[] | undefined;
  let jobsOverTimeData: TimeDataPoint[] | undefined;
  let scoreDistributionData: DistributionBucket[] | undefined;

  if (user) {
    // 1. Fetch user profile
    const { data: profileData } = await insforge.database
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (profileData) {
      profile = profileData as Profile;
    }

    // 2. Fetch jobs and agent runs in parallel
    const [jobsResult, runsResult] = await Promise.all([
      insforge.database
        .from("jobs")
        .select("id, company, title, match_score, found_at, company_research")
        .eq("user_id", user.id),
      insforge.database
        .from("agent_runs")
        .select(
          "id, status, job_title_searched, location_searched, jobs_found, started_at, completed_at"
        )
        .eq("user_id", user.id)
        .order("started_at", { ascending: false })
        .limit(5),
    ]);

    const jobsData = jobsResult.data || [];
    const typedJobs = jobsData as DashboardJobSummary[];
    stats = calculateDashboardStats(typedJobs);

    const researchedJobs = (jobsData as DashboardResearchedJobSummary[]).filter(
      (job) => job.company_research !== null && job.company_research !== undefined
    );

    activities = formatDashboardActivities(
      runsResult.data as DashboardAgentRunSummary[] | null,
      researchedJobs
    );

    // 3. Compute real analytics for the 3 dashboard charts
    jobsOverTimeData = calculateJobsOverTime(typedJobs);
    scoreDistributionData = calculateScoreDistribution(typedJobs);
    companyResearchData = calculateCompanyResearchActivity(typedJobs);
  }

  // Calculate profile completion status or fallback to demo state
  const completion = profile
    ? calculateProfileCompletion(profile)
    : {
        percentage: 70,
        missingFields: ["PHONE", "LOCATION", "EDUCATION"],
        isComplete: false,
      };

  return (
    <DashboardView
      completionPercentage={completion.percentage}
      missingFieldsCount={completion.missingFields.length}
      isProfileComplete={completion.isComplete}
      stats={stats}
      activities={activities}
      companyResearchData={companyResearchData}
      jobsOverTimeData={jobsOverTimeData}
      scoreDistributionData={scoreDistributionData}
    />
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </main>
    </div>
  );
}
