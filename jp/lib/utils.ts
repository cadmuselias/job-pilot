import type { Profile } from "@/types";

export const MATCH_THRESHOLD = 70;

export interface ProfileCompletionResult {
  percentage: number;
  missingFields: string[];
  isComplete: boolean;
}

/**
 * Calculates profile completion percentage and missing fields list.
 * Evaluates 10 core fields. Returns 0-100 percentage, missing tags, and completion flag.
 */
export function calculateProfileCompletion(
  profile: Partial<Profile> | null | undefined
): ProfileCompletionResult {
  if (!profile) {
    return {
      percentage: 0,
      missingFields: [
        "NAME",
        "PHONE",
        "LOCATION",
        "TITLE",
        "EXPERIENCE LEVEL",
        "YEARS EXP",
        "SKILLS",
        "WORK EXPERIENCE",
        "EDUCATION",
        "TARGET ROLES",
      ],
      isComplete: false,
    };
  }

  const missingFields: string[] = [];
  let score = 0;
  const total = 10;

  // 1. Full name
  if (profile.full_name && profile.full_name.trim().length > 0) {
    score++;
  } else {
    missingFields.push("NAME");
  }

  // 2. Phone
  if (profile.phone && profile.phone.trim().length > 0) {
    score++;
  } else {
    missingFields.push("PHONE");
  }

  // 3. Location
  if (profile.location && profile.location.trim().length > 0) {
    score++;
  } else {
    missingFields.push("LOCATION");
  }

  // 4. Current Title
  if (profile.current_title && profile.current_title.trim().length > 0) {
    score++;
  } else {
    missingFields.push("TITLE");
  }

  // 5. Experience Level
  if (profile.experience_level && profile.experience_level.trim().length > 0) {
    score++;
  } else {
    missingFields.push("EXPERIENCE LEVEL");
  }

  // 6. Years of Experience
  if (
    profile.years_experience !== null &&
    profile.years_experience !== undefined &&
    !isNaN(Number(profile.years_experience))
  ) {
    score++;
  } else {
    missingFields.push("YEARS EXP");
  }

  // 7. Skills
  if (Array.isArray(profile.skills) && profile.skills.length > 0) {
    score++;
  } else {
    missingFields.push("SKILLS");
  }

  // 8. Work Experience
  if (
    Array.isArray(profile.work_experience) &&
    profile.work_experience.length > 0 &&
    profile.work_experience.some((r) => r.company && r.title)
  ) {
    score++;
  } else {
    missingFields.push("WORK EXPERIENCE");
  }

  // 9. Education
  const hasEdu = Array.isArray(profile.education)
    ? profile.education.length > 0 &&
      profile.education.some(
        (e) => (e.institution && e.institution.trim().length > 0) || (e.field && e.field.trim().length > 0)
      )
    : false;

  if (hasEdu) {
    score++;
  } else {
    missingFields.push("EDUCATION");
  }

  // 10. Job Titles Seeking
  if (
    Array.isArray(profile.job_titles_seeking) &&
    profile.job_titles_seeking.length > 0
  ) {
    score++;
  } else {
    missingFields.push("TARGET ROLES");
  }

  const percentage = Math.round((score / total) * 100);
  const isComplete = score === total;

  return {
    percentage,
    missingFields,
    isComplete,
  };
}
