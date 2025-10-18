"use server";

import {
  getPredictiveMaintenanceRecommendations,
  PredictiveMaintenanceRecommendationsInput,
  PredictiveMaintenanceRecommendationsOutput,
} from "@/ai/flows/predictive-maintenance-recommendations";

export async function getRecommendations(
  input: PredictiveMaintenanceRecommendationsInput
): Promise<{ data: PredictiveMaintenanceRecommendationsOutput | null; error: string | null }> {
  try {
    const output = await getPredictiveMaintenanceRecommendations(input);
    return { data: output, error: null };
  } catch (e: any) {
    console.error("Error getting recommendations:", e);
    return { data: null, error: e.message || "An unknown error occurred." };
  }
}
