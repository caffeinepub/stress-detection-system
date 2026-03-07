import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  Loader2,
  RotateCcw,
  Sparkles,
  SwitchCamera,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { useCamera } from "../camera/useCamera";
import StressManagementSuggestions from "../components/StressManagementSuggestions";
import { useProcessFacialAnalysis } from "../hooks/useQueries";
import {
  type Emotion,
  type FacialAnalysisResult,
  analyzeFacialExpression,
} from "../utils/facialAnalysis";

const EMOTION_STYLES: Record<Emotion, { pill: string; bar: string }> = {
  happy: {
    pill: "text-yellow-700 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-300",
    bar: "bg-yellow-400",
  },
  sad: {
    pill: "text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300",
    bar: "bg-blue-400",
  },
  angry: {
    pill: "text-red-700 bg-red-50 dark:bg-red-900/30 dark:text-red-300",
    bar: "bg-red-400",
  },
  fearful: {
    pill: "text-orange-700 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-300",
    bar: "bg-orange-400",
  },
  disgusted: {
    pill: "text-purple-700 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300",
    bar: "bg-purple-400",
  },
  surprised: {
    pill: "text-cyan-700 bg-cyan-50 dark:bg-cyan-900/30 dark:text-cyan-300",
    bar: "bg-cyan-400",
  },
  neutral: {
    pill: "text-slate-700 bg-slate-50 dark:bg-slate-900/30 dark:text-slate-300",
    bar: "bg-slate-400",
  },
};

const EMOTION_EMOJIS: Record<Emotion, string> = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  fearful: "😨",
  disgusted: "🤢",
  surprised: "😲",
  neutral: "😐",
};

type InputMode = "upload" | "camera";

