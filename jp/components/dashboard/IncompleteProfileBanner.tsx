"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, X } from "lucide-react";

type IncompleteProfileBannerProps = {
  completionPercentage: number;
  missingFieldsCount?: number;
};

export function IncompleteProfileBanner({
  completionPercentage,
  missingFieldsCount = 3,
}: IncompleteProfileBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  // If already 100% complete or dismissed, hide banner
  if (completionPercentage >= 100 || isDismissed) {
    return null;
  }

  return (
    <div className="bg-surface border border-warning/30 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
          <AlertCircle className="w-5 h-5 text-warning" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-text-primary">
              Profile is {completionPercentage}% complete
            </h4>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20">
              {missingFieldsCount} fields remaining
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
            Fill in your key background details to maximize AI match precision and enable automatic resume tailoring.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
        <Link
          href="/profile"
          className="bg-overlay-dark hover:bg-black text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs"
        >
          <span>Complete Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          aria-label="Dismiss banner"
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
