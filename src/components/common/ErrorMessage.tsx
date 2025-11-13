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
        "flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center",
        className,
      )}
      role="alert"
    >
      <div className="flex items-center justify-center rounded-full bg-destructive/10 p-3">
        <AlertCircle className="size-6 text-destructive" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-destructive">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md">{message}</p>
      </div>

      {showRetry && onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="mt-2">
          <RefreshCw className="size-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
