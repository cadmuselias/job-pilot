import { Check, X } from "lucide-react";

interface SkillsComparisonProps {
  matchedSkills?: string[];
  missingSkills?: string[];
}

export function SkillsComparison({
  matchedSkills = [],
  missingSkills = [],
}: SkillsComparisonProps) {
  const hasMatched = matchedSkills && matchedSkills.length > 0;
  const hasMissing = missingSkills && missingSkills.length > 0;

  if (!hasMatched && !hasMissing) {
    return null;
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs">
      <h2 className="text-xs font-semibold tracking-wider uppercase text-text-secondary mb-4">
        Required Skills vs Your Profile
      </h2>

      {/* 1. Matched Skills ("You have") */}
      <div>
        <p className="text-xs font-medium text-text-secondary mb-2.5">
          You have
        </p>
        <div className="flex flex-wrap gap-2">
          {hasMatched ? (
            matchedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-success-lightest text-success-foreground border border-success-light/60"
              >
                <Check
                  className="w-3.5 h-3.5 text-success-foreground shrink-0"
                  aria-hidden="true"
                />
                <span>{skill}</span>
              </span>
            ))
          ) : (
            <span className="text-xs text-text-muted italic">
              No matching skills identified
            </span>
          )}
        </div>
      </div>

      {/* 2. Gap Skills ("Gap skills") */}
      <div>
        <p className="text-xs font-medium text-text-secondary mt-5 mb-2.5">
          Gap skills
        </p>
        <div className="flex flex-wrap gap-2">
          {hasMissing ? (
            missingSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-accent-muted text-accent border border-accent/20"
              >
                <X className="w-3.5 h-3.5 text-accent shrink-0" aria-hidden="true" />
                <span>{skill}</span>
              </span>
            ))
          ) : (
            <span className="text-xs text-text-muted italic">
              No skill gaps identified
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
