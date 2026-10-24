"use client";

import { useState } from "react";
import { ResumeUpload } from "./ResumeUpload";
import { ProfileForm } from "./ProfileForm";
import type { ExtractedProfileData } from "@/actions/profile";
import type { ComponentProps } from "react";

type ProfileInitialData = ComponentProps<typeof ProfileForm>["initialData"];

type ProfileViewProps = {
  currentResumeUrl: string | null;
  initialData: ProfileInitialData;
  formKey?: string;
};

export function ProfileView({
  currentResumeUrl,
  initialData,
  formKey,
}: ProfileViewProps) {
  const [extractedData, setExtractedData] =
    useState<ExtractedProfileData | null>(null);
  const [extractVersion, setExtractVersion] = useState(0);

  const handleExtractSuccess = (data: ExtractedProfileData) => {
    setExtractedData(data);
    setExtractVersion((v) => v + 1);
  };

  // Smart merge initialData with extractedData
  const mergedData: ProfileInitialData = extractedData
    ? {
        ...initialData,
        fullName: extractedData.fullName || initialData?.fullName,
        email: initialData?.email || extractedData.email,
        phone: extractedData.phone || initialData?.phone,
        location: extractedData.location || initialData?.location,
        linkedinUrl: extractedData.linkedinUrl || initialData?.linkedinUrl,
        portfolioUrl: extractedData.portfolioUrl || initialData?.portfolioUrl,
        workAuthorization:
          extractedData.workAuthorization || initialData?.workAuthorization,
        currentTitle: extractedData.currentTitle || initialData?.currentTitle,
        experienceLevel:
          extractedData.experienceLevel || initialData?.experienceLevel,
        yearsExperience:
          extractedData.yearsExperience !== undefined &&
          extractedData.yearsExperience !== null
            ? String(extractedData.yearsExperience)
            : initialData?.yearsExperience,
        skills: Array.from(
          new Set([...(initialData?.skills || []), ...(extractedData.skills || [])])
        ),
        industries: Array.from(
          new Set([
            ...(initialData?.industries || []),
            ...(extractedData.industries || []),
          ])
        ),
        workExperience:
          extractedData.workExperience && extractedData.workExperience.length > 0
            ? extractedData.workExperience
            : initialData?.workExperience,
        highestDegree:
          extractedData.highestDegree || initialData?.highestDegree,
        fieldOfStudy:
          extractedData.fieldOfStudy || initialData?.fieldOfStudy,
        institution:
          extractedData.institution || initialData?.institution,
        graduationYear: extractedData.graduationYear
          ? String(extractedData.graduationYear)
          : initialData?.graduationYear,
        jobTitlesSeeking:
          extractedData.jobTitlesSeeking || initialData?.jobTitlesSeeking,
        remotePreference:
          extractedData.remotePreference || initialData?.remotePreference,
        salaryExpectation:
          extractedData.salaryExpectation || initialData?.salaryExpectation,
        preferredLocations:
          extractedData.preferredLocations || initialData?.preferredLocations,
      }
    : initialData;

  return (
    <>
      <ResumeUpload
        currentResumeUrl={currentResumeUrl}
        onExtractSuccess={handleExtractSuccess}
      />
      <ProfileForm
        key={`${formKey || "profile-form"}-v${extractVersion}`}
        initialData={mergedData}
        isExtracted={Boolean(extractedData)}
      />
    </>
  );
}
