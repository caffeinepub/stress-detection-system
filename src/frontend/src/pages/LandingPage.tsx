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
import { motion } from "motion/react";

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
    accent: "from-teal-400 to-cyan-500",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    hoverBorder: "hover:border-teal-400/60",
    badgeClass: "bg-teal-100 text-teal-700",
    accuracy: "84.3%",
  },
  {
    id: "facial",
    title: "Facial Expression",
    subtitle: "Computer Vision Detection",
    description:
      "Capture or upload a facial image to detect emotions and map them to stress levels using visual feature analysis.",
    icon: Camera,
    route: "/facial-detection",
    badge: "OpenCV + Emotions",
    steps: ["Face Detection", "Emotion Extraction", "Stress Mapping"],
    accent: "from-emerald-400 to-teal-500",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    hoverBorder: "hover:border-emerald-400/60",
    badgeClass: "bg-emerald-100 text-emerald-700",
    accuracy: "79.1%",
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
    accent: "from-cyan-400 to-blue-500",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
    hoverBorder: "hover:border-cyan-400/60",
    badgeClass: "bg-cyan-100 text-cyan-700",
    accuracy: "81.7%",
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-2xl mx-auto px-6 pt-16 pb-0 text-center">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-extrabold text-black leading-tight tracking-tight mb-6"
          >
            Stress Detection with Machine Learning using Logistic Regression
            Algorithm
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg text-gray-500 leading-relaxed mb-10 max-w-xl mx-auto"
          >
            A comprehensive multi-modal stress detection system powered by{" "}
            <strong className="text-teal-600 font-bold">
              Logistic Regression
            </strong>{" "}
            algorithm, analyzing text, facial expressions, and voice patterns.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-col gap-4 max-w-md mx-auto mb-12"
          >
            <button
              type="button"
              data-ocid="landing.primary_button"
              onClick={() => navigate({ to: "/text-detection" })}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-900 transition-all"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              data-ocid="landing.secondary_button"
              onClick={() => navigate({ to: "/evaluation" })}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-black rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all"
            >
              <BarChart3 className="w-5 h-5" /> View ML Metrics
            </button>
          </motion.div>
        </div>

        {/* Brain Image */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full max-w-lg mx-auto px-6"
        >
          <img
            src="/assets/generated/brain-hero.dim_800x600.png"
            alt="Brain illustration"
            className="w-full rounded-3xl object-cover"
          />
        </motion.div>
      </section>

      {/* Detection Methods */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-3">
            Choose Detection Method
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Select one of three stress detection modalities. Each uses Logistic
            Regression as the core classifier with domain-specific feature
            extraction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {detectionMethods.map((method, idx) => {
            const Icon = method.icon;
            return (
              <motion.button
                type="button"
                key={method.id}
                data-ocid={`landing.method.${idx + 1}.button`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => navigate({ to: method.route as "/" })}
                className={`group text-left bg-white border-2 border-gray-200 ${method.hoverBorder} rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer`}
              >
                {/* Accent top line */}
                <div
                  className={`h-1 w-full bg-gradient-to-r ${method.accent}`}
                />

                <div className="p-6">
                  {/* Icon + Badge */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className={`w-[52px] h-[52px] rounded-xl ${method.iconBg} flex items-center justify-center`}
                    >
                      <Icon className={`w-7 h-7 ${method.iconColor}`} />
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${method.badgeClass}`}
                    >
                      {method.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-black mb-1">
                    {method.title}
                  </h3>
                  <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                    {method.subtitle}
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    {method.description}
                  </p>

                  {/* Steps */}
                  <div className="space-y-2 mb-5">
                    {method.steps.map((step, i) => (
                      <div
                        key={step}
                        className="flex items-center gap-2.5 text-xs text-gray-500"
                      >
                        <span
                          className={`w-5 h-5 rounded-full ${method.iconBg} ${method.iconColor} flex items-center justify-center font-bold text-[10px] flex-shrink-0`}
                        >
                          {i + 1}
                        </span>
                        {step}
                      </div>
                    ))}
                  </div>

                  {/* Accuracy + CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className={`text-sm font-bold ${method.iconColor}`}>
                      {method.accuracy} accuracy
                    </span>
                    <span
                      className={`flex items-center gap-1 text-sm font-semibold ${method.iconColor} group-hover:gap-2 transition-all`}
                    >
                      Analyze <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-black mb-2">
              ML Architecture Highlights
            </h2>
            <p className="text-gray-500 text-sm">
              Built for academic research and presentation
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-xs hover:shadow-sm transition-shadow"
                >
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <h4 className="font-semibold text-sm text-black mb-1">
                    {f.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Algorithm Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-black mb-3">
                Logistic Regression Algorithm
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                This system uses{" "}
                <strong className="text-black">Logistic Regression</strong> as
                the primary classification algorithm across all three detection
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
                    className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full border border-teal-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 bg-white border border-gray-200 rounded-xl p-5 font-mono text-xs text-gray-500 min-w-[220px]">
              <div className="text-teal-600 font-semibold mb-2">
                # Logistic Regression
              </div>
              <div>P(y=1|x) = σ(wᵀx + b)</div>
              <div className="mt-1">σ(z) = 1 / (1 + e⁻ᶻ)</div>
              <div className="mt-3 text-teal-600 font-semibold">
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
