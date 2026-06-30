# Smart Resume Reviewer

An AI-powered web application that analyzes resumes/CVs and provides instant, structured feedback on clarity, grammar, ATS-friendliness, and overall impact.

**Live demo:** https://ai-powered-smart-resume-cv-reviewer.onrender.com/

> Note: The app is hosted on Render's free tier, which spins down after 15 minutes of inactivity. The first load after idle time may take 30–60 seconds while the server wakes up.

---

## What It Does

- Upload a resume as a PDF (drag-and-drop or file picker) or paste resume text directly
- Get an overall score plus category scores for **Clarity**, **Grammar**, **ATS Friendliness**, and **Impact**
- View a detailed breakdown grouped by category, with specific issues, exact quoted excerpts from your resume, and concrete suggested fixes
- Automatic OCR fallback for scanned PDFs or design-tool exports (e.g. Canva) that don't contain a real text layer
- Built-in validation that detects and rejects non-resume content before wasting an AI call
- Reset and analyze another resume without reloading the page

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Schema validation | Zod |
| PDF parsing | pdf-parse v2 |
| OCR fallback | Tesseract.js |
| File upload UI | react-dropzone |
| Animated background | Aceternity UI (Background Beams) + Motion |
| AI API | Groq API (Llama 3.3 70B, free tier) |
| Deployment | Render (free tier) |

---

## How It Works

1. The user uploads a PDF or pastes resume text in the browser.
2. The `/api/analyze` route (a Next.js API route, acting as the backend) receives the request.
3. If a PDF was uploaded, text is extracted server-side using `pdf-parse`. If the PDF has no real text layer (scanned or design-tool export), the system automatically falls back to OCR via `tesseract.js`.
4. The extracted (or pasted) text is sent to the Groq API along with a structured prompt asking the model to first verify the text is actually a resume, then return detailed JSON feedback.
5. The AI's JSON response is validated at runtime with a Zod schema (`ResumeFeedbackSchema`) before it's ever shown to the user — malformed or unexpected AI output is caught and a clean error is returned instead of crashing the UI.
6. Validated results are rendered as score cards plus a detailed, per-category breakdown.

---

## Running Locally

### Prerequisites
- Node.js 18+
- A free Groq API key from [console.groq.com](https://console.groq.com)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Harshana-adhi/ai-powered-smart-resume-cv-reviewer.git
   cd ai-powered-smart-resume-cv-reviewer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production build

```bash
npm run build
npm run start
```

---

## Project Structure

```
ai-powered-smart-resume-cv-reviewer/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts        # Backend API route: PDF/text intake, AI call, validation
│   ├── globals.css             # Tailwind + theme variables
│   ├── layout.tsx              # Root layout, fonts
│   └── page.tsx                # Home page, state machine, UI composition
├── components/
│   ├── ui/
│   │   └── background-beams.tsx  # Animated background effect
│   ├── UploadBox.tsx            # Drag-and-drop / paste-text input
│   ├── ScoreCard.tsx            # Category score summary card
│   ├── DetailedFeedback.tsx     # Grouped, detailed issue/fix breakdown
│   └── ResultsView.tsx          # Assembles full results screen
├── lib/
│   ├── extractText.ts           # PDF text extraction + OCR fallback
│   ├── buildPrompt.ts           # Builds the AI prompt
│   └── schema.ts                # Zod schemas and TypeScript types
└── public/
```

---

## Known Limitations

- Free-tier hosting means the app may take 30–60 seconds to respond after periods of inactivity.
- OCR accuracy depends on PDF image quality; heavily stylized resumes may produce noisier results than plain text-based PDFs.
- File size is capped at 2MB to stay within free-tier API token limits.
- This is a single-session, stateless application — no accounts, no saved history.

---

## License

This is a student/portfolio project, built for educational purposes.