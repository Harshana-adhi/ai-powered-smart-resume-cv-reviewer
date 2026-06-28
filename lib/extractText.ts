// Extracts plain text from an uploaded PDF file (SRS FR3)
// Validates file type and size before parsing (SRS FR4)
// Note: pdf-parse v2 uses the PDFParse class API (different from v1's function-call API)

import { PDFParse } from "pdf-parse";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB, per SRS section 2.5

export class FileValidationError extends Error {}

export async function extractTextFromPdf(file: File): Promise<string> {
  // FR4: validate file type
  if (file.type !== "application/pdf") {
    throw new FileValidationError("Only PDF files are supported.");
  }

  // FR4: validate file size (≤2MB)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new FileValidationError("File size must be 2MB or smaller.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);

  const parser = new PDFParse({ data });
  const result = await parser.getText();
  await parser.destroy();

  return result.text.trim();
}