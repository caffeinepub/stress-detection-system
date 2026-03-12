import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Info,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import StressPredictionGraph from "../components/StressPredictionGraph";
import StressReport from "../components/StressReport";
import { useProcessTextAnalysis } from "../hooks/useQueries";
import {
  getPossibleCauses,
  getRecommendedActions,
  getStressLevel,
} from "../utils/stressReport";
import {
  type ClassificationResult,
  classifyText,
} from "../utils/textPreprocessing";

const SAMPLE_TEXTS = [
  "I feel completely overwhelmed with work deadlines. I can't sleep and I'm constantly anxious about everything.",
  "Today was a wonderful day! I went for a walk in the park and felt completely relaxed and at peace.",
  "The pressure at work is unbearable. I'm exhausted and frustrated all the time. I don't know how to cope.",
  "I'm feeling great today. Had a productive morning and enjoyed a calm afternoon with friends.",
];

export default function TextDetectionPage() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [showPreprocessing, setShowPreprocessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const processTextMutation = useProcessTextAnalysis();

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 800));

    const classification = classifyText(inputText);
    setResult(classification);

    try {
      await processTextMutation.mutateAsync({
        isStressed: classification.isStressed,
        confidence: classification.confidence,
      });
    } catch {
      // Backend call failed silently - result is still shown
    }

    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setInputText("");
    setResult(null);
    setShowPreprocessing(false);
  };

  const handleSampleText = (text: string) => {
    setInputText(text);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
            <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Text-Based Stress Detection
            </h1>
            <p className="text-sm text-muted-foreground">
              NLP + TF-IDF + Logistic Regression
            </p>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Enter any text to analyze stress indicators. The system preprocesses
          text using NLTK-style stopword removal, applies TF-IDF feature
          extraction, and classifies using Logistic Regression.
        </p>
      </div>

      {/* Pipeline Info */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          "1. Lowercase",
          "2. Remove Stopwords",
          "3. TF-IDF Vectorization",
          "4. Logistic Regression",
          "5. Sigmoid Output",
        ].map((step) => (
          <span
            key={step}
            className="text-xs px-3 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded-full font-medium"
          >
            {step}
          </span>
        ))}
      </div>

      {/* Sample Texts */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Sample Texts
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SAMPLE_TEXTS.map((text) => (
            <button
              key={text}
              type="button"
              onClick={() => handleSampleText(text)}
              className="text-left text-xs p-3 bg-muted/50 hover:bg-muted border border-border rounded-lg transition-colors line-clamp-2 text-muted-foreground hover:text-foreground"
            >
              {text}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
        <label
          htmlFor="text-analysis-input"
          className="block text-sm font-semibold text-foreground mb-2"
        >
          Enter Text for Analysis
        </label>
        <Textarea
          id="text-analysis-input"
          data-ocid="text.textarea"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste text here... (e.g., 'I feel overwhelmed with work and can't sleep')"
          className="min-h-[140px] resize-none text-sm"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground">
            {inputText.length} characters ·{" "}
            {inputText.trim().split(/\s+/).filter(Boolean).length} words
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isAnalyzing}
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
            </Button>
            <Button
              data-ocid="text.submit_button"
              size="sm"
              onClick={handleAnalyze}
              disabled={!inputText.trim() || isAnalyzing}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />{" "}
                  Analyzing...
                </>
              ) : (
                "Analyze Text"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-4">
          {/* Main Result Card */}
          <div
            className={`rounded-2xl border-2 p-6 ${
              result.isStressed
                ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                : "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {result.isStressed ? (
                  <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                )}
                <div>
                  <h3
                    className={`text-2xl font-bold ${result.isStressed ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}
                  >
                    {result.isStressed
                      ? "⚠ Stress Detected"
                      : "✓ No Stress Detected"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Logistic Regression Classification Result
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div
                  className={`text-3xl font-extrabold ${result.isStressed ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                >
                  {Math.round(result.confidence * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Confidence</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Confidence Score</span>
                <span>{Math.round(result.confidence * 100)}%</span>
              </div>
              <Progress
                value={result.confidence * 100}
                className={`h-2 ${result.isStressed ? "[&>div]:bg-red-500" : "[&>div]:bg-green-500"}`}
              />
            </div>

            {result.preprocessing.keywordsFound.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  Detected Keywords:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.preprocessing.keywordsFound.map((kw) => (
                    <span
                      key={kw}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        result.isStressed
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                          : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      }`}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preprocessing Details */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowPreprocessing(!showPreprocessing)}
              className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground" />
                Preprocessing Details
              </span>
              {showPreprocessing ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {showPreprocessing && (
              <div className="px-5 pb-5 space-y-3 border-t border-border">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  {[
                    {
                      label: "Original Words",
                      value: result.preprocessing.original
                        .split(/\s+/)
                        .filter(Boolean).length,
                    },
                    {
                      label: "After Cleaning",
                      value: result.preprocessing.tokens.length,
                    },
                    {
                      label: "Stopwords Removed",
                      value: result.preprocessing.stopwordsRemoved,
                    },
                    {
                      label: "Stress Keywords",
                      value: result.preprocessing.keywordsFound.length,
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-muted/50 rounded-lg p-3 text-center"
                    >
                      <div className="text-xl font-bold text-foreground">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">
                    Cleaned Text:
                  </p>
                  <p className="text-xs bg-muted/50 rounded-lg p-3 font-mono text-foreground break-all">
                    {result.preprocessing.cleaned ||
                      "(empty after preprocessing)"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">
                    Tokens after stopword removal:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {result.preprocessing.tokens.slice(0, 30).map((token) => (
                      <span
                        key={token}
                        className="text-xs px-2 py-0.5 bg-muted rounded font-mono text-foreground"
                      >
                        {token}
                      </span>
                    ))}
                    {result.preprocessing.tokens.length > 30 && (
                      <span className="text-xs text-muted-foreground">
                        +{result.preprocessing.tokens.length - 30} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Stress Report */}
          {!isAnalyzing && (
            <>
              <StressReport
                detectionMethod="Text Analysis"
                detectedEmotion={result.isStressed ? "Stressed" : "Calm"}
                stressLevel={getStressLevel(
                  result.confidence,
                  result.isStressed,
                )}
                confidenceScore={result.confidence}
                possibleCauses={getPossibleCauses(
                  "text",
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
