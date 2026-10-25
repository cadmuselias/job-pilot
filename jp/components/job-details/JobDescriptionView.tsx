"use client";

import { useState } from "react";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";

interface JobDescriptionViewProps {
  aboutRole?: string | null;
  responsibilities?: string[];
  requirements?: string[];
  niceToHave?: string[];
  benefits?: string[];
}

/**
 * Cleans severed trailing word fragments (e.g. "hospitali...")
 * caused by character-boundary truncations in legacy records.
 */
function cleanSeveredEnding(text: string): string {
  if (!text) return "";
  const trimmed = text.trim();

  // If text ends with an ellipsis preceded by a partial word, trim back to the last complete sentence
  if (trimmed.endsWith("...")) {
    const raw = trimmed.slice(0, -3).trim();
    const lastPeriod = raw.lastIndexOf(".");
    if (lastPeriod > 80) {
      return raw.slice(0, lastPeriod + 1).trim();
    }
    // If no clean period, cut at last word boundary
    const lastSpace = raw.lastIndexOf(" ");
    if (lastSpace > 40) {
      return raw.slice(0, lastSpace).trim() + ".";
    }
  }

  return trimmed;
}

export function JobDescriptionView({
  aboutRole,
  responsibilities = [],
  requirements = [],
  niceToHave = [],
  benefits = [],
}: JobDescriptionViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const cleanedRole = aboutRole ? cleanSeveredEnding(aboutRole) : "";
  const isLong = (cleanedRole.length ?? 0) > 320;

  // Derive preview excerpt when collapsed
  let previewText = cleanedRole;
  if (isLong && !isExpanded) {
    const slice = cleanedRole.slice(0, 320);
    const lastPeriod = slice.lastIndexOf(".");
    if (lastPeriod > 140) {
      previewText = slice.slice(0, lastPeriod + 1).trim();
    } else {
      const lastSpace = slice.lastIndexOf(" ");
      previewText = (lastSpace > 80 ? slice.slice(0, lastSpace) : slice).trim() + "...";
    }
  }

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
        {cleanedRole && (
          <div>
            <div className="whitespace-pre-line text-text-primary/95">
              {isExpanded ? cleanedRole : previewText}
            </div>

            {isLong && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-dark transition-colors cursor-pointer"
              >
                <span>{isExpanded ? "Show Less" : "Read Full Description"}</span>
                {isExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                )}
              </button>
            )}
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

        {!cleanedRole && !hasSections && (
          <p className="text-xs text-text-muted italic">
            No detailed description available for this role.
          </p>
        )}
      </div>
    </div>
  );
}
