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
