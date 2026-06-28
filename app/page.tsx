"use client";

import { useState } from "react";
import UploadBox from "@/components/UploadBox";
import ResultsView from "@/components/ResultsView";
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
        // FR10: show error message from API (bad file, rate limit, parse error, etc.)
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
    // FR11: reset and analyze a new resume without reloading the page
    setStatus("idle");
    setFeedback(null);
    setErrorMessage(null);
  }

  return (
    <main className="min-h-screen px-4 py-12 sm:py-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Smart Resume Reviewer</h1>
        <p className="text-gray-500 mt-2">
          Get instant AI-powered feedback on clarity, grammar, ATS-friendliness, and impact.
        </p>
      </div>

      {(status === "idle" || status === "loading") && (
        <UploadBox onSubmit={handleSubmit} isLoading={status === "loading"} />
      )}

      {status === "error" && (
        <div className="w-full max-w-xl mx-auto text-center">
          <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
          <button
            type="button"
            onClick={handleReset}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 underline"
          >
            Try again
          </button>
        </div>
      )}

      {status === "success" && feedback && (
        <ResultsView feedback={feedback} onReset={handleReset} />
      )}
    </main>
  );
}