import { Card, CardDescription, CardTitle } from "../components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
      </div>

      <Card className="flex flex-col items-center justify-center p-12 text-center min-h-[400px] border-dashed border-2">
        <Settings className="h-16 w-16 text-gray-300 mb-4" />
        <CardTitle className="text-2xl mb-2">Coming Soon</CardTitle>
        <CardDescription className="max-w-md text-base">
          User preferences, organization settings, and AI model configurations will be available here in a future update.
        </CardDescription>
      </Card>
    </div>
  );
}
