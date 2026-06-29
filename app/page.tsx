"use client";

import { useState } from "react";
import UploadBox from "@/components/UploadBox";
import ResultsView from "@/components/ResultsView";
import { BackgroundBeams } from "@/components/ui/background-beams";
import type { ResumeFeedback } from "@/lib/schema";

type Status = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState<ResumeFeedback | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit({ file, text }: { file?: File; text?: string }) {
    setStatus("loading");
    setErrorMessage(null);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (text) formData.append("text", text);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setFeedback(data as ResumeFeedback);
      setStatus("success");
    } catch (err) {
      console.error("Network or unexpected error:", err);
      setErrorMessage("Could not reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  }

  function handleReset() {
    setStatus("idle");
    setFeedback(null);
    setErrorMessage(null);
  }

  return (
    <main className="min-h-screen px-4 py-16 sm:py-24 relative overflow-hidden">
      <BackgroundBeams className="opacity-60" />

      <div className="text-center mb-12 relative z-10">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#8B95A3] mb-3">
          AI-Powered Review
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#E8ECF1] mb-3">
          Smart Resume Reviewer
        </h1>
        <p className="text-[#8B95A3] max-w-md mx-auto mb-3">
          Upload your resume and get instant feedback on clarity, grammar, ATS-friendliness, and impact.
        </p>
        <p className="text-xs text-[#8B95A3]/70 flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Powered by Groq &middot; Llama 3.3
        </p>
      </div>

      <div className="relative z-10">
        {(status === "idle" || status === "loading") && (
          <UploadBox onSubmit={handleSubmit} isLoading={status === "loading"} />
        )}

        {status === "error" && (
          <div className="w-full max-w-xl mx-auto text-center">
            <div className="border border-[#4A2228] bg-[#2A1418] rounded-lg p-4 mb-4">
              <p className="text-sm text-[#F87171]">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-sm font-medium text-[#F2A93B] hover:text-[#FFBE5C] underline"
            >
              Try again
            </button>
          </div>
        )}

        {status === "success" && feedback && (
          <ResultsView feedback={feedback} onReset={handleReset} />
        )}
      </div>
    </main>
  );
}