import { cn } from "@/lib/utils";

const control =
  "w-full rounded-md border border-edge-strong bg-paper px-3.5 py-2.5 text-[0.9375rem] text-ink transition-colors placeholder:text-ink-faint/70 focus:border-forest focus:outline-none focus-visible:outline-none";

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="block font-mono text-[0.6875rem] tracking-[0.14em] text-ink-soft uppercase"
      >
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p className="text-[0.8125rem] text-ink-faint">{hint}</p>
      ) : null}
      {error ? (
        <p className="text-[0.8125rem] text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={cn(control, "min-h-32 resize-y", className)} {...props} />
  );
}

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(control, "pr-8", className)} {...props} />;
}
