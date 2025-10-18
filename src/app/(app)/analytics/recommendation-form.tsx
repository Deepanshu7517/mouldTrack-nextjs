"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BrainCircuit, Bot, AlertTriangle, ChevronsUpDown, Check, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getRecommendations } from "./actions";
import type { PredictiveMaintenanceRecommendationsOutput } from "@/ai/flows/predictive-maintenance-recommendations";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  machineHistory: z.string().min(50, {
    message: "Machine history must be at least 50 characters.",
  }),
  preventativeMaintenanceSchedule: z.string().min(50, {
    message: "Maintenance schedule must be at least 50 characters.",
  }),
  costOfDowntime: z.coerce.number().min(1, {
    message: "Cost of downtime must be a positive number.",
  }),
});

export function RecommendationForm() {
  const [recommendations, setRecommendations] = useState<PredictiveMaintenanceRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      machineHistory: "Machine MC-003 has had 3 hydraulic pump failures in the last 6 months. Vibration levels have increased by 15% before each failure. Last oil analysis showed increased particulate matter. Operating temperature has been consistently 5-8% above normal range.",
      preventativeMaintenanceSchedule: "Quarterly hydraulic fluid replacement and filter change. Annual pump inspection. No vibration analysis is currently scheduled. Visual inspection of hoses and seals is performed monthly.",
      costOfDowntime: 5000,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendations(null);
    const result = await getRecommendations(values);
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else {
      setRecommendations(result.data);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Analysis Input</CardTitle>
          <CardDescription>Provide the necessary data for the AI analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="machineHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Machine History</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Historical data, maintenance logs, performance metrics, breakdown history..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preventativeMaintenanceSchedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preventative Maintenance Schedule</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Current schedule, task descriptions, frequencies..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="costOfDowntime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost of Downtime per Hour ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Bot className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    Get Recommendations
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>AI-Powered Recommendations</CardTitle>
          <CardDescription>Proactive maintenance advice generated by AI.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {isLoading && (
            <div className="space-y-6">
              <Skeleton className="h-8 w-1/2" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <Skeleton className="h-8 w-1/3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          )}
          {recommendations ? (
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center text-lg font-semibold font-headline mb-2">
                  <AlertTriangle className="mr-2 h-5 w-5 text-destructive" /> Predicted Failures
                </h3>
                <p className="text-muted-foreground">{recommendations.predictedFailures}</p>
              </div>
              <div>
                <h3 className="flex items-center text-lg font-semibold font-headline mb-2">
                  <Check className="mr-2 h-5 w-5 text-green-500" /> Recommended Actions
                </h3>
                <p className="text-muted-foreground whitespace-pre-line">{recommendations.recommendedActions}</p>
              </div>
              <div>
                <h3 className="flex items-center text-lg font-semibold font-headline mb-2">
                  <Sparkles className="mr-2 h-5 w-5 text-accent" /> Potential Cost Savings
                </h3>
                <p className="text-2xl font-bold text-primary">{recommendations.potentialCostSavings}</p>
              </div>
            </div>
          ) : (
            !isLoading && (
              <div className="flex h-full items-center justify-center text-center">
                <div className="space-y-2">
                    <div className="mx-auto w-fit rounded-full bg-secondary p-4">
                        <Bot className="h-10 w-10 text-muted-foreground" />
                    </div>
                  <h3 className="font-semibold">Awaiting Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Submit data to generate maintenance recommendations.
                  </p>
                </div>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
