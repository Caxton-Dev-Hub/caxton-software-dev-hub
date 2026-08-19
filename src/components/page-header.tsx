import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  lead,
  aside,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("border-b border-edge bg-mist", className)}>
      <Container>
        <div className="grid gap-8 py-14 sm:py-20 lg:grid-cols-12 lg:items-end">
          <div className={aside ? "lg:col-span-7" : "lg:col-span-9"}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="rise mt-5 text-[clamp(2.1rem,5vw,3.5rem)] leading-[1.02] tracking-[-0.033em]">
              {title}
            </h1>
            {lead ? (
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
                {lead}
              </p>
            ) : null}
          </div>
          {aside ? <div className="lg:col-span-5">{aside}</div> : null}
        </div>
      </Container>
    </header>
  );
}
