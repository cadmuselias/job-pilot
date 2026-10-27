"use client";

import { IncompleteProfileBanner } from "./IncompleteProfileBanner";
import { StatCardGrid, type StatCardItem } from "./StatCardGrid";
import { RecentActivityCard, type ActivityItem } from "./RecentActivityCard";
import { CompanyResearchChart, type DayActivity } from "./CompanyResearchChart";
import { JobsOverTimeChart, type TimeDataPoint } from "./JobsOverTimeChart";
import { ScoreDistributionChart, type DistributionBucket } from "./ScoreDistributionChart";

type DashboardViewProps = {
  completionPercentage?: number;
  missingFieldsCount?: number;
  isProfileComplete?: boolean;
  stats?: StatCardItem[];
  activities?: ActivityItem[];
  companyResearchData?: DayActivity[];
  jobsOverTimeData?: TimeDataPoint[];
  scoreDistributionData?: DistributionBucket[];
};

export function DashboardView({
  completionPercentage = 70,
  missingFieldsCount = 3,
  isProfileComplete = false,
  stats,
  activities,
  companyResearchData,
  jobsOverTimeData,
  scoreDistributionData,
}: DashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* Conditional incomplete profile warning banner */}
      {!isProfileComplete && (
        <IncompleteProfileBanner
          completionPercentage={completionPercentage}
          missingFieldsCount={missingFieldsCount}
        />
      )}

      {/* 4 Stat Cards */}
      <StatCardGrid stats={stats} />

      {/* Middle Row: Recent Activity & Company Research Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <RecentActivityCard activities={activities} />
        <CompanyResearchChart data={companyResearchData} />
      </div>

      {/* Bottom Row: Jobs Found Over Time (8 cols) & Match Score Distribution (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <JobsOverTimeChart data={jobsOverTimeData} />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <ScoreDistributionChart data={scoreDistributionData} />
        </div>
      </div>
    </div>
  );
}
