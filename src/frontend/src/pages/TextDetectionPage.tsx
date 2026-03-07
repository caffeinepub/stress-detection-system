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
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import StressManagementSuggestions from "../components/StressManagementSuggestions";
import { useProcessTextAnalysis } from "../hooks/useQueries";
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

const PIPELINE_STEPS = [
  "1. Lowercase",
  "2. Remove Stopwords",
  "3. TF-IDF Vectorization",
  "4. Logistic Regression",
  "5. Sigmoid Output",
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
      // silent
    }
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setInputText("");
    setResult(null);
    setShowPreprocessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shadow-sm ring-1 ring-teal-200 dark:ring-teal-800">
            <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Text-Based Stress Detection
            </h1>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-0.5">
              NLP + TF-IDF + Logistic Regression
            </p>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed text-[15px]">
          Enter any text to analyze stress indicators. The system preprocesses
          text using NLTK-style stopword removal, applies TF-IDF feature
          extraction, and classifies using Logistic Regression.
        </p>
      </div>

      {/* ── Pipeline Steps ──────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-8">
        {PIPELINE_STEPS.map((step) => (
          <span
            key={step}
            className="text-xs px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 ring-1 ring-teal-200 dark:ring-teal-800 rounded-full font-semibold"
          >
            {step}
          </span>
        ))}
      </div>

      {/* ── Sample Texts ────────────────────────────────────── */}
      <div className="mb-6">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
          Try a Sample
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SAMPLE_TEXTS.map((text) => (
            <button
              key={text}
              type="button"
              data-ocid="text.sample.button"
              onClick={() => {
                setInputText(text);
                setResult(null);
              }}
              className="group text-left text-xs p-3.5 bg-muted/40 hover:bg-muted border border-border hover:border-teal-200 dark:hover:border-teal-800 rounded-xl transition-all text-muted-foreground hover:text-foreground line-clamp-2"
            >
              {text}
            </button>
          ))}
        </div>
      </div>

      {/* ── Input Area ──────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
        <label
          htmlFor="text-analysis-input"
          className="block text-sm font-semibold text-foreground mb-2.5"
        >
          Enter Text for Analysis
        </label>
        <Textarea
          id="text-analysis-input"
          data-ocid="text.analysis.textarea"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste text here… (e.g., 'I feel overwhelmed with work and can't sleep')"
          className="min-h-[140px] resize-none text-sm bg-muted/30 focus:bg-background transition-colors"
        />
        <div className="flex items-center justify-between mt-3.5">
          <span className="text-xs text-muted-foreground">
            {inputText.length} chars ·{" "}
            {inputText.trim().split(/\s+/).filter(Boolean).length} words
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isAnalyzing}
              data-ocid="text.reset.button"
              className="gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </Button>
            <Button
              size="sm"
              onClick={handleAnalyze}
              disabled={!inputText.trim() || isAnalyzing}
              data-ocid="text.analyze.submit_button"
              className="gap-1.5 bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing…
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> Analyze Text
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Result ──────────────────────────────────────────── */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Main Result Card */}
          <div
            data-ocid={
              result.isStressed
                ? "text.result.error_state"
                : "text.result.success_state"
            }
            className={`rounded-2xl border-2 p-6 ${
              result.isStressed
                ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                : "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    result.isStressed
                      ? "bg-red-100 dark:bg-red-900/30"
                      : "bg-emerald-100 dark:bg-emerald-900/30"
                  }`}
                >
                  {result.isStressed ? (
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  ) : (
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  )}
                </div>
                <div>
                  <h3
                    className={`font-display text-2xl font-bold ${
                      result.isStressed
                        ? "text-red-700 dark:text-red-400"
                        : "text-emerald-700 dark:text-emerald-400"
                    }`}
                  >
                    {result.isStressed
                      ? "Stress Detected"
                      : "No Stress Detected"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Logistic Regression Classification Result
                  </p>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div
                  className={`font-display text-4xl font-extrabold ${
                    result.isStressed
                      ? "text-red-600 dark:text-red-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {Math.round(result.confidence * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Confidence</div>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>Confidence Score</span>
                <span>{Math.round(result.confidence * 100)}%</span>
              </div>
              <Progress
                value={result.confidence * 100}
                className={`h-2 ${
                  result.isStressed
                    ? "[&>div]:bg-red-500"
                    : "[&>div]:bg-emerald-500"
                }`}
              />
            </div>

            {result.preprocessing.keywordsFound.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                  Detected Keywords
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.preprocessing.keywordsFound.map((kw) => (
                    <span
                      key={kw}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        result.isStressed
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                          : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stress Management Suggestions */}
          <StressManagementSuggestions
            isStressed={result.isStressed}
            method="text"
            confidence={result.confidence}
          />

          {/* Preprocessing Details (collapsible) */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
            <button
              type="button"
              data-ocid="text.preprocessing.toggle"
              onClick={() => setShowPreprocessing(!showPreprocessing)}
              className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground" />
                Preprocessing Details
              </span>
              {showPreprocessing ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {showPreprocessing && (
              <div className="px-5 pb-5 space-y-4 border-t border-border">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
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
                      className="bg-muted/50 rounded-xl p-3 text-center"
                    >
                      <div className="font-display text-2xl font-bold text-foreground">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                    Cleaned Text
                  </p>
                  <p className="text-xs bg-muted/50 rounded-xl p-3 font-mono text-foreground break-all leading-relaxed">
                    {result.preprocessing.cleaned ||
                      "(empty after preprocessing)"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                    Tokens after stopword removal
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.preprocessing.tokens.slice(0, 30).map((token) => (
                      <span
                        key={token}
                        className="text-xs px-2 py-0.5 bg-muted rounded-lg font-mono text-foreground"
                      >
                        {token}
                      </span>
                    ))}
                    {result.preprocessing.tokens.length > 30 && (
                      <span className="text-xs text-muted-foreground py-0.5">
                        +{result.preprocessing.tokens.length - 30} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analyzing state */}
      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-12 gap-3 animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-teal-600 dark:text-teal-400 animate-spin" />
          </div>
          <p className="text-sm font-medium text-foreground">Analyzing text…</p>
          <p className="text-xs text-muted-foreground">
            Running TF-IDF + Logistic Regression
          </p>
        </div>
      )}
    </div>
  );
}
