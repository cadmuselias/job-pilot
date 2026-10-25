import { Sparkles } from "lucide-react";

interface MatchReasoningProps {
  reason?: string | null;
}

export function MatchReasoning({ reason }: MatchReasoningProps) {
  if (!reason?.trim()) {
    return null;
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs">
      <div className="flex items-center gap-2.5 mb-3.5">
        <div className="w-7 h-7 rounded-lg bg-success-lightest flex items-center justify-center text-success-alt shrink-0">
          <Sparkles className="w-4 h-4 text-success-alt" aria-hidden="true" />
        </div>
        <h2 className="text-xs font-semibold tracking-wider uppercase text-text-secondary">
          AI Match Reasoning
        </h2>
      </div>

      <p className="text-sm font-normal text-text-primary leading-relaxed">
        {reason}
      </p>
    </div>
  );
}
