/**
 * Error message display component.
 *
 * Shows an error message with a retry button.
 * Used when API calls fail or unexpected errors occur.
 */
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="rounded-lg border border-danger-500/20 bg-danger-500/5 p-6 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-danger-500/10">
        <svg className="h-6 w-6 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-danger-600">Something went wrong</h3>
      <p className="mt-1 text-sm text-surface-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center rounded-md bg-danger-500 px-4 py-2 text-sm font-medium text-white hover:bg-danger-600 transition-colors cursor-pointer"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
