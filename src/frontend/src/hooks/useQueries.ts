import { useMutation } from "@tanstack/react-query";
import type { StressPrediction } from "../backend";
import { useActor } from "./useActor";

export function useProcessTextAnalysis() {
  const { actor } = useActor();

  return useMutation<
    StressPrediction,
    Error,
    { isStressed: boolean; confidence: number }
  >({
    mutationFn: async ({ isStressed, confidence }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.processTextAnalysisResult(isStressed, confidence);
    },
  });
}

export function useProcessFacialAnalysis() {
  const { actor } = useActor();

  return useMutation<
    StressPrediction,
    Error,
    { isStressed: boolean; confidence: number }
  >({
    mutationFn: async ({ isStressed, confidence }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.processFacialAnalysisResult(isStressed, confidence);
    },
  });
}

export function useProcessVoiceAnalysis() {
  const { actor } = useActor();

  return useMutation<
    StressPrediction,
    Error,
    { isStressed: boolean; confidence: number }
  >({
    mutationFn: async ({ isStressed, confidence }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.processVoiceAnalysisResult(isStressed, confidence);
    },
  });
}
