import { Quote } from "lucide-react";

import { type Testimonial } from "@/content/site";

export function TestimonialGrid({ items }: { items: Testimonial[] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-lg border border-edge bg-edge sm:grid-cols-2">
      {items.map((item) => (
        <figure key={item.name} className="flex flex-col bg-paper p-7">
          <Quote className="size-5 text-signal" strokeWidth={1.75} />
          <blockquote className="mt-4 flex-1 text-[1.0625rem] leading-relaxed text-ink">
            {item.quote}
          </blockquote>
          <figcaption className="mt-6 border-t border-edge pt-4">
            <span className="block text-[0.9375rem] font-medium text-ink">
              {item.name}
            </span>
            <span className="mt-0.5 block font-mono text-[0.6875rem] tracking-wider text-ink-faint uppercase">
              {item.role}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
