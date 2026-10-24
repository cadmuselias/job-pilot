import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { renderToBuffer } from "@react-pdf/renderer";
import { createInsforgeServer } from "@/lib/insforge-server";
import { ResumeTemplate, type ResumePDFData } from "@/lib/pdf/ResumeTemplate";
import type { WorkExperienceItem, EducationItem } from "@/types";


interface GeminiResumePayload {
  summary?: string;
  workExperience?: {
    company?: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    bullets?: string[];
  }[];
}

export async function POST() {
  try {
    const insforge = await createInsforgeServer();
    const {
      data: authData,
      error: authError,
    } = await insforge.auth.getCurrentUser();

    if (authError || !authData?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in again." },
        { status: 401 }
      );
    }

    const user = authData.user;

    // Fetch user profile from database
    const { data: profile, error: profileError } = await insforge.database
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || !profile) {
      console.error("[resume/generate] Failed to fetch profile:", profileError);
      return NextResponse.json(
        { success: false, error: "Profile not found. Please save your profile first." },
        { status: 404 }
      );
    }

    // Minimum validation guardrail (Decision 1)
    const hasName = Boolean(profile.full_name && profile.full_name.trim().length > 0);
    const hasExperience = Array.isArray(profile.work_experience) && profile.work_experience.length > 0;
    const hasSkills = Array.isArray(profile.skills) && profile.skills.length > 0;

    if (!hasName || (!hasExperience && !hasSkills)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please fill in your name and at least one role or skill before generating a resume.",
        },
        { status: 400 }
      );
    }

    // AI Polishing step with Gemini
    let polishedSummary = "";
    let polishedWorkExperience: ResumePDFData["workExperience"] = [];

    const rawRoles: WorkExperienceItem[] = Array.isArray(profile.work_experience)
      ? profile.work_experience
      : [];
    const skillsList: string[] = Array.isArray(profile.skills) ? profile.skills : [];

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are an elite executive resume writer and career strategist.
Transform the candidate's profile into an ATS-optimized, high-impact resume representation.

Candidate Profile:
- Full Name: ${profile.full_name || ""}
- Current Title: ${profile.current_title || ""}
- Experience Level: ${profile.experience_level || ""} (${profile.years_experience || 0} years)
- Skills: ${skillsList.join(", ")}
- Target Roles: ${(profile.job_titles_seeking || []).join(", ")}
- Work Experience History:
${JSON.stringify(rawRoles, null, 2)}
- Education:
${JSON.stringify(profile.education || [], null, 2)}

Instructions:
1. Write a compelling 2-3 sentence Professional Summary that positions the candidate strongly based on their target roles, years of experience, and key skills.
2. For each work experience entry, write 2 to 4 concise, achievement-oriented bullet points starting with strong action verbs (e.g., "Architected", "Engineered", "Spearheaded", "Streamlined"). Quantify impact or describe technical scope where appropriate.

