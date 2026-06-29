"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB, per SRS section 2.5

type Mode = "upload" | "paste";

interface UploadBoxProps {
  onSubmit: (data: { file?: File; text?: string }) => void;
  isLoading: boolean;
}

function formatFileSize(bytes: number): string {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

export default function UploadBox({ onSubmit, isLoading }: UploadBoxProps) {
  const [mode, setMode] = useState<Mode>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: unknown[]) => {
    setError(null);

    if (rejectedFiles.length > 0) {
      setError("Please upload a single PDF file under 2MB.");
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError("File size must be 2MB or smaller.");
      return;
    }

    setSelectedFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE_BYTES,
    disabled: isLoading,
    noClick: true, // we provide an explicit "Select File" button instead
  });

  function handleSubmit() {
    setError(null);

    if (mode === "upload") {
      if (!selectedFile) {
        setError("Please select a PDF file first.");
        return;
      }
      onSubmit({ file: selectedFile });
    } else {
      if (pastedText.trim().length === 0) {
        setError("Please paste your resume text first.");
        return;
      }
      onSubmit({ text: pastedText });
    }
  }

  function handleClearFile(e: React.MouseEvent) {
    e.stopPropagation();
    setSelectedFile(null);
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Mode toggle */}
      <div className="flex gap-1 mb-5 bg-[#141923] border border-[#232B38] rounded-lg p-1 w-fit mx-auto">
        <button
          type="button"
          onClick={() => setMode("upload")}
          disabled={isLoading}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mode === "upload"
              ? "bg-[#F2A93B] text-[#0B0E14]"
              : "text-[#8B95A3] hover:text-[#E8ECF1]"
          }`}
        >
          Upload PDF
        </button>
        <button
          type="button"
          onClick={() => setMode("paste")}
          disabled={isLoading}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mode === "paste"
              ? "bg-[#F2A93B] text-[#0B0E14]"
              : "text-[#8B95A3] hover:text-[#E8ECF1]"
          }`}
        >
          Paste Text
        </button>
      </div>

      {/* Upload mode */}
      {mode === "upload" && (
        <div
          {...getRootProps()}
          className={`rounded-xl p-8 text-center transition-all ${
            isDragActive
              ? "border-2 border-[#F2A93B] bg-[#2A2114]"
              : selectedFile
              ? "border-2 border-[#34D399] bg-[#0F2419]"
              : "border-2 border-dashed border-[#232B38] bg-[#141923] hover:border-[#3A4456]"
          } ${isLoading ? "opacity-50" : ""}`}
        >
          <input {...getInputProps()} />

          {selectedFile ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#34D399]/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#34D399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-[#E8ECF1]">{selectedFile.name}</p>
                <p className="text-xs text-[#8B95A3]">{formatFileSize(selectedFile.size)} · Ready to analyze</p>
              </div>
              {!isLoading && (
                <button
                  type="button"
                  onClick={handleClearFile}
                  className="ml-2 text-[#8B95A3] hover:text-[#F87171] transition-colors"
                  aria-label="Remove file"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-[#F2A93B]/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-[#F2A93B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm text-[#E8ECF1] mb-1">
                {isDragActive ? "Drop your resume here" : "Drag and drop your resume PDF here"}
              </p>
              <p className="text-xs text-[#8B95A3] mb-4">PDF only, up to 2MB</p>
              <button
                type="button"
                onClick={open}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium rounded-md bg-[#232B38] text-[#E8ECF1] hover:bg-[#2D3645] transition-colors"
              >
                Select File
              </button>
            </>
          )}
        </div>
      )}

      {/* Paste mode */}
      {mode === "paste" && (
        <textarea
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
          disabled={isLoading}
          placeholder="Paste your resume text here..."
          className="w-full h-48 p-4 bg-[#141923] border border-[#232B38] rounded-xl text-sm text-[#E8ECF1] placeholder:text-[#8B95A3] resize-none focus:outline-none focus:ring-2 focus:ring-[#F2A93B]/50 focus:border-[#F2A93B]"
        />
      )}

      {error && (
        <p className="text-sm text-[#F87171] mt-3 text-center">{error}</p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full mt-5 bg-[#F2A93B] text-[#0B0E14] py-2.5 rounded-lg font-semibold hover:bg-[#FFBE5C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isLoading && (
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {isLoading ? "Analyzing..." : "Analyze Resume"}
      </button>
    </div>
  );
}