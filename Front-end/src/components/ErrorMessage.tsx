interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div
      className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
      role="alert"
    >
      <p>{message}</p>
      {onRetry && (
        <button
          className="self-start font-semibold underline underline-offset-2 sm:self-auto"
          onClick={onRetry}
          type="button"
        >
          Try again
        </button>
      )}
    </div>
  );
}
