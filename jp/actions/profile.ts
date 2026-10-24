"use server";

import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";
import { createPostHogServer } from "@/lib/posthog-server";
import { calculateProfileCompletion } from "@/lib/utils";
import type { ProfileFormData, WorkExperienceItem, EducationItem } from "@/types";

export type SaveProfileResult = {
  success: boolean;
  error?: string;
  isComplete?: boolean;
};

export type UploadResumeResult = {
  success: boolean;
  url?: string;
  error?: string;
};

export async function saveProfile(
  formData: ProfileFormData
): Promise<SaveProfileResult> {
  try {
    const insforge = await createInsforgeServer();
    const {
      data: authData,
      error: authError,
    } = await insforge.auth.getCurrentUser();

    if (authError || !authData?.user) {
      return { success: false, error: "Unauthorized. Please log in again." };
    }

    const user = authData.user;

    // Check existing profile state to detect first-time completion
    const { data: existingProfile } = await insforge.database
      .from("profiles")
      .select("is_complete")
      .eq("id", user.id)
      .maybeSingle();

    const wasPreviouslyComplete = existingProfile?.is_complete === true;

    // Format roles (up to 3)
    const formattedRoles: WorkExperienceItem[] = (formData.roles || [])
      .slice(0, 3)
      .map((role) => ({
        company: role.company?.trim() || "",
        title: role.title?.trim() || "",
        startDate: role.startDate?.trim() || "",
        endDate: role.endDate?.trim() || "",
        current: Boolean(role.current),
        responsibilities: role.responsibilities?.trim() || "",
      }));

    // Format education
    const formattedEducation: EducationItem[] = [
      {
        degree: formData.highestDegree?.trim() || "",
        field: formData.fieldOfStudy?.trim() || "",
        institution: formData.institution?.trim() || "",
        year: formData.graduationYear ? String(formData.graduationYear).trim() : "",
      },
    ];

    // Format string list fields
    const formattedJobTitles: string[] = typeof formData.jobTitlesSeeking === "string"
      ? formData.jobTitlesSeeking
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : Array.isArray(formData.jobTitlesSeeking)
        ? formData.jobTitlesSeeking
        : [];

    const formattedPreferredLocations: string[] = typeof formData.preferredLocations === "string"
      ? formData.preferredLocations
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : Array.isArray(formData.preferredLocations)
        ? formData.preferredLocations
        : [];

    const yearsExp =
      formData.yearsExperience !== "" &&
      formData.yearsExperience !== undefined &&
      formData.yearsExperience !== null
        ? Number(formData.yearsExperience)
        : null;

    // Calculate completion metrics
    const completion = calculateProfileCompletion({
      full_name: formData.fullName,
      phone: formData.phone,
      location: formData.location,
      current_title: formData.currentTitle,
      experience_level: (formData.experienceLevel as import("@/types").ExperienceLevel) || null,
      years_experience: yearsExp,
      skills: formData.skills || [],
      work_experience: formattedRoles,
      education: formattedEducation,
      job_titles_seeking: formattedJobTitles,
    });

    const profileRecord = {
      id: user.id,
      full_name: formData.fullName?.trim() || null,
      email: user.email || formData.email || null,
      phone: formData.phone?.trim() || null,
      location: formData.location?.trim() || null,
      current_title: formData.currentTitle?.trim() || null,
      experience_level: formData.experienceLevel?.trim() || null,
      years_experience: isNaN(Number(yearsExp)) ? null : yearsExp,
      skills: formData.skills || [],
      industries: formData.industries || [],
      work_experience: formattedRoles,
      education: formattedEducation,
      job_titles_seeking: formattedJobTitles,
      remote_preference: formData.remotePreference || null,
      preferred_locations: formattedPreferredLocations,
      salary_expectation: formData.salaryExpectation?.trim() || null,
      cover_letter_tone: formData.coverLetterTone || "formal",
      linkedin_url: formData.linkedinUrl?.trim() || null,
      portfolio_url: formData.portfolioUrl?.trim() || null,
      work_authorization: formData.workAuthorization || null,
      is_complete: completion.isComplete,
      updated_at: new Date().toISOString(),
    };

    // Upsert into profiles table
    const { error: dbError } = await insforge.database
      .from("profiles")
      .upsert([profileRecord], { onConflict: "id" });

    if (dbError) {
      console.error("[actions/profile] Database error saving profile:", dbError);
      return { success: false, error: dbError.message || "Failed to save profile." };
    }

    // Trigger PostHog profile_completed if transitioning to complete for first time
    if (completion.isComplete && !wasPreviouslyComplete) {
      try {
        const posthog = createPostHogServer();
        posthog.capture({
          distinctId: user.id,
          event: "profile_completed",
          properties: {
            userId: user.id,
          },
        });
        await posthog.shutdown();
      } catch (posthogError) {
        // Non-fatal: do not block profile save if PostHog encounters errors
        console.warn("[actions/profile] PostHog profile_completed capture warning:", posthogError);
      }
    }

    revalidatePath("/profile");
    return { success: true, isComplete: completion.isComplete };
  } catch (error) {
    console.error("[actions/profile] Unexpected error in saveProfile:", error);
    return { success: false, error: "An unexpected error occurred while saving profile." };
  }
}

