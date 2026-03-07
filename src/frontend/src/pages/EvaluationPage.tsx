import { BarChart3, Info } from "lucide-react";
import ConfusionMatrix from "../components/ConfusionMatrix";
import MetricsTable from "../components/MetricsTable";
import ModelComparisonChart from "../components/ModelComparisonChart";
import { MODEL_METRICS } from "../data/mockMetrics";

export default function EvaluationPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              ML Evaluation & Results
            </h1>
            <p className="text-sm text-muted-foreground">
              Model Performance Metrics & Analysis
            </p>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Comprehensive evaluation of all three Logistic Regression models using
          80/20 train-test split and 10-fold cross validation. Metrics include
          Accuracy, Precision, Recall, F1-Score, and Confusion Matrices.
        </p>
      </div>

      {/* Methodology Info */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 flex gap-3">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <strong className="text-foreground">Evaluation Methodology:</strong>{" "}
          All models trained using Logistic Regression with 80% training / 20%
          testing split. 10-fold cross validation applied for robust performance
          estimation. Metrics computed on held-out test set. Datasets: Dreaddit
          (text), AffectNet (facial), RAVDESS (voice).
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {MODEL_METRICS.map((m) => {
          const cvMean =
            m.crossValidationScores.reduce((a, b) => a + b, 0) /
            m.crossValidationScores.length;
          return (
            <div
              key={m.name}
              className="bg-card border border-border rounded-xl p-5 shadow-sm"
            >
              <h3 className="font-semibold text-foreground mb-3">{m.name}</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Accuracy</span>
                  <span className="font-bold text-foreground">
                    {Math.round(m.accuracy * 1000) / 10}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">F1-Score</span>
                  <span className="font-bold text-foreground">
                    {Math.round(m.f1Score * 1000) / 10}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CV Mean</span>
                  <span className="font-bold text-foreground">
                    {Math.round(cvMean * 1000) / 10}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Metrics Table */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-foreground mb-4">
          Performance Metrics Table
        </h2>
        <MetricsTable metrics={MODEL_METRICS} />
      </section>

      {/* Model Comparison Chart */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-foreground mb-4">
          Model Comparison Chart
        </h2>
        <ModelComparisonChart metrics={MODEL_METRICS} />
      </section>

      {/* Confusion Matrices */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-foreground mb-4">
          Confusion Matrices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MODEL_METRICS.map((m) => (
            <ConfusionMatrix
              key={m.name}
              modelName={m.name}
              tp={m.confusionMatrix.tp}
              fp={m.confusionMatrix.fp}
              fn={m.confusionMatrix.fn}
              tn={m.confusionMatrix.tn}
            />
          ))}
        </div>
      </section>

      {/* Cross Validation Scores */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-foreground mb-4">
          10-Fold Cross Validation Scores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MODEL_METRICS.map((m) => {
            const mean =
              m.crossValidationScores.reduce((a, b) => a + b, 0) /
              m.crossValidationScores.length;
            const std = Math.sqrt(
              m.crossValidationScores.reduce((a, b) => a + (b - mean) ** 2, 0) /
                m.crossValidationScores.length,
            );
            return (
              <div
                key={m.name}
                className="bg-card border border-border rounded-xl p-4 shadow-sm"
              >
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  {m.name}
                </h4>
                <div className="space-y-1.5 mb-3">
                  {m.crossValidationScores.map((score, i) => (
                    <div
                      key={`fold-${i + 1}`}
                      className="flex items-center gap-2"
                    >
                      <span className="text-xs text-muted-foreground w-12">
                        Fold {i + 1}
                      </span>
                      <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${score * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-foreground w-12 text-right">
                        {Math.round(score * 1000) / 10}%
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs bg-muted/50 rounded-lg px-3 py-2">
                  <span className="text-muted-foreground">
                    Mean:{" "}
                    <strong className="text-foreground">
                      {Math.round(mean * 1000) / 10}%
                    </strong>
                  </span>
                  <span className="text-muted-foreground">
                    Std:{" "}
                    <strong className="text-foreground">
                      ±{Math.round(std * 1000) / 10}%
                    </strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Algorithm Details */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-4">
          Algorithm Details
        </h2>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Text Analysis Pipeline",
                items: [
                  "NLTK Stopword Removal",
                  "TF-IDF Vectorization (max_features=5000)",
                  "Logistic Regression (C=1.0)",
                  "Dataset: Dreaddit Reddit Corpus",
                  "Classes: Stressed / Not Stressed",
                ],
              },
              {
                title: "Facial Expression Pipeline",
                items: [
                  "OpenCV Face Detection (Haar Cascade)",
                  "HOG + LBP Feature Extraction",
                  "Emotion → Stress Mapping",
                  "Dataset: AffectNet (7 emotions)",
                  "Classes: Stressed / Not Stressed",
                ],
              },
              {
                title: "Voice Analysis Pipeline",
                items: [
                  "Librosa MFCC (n_mfcc=40)",
                  "RMS Energy + ZCR Features",
                  "Spectral Centroid Analysis",
                  "Dataset: RAVDESS Audio Corpus",
                  "Classes: Stressed / Not Stressed",
                ],
              },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  {section.title}
                </h4>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <span className="text-primary mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
