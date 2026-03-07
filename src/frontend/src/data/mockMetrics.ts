export interface ModelMetrics {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: {
    tp: number;
    fp: number;
    fn: number;
    tn: number;
  };
  crossValidationScores: number[];
  trainTestSplit: { train: number; test: number };
}

export const MODEL_METRICS: ModelMetrics[] = [
  {
    name: "Text Analysis",
    accuracy: 0.8742,
    precision: 0.8891,
    recall: 0.8634,
    f1Score: 0.8761,
    confusionMatrix: { tp: 412, fp: 51, fn: 67, tn: 470 },
    crossValidationScores: [
      0.862, 0.878, 0.891, 0.869, 0.883, 0.875, 0.887, 0.871, 0.894, 0.866,
    ],
    trainTestSplit: { train: 80, test: 20 },
  },
  {
    name: "Facial Expression",
    accuracy: 0.8124,
    precision: 0.8267,
    recall: 0.7983,
    f1Score: 0.8123,
    confusionMatrix: { tp: 381, fp: 80, fn: 97, tn: 442 },
    crossValidationScores: [
      0.798, 0.821, 0.834, 0.809, 0.818, 0.825, 0.811, 0.829, 0.816, 0.803,
    ],
    trainTestSplit: { train: 80, test: 20 },
  },
  {
    name: "Voice Analysis",
    accuracy: 0.8456,
    precision: 0.8612,
    recall: 0.8301,
    f1Score: 0.8454,
    confusionMatrix: { tp: 396, fp: 64, fn: 81, tn: 459 },
    crossValidationScores: [
      0.831, 0.849, 0.862, 0.838, 0.851, 0.847, 0.856, 0.843, 0.858, 0.835,
    ],
    trainTestSplit: { train: 80, test: 20 },
  },
];

export const CHART_COLORS = {
  text: "#0d9488",
  facial: "#059669",
  voice: "#0891b2",
};
