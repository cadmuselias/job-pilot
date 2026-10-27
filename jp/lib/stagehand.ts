import { Stagehand, browserbase } from "@browserbasehq/stagehand";

/**
 * Initializes a Stagehand instance backed by a Browserbase cloud browser.
 * Uses Google Gemini for browser-level action and extraction intelligence.
 */
export async function createStagehandInstance(sessionId?: string): Promise<Stagehand> {
  const apiKey = process.env.BROWSERBASE_API_KEY;
  const projectId = process.env.BROWSERBASE_PROJECT_ID;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || !projectId) {
    throw new Error("Missing BROWSERBASE_API_KEY or BROWSERBASE_PROJECT_ID in environment variables");
  }

  const browser = sessionId
    ? await browserbase.connect({ sessionId, apiKey })
    : await browserbase.launch({ apiKey, projectId });

  const stagehand = await Stagehand.create({
    browser,
    model: geminiKey
      ? {
          modelName: "google/gemini-2.5-flash",
          apiKey: geminiKey,
        }
      : undefined,
  });

  return stagehand;
}