export async function uploadResume(formData: FormData): Promise<UploadResumeResult> {
  try {
    const insforge = await createInsforgeServer();
    const {
      data: authData,
      error: authError,
    } = await insforge.auth.getCurrentUser();

    if (authError || !authData?.user) {
      return { success: false, error: "Unauthorized. Please log in again." };
    }

    const user = authData.user;
    const file = formData.get("resume") as File | null;

    if (!file) {
      return { success: false, error: "No resume file provided." };
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return { success: false, error: "Only PDF format is supported." };
    }

    // Max 5MB file size check
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { success: false, error: "File exceeds 5MB limit. Please upload a smaller PDF." };
    }

    const storagePath = `${user.id}/resume.pdf`;

    // Upload to InsForge Storage bucket 'resumes'
    const { data: uploadData, error: uploadError } = await insforge.storage
      .from("resumes")
      .upload(storagePath, file);

    if (uploadError) {
      console.error("[actions/profile] Storage upload error:", uploadError);
      return { success: false, error: uploadError.message || "Failed to upload resume to storage." };
    }

    let resumeUrl = storagePath;
    try {
      const signedResult = await insforge.storage
        .from("resumes")
        .createSignedUrl(storagePath, 60 * 60 * 24 * 7);

      if (signedResult.data?.signedUrl) {
        resumeUrl = signedResult.data.signedUrl;
      } else {
        const publicUrlResult = insforge.storage.from("resumes").getPublicUrl(storagePath);
        resumeUrl = uploadData?.url || publicUrlResult.data?.publicUrl || storagePath;
      }
    } catch {
      const publicUrlResult = insforge.storage.from("resumes").getPublicUrl(storagePath);
      resumeUrl = uploadData?.url || publicUrlResult.data?.publicUrl || storagePath;
    }

    // Check if profile exists before updating
    const { data: existingProfile } = await insforge.database
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (existingProfile) {
      const { error: updateError } = await insforge.database
        .from("profiles")
        .update({
          resume_pdf_url: resumeUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("[actions/profile] Failed updating resume URL:", updateError);
      }
    } else {
      const { error: insertError } = await insforge.database
        .from("profiles")
        .insert([
          {
            id: user.id,
            email: user.email,
            resume_pdf_url: resumeUrl,
            updated_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        console.error("[actions/profile] Failed inserting initial profile with resume URL:", insertError);
      }
    }

    revalidatePath("/profile");
    return { success: true, url: resumeUrl };
  } catch (error) {
    console.error("[actions/profile] Unexpected error in uploadResume:", error);
    return { success: false, error: "An unexpected error occurred while uploading resume." };
  }
}
