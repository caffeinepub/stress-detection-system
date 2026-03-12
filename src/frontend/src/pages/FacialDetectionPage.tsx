import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  Loader2,
  RotateCcw,
  SwitchCamera,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { useCamera } from "../camera/useCamera";
import StressPredictionGraph from "../components/StressPredictionGraph";
import StressReport from "../components/StressReport";
import { useProcessFacialAnalysis } from "../hooks/useQueries";
import {
  type Emotion,
  type FacialAnalysisResult,
  analyzeFacialExpression,
} from "../utils/facialAnalysis";
import {
  getPossibleCauses,
  getRecommendedActions,
  getStressLevel,
} from "../utils/stressReport";

const EMOTION_COLORS: Record<Emotion, string> = {
  happy:
    "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300",
  sad: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300",
  angry: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300",
  fearful:
    "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300",
  disgusted:
    "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300",
  surprised: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-300",
  neutral: "text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300",
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
    const url = URL.createObjectURL(file);
    setSelectedImage(url);
    setSelectedFile(file);
    setResult(null);
  };

  const handleCapture = async () => {
    const photo = await capturePhoto();
    if (!photo) return;
    const url = URL.createObjectURL(photo);
    setSelectedImage(url);
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
      // Silent fail
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
    if (mode === "camera" && !isActive) {
      startCamera();
    } else if (mode === "upload" && isActive) {
      stopCamera();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Camera className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Facial Expression Detection
            </h1>
            <p className="text-sm text-muted-foreground">
              OpenCV + Emotion Analysis + Logistic Regression
            </p>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Upload a facial image or use your webcam to detect emotions and
          classify stress levels using computer vision feature extraction and
          Logistic Regression.
        </p>
      </div>

      {/* Pipeline */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          "1. Face Detection",
          "2. Feature Extraction",
          "3. Emotion Classification",
          "4. Stress Mapping",
          "5. LR Output",
        ].map((step) => (
          <span
            key={step}
            className="text-xs px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full font-medium"
          >
            {step}
          </span>
        ))}
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => handleModeSwitch("upload")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            inputMode === "upload"
              ? "bg-emerald-600 text-white shadow-md"
              : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        >
          <Upload className="w-4 h-4" /> Upload Image
        </button>
        <button
          type="button"
          onClick={() => handleModeSwitch("camera")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            inputMode === "camera"
              ? "bg-emerald-600 text-white shadow-md"
              : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        >
          <Camera className="w-4 h-4" /> Use Webcam
        </button>
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
                  className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all"
                >
                  <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium text-foreground">
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
                      className="flex-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" /> Change
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />{" "}
                          Analyzing...
                        </>
                      ) : (
                        "Analyze Face"
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
                        <Camera className="w-10 h-10 mb-2 opacity-60" />
                        <p className="text-sm opacity-60">Camera preview</p>
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
                    <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                      {cameraError.message}
                    </p>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    {!isActive && !selectedImage && (
                      <Button
                        size="sm"
                        onClick={startCamera}
                        disabled={cameraLoading}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        {cameraLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                        ) : (
                          <Camera className="w-3.5 h-3.5 mr-1" />
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
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Camera className="w-3.5 h-3.5 mr-1" /> Capture Photo
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
                          className="flex-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1" /> Retake
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleAnalyze}
                          disabled={isAnalyzing}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />{" "}
                              Analyzing...
                            </>
                          ) : (
                            "Analyze Face"
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
            <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
              <Camera className="w-12 h-12 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                Upload or capture a facial image to see the analysis results
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-3" />
              <p className="text-sm font-medium text-foreground">
                Analyzing facial expression...
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

              {/* Detected Emotion */}
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Detected Emotion
                </p>
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${EMOTION_COLORS[result.emotion]}`}
                >
                  <span className="text-xl">
                    {EMOTION_EMOJIS[result.emotion]}
                  </span>
                  {result.emotion.charAt(0).toUpperCase() +
                    result.emotion.slice(1)}
                  <span className="text-xs font-normal opacity-70">
                    ({Math.round(result.emotionConfidence * 100)}%)
                  </span>
                </div>
              </div>

              {/* Emotion Scores */}
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Emotion Distribution
                </p>
                <div className="space-y-2">
                  {(Object.entries(result.emotionScores) as [Emotion, number][])
                    .sort((a, b) => b[1] - a[1])
                    .map(([emotion, score]) => (
                      <div key={emotion} className="flex items-center gap-2">
                        <span className="text-sm w-20 text-muted-foreground capitalize">
                          {emotion}
                        </span>
                        <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${emotion === result.emotion ? "bg-emerald-500" : "bg-muted-foreground/30"}`}
                            style={{ width: `${score * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-10 text-right">
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

      {/* AI Stress Report + Graph */}
      {result && !isAnalyzing && (
        <div className="mt-6 space-y-4">
          <StressReport
            detectionMethod="Face Analysis"
            detectedEmotion={
              result.emotion.charAt(0).toUpperCase() + result.emotion.slice(1)
            }
            stressLevel={getStressLevel(result.confidence, result.isStressed)}
            confidenceScore={result.confidence}
            possibleCauses={getPossibleCauses(
              "facial",
              getStressLevel(result.confidence, result.isStressed),
            )}
            recommendedActions={getRecommendedActions(
              getStressLevel(result.confidence, result.isStressed),
            )}
          />
          <StressPredictionGraph
            currentStressLevel={getStressLevel(
              result.confidence,
              result.isStressed,
            )}
          />
        </div>
      )}
    </div>
  );
}
