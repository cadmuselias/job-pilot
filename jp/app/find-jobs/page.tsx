import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { FindJobsView } from "@/components/find-jobs/FindJobsView";

export const metadata: Metadata = {
  title: "Find Jobs | JobPilot",
  description:
    "Explore AI-matched job opportunities discovered and scored against your professional profile.",
};

export default function FindJobsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FindJobsView />
      </main>
    </div>
  );
}
