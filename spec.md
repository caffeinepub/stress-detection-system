# Stress Detection System

## Current State
A multi-modal stress detection app with three detection pages (Text, Facial, Voice) and an Evaluation page. Each detection page shows a stress/no-stress result with a confidence score after analysis. No stress management guidance is shown after detection.

## Requested Changes (Diff)

### Add
- A reusable `StressManagementSuggestions` component that renders contextual stress relief tips when stress is detected (or positive wellness tips when not stressed).
- Suggestions tailored by detection method: text-based suggestions differ slightly from facial/voice ones but all cover breathing, exercise, sleep, mindfulness, and social support categories.
- The component appears below the result card on all three detection pages when a result is available.

### Modify
- `TextDetectionPage.tsx` — import and render `StressManagementSuggestions` after the result card.
- `FacialDetectionPage.tsx` — import and render `StressManagementSuggestions` after the stress result card.
- `VoiceDetectionPage.tsx` — import and render `StressManagementSuggestions` after the stress result card.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `src/frontend/src/components/StressManagementSuggestions.tsx` with:
   - Props: `isStressed: boolean`, `method: 'text' | 'facial' | 'voice'`, `confidence: number`
   - When stressed: show 5–6 actionable tips grouped by category (Breathing, Physical Activity, Mindfulness, Sleep, Social Support, Professional Help)
   - When not stressed: show 3 positive reinforcement / wellness maintenance tips
   - Visual: card with a distinct color (amber/orange for stressed, green for not stressed), icons per category
2. Import and place the component at the bottom of results in all three detection pages.
