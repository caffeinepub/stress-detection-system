import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Camera,
  FileText,
  Mic,
  Shield,
  Sparkles,
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
    badge: "NLP + TF-IDF",
    steps: ["Text Preprocessing", "TF-IDF Vectorization", "LR Classification"],
    accentClass: "from-teal-500 to-cyan-500",
    iconBg: "bg-teal-50 dark:bg-teal-900/30",
    iconColor: "text-teal-600 dark:text-teal-400",
    badgeClass:
      "bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 ring-1 ring-teal-200 dark:ring-teal-800",
    hoverBorder: "hover:border-teal-300 dark:hover:border-teal-700",
    numberClass:
      "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300",
    ctaColor: "text-teal-600 dark:text-teal-400",
    glowClass:
      "group-hover:shadow-teal-200/50 dark:group-hover:shadow-teal-900/30",
  },
  {
    id: "facial",
    title: "Facial Expression",
    subtitle: "Computer Vision Detection",
    description:
      "Capture or upload a facial image to detect emotions and map them to stress levels via visual feature analysis.",
    icon: Camera,
    route: "/facial-detection",
    badge: "OpenCV + Emotions",
    steps: ["Face Detection", "Emotion Extraction", "Stress Mapping"],
    accentClass: "from-emerald-500 to-teal-500",
    iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    badgeClass:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-800",
    hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-700",
    numberClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    ctaColor: "text-emerald-600 dark:text-emerald-400",
    glowClass:
      "group-hover:shadow-emerald-200/50 dark:group-hover:shadow-emerald-900/30",
  },
  {
    id: "voice",
    title: "Voice Analysis",
    subtitle: "Audio Signal Detection",
    description:
      "Record or upload audio to extract MFCC features and classify stress levels from vocal patterns.",
    icon: Mic,
    route: "/voice-detection",
    badge: "MFCC + Librosa",
    steps: ["Audio Recording", "MFCC Extraction", "LR Classification"],
    accentClass: "from-sky-500 to-teal-500",
    iconBg: "bg-sky-50 dark:bg-sky-900/30",
    iconColor: "text-sky-600 dark:text-sky-400",
    badgeClass:
      "bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 ring-1 ring-sky-200 dark:ring-sky-800",
    hoverBorder: "hover:border-sky-300 dark:hover:border-sky-700",
    numberClass: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300",
    ctaColor: "text-sky-600 dark:text-sky-400",
    glowClass:
      "group-hover:shadow-sky-200/50 dark:group-hover:shadow-sky-900/30",
  },
];

