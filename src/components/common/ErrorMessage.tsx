import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorMessageProps {
  /** Error message to display */
  message?: string;
  /** Optional title for the error */
  title?: string;
  /** Callback action when retry button is clicked */
  onRetry?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Show retry button */
  showRetry?: boolean;
}

export function ErrorMessage({
  message = "Something went wrong. Please try again.",
  title = "Error",
  onRetry,
  className,
  showRetry = true,
}: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border-2 p-8 text-center shadow-lg transition-shadow hover:shadow-xl",
        className,
      )}
      style={{
        borderColor: "var(--custom-border)",
        backgroundColor: "var(--custom-surface)",
      }}
      role="alert"
    >
      <div
        className="flex items-center justify-center rounded-full p-3 shadow-sm"
        style={{
          backgroundColor: "var(--custom-bg-secondary)",
        }}
      >
        <AlertCircle className="size-6" style={{ color: "var(--custom-accent)" }} />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold" style={{ color: "var(--custom-text-primary)" }}>
          {title}
        </h3>
        <p className="text-sm max-w-md" style={{ color: "var(--custom-text-secondary)" }}>
          {message}
        </p>
      </div>

      {showRetry && onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="mt-2 border-2 rounded-md shadow-sm transition-all hover:shadow-md focus:ring-2 focus:ring-offset-2"
          style={{
            borderColor: "var(--custom-border)",
            backgroundColor: "var(--custom-bg-primary)",
            color: "var(--custom-text-primary)",
          }}
        >
          <RefreshCw className="size-4" style={{ color: "var(--custom-accent)" }} />
          Try Again
        </Button>
      )}
    </div>
  );
}
