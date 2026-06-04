/**
 * Loading spinner component.
 *
 * Displays a centered spinning indicator with an optional message.
 * Used during API calls and AI analysis processing.
 */
interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-surface-200" />
        <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-t-primary-600 animate-spin" />
      </div>
      <p className="mt-4 text-sm text-surface-500 font-medium">{message}</p>
    </div>
  );
}
