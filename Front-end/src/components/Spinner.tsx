interface SpinnerProps {
  label?: string;
}

export function Spinner({ label = "Loading" }: SpinnerProps) {
  return (
    <div className="grid min-h-56 place-items-center" role="status">
      <span className="size-8 animate-spin rounded-full border-4 border-emerald-700 border-r-transparent" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
