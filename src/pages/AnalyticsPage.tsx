import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics</h1>
      </div>

      <Card className="flex flex-col items-center justify-center p-12 text-center min-h-[400px] border-dashed border-2">
        <BarChart3 className="h-16 w-16 text-gray-300 mb-4" />
        <CardTitle className="text-2xl mb-2">Coming Soon</CardTitle>
        <CardDescription className="max-w-md text-base">
          Advanced AI analytics, incident forecasting, and deep telemetry insights are currently in development. Check back soon!
        </CardDescription>
      </Card>
    </div>
  );
}
