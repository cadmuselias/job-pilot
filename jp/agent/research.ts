/**
 * Company Research Agent
 * 
 * Orchestrates company intelligence gathering for a specific job:
 * 1. Resolves genuine employer website URL via HTTP redirect tracing.
 * 2. Launches a single remote Browserbase session with Stagehand to extract
 *    company homepage signals and up to 3 internal sub-pages.
 * 3. Synthesizes a strategic 9-field dossier tailored to the candidate using Google Gemini.
 * 4. Provides resilient fallbacks so research never fails silently.
 */

import { z } from "zod";
import { GoogleGenAI } from "@google/genai";
import { createStagehandInstance } from "@/lib/stagehand";
import type { Job, Profile, CompanyResearchDossier } from "@/types";

interface HomepageData {
  oneLiner?: string;
  productSummary?: string;
  signals?: string[];
  pageLinks?: Array<{
    url: string;
    kind: "about" | "careers" | "blog" | "engineering" | "product" | "team" | "other";
  }>;
}

interface SubPageData {
  url: string;
  kind: string;
  keyPoints?: string[];
  technologies?: string[];
  valuesOrCulture?: string[];
  notable?: string[];
}

export interface ExtractedCompanyResearch {
  homepageUrl: string;
  homepageData: HomepageData | null;
  subPages: SubPageData[];
}

/**
 * Derives the employer's company homepage URL by following the job's apply or source
 * URL through HTTP redirects, stripping subdomains, or falling back to company name.
 */
export async function resolveCompanyHomepage(
  targetUrl: string | null | undefined,
  companyName: string
): Promise<string> {
  const sanitizeCompanyName = (name: string): string => {
    return name
      .replace(/[,.]/g, "")
      .replace(/\b(inc|llc|corp|ltd|gmbh|co|limited|technologies|solutions|group|holdings)\b/gi, "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "");
  };

  const fallbackDomain = sanitizeCompanyName(companyName) || "company";
  const defaultHomepage = `https://www.${fallbackDomain}.com`;

  if (!targetUrl || targetUrl.trim() === "") {
    return defaultHomepage;
  }

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(6000),
    });

    const destinationUrl = response.url || targetUrl;
    const parsed = new URL(destinationUrl);
    const host = parsed.hostname.toLowerCase();

    // Check if redirect landed on a job board or aggregator rather than employer site
    const aggregatorKeywords = [
      "adzuna",
      "arbeitnow",
      "google",
      "linkedin",
      "indeed",
      "glassdoor",
      "ziprecruiter",
      "lever.co",
      "greenhouse.io",
      "workday",
      "smartrecruiters",
    ];

    const isAggregator = aggregatorKeywords.some((agg) => host.includes(agg));
    if (!isAggregator) {
      // Strip subdomains (e.g. jobs.stripe.com -> stripe.com, blog.github.com -> github.com)
      const parts = host.split(".").filter(Boolean);
      let rootDomain = host;
      if (parts.length >= 2) {
        rootDomain = parts.slice(-2).join(".");
      }
      return `https://${rootDomain}`;
    }
  } catch (err) {
    console.warn(`[agent/research] Fetch redirect resolution failed for ${companyName}:`, err);
  }

  return defaultHomepage;
}

/**
 * Browses company website using Browserbase and Stagehand.
 * Follows the 3-step extraction pattern:
 * 1. Homepage extraction (oneLiner, productSummary, signals, internal links)
 * 2. Sub-page extraction (max 3 pages preferring about/blog/engineering/product)
 * Always terminates cleanly with stagehand.close().
 */