export default function FacialDetectionPage() {
  const [inputMode, setInputMode] = useState<InputMode>("upload");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | Blob | null>(null);
  const [result, setResult] = useState<FacialAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFacialMutation = useProcessFacialAnalysis();

  const {
    isActive,
    isSupported,
    error: cameraError,
    isLoading: cameraLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    videoRef,
    canvasRef,
  } = useCamera({ facingMode: "user", width: 640, height: 480 });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(URL.createObjectURL(file));
    setSelectedFile(file);
    setResult(null);
  };

  const handleCapture = async () => {
    const photo = await capturePhoto();
    if (!photo) return;
    setSelectedImage(URL.createObjectURL(photo));
    setSelectedFile(photo);
    setResult(null);
    stopCamera();
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 1000));
    const analysis = await analyzeFacialExpression(selectedFile);
    setResult(analysis);
    try {
      await processFacialMutation.mutateAsync({
        isStressed: analysis.isStressed,
        confidence: analysis.confidence,
      });
    } catch {
      /* silent */
    }
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (isActive) stopCamera();
  };

  const handleModeSwitch = (mode: InputMode) => {
    setInputMode(mode);
    setSelectedImage(null);
    setSelectedFile(null);
    setResult(null);
    if (mode === "camera" && !isActive) startCamera();
    else if (mode === "upload" && isActive) stopCamera();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shadow-sm ring-1 ring-emerald-200 dark:ring-emerald-800">
            <Camera className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Facial Expression Detection
            </h1>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-0.5">
              OpenCV + Emotion Analysis + Logistic Regression
            </p>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed text-[15px]">
          Upload a facial image or use your webcam to detect emotions and
          classify stress levels using computer vision feature extraction and
          Logistic Regression.
        </p>
      </div>

      {/* ── Pipeline Steps ──────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-7">
        {[
          "1. Face Detection",
          "2. Feature Extraction",
          "3. Emotion Classification",
          "4. Stress Mapping",
          "5. LR Output",
        ].map((step) => (
          <span
            key={step}
            className="text-xs px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-800 rounded-full font-semibold"
          >
            {step}
          </span>
        ))}
      </div>

      {/* ── Mode Toggle ─────────────────────────────────────── */}
      <div className="flex gap-2 mb-7 p-1 bg-muted/50 rounded-xl w-fit">
        {(["upload", "camera"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            data-ocid={`facial.${mode}.tab`}
            onClick={() => handleModeSwitch(mode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-semibold transition-all ${
              inputMode === mode
                ? "bg-card text-foreground shadow-sm ring-1 ring-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {mode === "upload" ? (
              <Upload className="w-3.5 h-3.5" />
            ) : (
              <Camera className="w-3.5 h-3.5" />
            )}
            {mode === "upload" ? "Upload Image" : "Use Webcam"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          {inputMode === "upload" ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="face-upload"
              />
              {!selectedImage ? (
                <label
                  htmlFor="face-upload"
                  data-ocid="facial.upload.dropzone"
                  className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Upload className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    Click to upload image
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, WEBP supported
                  </p>
                </label>
              ) : (
                <div className="space-y-3">
                  <img
                    src={selectedImage}
                    alt="Selected face"
                    className="w-full h-64 object-cover rounded-xl border border-border"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="flex-1 gap-1.5"
                      data-ocid="facial.reset.button"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Change
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                      data-ocid="facial.analyze.submit_button"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                          Analyzing…
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" /> Analyze Face
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {isSupported === false ? (
                <div className="flex items-center justify-center h-64 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground">
                    Camera not supported in this browser
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className="relative bg-black rounded-xl overflow-hidden"
                    style={{ minHeight: "256px" }}
                  >
                    <video
                      ref={videoRef}
                      className="w-full h-64 object-cover"
                      playsInline
                      muted
                      style={{ display: isActive ? "block" : "none" }}
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    {!isActive && !selectedImage && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <Camera className="w-10 h-10 mb-2 opacity-50" />
                        <p className="text-sm opacity-50">Camera preview</p>
                      </div>
                    )}
                    {selectedImage && !isActive && (
                      <img
                        src={selectedImage}
                        alt="Captured"
                        className="w-full h-64 object-cover"
                      />
                    )}
                  </div>

                  {cameraError && (
                    <p className="text-xs text-destructive bg-destructive/10 rounded-xl px-3 py-2">
                      {cameraError.message}
                    </p>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    {!isActive && !selectedImage && (
                      <Button
                        size="sm"
                        onClick={startCamera}
                        disabled={cameraLoading}
                        className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                        data-ocid="facial.camera.button"
                      >
                        {cameraLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Camera className="w-3.5 h-3.5" />
                        )}
                        Start Camera
                      </Button>
                    )}
                    {isActive && (
                      <>
                        <Button
                          size="sm"
                          onClick={handleCapture}
                          disabled={cameraLoading}
                          className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                          data-ocid="facial.capture.button"
                        >
                          <Camera className="w-3.5 h-3.5" /> Capture Photo
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => switchCamera()}
                        >
                          <SwitchCamera className="w-3.5 h-3.5" />
                        </Button>
                      </>
                    )}
                    {selectedImage && !isActive && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleReset}
                          className="flex-1 gap-1.5"
                          data-ocid="facial.retake.button"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Retake
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleAnalyze}
                          disabled={isAnalyzing}
                          className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                          data-ocid="facial.analyze.submit_button"
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                              Analyzing…
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" /> Analyze Face
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Result Panel */}
        <div className="space-y-4">
          {!result && !isAnalyzing && (
            <div
              className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[200px]"
              data-ocid="facial.result.empty_state"
            >
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <Camera className="w-7 h-7 text-muted-foreground/40" />
              </div>
              <p className="text-sm text-muted-foreground">
                Upload or capture a facial image to see results
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div
              className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center"
              data-ocid="facial.result.loading_state"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
                <Loader2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-spin" />
              </div>
              <p className="text-sm font-medium text-foreground">
                Analyzing facial expression…
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Extracting emotion features
              </p>
            </div>
          )}

          {result && !isAnalyzing && (
            <>
              {/* Stress Result */}
              <div
                data-ocid={
                  result.isStressed
                    ? "facial.result.error_state"
                    : "facial.result.success_state"
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

              {/* Detected Emotion */}
              <div className="bg-card border border-border rounded-xl p-4 shadow-xs">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                  Detected Emotion
                </p>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ring-1 ring-inset ${EMOTION_STYLES[result.emotion].pill}`}
                >
                  <span className="text-xl">
                    {EMOTION_EMOJIS[result.emotion]}
                  </span>
                  {result.emotion.charAt(0).toUpperCase() +
                    result.emotion.slice(1)}
                  <span className="text-xs font-normal opacity-70">
                    ({Math.round(result.emotionConfidence * 100)}%)
                  </span>
                </span>
              </div>

              {/* Emotion Distribution */}
              <div className="bg-card border border-border rounded-xl p-4 shadow-xs">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                  Emotion Distribution
                </p>
                <div className="space-y-2">
                  {(Object.entries(result.emotionScores) as [Emotion, number][])
                    .sort((a, b) => b[1] - a[1])
                    .map(([emotion, score]) => (
                      <div key={emotion} className="flex items-center gap-3">
                        <span className="text-xs w-20 text-muted-foreground capitalize">
                          {emotion}
                        </span>
                        <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              emotion === result.emotion
                                ? EMOTION_STYLES[emotion].bar
                                : "bg-muted-foreground/25"
                            }`}
                            style={{ width: `${score * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-10 text-right font-mono">
                          {Math.round(score * 100)}%
                        </span>
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
            method="facial"
            confidence={result.confidence}
          />
        </div>
      )}
    </div>
  );
}
