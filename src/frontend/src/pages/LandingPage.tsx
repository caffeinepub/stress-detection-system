import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Camera,
  FileText,
  Mic,
  Shield,
  Zap,
} from "lucide-react";

const detectionMethods = [
  {
    id: "text",
    title: "Text Analysis",
    subtitle: "NLP-Based Detection",
    description:
      "Enter text to analyze stress indicators using TF-IDF feature extraction and Logistic Regression classification.",
    icon: FileText,
    route: "/text-detection",
    color: "teal",
    badge: "NLP + TF-IDF",
    steps: ["Text Preprocessing", "TF-IDF Vectorization", "LR Classification"],
    iconBg: "bg-teal-100 dark:bg-teal-900/30",
    iconColor: "text-teal-600 dark:text-teal-400",
    borderHover: "hover:border-teal-400",
    badgeClass:
      "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    image: "/assets/generated/icon-text-analysis.dim_128x128.png",
  },
  {
    id: "facial",
    title: "Facial Expression",
    subtitle: "Computer Vision Detection",
    description:
      "Capture or upload a facial image to detect emotions and map them to stress levels using visual feature analysis.",
    icon: Camera,
    route: "/facial-detection",
    color: "emerald",
    badge: "OpenCV + Emotions",
    steps: ["Face Detection", "Emotion Extraction", "Stress Mapping"],
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    borderHover: "hover:border-emerald-400",
    badgeClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    image: "/assets/generated/icon-face-analysis.dim_128x128.png",
  },
  {
    id: "voice",
    title: "Voice Analysis",
    subtitle: "Audio Signal Detection",
    description:
      "Record or upload audio to extract MFCC features and classify stress levels from vocal patterns.",
    icon: Mic,
    route: "/voice-detection",
    color: "cyan",
    badge: "MFCC + Librosa",
    steps: ["Audio Recording", "MFCC Extraction", "LR Classification"],
    iconBg: "bg-cyan-100 dark:bg-cyan-900/30",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    borderHover: "hover:border-cyan-400",
    badgeClass:
      "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    image: "/assets/generated/icon-voice-analysis.dim_128x128.png",
  },
];

const features = [
  {
    icon: Brain,
    title: "Logistic Regression",
    desc: "Core ML algorithm for binary stress classification",
  },
  {
    icon: Zap,
    title: "10-Fold Cross Validation",
    desc: "Robust model evaluation with 80/20 train-test split",
  },
  {
    icon: Shield,
    title: "Multi-Modal Analysis",
    desc: "Three independent detection pathways for accuracy",
  },
  {
    icon: BarChart3,
    title: "Performance Metrics",
    desc: "Accuracy, Precision, Recall, F1-score evaluation",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-background to-emerald-50 dark:from-teal-950/20 dark:via-background dark:to-emerald-950/20 border-b border-border">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <Brain className="w-4 h-4" />
                Academic ML Research Project
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-4">
                Stress Detection
                <span className="block text-primary">
                  Using Machine Learning
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
                A comprehensive multi-modal stress detection system powered by{" "}
                <strong>Logistic Regression</strong> algorithm, analyzing text,
                facial expressions, and voice patterns.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button
                  type="button"
                  onClick={() => navigate({ to: "/text-detection" })}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/evaluation" })}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border text-foreground rounded-xl font-semibold hover:bg-accent transition-all"
                >
                  <BarChart3 className="w-4 h-4" /> View ML Metrics
                </button>
              </div>
            </div>
            <div className="flex-shrink-0 w-full lg:w-auto">
              <img
                src="/assets/generated/stress-hero-banner.dim_1200x400.png"
                alt="Stress Detection System"
                className="w-full lg:w-[480px] h-48 lg:h-64 object-cover rounded-2xl shadow-xl border border-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Detection Methods */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Choose Detection Method
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select one of three stress detection modalities. Each uses Logistic
            Regression as the core classifier with domain-specific feature
            extraction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {detectionMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                type="button"
                key={method.id}
                onClick={() => navigate({ to: method.route as "/" })}
                className={`group text-left bg-card border-2 border-border ${method.borderHover} rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
              >
                {/* Icon + Badge */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className={`w-14 h-14 rounded-xl ${method.iconBg} flex items-center justify-center`}
                  >
                    <Icon className={`w-7 h-7 ${method.iconColor}`} />
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${method.badgeClass}`}
                  >
                    {method.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {method.title}
                </h3>
                <p className="text-xs font-medium text-muted-foreground mb-3">
                  {method.subtitle}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {method.description}
                </p>

                {/* Steps */}
                <div className="space-y-1.5 mb-5">
                  {method.steps.map((step, i) => (
                    <div
                      key={step}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <span
                        className={`w-5 h-5 rounded-full ${method.iconBg} ${method.iconColor} flex items-center justify-center font-bold text-xs flex-shrink-0`}
                      >
                        {i + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${method.iconColor} group-hover:gap-2 transition-all`}
                >
                  Analyze Now <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              ML Architecture Highlights
            </h2>
            <p className="text-muted-foreground text-sm">
              Built for academic research and presentation
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-card border border-border rounded-xl p-5 text-center shadow-xs"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-sm text-foreground mb-1">
                    {f.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Algorithm Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-gradient-to-r from-primary/5 to-teal-500/5 border border-primary/20 rounded-2xl p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Logistic Regression Algorithm
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This system uses <strong>Logistic Regression</strong> as the
                primary classification algorithm across all three detection
                modules. The sigmoid function maps feature vectors to
                probability scores, enabling binary classification of stress vs.
                non-stress states.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Scikit-learn",
                  "NLTK",
                  "TF-IDF",
                  "MFCC",
                  "OpenCV",
                  "Pandas",
                  "NumPy",
                  "Joblib",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 bg-card border border-border rounded-xl p-5 font-mono text-xs text-muted-foreground min-w-[220px]">
              <div className="text-primary font-semibold mb-2">
                # Logistic Regression
              </div>
              <div>P(y=1|x) = σ(wᵀx + b)</div>
              <div className="mt-1">σ(z) = 1 / (1 + e⁻ᶻ)</div>
              <div className="mt-3 text-primary font-semibold">
                Train-Test Split
              </div>
              <div>80% Training / 20% Testing</div>
              <div className="mt-1">10-Fold Cross Validation</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
