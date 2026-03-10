import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  Mic,
  Play,
  RotateCcw,
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
    const url = URL.createObjectURL(file);
    setUploadedAudio({ blob: file, url });
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
      // Silent fail
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
            <Mic className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Voice-Based Stress Detection
            </h1>
            <p className="text-sm text-muted-foreground">
              MFCC Features + Logistic Regression
            </p>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Record your voice or upload an audio file to extract MFCC acoustic
          features and classify stress levels using Logistic Regression on vocal
          pattern analysis.
        </p>
      </div>

      {/* Pipeline */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          "1. Audio Capture",
          "2. Signal Processing",
          "3. MFCC Extraction",
          "4. Feature Normalization",
          "5. LR Classification",
        ].map((step) => (
          <span
            key={step}
            className="text-xs px-3 py-1 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 rounded-full font-medium"
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
              <Mic className="w-4 h-4 text-cyan-500" /> Microphone Recording
            </h3>

            {/* Recording Visualizer */}
            <div
              className={`flex items-center justify-center h-28 rounded-xl mb-4 transition-all ${
                isRecording
                  ? "bg-red-50 dark:bg-red-950/20 border-2 border-red-300 dark:border-red-700"
                  : "bg-muted/50 border-2 border-dashed border-border"
              }`}
            >
              {isRecording ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-red-500 rounded-full animate-pulse"
                        style={{
                          height: `${16 + Math.sin(i * 1.2) * 12}px`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-red-600 dark:text-red-400 font-mono text-lg font-bold">
                    {formatDuration(duration)}
                  </span>
                  <span className="text-xs text-red-500 animate-pulse">
                    ● Recording...
                  </span>
                </div>
              ) : isStopped && audioUrl ? (
                <div className="flex flex-col items-center gap-2 w-full px-4">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-sm text-foreground font-medium">
                    Recording complete ({formatDuration(duration)})
                  </span>
                  {/* biome-ignore lint/a11y/useMediaCaption: user's own recorded audio, no caption needed */}
                  <audio src={audioUrl} controls className="w-full h-8 mt-1" />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Mic className="w-8 h-8 opacity-40" />
                  <span className="text-xs">Press record to start</span>
                </div>
              )}
            </div>

            {error && (
              <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2 mb-3">
                {error}
              </p>
            )}

            <div className="flex gap-2">
              {!isRecording && !isStopped && (
                <Button
                  onClick={startRecording}
                  disabled={recordingState === "requesting"}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  size="sm"
                >
                  {recordingState === "requesting" ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />{" "}
                      Requesting...
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 mr-1" /> Start Recording
                    </>
                  )}
                </Button>
              )}
              {isRecording && (
                <Button
                  onClick={stopRecording}
                  className="flex-1 bg-gray-700 hover:bg-gray-800 text-white"
                  size="sm"
                >
                  <Square className="w-3.5 h-3.5 mr-1" /> Stop Recording
                </Button>
              )}
              {isStopped && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetRecording}
                  className="flex-1"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" /> Re-record
                </Button>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-500" /> Upload Audio File
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
                {/* biome-ignore lint/a11y/useMediaCaption: user-uploaded audio, no caption needed */}
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
                  className="w-full"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" /> Change File
                </Button>
              </div>
            ) : (
              <label
                htmlFor="audio-upload"
                className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10 transition-all"
              >
                <Upload className="w-6 h-6 text-muted-foreground mb-1" />
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
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Extracting
                  MFCC Features...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" /> Analyze Voice
                </>
              )}
            </Button>
          )}
        </div>

        {/* Result Panel */}
        <div className="space-y-4">
          {!result && !isAnalyzing && (
            <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
              <Mic className="w-12 h-12 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                Record or upload audio to see stress analysis results
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-3" />
              <p className="text-sm font-medium text-foreground">
                Extracting MFCC features...
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
                className={`rounded-2xl border-2 p-5 ${
                  result.isStressed
                    ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                    : "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {result.isStressed ? (
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                    <span
                      className={`font-bold text-lg ${result.isStressed ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}
                    >
                      {result.isStressed
                        ? "Stress Detected"
                        : "No Stress Detected"}
                    </span>
                  </div>
                  <span
                    className={`text-2xl font-extrabold ${result.isStressed ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                  >
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>
                <Progress
                  value={result.confidence * 100}
                  className={`h-2 ${result.isStressed ? "[&>div]:bg-red-500" : "[&>div]:bg-green-500"}`}
                />
              </div>

              {/* MFCC Features */}
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
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
                      className="bg-muted/50 rounded-lg p-2.5"
                    >
                      <div className="text-xs text-muted-foreground">
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
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Stress Indicators
                </p>
                <div className="space-y-1.5">
                  {result.stressIndicators.map((indicator) => (
                    <div
                      key={indicator}
                      className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
                        result.isStressed
                          ? "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300"
                          : "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300"
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
        <div className="mt-6">
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
