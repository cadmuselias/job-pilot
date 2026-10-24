"use server";

import { revalidatePath } from "next/cache";
import { GoogleGenAI } from "@google/genai";
import { PDFParse } from "pdf-parse";
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

export type DeleteResumeResult = {
  success: boolean;
  error?: string;
};

export type ExtractedProfileData = {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  workAuthorization?: string;
  currentTitle?: string;
  experienceLevel?: string;
  yearsExperience?: string | number;
  skills?: string[];
  industries?: string[];
  workExperience?: WorkExperienceItem[];
  highestDegree?: string;
  fieldOfStudy?: string;
  institution?: string;
  graduationYear?: string | number;
  jobTitlesSeeking?: string;
  remotePreference?: string;
  salaryExpectation?: string;
  preferredLocations?: string;
};

export type ExtractResumeResult = {
  success: boolean;
  data?: ExtractedProfileData;
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

export async function deleteResumeAction(): Promise<DeleteResumeResult> {
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
    const storagePath = `${user.id}/resume.pdf`;

    // Attempt to remove file from InsForge Storage bucket 'resumes'
    try {
      await insforge.storage.from("resumes").remove(storagePath);
    } catch (storageErr) {
      console.warn("[actions/profile] Warning during storage file removal:", storageErr);
    }

    // Clear resume_pdf_url on profile
    const { error: dbError } = await insforge.database
      .from("profiles")
      .update({
        resume_pdf_url: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (dbError) {
      console.error("[actions/profile] Failed to clear resume_pdf_url in DB:", dbError);
      return { success: false, error: "Failed to update profile record." };
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("[actions/profile] Unexpected error in deleteResumeAction:", error);
    return { success: false, error: "An unexpected error occurred while deleting resume." };
  }
}

export async function extractResumeAction(
  formData?: FormData
): Promise<ExtractResumeResult> {
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
    let buffer: Buffer | null = null;

    // 1. Try reading directly from uploaded formData if passed
    const file = formData?.get("resume") as File | null;
    if (file && file.size > 0) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const candidateBuf = Buffer.from(arrayBuffer);
        if (candidateBuf.slice(0, 5).toString().startsWith("%PDF")) {
          buffer = candidateBuf;
        }
      } catch (fileErr) {
        console.warn("[actions/profile] Failed reading file from formData:", fileErr);
      }
    }

    // 2. Try fetching active signed URL from user's profile record
    if (!buffer) {
      const { data: profile } = await insforge.database
        .from("profiles")
        .select("resume_pdf_url")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.resume_pdf_url && profile.resume_pdf_url.startsWith("http")) {
        try {
          const res = await fetch(profile.resume_pdf_url);
          if (res.ok) {
            const arrayBuffer = await res.arrayBuffer();
            const candidateBuf = Buffer.from(arrayBuffer);
            if (candidateBuf.slice(0, 5).toString().startsWith("%PDF")) {
              buffer = candidateBuf;
            }
          }
        } catch (fetchErr) {
          console.warn("[actions/profile] Failed fetching profile.resume_pdf_url:", fetchErr);
        }
      }
    }

    // 3. Try creating a fresh signed URL from InsForge storage
    const storagePath = `${user.id}/resume.pdf`;
    if (!buffer) {
      try {
        const signedRes = await insforge.storage
          .from("resumes")
          .createSignedUrl(storagePath, 3600);

        if (signedRes.data?.signedUrl) {
          const res = await fetch(signedRes.data.signedUrl);
          if (res.ok) {
            const arrayBuffer = await res.arrayBuffer();
            const candidateBuf = Buffer.from(arrayBuffer);
            if (candidateBuf.slice(0, 5).toString().startsWith("%PDF")) {
              buffer = candidateBuf;
            }
          }
        }
      } catch (signErr) {
        console.warn("[actions/profile] Failed fetching via createSignedUrl:", signErr);
      }
    }

    // 4. Try storage download client
    if (!buffer) {
      try {
        const { data: fileBlob, error: downloadError } = await insforge.storage
          .from("resumes")
          .download(storagePath);

        if (!downloadError && fileBlob && fileBlob.size > 0) {
          const arrayBuffer = await fileBlob.arrayBuffer();
          const candidateBuf = Buffer.from(arrayBuffer);
          if (candidateBuf.slice(0, 5).toString().startsWith("%PDF")) {
            buffer = candidateBuf;
          }
        }
      } catch (dlErr) {
        console.warn("[actions/profile] Failed downloading via storage.download():", dlErr);
      }
    }

    if (!buffer || buffer.length === 0) {
      return {
        success: false,
        error: "No uploaded resume found. Please upload a PDF resume first.",
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        error: "AI service is not configured. Missing GEMINI_API_KEY.",
      };
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert AI resume parser for JobPilot.
Analyze the provided resume and extract all relevant candidate profile fields into the exact JSON format specified below.

Extraction Guidelines:
- fullName: candidate's name (string)
- email: email address (string or null if not found)
- phone: phone number (string or null if not found)
- location: location (e.g. "San Francisco, CA" or "Berlin, Germany")
- linkedinUrl: full LinkedIn profile URL (string or null)
- portfolioUrl: portfolio or GitHub URL (string or null)
- currentTitle: candidate's most recent or prominent job title
- experienceLevel: categorize into exactly one of: "junior", "mid", "senior", "lead"
- yearsExperience: estimated total years of relevant work experience (number or string)
- skills: array of technical and professional skills as concise strings (e.g. ["React", "TypeScript", "Node.js"])
- industries: array of relevant industries (e.g. ["Technology", "FinTech", "SaaS"])
- workExperience: array of up to 3 most recent work experiences, with:
    - company: string
    - title: string
    - startDate: string (e.g. "Jan 2022")
    - endDate: string (e.g. "Dec 2023" or leave empty if currently working)
    - current: boolean
    - responsibilities: string (2-3 concise bullet-point style sentences describing achievements)
- highestDegree: categorize into one of: "high_school", "bachelors", "masters", "phd", "other"
- fieldOfStudy: degree field or major (e.g. "Computer Science")
- institution: name of university or educational institution
- graduationYear: year of graduation (e.g. "2021")
- jobTitlesSeeking: comma-separated string of roles candidate is targeting (e.g. "Frontend Engineer, Full Stack Developer")
- remotePreference: one of: "remote", "hybrid", "onsite", "any"

Return ONLY valid JSON with keys matching the specifications above.`;

    // Attempt text extraction with PDFParse
    let rawText = "";
    try {
      const parser = new PDFParse({ data: new Uint8Array(buffer) });
      const parseResult = await parser.getText();
      rawText = (parseResult.text || "").trim();
      await parser.destroy();
    } catch (parseError) {
      console.warn("[actions/profile] PDFParse failed, will fallback to Gemini multimodal PDF:", parseError);
    }

    let response;
    if (rawText && rawText.length >= 50) {
      // Primary path: parsed text
      response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `${prompt}\n\nResume Content:\n${rawText}`,
        config: {
          responseMimeType: "application/json",
        },
      });
    } else {
      // Robust multimodal fallback: Gemini natively parses PDF buffer directly
      response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: "application/pdf",
                  data: buffer.toString("base64"),
                },
              },
              {
                text: prompt,
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
        },
      });
    }

    let extractedData: ExtractedProfileData;
    try {
      extractedData = JSON.parse(response.text || "{}");
    } catch {
      const cleaned = (response.text || "")
        .replace(/^```json/m, "")
        .replace(/```$/m, "")
        .trim();
      extractedData = JSON.parse(cleaned);
    }

    return {
      success: true,
      data: extractedData,
    };
  } catch (error) {
    console.error("[actions/profile] Error in extractResumeAction:", error);
    return {
      success: false,
      error: "An unexpected error occurred while analyzing the resume.",
    };
  }
}
