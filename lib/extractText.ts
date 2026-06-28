// Extracts plain text from an uploaded PDF file (SRS FR3)
// Validates file type and size before parsing (SRS FR4)
// Falls back to OCR (tesseract.js) when the PDF has no real text layer
// (e.g. scanned PDFs or design-tool exports like Canva) — internal stretch feature, not in SRS v1.0

import { PDFParse } from "pdf-parse";
import { createWorker } from "tesseract.js";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB, per SRS section 2.5
const MIN_VALID_TEXT_LENGTH = 20; // below this, treat as "no extractable text"

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

  try {
    // First attempt: normal text-layer extraction
    const textResult = await parser.getText();
    const extractedText = textResult.text.trim();

    if (extractedText.length >= MIN_VALID_TEXT_LENGTH) {
      return extractedText;
    }

    // Fallback: no real text layer found — try OCR on rendered page images
    const ocrText = await extractTextViaOcr(parser);
    return ocrText;
  } finally {
    await parser.destroy();
  }
}

async function extractTextViaOcr(parser: PDFParse): Promise<string> {
  const screenshotResult = await parser.getScreenshot({
    scale: 2, // higher resolution improves OCR accuracy
    imageBuffer: true,
    imageDataUrl: false,
  });

  const worker = await createWorker("eng");
  let combinedText = "";

  try {
    for (const page of screenshotResult.pages) {
      if (!page.data) continue;
      const { data } = await worker.recognize(Buffer.from(page.data));
      combinedText += data.text + "\n";
    }
  } finally {
    await worker.terminate();
  }

  return combinedText.trim();
}