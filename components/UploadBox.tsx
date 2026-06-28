"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB, per SRS section 2.5

type Mode = "upload" | "paste";

interface UploadBoxProps {
  onSubmit: (data: { file?: File; text?: string }) => void;
  isLoading: boolean;
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE_BYTES,
    disabled: isLoading,
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

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            mode === "upload"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          disabled={isLoading}
        >
          Upload PDF
        </button>
        <button
          type="button"
          onClick={() => setMode("paste")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            mode === "paste"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          disabled={isLoading}
        >
          Paste Text
        </button>
      </div>

      {/* Upload mode */}
      {mode === "upload" && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input {...getInputProps()} />
          {selectedFile ? (
            <p className="text-sm text-gray-700">
              Selected: <span className="font-medium">{selectedFile.name}</span>
            </p>
          ) : isDragActive ? (
            <p className="text-sm text-blue-600">Drop the PDF here...</p>
          ) : (
            <p className="text-sm text-gray-500">
              Drag and drop a PDF here, or click to select (max 2MB)
            </p>
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
          className="w-full h-48 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Analyzing..." : "Analyze Resume"}
      </button>
    </div>
  );
}