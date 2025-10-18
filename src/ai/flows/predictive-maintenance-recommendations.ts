'use server';

/**
 * @fileOverview AI-powered predictive maintenance recommendations flow.
 *
 * - getPredictiveMaintenanceRecommendations - A function that analyzes historical data to predict potential machine failures and recommends proactive maintenance.
 * - PredictiveMaintenanceRecommendationsInput - The input type for the getPredictiveMaintenanceRecommendations function.
 * - PredictiveMaintenanceRecommendationsOutput - The return type for the getPredictiveMaintenanceRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictiveMaintenanceRecommendationsInputSchema = z.object({
  machineHistory: z
    .string()
    .describe(
      'Historical data for the machine, including maintenance logs, performance metrics, and breakdown history.'
    ),
  preventativeMaintenanceSchedule: z
    .string()
    .describe(
      'The current preventative maintenance schedule, including task descriptions and frequencies.'
    ),
  costOfDowntime: z.number().describe('The estimated cost of downtime per hour.'),
});
export type PredictiveMaintenanceRecommendationsInput = z.infer<
  typeof PredictiveMaintenanceRecommendationsInputSchema
>;

const PredictiveMaintenanceRecommendationsOutputSchema = z.object({
  predictedFailures: z
    .string()
    .describe(
      'A description of potential machine failures predicted by the AI model.'
    ),
  recommendedActions: z
    .string()
    .describe(
      'Proactive maintenance recommendations to prevent predicted failures.'
    ),
  potentialCostSavings: z
    .string()
    .describe(
      'An estimate of potential cost savings from implementing the recommended actions.'
    ),
});
export type PredictiveMaintenanceRecommendationsOutput = z.infer<
  typeof PredictiveMaintenanceRecommendationsOutputSchema
>;

export async function getPredictiveMaintenanceRecommendations(
  input: PredictiveMaintenanceRecommendationsInput
): Promise<PredictiveMaintenanceRecommendationsOutput> {
  return predictiveMaintenanceRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictiveMaintenanceRecommendationsPrompt',
  input: {schema: PredictiveMaintenanceRecommendationsInputSchema},
  output: {schema: PredictiveMaintenanceRecommendationsOutputSchema},
  prompt: `You are an AI assistant that analyzes machine history and preventative maintenance schedules to predict potential machine failures and recommend proactive maintenance.

  Analyze the provided machine history, current preventative maintenance schedule, and cost of downtime to identify potential cost-saving opportunities by preventing failures.

  Machine History: {{{machineHistory}}}
  Preventative Maintenance Schedule: {{{preventativeMaintenanceSchedule}}}
  Cost of Downtime per Hour: {{{costOfDowntime}}}

  Based on this information, provide the following:
  1.  Predicted Failures: Describe potential machine failures.
  2.  Recommended Actions: Provide proactive maintenance recommendations to prevent these failures.
  3.  Potential Cost Savings: Estimate potential cost savings from implementing the recommended actions.
  \n  Format your response as a well-structured report.`,
});

const predictiveMaintenanceRecommendationsFlow = ai.defineFlow(
  {
    name: 'predictiveMaintenanceRecommendationsFlow',
    inputSchema: PredictiveMaintenanceRecommendationsInputSchema,
    outputSchema: PredictiveMaintenanceRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