const features = [
  {
    icon: Brain,
    title: "Logistic Regression",
    desc: "Core ML algorithm for binary stress classification",
    color:
      "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  },
  {
    icon: Zap,
    title: "10-Fold Cross Validation",
    desc: "Robust model evaluation with 80/20 train-test split",
    color:
      "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    icon: Shield,
    title: "Multi-Modal Analysis",
    desc: "Three independent detection pathways for accuracy",
    color: "bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
  },
  {
    icon: BarChart3,
    title: "Performance Metrics",
    desc: "Accuracy, Precision, Recall, F1-score evaluation",
    color: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
  },
];

const techStack = [
  "Scikit-learn",
  "NLTK",
  "TF-IDF",
  "MFCC",
  "OpenCV",
  "Pandas",
  "NumPy",
  "Joblib",
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-background to-sky-50/60 dark:from-teal-950/25 dark:via-background dark:to-sky-950/20" />
        <div className="absolute inset-0 bg-dot-pattern opacity-60" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="flex flex-col lg:flex-row items-center gap-14">
            {/* Left copy */}
            <div className="flex-1 text-center lg:text-left animate-fade-in">
              {/* Eyebrow pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 ring-1 ring-primary/20 text-primary text-sm font-semibold mb-7 tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                Academic ML Research Project
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.08] tracking-tight mb-5">
                Detect Stress
                <br />
                <span className="text-gradient">Intelligently</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl mb-9 leading-relaxed">
                A multi-modal stress detection system powered by{" "}
                <strong className="text-foreground font-semibold">
                  Logistic Regression
                </strong>{" "}
                — analyzing text, facial expressions, and voice patterns with
                academic precision.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button
                  type="button"
                  data-ocid="landing.primary_button"
                  onClick={() => navigate({ to: "/text-detection" })}
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-[15px] hover:bg-primary/90 transition-all shadow-primary-glow hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  type="button"
                  data-ocid="landing.secondary_button"
                  onClick={() => navigate({ to: "/evaluation" })}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-card border border-border text-foreground rounded-xl font-semibold text-[15px] hover:bg-accent transition-all hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <BarChart3 className="w-4 h-4 text-primary" />
                  View ML Metrics
                </button>
              </div>

              {/* Quick stat pills */}
              <div className="flex flex-wrap gap-3 mt-8 justify-center lg:justify-start">
                {[
                  {
                    label: "3 Detection Modes",
                    color:
                      "bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:ring-teal-800",
                  },
                  {
                    label: "10-Fold CV",
                    color:
                      "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:ring-violet-800",
                  },
                  {
                    label: "80/20 Split",
                    color:
                      "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:ring-sky-800",
                  },
                ].map((s) => (
                  <span
                    key={s.label}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full ring-1 ${s.color}`}
                  >
                    {s.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: hero image */}
            <div className="flex-shrink-0 w-full lg:w-auto animate-scale-in">
              <div className="relative">
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-teal-400/20 to-sky-400/20 blur-xl" />
                <img
                  src="/assets/generated/stress-hero-banner.dim_1200x400.png"
                  alt="Stress Detection System"
                  className="relative w-full lg:w-[500px] h-52 lg:h-72 object-cover rounded-2xl shadow-xl border border-border/60"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Detection Methods ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Choose Your Method
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Three Ways to Detect Stress
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-[15px] leading-relaxed">
            Each modality uses Logistic Regression as the core classifier with
            domain-specific feature extraction pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {detectionMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                type="button"
                key={method.id}
                data-ocid={`landing.${method.id}.card`}
                onClick={() => navigate({ to: method.route as "/" })}
                className={`group relative text-left bg-card border border-border ${method.hoverBorder} rounded-2xl p-7 shadow-sm hover:shadow-lg ${method.glowClass} transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden`}
              >
                {/* Top gradient line */}
                <div
                  className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${method.accentClass} rounded-t-2xl`}
                />

                {/* Icon + Badge */}
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`w-14 h-14 rounded-2xl ${method.iconBg} flex items-center justify-center shadow-sm`}
                  >
                    <Icon className={`w-7 h-7 ${method.iconColor}`} />
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${method.badgeClass}`}
                  >
                    {method.badge}
                  </span>
                </div>

                {/* Title + Subtitle */}
                <h3 className="font-display text-xl font-bold text-foreground mb-1">
                  {method.title}
                </h3>
                <p className="text-xs font-semibold text-muted-foreground/80 mb-3 uppercase tracking-wide">
                  {method.subtitle}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {method.description}
                </p>

                {/* Steps */}
                <div className="space-y-2 mb-6">
                  {method.steps.map((step, i) => (
                    <div
                      key={step}
                      className="flex items-center gap-2.5 text-sm text-muted-foreground"
                    >
                      <span
                        className={`w-5 h-5 rounded-full ${method.numberClass} flex items-center justify-center font-bold text-[10px] flex-shrink-0`}
                      >
                        {i + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold ${method.ctaColor} group-hover:gap-2.5 transition-all duration-200`}
                >
                  Analyze Now
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────────── */}
      <section className="border-y border-border bg-gradient-to-b from-muted/20 to-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              Architecture
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
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
                  className="bg-card border border-border rounded-2xl p-6 text-center shadow-xs hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-bold text-sm text-foreground mb-2">
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

      {/* ── Algorithm Callout ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/8 via-card to-teal-500/5 border border-primary/15 rounded-3xl p-8 md:p-12 shadow-sm">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/8 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-start gap-10">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
                Core Algorithm
              </p>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Logistic Regression
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6 text-[15px]">
                This system uses{" "}
                <strong className="text-foreground">Logistic Regression</strong>{" "}
                as the primary classification algorithm across all three
                detection modules. The sigmoid function maps feature vectors to
                probability scores, enabling binary classification of stress vs.
                non-stress states.
              </p>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full ring-1 ring-primary/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex-shrink-0 bg-card/80 backdrop-blur border border-border rounded-2xl p-6 font-mono text-sm min-w-[240px] shadow-sm">
              <div className="text-primary font-bold mb-3 text-xs uppercase tracking-widest">
                Logistic Regression
              </div>
              <div className="space-y-1 text-muted-foreground text-xs">
                <div>P(y=1|x) = σ(wᵀx + b)</div>
                <div>σ(z) = 1 / (1 + e⁻ᶻ)</div>
              </div>
              <div className="border-t border-border my-3" />
              <div className="text-primary font-bold mb-2 text-xs uppercase tracking-widest">
                Evaluation
              </div>
              <div className="space-y-1 text-muted-foreground text-xs">
                <div>80% Training / 20% Testing</div>
                <div>10-Fold Cross Validation</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
