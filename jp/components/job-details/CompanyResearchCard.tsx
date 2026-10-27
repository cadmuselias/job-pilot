"use client";

import { useState, useEffect, useRef } from "react";
import {
  Building2,
  Search,
  Loader2,
  Sparkles,
  Layers,
  HeartHandshake,
  Target,
  ArrowUpRight,
  HelpCircle,
  BookOpen,
  Globe,
  RotateCw,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import type { CompanyResearchDossier } from "@/types";
import { useAuth } from "@/components/auth/AuthProvider";

interface CompanyResearchCardProps {
  jobId: string;
  company: string;
  initialResearch?: CompanyResearchDossier | null;
}

const PROGRESS_STEPS = [
  "Locating employer website via redirects...",
  "Starting Browserbase cloud session...",
  "Browsing homepage & engineering pages with Stagehand...",
  "Synthesizing 9-part dossier with Gemini AI...",
];

export function CompanyResearchCard({
  jobId,
  company,
  initialResearch = null,
}: CompanyResearchCardProps) {
  const { getToken, refreshUser } = useAuth();
  const [activeResearch, setActiveResearch] = useState<CompanyResearchDossier | null>(null);
  const research = activeResearch ?? initialResearch ?? null;

  const [isResearching, setIsResearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isResearching) {
      stepTimerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) =>
          prev < PROGRESS_STEPS.length - 1 ? prev + 1 : prev
        );
      }, 5500);
    } else {
      if (stepTimerRef.current) {
        clearInterval(stepTimerRef.current);
        stepTimerRef.current = null;
      }
    }

    return () => {
      if (stepTimerRef.current) {
        clearInterval(stepTimerRef.current);
      }
    };
  }, [isResearching]);

  async function handleStartResearch() {
    setIsResearching(true);
    setError(null);
    setCurrentStepIndex(0);

    try {
      let token = await getToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      let response = await fetch("/api/agent/research", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ jobId }),
      });

      // If 401 received, attempt refresh and retry once
      if (response.status === 401) {
        await refreshUser();
        const freshToken = await getToken();
        if (freshToken) {
          token = freshToken;
          headers["Authorization"] = `Bearer ${freshToken}`;
          response = await fetch("/api/agent/research", {
            method: "POST",
            headers,
            credentials: "include",
            body: JSON.stringify({ jobId }),
          });
        }
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Failed conducting company research. Please try again."
        );
      }

      setActiveResearch(data.research);
    } catch (err: unknown) {
      console.error("[CompanyResearchCard] Research error:", err);
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
    } finally {
      setIsResearching(false);
    }
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs transition-all">
      {/* Card Header */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-muted flex items-center justify-center text-accent shrink-0">
            <Building2 className="w-4 h-4 text-accent" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
              Company Research
              {research && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-success-lightest text-success-foreground border border-success-light">
                  Active Dossier
                </span>
              )}
            </h2>
            <p className="text-xs text-text-secondary">
              Real-time public web intelligence & candidate edge briefing
            </p>
          </div>
        </div>

        {/* Action Button */}
        {research ? (
          <button
            type="button"
            onClick={handleStartResearch}
            disabled={isResearching}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-dark text-xs font-medium transition-colors shadow-2xs disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
          >
            {isResearching ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                <span>Re-researching...</span>
              </>
            ) : (
              <>
                <RotateCw className="w-3.5 h-3.5 text-text-muted" />
                <span>Refresh Dossier</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStartResearch}
            disabled={isResearching}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent-dark text-white text-sm font-medium transition-colors shadow-xs disabled:opacity-75 disabled:cursor-not-allowed shrink-0 cursor-pointer"
          >
            {isResearching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Researching...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 text-white" aria-hidden="true" />
                <span>Research Company</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-error/10 border border-error/20 text-error flex items-start gap-2.5 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-error" />
          <div className="flex-1">
            <span className="font-semibold">Research notice: </span>
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={handleStartResearch}
            className="underline font-semibold text-error hover:text-error/80 ml-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* State 1: Active In-Progress Research */}
      {isResearching && (
        <div className="py-10 text-center space-y-4">
          <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-ping opacity-30" />
            <div className="w-12 h-12 rounded-full bg-accent-muted flex items-center justify-center text-accent shadow-xs">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-1">
              Investigating {company}
            </h3>
            <p className="text-xs text-accent font-medium animate-pulse">
              {PROGRESS_STEPS[currentStepIndex]}
            </p>
          </div>
          <p className="text-[11px] text-text-muted max-w-sm mx-auto leading-relaxed">
            Opening a cloud Browserbase session, extracting key engineering
            signals with Stagehand, and formulating talking points with Gemini.
          </p>
        </div>
      )}

      {/* State 2: Empty State (No research conducted yet) */}
      {!isResearching && !research && (
        <div className="py-8 sm:py-10 text-center">
          <div className="w-12 h-12 rounded-xl bg-surface-secondary border border-border-light flex items-center justify-center text-text-muted mx-auto mb-3 shadow-2xs">
            <Building2 className="w-6 h-6 text-text-muted" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">
            No research yet
          </h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed mb-5">
            Click &ldquo;Research Company&rdquo; to launch Browserbase and Gemini.
            The agent will browse{" "}
            <span className="font-medium text-text-primary">{company}</span>&apos;s
            public web presence and compile a customized interview briefing.
          </p>
          <button
            type="button"
            onClick={handleStartResearch}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent-dark text-white text-sm font-medium transition-colors shadow-xs cursor-pointer"
          >
            <Search className="w-4 h-4 text-white" aria-hidden="true" />
            <span>Research Company Now</span>
          </button>
        </div>
      )}

      {/* State 3: Populated 9-Field Dossier */}
      {!isResearching && research && (
        <div className="space-y-6 pt-1">
          {/* 1. Company Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-accent" />
              Company Overview
            </h4>
            <p className="text-sm text-text-primary leading-relaxed bg-surface-secondary/70 p-3.5 rounded-xl border border-border-light">
              {research.companyOverview}
            </p>
          </div>

          {/* 2. Tech Stack */}
          {research.techStack && research.techStack.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-accent" />
                Technologies & Platform
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {research.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-surface-secondary border border-border text-text-dark"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 3. Your Competitive Edge (Highlighted Callout) */}
          {research.yourEdge && research.yourEdge.length > 0 && (
            <div className="bg-accent-muted/60 border border-accent/25 rounded-xl p-4 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Your Competitive Edge for This Role
              </h4>
              <ul className="space-y-1.5">
                {research.yourEdge.map((edge, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-text-dark leading-relaxed flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                    <span>{edge}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4. Why This Role */}
          {research.whyThisRole && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-accent" />
                Why This Role Matters
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed bg-surface-secondary/50 p-3 rounded-lg border border-border-light">
                {research.whyThisRole}
              </p>
            </div>
          )}

          {/* 5. Culture & Working Style */}
          {research.culture && research.culture.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-accent" />
                Team Culture & Working Norms
              </h4>
              <ul className="space-y-1.5">
                {research.culture.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-text-secondary flex items-start gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-text-muted mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 6. Gaps to Address as Strategy */}
          {research.gapsToAddress && research.gapsToAddress.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 flex items-center gap-1.5">
                <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
                How to Reframe Skill Gaps
              </h4>
              <ul className="space-y-1.5">
                {research.gapsToAddress.map((gap, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-text-secondary flex items-start gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-warning mt-1.5 shrink-0" />
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 7. Smart Interview Questions */}
          {research.smartQuestions && research.smartQuestions.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-accent" />
                High-Signal Questions to Ask
              </h4>
              <div className="space-y-1.5">
                {research.smartQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-text-dark bg-surface-secondary/60 p-2.5 rounded-lg border border-border-light flex items-start gap-2"
                  >
                    <span className="font-semibold text-accent shrink-0">
                      Q{idx + 1}:
                    </span>
                    <span className="leading-relaxed">&ldquo;{q}&rdquo;</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. Interview Preparation Topics */}
          {research.interviewPrep && research.interviewPrep.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-accent" />
                Key Interview Prep Topics
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {research.interviewPrep.map((topic, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-text-secondary bg-surface p-2.5 rounded-lg border border-border flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 9. Sources */}
          {research.sources && research.sources.length > 0 && (
            <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-[11px] text-text-muted">
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-text-muted" />
                Sources consulted:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {research.sources.map((src, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-surface-secondary px-2 py-0.5 rounded text-[10px] text-text-secondary border border-border-light truncate max-w-xs"
                    title={src}
                  >
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    {src.startsWith("http")
                      ? new URL(src).hostname.replace(/^www\./, "")
                      : src}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
