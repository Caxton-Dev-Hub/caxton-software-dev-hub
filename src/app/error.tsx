"use client";

import { useEffect } from "react";

import { Container } from "@/components/ui/container";
import { Button, ButtonLink } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh items-center bg-mist">
      <Container>
        <div className="max-w-xl">
          <p className="font-mono text-[0.6875rem] tracking-[0.2em] text-forest uppercase">
            Something broke
          </p>
          <h1 className="mt-5 text-[clamp(2rem,4.6vw,3rem)] leading-[1.05] tracking-[-0.03em]">
            We hit an unexpected error
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            This is on us, not you. Try again — and if it keeps happening, send
            us the reference below and we will look into it.
          </p>

          {error.digest ? (
            <p className="mt-4 font-mono text-[0.8125rem] text-ink-faint">
              Reference: {error.digest}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={reset} size="lg">
              Try again
            </Button>
            <ButtonLink href="/contact" variant="secondary" size="lg">
              Report it
            </ButtonLink>
          </div>
        </div>
      </Container>
    </main>
  );
}
