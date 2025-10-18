import { PageHeader } from "@/components/page-header";
import { RecommendationForm } from "./recommendation-form";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Predictive Maintenance"
        description="Leverage AI to analyze historical data, predict failures, and receive proactive maintenance recommendations."
      />
      <RecommendationForm />
    </div>
  );
}
