import Browserbase from "@browserbasehq/sdk";

/**
 * Returns a configured Browserbase client instance.
 * Credentials read from environment variables.
 */
export function getBrowserbaseClient(): Browserbase {
  const apiKey = process.env.BROWSERBASE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing BROWSERBASE_API_KEY environment variable");
  }
  return new Browserbase({ apiKey });
}

/**
 * Creates a single Browserbase cloud browser session with a 120s timeout.
 */
export async function createResearchSession(timeoutSeconds: number = 120) {
  const bb = getBrowserbaseClient();
  const projectId = process.env.BROWSERBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error("Missing BROWSERBASE_PROJECT_ID environment variable");
  }

  const session = await bb.sessions.create(
    { projectId },
    { timeout: timeoutSeconds * 1000 }
  );

  return session;
}
