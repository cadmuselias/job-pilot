import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { runJobDiscovery } from "@/agent/job-discovery";

export async function POST(req: NextRequest) {
  try {
    const insforge = await createInsforgeServer();
    const {
      data: authData,
      error: authError,
    } = await insforge.auth.getCurrentUser();

    if (authError || !authData?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in to search for jobs." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const jobTitle = typeof body.jobTitle === "string" ? body.jobTitle : "";
    const location = typeof body.location === "string" ? body.location : "";

    const result = await runJobDiscovery({
      userId: authData.user.id,
      jobTitle,
      location,
      insforgeServer: insforge,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed discovering jobs. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("[api/agent/find] Route handler error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function GET() {
  try {
    const insforge = await createInsforgeServer();
    const {
      data: authData,
      error: authError,
    } = await insforge.auth.getCurrentUser();

    if (authError || !authData?.user) {
      return NextResponse.json({ success: true, jobs: [] });
    }

    const { data: dbJobs, error: dbError } = await insforge.database
      .from("jobs")
      .select("*")
      .eq("user_id", authData.user.id)
      .order("found_at", { ascending: false });

    if (dbError) {
      console.error("[api/agent/find GET] DB error:", dbError);
      return NextResponse.json({ success: false, error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, jobs: dbJobs || [] });
  } catch (error: unknown) {
    console.error("[api/agent/find GET] Unexpected error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