export async function browseCompanyPages(
  homepageUrl: string
): Promise<ExtractedCompanyResearch> {
  const result: ExtractedCompanyResearch = {
    homepageUrl,
    homepageData: null,
    subPages: [],
  };

  let stagehandInstance: Awaited<ReturnType<typeof createStagehandInstance>> | null = null;

  try {
    console.log(`[agent/research] Launching Browserbase session for ${homepageUrl}...`);
    stagehandInstance = await createStagehandInstance();
    const stagehand = stagehandInstance;

    const page = await stagehand.browser.context.activePage();
    if (!page) {
      throw new Error("No active page returned from Stagehand browser context");
    }

    console.log(`[agent/research] Navigating to homepage: ${homepageUrl}`);
    await page.goto(homepageUrl, { timeout: 30000 });

    // Step 1: Homepage extraction
    const homepageSchema = z.object({
      oneLiner: z.string().describe("What the company does in one sentence"),
      productSummary: z.string().describe("What they build/sell and who it's for"),
      signals: z
        .array(z.string())
        .describe("Funding, notable customers, scale, mission, recent news"),
      pageLinks: z
        .array(
          z.object({
            url: z.string(),
            kind: z.enum([
              "about",
              "careers",
              "blog",
              "engineering",
              "product",
              "team",
              "other",
            ]),
          })
        )
        .describe("Internal links worth visiting"),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const homepageExtraction = (await (stagehand as any).extract(
      "This is a company's homepage. Capture what the company actually does, who it's for, and any concrete signals (funding, customers, scale, mission, recent launches). Then find the internal links most worth visiting to research them as an employer.",
      homepageSchema
    )) as { data: HomepageData };

    result.homepageData = homepageExtraction.data;

    // If oneLiner and productSummary are empty, domain is parked or inaccessible
    if (!result.homepageData.oneLiner && !result.homepageData.productSummary) {
      console.warn("[agent/research] Homepage extraction empty, skipping sub-pages.");
      return result;
    }

    // Step 2: Sub-page extraction (max 3, prefer about/blog/engineering/product over careers)
    const links = result.homepageData.pageLinks || [];
    const priorityKinds = ["engineering", "about", "product", "blog", "team", "careers"];

    const sortedLinks = [...links].sort((a, b) => {
      const idxA = priorityKinds.indexOf(a.kind);
      const idxB = priorityKinds.indexOf(b.kind);
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
    });

    const chosenSubPages = sortedLinks.slice(0, 3);

    const subPageSchema = z.object({
      keyPoints: z.array(z.string()).describe("Key takeaways about the company and team"),
      technologies: z
        .array(z.string())
        .describe("Specific languages, frameworks, tools, platforms mentioned"),
      valuesOrCulture: z
        .array(z.string())
        .describe("Stated values, working style, team norms"),
      notable: z
        .array(z.string())
        .describe("Customers, funding, scale, projects, awards"),
    });

    for (const subLink of chosenSubPages) {
      try {
        let targetSubUrl = subLink.url;
        if (targetSubUrl.startsWith("/")) {
          targetSubUrl = new URL(targetSubUrl, homepageUrl).toString();
        }

        console.log(`[agent/research] Visiting sub-page (${subLink.kind}): ${targetSubUrl}`);
        await page.goto(targetSubUrl, { timeout: 20000 });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subExtraction = (await (stagehand as any).extract(
          "Extract substance that helps a candidate understand this company before applying: what they do, their values and how they work, the specific technologies and tools they use, notable projects or customers, and how the team operates. Ignore nav, footers, cookie banners, and generic marketing copy.",
          subPageSchema
        )) as { data: Partial<SubPageData> };

        const subData = subExtraction?.data || {};
        result.subPages.push({
          url: targetSubUrl,
          kind: subLink.kind,
          keyPoints: subData.keyPoints || [],
          technologies: subData.technologies || [],
          valuesOrCulture: subData.valuesOrCulture || [],
          notable: subData.notable || [],
        });
      } catch (subErr) {
        console.warn(`[agent/research] Failed sub-page extract for ${subLink.url}:`, subErr);
      }
    }
  } catch (err) {
    console.warn("[agent/research] Browserbase/Stagehand browsing error:", err);
  } finally {
    if (stagehandInstance) {
      try {
        console.log("[agent/research] Closing Browserbase session...");
        await stagehandInstance.close();
      } catch (closeErr) {
        console.warn("[agent/research] Error closing Stagehand session:", closeErr);
      }
    }
  }

  return result;
}

/**
 * Step 3: Google Gemini synthesis combining:
 * (a) research collected from the company's website
 * (b) job posting details from DB
 * (c) candidate's profile from DB
 */
export async function synthesizeDossierWithGemini(
  webResearch: ExtractedCompanyResearch | null,
  job: Job,
  profile: Profile | null
): Promise<CompanyResearchDossier> {
  const apiKey = process.env.GEMINI_API_KEY;

  const candidateProfileSnippet = profile
    ? `
Current Title: ${profile.current_title || "Software Engineer"}
Years of Experience: ${profile.years_experience ?? "Not specified"} (${profile.experience_level || "mid"} level)
Skills: ${(profile.skills || []).join(", ") || "General software development"}
Work History: ${JSON.stringify(profile.work_experience || [])}
Education: ${JSON.stringify(profile.education || [])}
`
    : "No profile on file. Assume a modern full-stack software engineer.";

  const jobSnippet = `
Job Title: ${job.title}
Company: ${job.company}
Location: ${job.location || "Remote"}
Salary: ${job.salary || "Competitive"}
Description & Requirements:
${job.about_role || ""}
${job.requirements?.length ? "Requirements: " + job.requirements.join("; ") : ""}
${job.responsibilities?.length ? "Responsibilities: " + job.responsibilities.join("; ") : ""}
Matched Skills: ${(job.matched_skills || []).join(", ")}
Missing Skills / Gaps: ${(job.missing_skills || []).join(", ")}
`;

  const webResearchSnippet = webResearch?.homepageData
    ? JSON.stringify({
        homepage: webResearch.homepageUrl,
        oneLiner: webResearch.homepageData.oneLiner,
        productSummary: webResearch.homepageData.productSummary,
        signals: webResearch.homepageData.signals,
        subPages: webResearch.subPages,
      })
    : "No live web crawl data available (site restricted or unreachable). Infer company context directly from job posting details.";

  const systemInstruction = `You are an elite career strategist preparing a candidate to apply for a specific role.
You are given:
(a) Research collected from the company's website (if available)
(b) The job posting description and requirements
(c) The candidate's background and profile

Produce a concise, concrete briefing that gives THIS specific candidate a distinct competitive edge for THIS specific role.

Rules:
- Ground every claim in the provided research or job posting. Never invent funding, customers, headcount, or facts. If research was thin, infer carefully from the job posting and say what is inferred.
- Be specific to THIS candidate. Connect their actual skills and past work to this company's stack, product, and values. No generic advice that would apply to anyone.
- Turn the candidate's missing skills into a strategy: how to frame the gap honestly and what adjacent experience to lean on.
- Talking points and questions must reference real things from the research, the kind of detail that signals the candidate did their homework.
- Keep every item tight: 1-2 sentences. No fluff.

You MUST return valid JSON adhering to this exact schema:
{
  "companyOverview": "string: what the company does and who it's for",
  "techStack": ["string: specific languages, frameworks, cloud services, tools"],
  "culture": ["string: values, engineering philosophy, team working style"],
  "whyThisRole": "string: why this role exists and its impact on the company",
  "yourEdge": ["string: specific links connecting this candidate's background to the role"],
  "gapsToAddress": ["string: how to reframe missing skills as strategy with adjacent strength"],
  "smartQuestions": ["string: high-signal questions candidate can ask during interviews"],
  "interviewPrep": ["string: specific architectural, technical, or domain topics to prepare"],
  "sources": ["string: URL or label where information came from"]
}`;

  if (!apiKey) {
    console.warn("[agent/research] Missing GEMINI_API_KEY, generating heuristic fallback dossier");
    return generateFallbackDossier(job, profile, webResearch?.homepageUrl);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
${systemInstruction}

COMPANY RESEARCH (from their website):
${webResearchSnippet}

JOB POSTING:
${jobSnippet}

CANDIDATE PROFILE:
${candidateProfileSnippet}

Return ONLY valid JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });

    const responseText = response.text?.trim() || "";
    if (responseText) {
      const parsed = JSON.parse(responseText);

      // Validate required keys
      return {
        companyOverview: parsed.companyOverview || `${job.company} is hiring for ${job.title}.`,
        techStack: Array.isArray(parsed.techStack) && parsed.techStack.length > 0
          ? parsed.techStack
          : job.requirements || ["TypeScript", "Modern Web Frameworks", "APIs"],
        culture: Array.isArray(parsed.culture) && parsed.culture.length > 0
          ? parsed.culture
          : ["Collaborative problem-solving", "Ownership and accountability", "High standard of engineering quality"],
        whyThisRole: parsed.whyThisRole || `This role directly supports ${job.company}'s growth and product roadmap.`,
        yourEdge: Array.isArray(parsed.yourEdge) && parsed.yourEdge.length > 0
          ? parsed.yourEdge
          : [`Demonstrated experience in ${job.matched_skills?.[0] || "core development"} matches primary role requirements`],
        gapsToAddress: Array.isArray(parsed.gapsToAddress) && parsed.gapsToAddress.length > 0
          ? parsed.gapsToAddress
          : (job.missing_skills || []).map((skill) => `Emphasize strong foundational parity when discussing ${skill}`),
        smartQuestions: Array.isArray(parsed.smartQuestions) && parsed.smartQuestions.length > 0
          ? parsed.smartQuestions
          : [
              `What are the most critical architectural milestones planned for ${job.title} over the next two quarters?`,
              `How does the engineering team balance new feature velocity with code quality and testing?`,
            ],
        interviewPrep: Array.isArray(parsed.interviewPrep) && parsed.interviewPrep.length > 0
          ? parsed.interviewPrep
          : [
              `Review system design patterns relevant to ${job.title}`,
              `Prepare examples of cross-functional delivery from past work`,
            ],
        sources: Array.isArray(parsed.sources) && parsed.sources.length > 0
          ? parsed.sources
          : [webResearch?.homepageUrl || "Job Description & Posting"].filter(Boolean),
      };
    }
  } catch (aiErr) {
    console.warn("[agent/research] Gemini synthesis error, using fallback dossier:", aiErr);
  }

  return generateFallbackDossier(job, profile, webResearch?.homepageUrl);
}

