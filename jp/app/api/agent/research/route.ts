import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { createPostHogServer } from "@/lib/posthog-server";
import { runCompanyResearch } from "@/agent/research";
import type { Job, Profile } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader ? authHeader.replace(/^Bearer\s+/i, "").trim() : undefined;

    let insforge = await createInsforgeServer(bearerToken);
    let {
      data: authData,
      error: authError,
    } = await insforge.auth.getCurrentUser();

    if ((authError || !authData?.user) && bearerToken) {
      insforge = await createInsforgeServer();
      const retryResult = await insforge.auth.getCurrentUser();
      if (retryResult.data?.user) {
        authData = retryResult.data;
        authError = null;
      }
    }

    if (authError || !authData?.user) {
      console.warn("[api/agent/research POST] Auth check failed:", authError?.message || "No user session");
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in to research companies." },
        { status: 401 }
      );
    }

    const userId = authData.user.id;
    const body = await req.json().catch(() => ({}));
    const jobId = typeof body.jobId === "string" ? body.jobId.trim() : "";

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "Missing required jobId parameter." },
        { status: 400 }
      );
    }

    // 1. Fetch job from DB
    const { data: jobData, error: jobError } = await insforge.database
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .eq("user_id", userId)
      .maybeSingle();

    if (jobError || !jobData) {
      return NextResponse.json(
        { success: false, error: "Job posting not found for this user." },
        { status: 404 }
      );
    }

    const job = jobData as Job;

    // 2. Fetch candidate profile from DB
    const { data: profileData } = await insforge.database
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    const profile = (profileData as Profile) || null;

    // 3. Execute company research agent
    const dossier = await runCompanyResearch(job, profile);

    // 4. Update jobs table with company_research jsonb
    const { error: updateError } = await insforge.database
      .from("jobs")
      .update({ company_research: dossier })
      .eq("id", jobId)
      .eq("user_id", userId);

    if (updateError) {
      console.error("[api/agent/research POST] Failed updating job with research:", updateError);
    }

    // 5. Insert agent_log entry
    try {
      await insforge.database.from("agent_logs").insert([
        {
          user_id: userId,
          run_id: job.run_id || null,
          job_id: jobId,
          level: "success",
          message: `Researched ${job.company}: compiled structured dossier with 9 strategic briefing sections.`,
        },
      ]);
    } catch (logErr) {
      console.warn("[api/agent/research POST] Non-fatal agent_log insert error:", logErr);
    }

    // 6. Capture PostHog telemetry
    try {
      const posthog = createPostHogServer();
      posthog.capture({
        distinctId: userId,
        event: "company_researched",
        properties: {
          userId,
          jobId,
          company: job.company,
        },
      });
      await posthog.shutdown();
    } catch (phErr) {
      console.warn("[api/agent/research POST] Non-fatal PostHog tracking error:", phErr);
    }

    return NextResponse.json({
      success: true,
      research: dossier,
    });
  } catch (error: unknown) {
    console.error("[api/agent/research POST] Unexpected error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
