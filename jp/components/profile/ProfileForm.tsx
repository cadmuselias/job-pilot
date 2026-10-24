"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import {
  ChevronDown,
  Calendar,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { saveProfile } from "@/actions/profile";

type ProfileFormProps = {
  initialData?: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    workAuthorization?: string;
    currentTitle?: string;
    experienceLevel?: string;
    yearsExperience?: string;
    skills?: string[];
    industries?: string[];
    workExperience?: {
      company: string;
      title: string;
      startDate: string;
      endDate?: string;
      current?: boolean;
      responsibilities: string;
    }[];
    highestDegree?: string;
    fieldOfStudy?: string;
    institution?: string;
    graduationYear?: string;
    jobTitlesSeeking?: string;
    remotePreference?: string;
    salaryExpectation?: string;
    preferredLocations?: string;
  };
  isExtracted?: boolean;
  onSave?: (data: unknown) => void;
};

export function ProfileForm({ initialData, isExtracted, onSave }: ProfileFormProps) {
  const [showExtractedBanner, setShowExtractedBanner] = useState(Boolean(isExtracted));
  // Personal Info state
  const [fullName, setFullName] = useState(initialData?.fullName ?? "Faizan Ali");
  const [email, setEmail] = useState(initialData?.email ?? "faizan@jsmastery.pro");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(
    initialData?.linkedinUrl ?? "https://linkedin.com/in/faizan"
  );
  const [portfolioUrl, setPortfolioUrl] = useState(
    initialData?.portfolioUrl ?? "https://github.com/jsmastery"
  );
  const [workAuthorization, setWorkAuthorization] = useState(
    initialData?.workAuthorization ?? "citizen"
  );

  // Professional Info state
  const [currentTitle, setCurrentTitle] = useState(
    initialData?.currentTitle ?? "Frontend Engineer"
  );
  const [experienceLevel, setExperienceLevel] = useState(
    initialData?.experienceLevel ?? "junior"
  );
  const [yearsExperience, setYearsExperience] = useState(
    initialData?.yearsExperience ?? "4"
  );
  const [skills, setSkills] = useState<string[]>(
    initialData?.skills ?? ["React", "TypeScript", "Next.js", "Tailwind CSS"]
  );
  const [skillInput, setSkillInput] = useState("");
  const [industries, setIndustries] = useState<string[]>(
    initialData?.industries ?? []
  );
  const [industryInput, setIndustryInput] = useState("");

  // Work Experience state (up to 3 roles)
  const [roles, setRoles] = useState(
    initialData?.workExperience ?? [
      {
        company: "Vercel",
        title: "Frontend Engineer",
        startDate: "January 2022",
        endDate: "",
        current: true,
        responsibilities:
          "Built Next.js features and optimized web vitals. Led a team of 3 developers.",
      },
    ]
  );

  // Education state
  const [highestDegree, setHighestDegree] = useState(
    initialData?.highestDegree ?? "high_school"
  );
  const [fieldOfStudy, setFieldOfStudy] = useState(
    initialData?.fieldOfStudy ?? "Computer Science"
  );
  const [institution, setInstitution] = useState(
    initialData?.institution ?? ""
  );
  const [graduationYear, setGraduationYear] = useState(
    initialData?.graduationYear ?? ""
  );

  // Job Preferences state
  const [jobTitlesSeeking, setJobTitlesSeeking] = useState(
    initialData?.jobTitlesSeeking ?? "Frontend Engineer, React Developer"
  );
  const [remotePreference, setRemotePreference] = useState(
    initialData?.remotePreference ?? "any"
  );
  const [salaryExpectation, setSalaryExpectation] = useState(
    initialData?.salaryExpectation ?? ""
  );
  const [preferredLocations, setPreferredLocations] = useState(
    initialData?.preferredLocations ?? ""
  );

  // Form submission feedback state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);


  // Skills handlers
  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Industries handlers
  const handleAddIndustry = () => {
    const trimmed = industryInput.trim();
    if (trimmed && !industries.includes(trimmed)) {
      setIndustries([...industries, trimmed]);
      setIndustryInput("");
    }
  };

  const handleIndustryKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddIndustry();
    }
  };

  const handleRemoveIndustry = (industryToRemove: string) => {
    setIndustries(industries.filter((i) => i !== industryToRemove));
  };

  // Add work experience role
  const handleAddRole = () => {
    if (roles.length < 3) {
      setRoles([
        ...roles,
        {
          company: "",
          title: "",
          startDate: "",
          endDate: "",
          current: false,
          responsibilities: "",
        },
      ]);
    }
  };

  const handleUpdateRole = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    setRoles((prevRoles) => {
      const updated = [...prevRoles];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    const payload = {
      fullName,
      email,
      phone,
      location,
      linkedinUrl,
      portfolioUrl,
      workAuthorization,
      currentTitle,
      experienceLevel,
      yearsExperience,
      skills,
      industries,
      roles,
      highestDegree,
      fieldOfStudy,
      institution,
      graduationYear,
      jobTitlesSeeking,
      remotePreference,
      salaryExpectation,
      preferredLocations,
    };

    try {
      const res = await saveProfile(payload);
      if (res.success) {
        setSaveSuccess(true);
        onSave?.(payload);
        setTimeout(() => {
          setSaveSuccess(false);
        }, 5000);
      } else {
        setSaveError(res.error || "Failed to save profile.");
      }
    } catch (err) {
      console.error("[ProfileForm] Save error:", err);
      setSaveError("An unexpected error occurred while saving profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-border rounded-2xl p-6 shadow-xs"
    >
      {/* Card Header */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary">
          Profile Information
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          This context is used to accurately represent you in agent interactions.
        </p>
      </div>

      {/* AI Extraction Feedback Banner */}
      {showExtractedBanner && (
        <div className="mt-4 flex items-start justify-between gap-3 text-sm text-accent bg-accent-muted/40 border border-accent/30 p-4 rounded-xl">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-text-primary text-sm">
                Profile Auto-Filled from Resume
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                AI extracted your details into the fields below. Please review each section, make any necessary edits, and click <strong>Save Profile</strong> when ready.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowExtractedBanner(false)}
            className="text-text-muted hover:text-text-primary cursor-pointer p-1 rounded-md"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <hr className="border-border my-6" />

      {/* ========================================================
          1. PERSONAL INFO SECTION
          ======================================================== */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-text-primary">
          Personal Info
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>

          {/* LinkedIn URL */}
          <div>
            <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>

          {/* Portfolio / GitHub */}
          <div>
            <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
              Portfolio / GitHub
            </label>
            <input
              type="url"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>

          {/* Work Authorization */}
          <div>
            <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
              Work Authorization
            </label>
            <div className="relative">
              <select
                value={workAuthorization}
                onChange={(e) => setWorkAuthorization(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary appearance-none focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent pr-10 cursor-pointer"
              >
                <option value="citizen">Citizen</option>
                <option value="permanent_resident">Permanent Resident</option>
                <option value="visa_required">Visa Required</option>
              </select>
              <ChevronDown className="w-4 h-4 text-text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      <hr className="border-border my-6" />

      {/* ========================================================
          2. PROFESSIONAL INFO SECTION
          ======================================================== */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-text-primary">
          Professional Info
        </h3>

        {/* Current / Recent Job Title */}
        <div>
          <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
            Current/Recent Job Title
          </label>
          <input
            type="text"
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Experience Level */}
          <div>
            <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
              Experience Level
            </label>
            <div className="relative">
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary appearance-none focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent pr-10 cursor-pointer"
              >
                <option value="junior">Junior</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
              </select>
              <ChevronDown className="w-4 h-4 text-text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Years of Experience */}
          <div>
            <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
              Years of Experience
            </label>
            <input
              type="number"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>
        </div>

        {/* Skills Tag Input */}
        <div>
          <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
            Skills
          </label>
          <div className="flex rounded-lg border border-border overflow-hidden bg-surface focus-within:ring-1 focus-within:ring-accent focus-within:border-accent">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Add a skill"
              className="flex-1 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-surface-secondary hover:bg-surface-tertiary text-text-primary text-sm font-medium border-l border-border transition-colors cursor-pointer"
            >
              Add
            </button>
          </div>

          {/* Skill Tag Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-surface border border-border text-text-primary shadow-2xs"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-text-muted hover:text-error transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Industries Worked In */}
        <div>
          <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
            Industries Worked In (Optional)
          </label>
          <div className="flex rounded-lg border border-border overflow-hidden bg-surface focus-within:ring-1 focus-within:ring-accent focus-within:border-accent">
            <input
              type="text"
              value={industryInput}
              onChange={(e) => setIndustryInput(e.target.value)}
              onKeyDown={handleIndustryKeyDown}
              placeholder="E.g. FinTech, Healthcare"
              className="flex-1 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={handleAddIndustry}
              className="px-4 py-2 bg-surface-secondary hover:bg-surface-tertiary text-text-primary text-sm font-medium border-l border-border transition-colors cursor-pointer"
            >
              Add
            </button>
          </div>

          {/* Industry Tag Chips */}
          {industries.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              {industries.map((ind) => (
                <span
                  key={ind}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-surface border border-border text-text-primary shadow-2xs"
                >
                  <span>{ind}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIndustry(ind)}
                    className="text-text-muted hover:text-error transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <hr className="border-border my-6" />

      {/* ========================================================
          3. WORK EXPERIENCE SECTION
          ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">
            Work Experience
          </h3>
          {roles.length < 3 && (
            <button
              type="button"
              onClick={handleAddRole}
              className="text-sm font-medium text-accent hover:text-accent-dark inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add role</span>
            </button>
          )}
        </div>

        {/* Roles list */}
        <div className="space-y-4">
          {roles.map((role, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border-light p-4 sm:p-5 bg-surface-secondary/20 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Company Name */}
                <div>
                  <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={role.company}
                    onChange={(e) =>
                      handleUpdateRole(idx, "company", e.target.value)
                    }
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                  />
                </div>

                {/* Job Title */}
                <div>
                  <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={role.title}
                    onChange={(e) =>
                      handleUpdateRole(idx, "title", e.target.value)
                    }
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={role.startDate}
                      onChange={(e) =>
                        handleUpdateRole(idx, "startDate", e.target.value)
                      }
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent pr-10 transition-colors"
                    />
                    <Calendar className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* End Date */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase">
                      End Date
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-xs text-text-dark font-normal cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={Boolean(role.current)}
                        onChange={(e) =>
                          handleUpdateRole(idx, "current", e.target.checked)
                        }
                        className="rounded border-border text-accent focus:ring-accent cursor-pointer w-3.5 h-3.5 accent-accent"
                      />
                      <span>Currently working here</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    disabled={Boolean(role.current)}
                    value={role.current ? "-------- ----" : (role.endDate ?? "")}
                    onChange={(e) =>
                      handleUpdateRole(idx, "endDate", e.target.value)
                    }
                    placeholder="Month YYYY"
                    className={`w-full border rounded-lg px-3 py-2 text-sm transition-colors ${
                      role.current
                        ? "bg-surface-secondary/60 text-text-muted border-border cursor-not-allowed"
                        : "bg-surface border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                    }`}
                  />
                </div>
              </div>

              {/* Key Responsibilities */}
              <div>
                <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
                  Key Responsibilities
                </label>
                <textarea
                  rows={3}
                  value={role.responsibilities}
                  onChange={(e) =>
                    handleUpdateRole(idx, "responsibilities", e.target.value)
                  }
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent resize-y transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-border my-6" />

      {/* ========================================================
          4. EDUCATION SECTION
          ======================================================== */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-text-primary">
          Education
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Highest Degree */}
          <div>
            <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
              Highest Degree
            </label>
            <div className="relative">
              <select
                value={highestDegree}
                onChange={(e) => setHighestDegree(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary appearance-none focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent pr-10 cursor-pointer"
              >
                <option value="high_school">High School</option>
                <option value="associate">Associate Degree</option>
                <option value="bachelor">Bachelor&apos;s Degree</option>
                <option value="master">Master&apos;s Degree</option>
                <option value="doctorate">Doctorate</option>
              </select>
              <ChevronDown className="w-4 h-4 text-text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Field of Study */}
          <div>
            <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
              Field of Study
            </label>
            <input
              type="text"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>

          {/* Institution Name */}
          <div>
            <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
              Institution Name
            </label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="E.g. State University"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>

          {/* Graduation Year */}
          <div>
            <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
              Graduation Year
            </label>
            <input
              type="text"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              placeholder="YYYY"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>
        </div>
      </section>

      <hr className="border-border my-6" />

      {/* ========================================================
          5. JOB PREFERENCES SECTION
          ======================================================== */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-text-primary">
          Job Preferences
        </h3>

        {/* Job Titles Seeking */}
        <div>
          <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
            Job Titles Seeking
          </label>
          <input
            type="text"
            value={jobTitlesSeeking}
            onChange={(e) => setJobTitlesSeeking(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Remote Preference */}
          <div>
            <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
              Remote Preference
            </label>
            <div className="relative">
              <select
                value={remotePreference}
                onChange={(e) => setRemotePreference(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary appearance-none focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent pr-10 cursor-pointer"
              >
                <option value="any">Any</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">Onsite</option>
              </select>
              <ChevronDown className="w-4 h-4 text-text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Salary Expectation */}
          <div>
            <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
              Salary Expectation (Optional)
            </label>
            <input
              type="text"
              value={salaryExpectation}
              onChange={(e) => setSalaryExpectation(e.target.value)}
              placeholder="E.g. $120k+"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>
        </div>

        {/* Preferred Locations */}
        <div>
          <label className="text-[11px] font-semibold text-text-dark tracking-wider uppercase mb-1.5 block">
            Preferred Locations (Optional)
          </label>
          <input
            type="text"
            value={preferredLocations}
            onChange={(e) => setPreferredLocations(e.target.value)}
            placeholder="E.g. New York, London"
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
        </div>
      </section>

      {/* Save Button & Feedback */}
      <div className="mt-8">
        {saveSuccess && (
          <div className="mb-4 flex items-center gap-2 p-3.5 text-sm text-success bg-success-lightest border border-success-light rounded-xl transition-all">
            <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
            <span className="font-medium">Profile saved successfully!</span>
          </div>
        )}

        {saveError && (
          <div className="mb-4 flex items-center gap-2 p-3.5 text-sm text-error bg-error/10 border border-error/20 rounded-xl transition-all">
            <AlertCircle className="w-5 h-5 text-error shrink-0" />
            <span className="font-medium">{saveError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-accent hover:bg-accent-dark disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-all shadow-sm active:scale-[0.99] text-sm sm:text-base cursor-pointer flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Saving Profile...</span>
            </>
          ) : (
            <span>Save Profile</span>
          )}
        </button>
      </div>
    </form>
  );
}
