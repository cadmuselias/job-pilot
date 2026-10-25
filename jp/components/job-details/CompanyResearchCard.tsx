import { Building2, Search } from "lucide-react";

interface CompanyResearchCardProps {
  company: string;
}

export function CompanyResearchCard({ company }: CompanyResearchCardProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs">
      {/* Card Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-muted flex items-center justify-center text-accent shrink-0">
            <Building2 className="w-4 h-4 text-accent" aria-hidden="true" />
          </div>
          <h2 className="text-base font-semibold text-text-primary">
            Company Research
          </h2>
        </div>

        {/* Research Company Trigger Button (Phase 4 Feature 12 placeholder for Feature 13 agent) */}
        <button
          type="button"
          disabled
          title="Company research agent will be active in Feature 13"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent-dark text-white text-sm font-medium transition-colors shadow-xs opacity-90 cursor-not-allowed shrink-0"
        >
          <Search className="w-4 h-4 text-white" aria-hidden="true" />
          <span>Research Company</span>
        </button>
      </div>

      {/* Empty State */}
      <div className="py-6 sm:py-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-surface-secondary border border-border-light flex items-center justify-center text-text-muted mx-auto mb-3">
          <Building2 className="w-6 h-6 text-text-muted" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-semibold text-text-primary mb-1">
          No research yet
        </h3>
        <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
          Click &ldquo;Research Company&rdquo; to let the AI browse{" "}
          <span className="font-medium text-text-primary">{company}</span>&apos;s
          public pages and build a dossier.
        </p>
      </div>
    </div>
  );
}