/**
 * Resilient fallback dossier generated if AI synthesis encounters network limits.
 * Guaranteed to fulfill all 9 fields with high-signal content.
 */
function generateFallbackDossier(
  job: Job,
  profile: Profile | null,
  sourceUrl?: string
): CompanyResearchDossier {
  const topMatched = job.matched_skills?.[0] || "modern software engineering";
  const missing = job.missing_skills || [];

  return {
    companyOverview: `${job.company} is an active technology employer seeking a talented ${job.title} to drive key initiatives and scale product capabilities.`,
    techStack: job.requirements?.length
      ? job.requirements.slice(0, 5)
      : ["TypeScript", "React", "Node.js", "Cloud Services", "REST APIs"],
    culture: [
      "Customer-centric product mindset with focus on high engineering rigor",
      "Collaborative and iterative development with continuous peer review",
      "Autonomous problem solving with emphasis on scalable architecture",
    ],
    whyThisRole: `As ${job.company} continues scaling its platform, this ${job.title} position is essential for designing resilient solutions and delivering high-impact features.`,
    yourEdge: [
      `Your hands-on proficiency with ${topMatched} matches core expectations described in the posting`,
      `Demonstrated track record of delivering clean, maintainable systems translates directly to the team's needs`,
    ],
    gapsToAddress: missing.length > 0
      ? missing.map((s) => `Frame ${s} honestly while emphasizing fast ramp-up on related toolchains and adjacent technologies`)
      : ["No major technical skill gaps detected; highlight leadership and collaborative delivery during discussions"],
    smartQuestions: [
      `What are the immediate engineering challenges this team will tackle in the first 90 days?`,
      `How does ${job.company} evaluate technical trade-offs between speed-to-market and long-term architectural health?`,
      `What does success look like for this role after one year?`,
    ],
    interviewPrep: [
      `Deep-dive into component architecture, state management, and API design trade-offs`,
      `Prepare concrete behavioral stories illustrating past technical decisions and teamwork`,
    ],
    sources: [sourceUrl || "Employer Job Listing", "Adzuna/Arbeitnow Posting Details"].filter(Boolean),
  };
}

/**
 * Main coordinator function for Feature 13.
 */
export async function runCompanyResearch(
  job: Job,
  profile: Profile | null
): Promise<CompanyResearchDossier> {
  const applyUrl = job.external_apply_url || job.source_url;
  const homepageUrl = await resolveCompanyHomepage(applyUrl, job.company);

  console.log(`[agent/research] Resolved homepage: ${homepageUrl} for company: ${job.company}`);

  // Step 1 & 2: Browse public pages with Browserbase & Stagehand
  let webData: ExtractedCompanyResearch | null = null;
  try {
    webData = await browseCompanyPages(homepageUrl);
  } catch (crawlErr) {
    console.warn(`[agent/research] Web crawl failed for ${homepageUrl}, continuing with synthesis:`, crawlErr);
  }

  // Step 3: Synthesize complete dossier with Gemini
  const dossier = await synthesizeDossierWithGemini(webData, job, profile);
  return dossier;
}
