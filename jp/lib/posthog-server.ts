import { PostHog } from "posthog-node";

export const createPostHogServer = () => {
  const apiKey =
    process.env.NEXT_PUBLIC_POSTHOG_KEY ||
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

  if (!apiKey) {
    throw new Error(
      "NEXT_PUBLIC_POSTHOG_KEY is not defined. Ensure PostHog environment variables are configured.",
    );
  }

  return new PostHog(apiKey, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
    flushAt: 1, // send immediately
    flushInterval: 0, // no batching — Next.js functions are short-lived
  });
};
