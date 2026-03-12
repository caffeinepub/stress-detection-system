# Stress Detection System

## Current State
The app has three detection pages (Text, Facial, Voice), each showing a stress result and then rendering `<StressManagementSuggestions>` which shows wellness tips (both for stressed and non-stressed cases). There is no AI report, graph dashboard, or PDF download.

## Requested Changes (Diff)

### Add
- `StressReport` component: structured report card showing Detection Method, Detected Emotion, Stress Level (Low/Medium/High), Confidence Score, Possible Causes (contextual list), Recommended Actions (contextual list). Shown after analysis completes on all three detection pages.
- `StressPredictionGraph` component: interactive recharts BarChart or LineChart showing simulated stress history over time (Day 1–7 with Low/Medium/High labels). Displayed below the report.
- PDF download button: "Download Stress Report" — generates a printable PDF using the browser print API (window.print with a hidden styled div) or jsPDF. PDF includes: date/time, detection method, detected emotion, stress level, confidence score, suggested actions, and a text-based graph summary.
- Install `jspdf` for PDF generation.

### Modify
- `TextDetectionPage`, `FacialDetectionPage`, `VoiceDetectionPage`: Replace `<StressManagementSuggestions>` with `<StressReport>` + `<StressPredictionGraph>` below results.
- Each detection page passes the correct `method` prop ("Text Analysis" / "Face Analysis" / "Voice Analysis"), `emotion`, `stressLevel`, and `confidence` to the report component.

### Remove
- Remove `<StressManagementSuggestions>` usage from all three detection pages (the Wellness Maintenance Tips section).
- The `StressManagementSuggestions.tsx` component file can remain but should no longer be imported in detection pages.

## Implementation Plan
1. Install `jspdf` package in frontend.
2. Create `src/frontend/src/utils/stressReport.ts` — helper functions: `getStressLevel(confidence, isStressed)` returning Low/Medium/High, `getPossibleCauses(method, emotion, isStressed)` returning string[], `getRecommendedActions(stressLevel, method)` returning string[].
3. Create `src/frontend/src/components/StressReport.tsx` — styled report card with all fields, PDF download button using jsPDF.
4. Create `src/frontend/src/components/StressPredictionGraph.tsx` — recharts BarChart with 7 simulated days of stress data, numeric Y axis mapped to Low/Medium/High labels, animated, interactive tooltip.
5. Update `TextDetectionPage.tsx` — remove StressManagementSuggestions import/usage, add StressReport + StressPredictionGraph after result.
6. Update `FacialDetectionPage.tsx` — same as above, pass detected emotion from result.
7. Update `VoiceDetectionPage.tsx` — same as above.
