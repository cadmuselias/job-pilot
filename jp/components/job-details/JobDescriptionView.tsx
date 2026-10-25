import { FileText } from "lucide-react";

interface JobDescriptionViewProps {
  aboutRole?: string | null;
  responsibilities?: string[];
  requirements?: string[];
  niceToHave?: string[];
  benefits?: string[];
}

export function JobDescriptionView({
  aboutRole,
  responsibilities = [],
  requirements = [],
  niceToHave = [],
  benefits = [],
}: JobDescriptionViewProps) {
  const hasSections =
    (responsibilities && responsibilities.length > 0) ||
    (requirements && requirements.length > 0) ||
    (niceToHave && niceToHave.length > 0) ||
    (benefits && benefits.length > 0);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs">
      <div className="flex items-center gap-2.5 mb-4">
        <FileText className="w-5 h-5 text-text-secondary" aria-hidden="true" />
        <h2 className="text-base font-semibold text-text-primary">
          Job Description
        </h2>
      </div>

      <div className="text-sm text-text-primary leading-relaxed space-y-4">
        {aboutRole && (
          <div className="whitespace-pre-line text-text-primary/95">
            {aboutRole}
          </div>
        )}

        {/* Structured Sections if available */}
        {responsibilities && responsibilities.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold tracking-wider uppercase text-text-secondary mb-2">
              Key Responsibilities
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-text-primary/90 pl-1">
              {responsibilities.map((resp, i) => (
                <li key={i}>{resp}</li>
              ))}
            </ul>
          </div>
        )}

        {requirements && requirements.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold tracking-wider uppercase text-text-secondary mb-2">
              Requirements
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-text-primary/90 pl-1">
              {requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {niceToHave && niceToHave.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold tracking-wider uppercase text-text-secondary mb-2">
              Nice to Have
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-text-primary/90 pl-1">
              {niceToHave.map((nth, i) => (
                <li key={i}>{nth}</li>
              ))}
            </ul>
          </div>
        )}

        {benefits && benefits.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold tracking-wider uppercase text-text-secondary mb-2">
              Benefits
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-text-primary/90 pl-1">
              {benefits.map((ben, i) => (
                <li key={i}>{ben}</li>
              ))}
            </ul>
          </div>
        )}

        {!aboutRole && !hasSections && (
          <p className="text-xs text-text-muted italic">
            No detailed description available for this role.
          </p>
        )}
      </div>
    </div>
  );
}
