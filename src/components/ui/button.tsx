import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary:
    "bg-forest text-white hover:bg-forest-deep active:translate-y-px shadow-[0_1px_0_0_rgba(6,54,32,0.9)]",
  secondary:
    "bg-paper text-ink border border-edge-strong hover:border-forest hover:text-forest",
  ghost: "text-forest hover:bg-mint",
  inverse: "bg-white text-forest-deep hover:bg-mint",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-md",
  md: "h-11 px-5 text-[0.9375rem] rounded-md",
  lg: "h-13 px-7 text-base rounded-md",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
