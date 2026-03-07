import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  Mic,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import StressManagementSuggestions from "../components/StressManagementSuggestions";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { useProcessVoiceAnalysis } from "../hooks/useQueries";
import {
  type VoiceAnalysisResult,
  analyzeVoiceStress,
} from "../utils/voiceAnalysis";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function VoiceDetectionPage() {
  const [result, setResult] = useState<VoiceAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedAudio, setUploadedAudio] = useState<{
    blob: Blob;
    url: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processVoiceMutation = useProcessVoiceAnalysis();

  const {
    recordingState,
    audioBlob,
    audioUrl,
    duration,
    error,
    isRecording,
    isStopped,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const activeAudioBlob = audioBlob || uploadedAudio?.blob || null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedAudio({ blob: file, url: URL.createObjectURL(file) });
    setResult(null);
    resetRecording();
  };

  const handleAnalyze = async () => {
    if (!activeAudioBlob) return;
    setIsAnalyzing(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 1200));
    const analysis = await analyzeVoiceStress(activeAudioBlob);
    setResult(analysis);
    try {
      await processVoiceMutation.mutateAsync({
        isStressed: analysis.isStressed,
        confidence: analysis.confidence,
      });
    } catch {
      /* silent */
    }
    setIsAnalyzing(false);
  };

  const _handleReset = () => {
    resetRecording();
    setUploadedAudio(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const hasAudio = !!activeAudioBlob;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center shadow-sm ring-1 ring-sky-200 dark:ring-sky-800">
            <Mic className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Voice-Based Stress Detection
            </h1>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-0.5">
              MFCC Features + Logistic Regression
            </p>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed text-[15px]">
          Record your voice or upload an audio file to extract MFCC acoustic
          features and classify stress levels using Logistic Regression on vocal
          pattern analysis.
        </p>
      </div>

      {/* ── Pipeline Steps ──────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-7">
        {[
          "1. Audio Capture",
          "2. Signal Processing",
          "3. MFCC Extraction",
          "4. Feature Normalization",
          "5. LR Classification",
        ].map((step) => (
          <span
            key={step}
            className="text-xs px-3 py-1.5 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 ring-1 ring-sky-200 dark:ring-sky-800 rounded-full font-semibold"
          >
            {step}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          {/* Microphone Recording */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Mic className="w-4 h-4 text-sky-500" />
              Microphone Recording
            </h3>

            {/* Recording Visualizer */}
            <div
              className={`flex items-center justify-center h-28 rounded-xl mb-4 transition-all ${
                isRecording
                  ? "bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800"
                  : "bg-muted/30 border-2 border-dashed border-border"
              }`}
            >
              {isRecording ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-end gap-1">
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-red-500 rounded-full animate-pulse"
                        style={{
                          height: `${18 + Math.sin(i * 1.2) * 14}px`,
                          animationDelay: `${i * 0.12}s`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-lg font-bold text-red-600 dark:text-red-400">
                    {formatDuration(duration)}
                  </span>
                  <span className="text-xs text-red-500 animate-pulse font-medium">
                    ● Recording…
                  </span>
                </div>
              ) : isStopped && audioUrl ? (
                <div className="flex flex-col items-center gap-2 w-full px-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-foreground font-medium">
                      Recording complete ({formatDuration(duration)})
                    </span>
                  </div>
                  {/* biome-ignore lint/a11y/useMediaCaption: user's own recorded audio */}
                  <audio src={audioUrl} controls className="w-full h-8 mt-1" />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                  <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center">
                    <Mic className="w-5 h-5 opacity-50" />
                  </div>
                  <span className="text-xs">Press record to start</span>
                </div>
              )}
            </div>

            {error && (
              <p className="text-xs text-destructive bg-destructive/10 rounded-xl px-3 py-2 mb-3">
                {error}
              </p>
            )}

            <div className="flex gap-2">
              {!isRecording && !isStopped && (
                <Button
                  onClick={startRecording}
                  disabled={recordingState === "requesting"}
                  className="flex-1 gap-1.5 bg-red-500 hover:bg-red-600 text-white"
                  size="sm"
                  data-ocid="voice.record.button"
                >
                  {recordingState === "requesting" ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                      Requesting…
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5" /> Start Recording
                    </>
                  )}
                </Button>
              )}
              {isRecording && (
                <Button
                  onClick={stopRecording}
                  className="flex-1 gap-1.5 bg-slate-700 hover:bg-slate-800 text-white"
                  size="sm"
                  data-ocid="voice.stop.button"
                >
                  <Square className="w-3.5 h-3.5" /> Stop Recording
                </Button>
              )}
              {isStopped && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetRecording}
                  className="flex-1 gap-1.5"
                  data-ocid="voice.rerecord.button"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Re-record
                </Button>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4 text-sky-500" />
              Upload Audio File
            </h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              id="audio-upload"
            />
            {uploadedAudio ? (
              <div className="space-y-2">
                {/* biome-ignore lint/a11y/useMediaCaption: user-uploaded audio */}
                <audio
                  src={uploadedAudio.url}
                  controls
                  className="w-full h-8"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUploadedAudio(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="w-full gap-1.5"
                  data-ocid="voice.change_file.button"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Change File
                </Button>
              </div>
            ) : (
              <label
                htmlFor="audio-upload"
                data-ocid="voice.upload.dropzone"
                className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-sky-300 dark:hover:border-sky-700 hover:bg-sky-50/50 dark:hover:bg-sky-900/10 transition-all group"
              >
                <Upload className="w-5 h-5 text-muted-foreground mb-1 group-hover:text-sky-500 transition-colors" />
                <p className="text-xs text-muted-foreground">
                  Click to upload audio (MP3, WAV, OGG)
                </p>
              </label>
            )}
          </div>

          {/* Analyze Button */}
          {hasAudio && (
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              data-ocid="voice.analyze.submit_button"
              className="w-full gap-2 bg-sky-600 hover:bg-sky-700 text-white py-3 shadow-sm"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Extracting MFCC
                  Features…
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />{" "}
                  <Sparkles className="w-3.5 h-3.5" /> Analyze Voice
                </>
              )}
            </Button>
          )}
        </div>

        {/* Result Panel */}
        <div className="space-y-4">
          {!result && !isAnalyzing && (
            <div
              className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[200px]"
              data-ocid="voice.result.empty_state"
            >
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <Mic className="w-7 h-7 text-muted-foreground/40" />
              </div>
              <p className="text-sm text-muted-foreground">
                Record or upload audio to see stress analysis results
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div
              className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center"
              data-ocid="voice.result.loading_state"
            >
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center mb-3">
                <Loader2 className="w-6 h-6 text-sky-500 animate-spin" />
              </div>
              <p className="text-sm font-medium text-foreground">
                Extracting MFCC features…
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Applying Logistic Regression classifier
              </p>
            </div>
          )}

          {result && !isAnalyzing && (
            <>
              {/* Stress Result */}
              <div
                data-ocid={
                  result.isStressed
                    ? "voice.result.error_state"
                    : "voice.result.success_state"
                }
                className={`rounded-2xl border-2 p-5 animate-fade-in ${
                  result.isStressed
                    ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                    : "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${result.isStressed ? "bg-red-100 dark:bg-red-900/30" : "bg-emerald-100 dark:bg-emerald-900/30"}`}
                    >
                      {result.isStressed ? (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      )}
                    </div>
                    <span
                      className={`font-display font-bold text-lg ${result.isStressed ? "text-red-700 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}
                    >
                      {result.isStressed
                        ? "Stress Detected"
                        : "No Stress Detected"}
                    </span>
                  </div>
                  <span
                    className={`font-display text-2xl font-extrabold ${result.isStressed ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}
                  >
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>
                <Progress
                  value={result.confidence * 100}
                  className={`h-2 ${result.isStressed ? "[&>div]:bg-red-500" : "[&>div]:bg-emerald-500"}`}
                />
              </div>

              {/* MFCC Features */}
              <div className="bg-card border border-border rounded-xl p-4 shadow-xs">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                  Extracted MFCC Features
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      label: "RMS Energy",
                      value: result.features.energy.toFixed(4),
                    },
                    {
                      label: "Zero Crossing Rate",
                      value: result.features.zeroCrossingRate.toFixed(4),
                    },
                    {
                      label: "Spectral Centroid",
                      value: `${result.features.spectralCentroid} Hz`,
                    },
                    {
                      label: "MFCC Mean",
                      value: result.features.mfccMean.toFixed(3),
                    },
                    {
                      label: "Pitch Variance",
                      value: result.features.pitchVariance.toFixed(5),
                    },
                  ].map((feat) => (
                    <div
                      key={feat.label}
                      className="bg-muted/50 rounded-xl p-2.5"
                    >
                      <div className="text-xs text-muted-foreground mb-0.5">
                        {feat.label}
                      </div>
                      <div className="text-sm font-mono font-semibold text-foreground">
                        {feat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stress Indicators */}
              <div className="bg-card border border-border rounded-xl p-4 shadow-xs">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                  Stress Indicators
                </p>
                <div className="space-y-1.5">
                  {result.stressIndicators.map((indicator) => (
                    <div
                      key={indicator}
                      className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl font-medium ${
                        result.isStressed
                          ? "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300"
                          : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      {result.isStressed ? "⚠" : "✓"} {indicator}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stress Management Suggestions */}
      {result && !isAnalyzing && (
        <div className="mt-6 animate-fade-in">
          <StressManagementSuggestions
            isStressed={result.isStressed}
            method="voice"
            confidence={result.confidence}
          />
        </div>
      )}
    </div>
  );
}