Return ONLY a valid JSON object matching this schema:
{
  "summary": string,
  "workExperience": [
    {
      "company": string,
      "title": string,
      "startDate": string,
      "endDate": string,
      "current": boolean,
      "bullets": string[]
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        const text = response.text?.trim() || "";
        if (text) {
          const parsed = JSON.parse(text) as GeminiResumePayload;
          if (parsed.summary) {
            polishedSummary = parsed.summary.trim();
          }
          if (Array.isArray(parsed.workExperience) && parsed.workExperience.length > 0) {
            polishedWorkExperience = parsed.workExperience.map((exp) => ({
              company: exp.company || "",
              title: exp.title || "",
              startDate: exp.startDate || "",
              endDate: exp.endDate || "",
              current: Boolean(exp.current),
              bullets: Array.isArray(exp.bullets)
                ? exp.bullets.filter((b) => typeof b === "string" && b.trim().length > 0)
                : [],
            }));
          }
        }
      } catch (geminiError) {
        console.warn(
          "[resume/generate] Gemini enhancement failed, falling back to raw profile data:",
          geminiError
        );
      }
    }

    // Fallback: If AI summary was not generated, construct standard professional summary
    if (!polishedSummary) {
      if (profile.current_title && skillsList.length > 0) {
        polishedSummary = `Experienced ${profile.current_title} with proven expertise across ${skillsList
          .slice(0, 5)
          .join(", ")}. Dedicated to delivering robust engineering solutions, driving technical excellence, and achieving scalable results.`;
      } else if (profile.current_title) {
        polishedSummary = `Accomplished ${profile.current_title} with a strong track record of professional success, strategic problem-solving, and cross-functional leadership.`;
      } else {
        polishedSummary = `Results-driven professional with hands-on domain experience, strong problem-solving abilities, and a commitment to technical innovation and measurable outcomes.`;
      }
    }

    // Fallback: If AI work experience was not generated, extract bullets from raw responsibilities
    if (polishedWorkExperience.length === 0 && rawRoles.length > 0) {
      polishedWorkExperience = rawRoles.map((role) => {
        const bullets: string[] = [];
        if (role.responsibilities) {
          const lines = role.responsibilities
            .split(/\r?\n|•|-/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

          if (lines.length > 0) {
            bullets.push(...lines);
          } else {
            bullets.push(role.responsibilities.trim());
          }
        }

        return {
          company: role.company || "",
          title: role.title || "",
          startDate: role.startDate || "",
          endDate: role.endDate || "",
          current: Boolean(role.current),
          bullets: bullets.length > 0 ? bullets : ["Contributed to core product initiatives and team deliverables."],
        };
      });
    }

    // Format education items
    const rawEducation: EducationItem[] = Array.isArray(profile.education)
      ? profile.education
      : [];
    const formattedEducation = rawEducation
      .filter((e) => e.institution || e.field || e.degree)
      .map((e) => ({
        degree: e.degree || "",
        field: e.field || "",
        institution: e.institution || "",
        year: e.year || "",
      }));

    // Assemble final PDF data
    const resumePdfData: ResumePDFData = {
      fullName: profile.full_name || "Candidate",
      currentTitle: profile.current_title || undefined,
      email: profile.email || user.email || "",
      phone: profile.phone || undefined,
      location: profile.location || undefined,
      linkedinUrl: profile.linkedin_url || undefined,
      portfolioUrl: profile.portfolio_url || undefined,
      summary: polishedSummary,
      skills: skillsList,
      workExperience: polishedWorkExperience,
      education: formattedEducation,
    };

    // Render PDF buffer using @react-pdf/renderer
    const pdfDocument = ResumeTemplate({ data: resumePdfData });
    const pdfBuffer = await renderToBuffer(pdfDocument);

    const storagePath = `${user.id}/resume.pdf`;
    const pdfFile = new File([new Uint8Array(pdfBuffer)], "resume.pdf", {
      type: "application/pdf",
    });

    // Upload to InsForge Storage bucket 'resumes'
    const { data: uploadData, error: uploadError } = await insforge.storage
      .from("resumes")
      .upload(storagePath, pdfFile);

    if (uploadError) {
      console.error("[resume/generate] Storage upload error:", uploadError);
      return NextResponse.json(
        {
          success: false,
          error: uploadError.message || "Failed to upload generated resume to storage.",
        },
        { status: 500 }
      );
    }

    // Resolve accessible URL
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

    // Persist resume_pdf_url to profiles table
    const { error: dbUpdateError } = await insforge.database
      .from("profiles")
      .update({
        resume_pdf_url: resumeUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (dbUpdateError) {
      console.error("[resume/generate] Profile update error:", dbUpdateError);
    }

    return NextResponse.json({
      success: true,
      url: resumeUrl,
    });
  } catch (error) {
    console.error("[resume/generate] Unexpected error during resume generation:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while generating resume PDF.",
      },
      { status: 500 }
    );
  }
}
