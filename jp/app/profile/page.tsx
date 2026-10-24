import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { CompletionIndicator } from "@/components/profile/CompletionIndicator";
import { ResumeUpload } from "@/components/profile/ResumeUpload";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { createInsforgeServer } from "@/lib/insforge-server";
import { calculateProfileCompletion } from "@/lib/utils";
import type { Profile } from "@/types";

export const metadata: Metadata = {
  title: "Profile | JobPilot",
  description:
    "Manage your professional profile and resume for AI-powered job matching.",
};

function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Completion Indicator Skeleton */}
      <div className="h-36 bg-surface border border-border rounded-2xl p-6 flex items-center justify-between">
        <div className="space-y-3 w-2/3">
          <div className="h-5 w-44 bg-surface-secondary rounded-md" />
          <div className="h-4 w-full bg-surface-secondary/60 rounded-md" />
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-surface-secondary rounded-md" />
            <div className="h-5 w-20 bg-surface-secondary rounded-md" />
          </div>
        </div>
        <div className="w-20 h-20 rounded-full border-4 border-surface-secondary" />
      </div>

      {/* Resume Upload Skeleton */}
      <div className="h-64 bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-5 w-32 bg-surface-secondary rounded-md" />
          <div className="h-4 w-72 bg-surface-secondary/60 rounded-md" />
        </div>
        <div className="h-32 bg-surface-secondary/30 border-2 border-dashed border-border-muted rounded-xl" />
      </div>

      {/* Profile Form Skeleton */}
      <div className="h-96 bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div className="h-5 w-40 bg-surface-secondary rounded-md" />
        <div className="h-4 w-64 bg-surface-secondary/60 rounded-md" />
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="h-10 bg-surface-secondary/40 rounded-lg" />
          <div className="h-10 bg-surface-secondary/40 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

async function ProfileContent() {
  const insforge = await createInsforgeServer();
  const { data: authData } = await insforge.auth.getCurrentUser();
  const user = authData?.user;

  let profile: Profile | null = null;
  const userName =
    user?.profile?.name ||
    (typeof user?.metadata?.name === "string" ? user.metadata.name : null) ||
    (user?.email ? user.email.split("@")[0] : "");
  const userEmail = user?.email || "";

  if (user) {
    const { data, error } = await insforge.database
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (!error && data) {
      profile = data as Profile;
    }
  }

  // Calculate completion percentage and missing fields dynamically
  const completion = profile
    ? calculateProfileCompletion(profile)
    : calculateProfileCompletion({
        full_name: userName,
        email: userEmail,
      });

  // Map database record or default state to ProfileForm initialData
  const initialData = profile
    ? {
        fullName: profile.full_name ?? userName,
        email: profile.email ?? userEmail,
        phone: profile.phone ?? "",
        location: profile.location ?? "",
        linkedinUrl: profile.linkedin_url ?? "",
        portfolioUrl: profile.portfolio_url ?? "",
        workAuthorization: profile.work_authorization ?? "citizen",
        currentTitle: profile.current_title ?? "",
        experienceLevel: profile.experience_level ?? "junior",
        yearsExperience:
          profile.years_experience !== null && profile.years_experience !== undefined
            ? String(profile.years_experience)
            : "",
        skills: profile.skills ?? [],
        industries: profile.industries ?? [],
        workExperience: profile.work_experience ?? [],
        highestDegree:
          Array.isArray(profile.education) && profile.education[0]?.degree
            ? profile.education[0].degree
            : "high_school",
        fieldOfStudy:
          Array.isArray(profile.education) && profile.education[0]?.field
            ? profile.education[0].field
            : "",
        institution:
          Array.isArray(profile.education) && profile.education[0]?.institution
            ? profile.education[0].institution
            : "",
        graduationYear:
          Array.isArray(profile.education) && profile.education[0]?.year
            ? String(profile.education[0].year)
            : "",
        jobTitlesSeeking: Array.isArray(profile.job_titles_seeking)
          ? profile.job_titles_seeking.join(", ")
          : "",
        remotePreference: profile.remote_preference ?? "any",
        salaryExpectation: profile.salary_expectation ?? "",
        preferredLocations: Array.isArray(profile.preferred_locations)
          ? profile.preferred_locations.join(", ")
          : "",
      }
    : {
        fullName: userName,
        email: userEmail,
        phone: "",
        location: "",
        linkedinUrl: "",
        portfolioUrl: "",
        workAuthorization: "citizen",
        currentTitle: "",
        experienceLevel: "junior",
        yearsExperience: "",
        skills: [],
        industries: [],
        workExperience: [],
        highestDegree: "high_school",
        fieldOfStudy: "",
        institution: "",
        graduationYear: "",
        jobTitlesSeeking: "",
        remotePreference: "any",
        salaryExpectation: "",
        preferredLocations: "",
      };

  return (
    <>
      <CompletionIndicator
        completionPercentage={completion.percentage}
        missingFields={completion.missingFields}
      />
      <ResumeUpload currentResumeUrl={profile?.resume_pdf_url ?? null} />
      <ProfileForm
        key={profile?.updated_at || "initial"}
        initialData={initialData}
      />
    </>
  );
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[860px] w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileContent />
        </Suspense>
      </main>
    </div>
  );
}
