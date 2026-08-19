import { Plus } from "lucide-react";

import type { Faq } from "@/content/faq";

export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="divide-y divide-edge border-y border-edge">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[1.0625rem] font-medium text-ink marker:hidden">
            {item.question}
            <Plus
              className="mt-1 size-4 shrink-0 text-forest transition-transform duration-200 group-open:rotate-45"
              strokeWidth={2}
            />
          </summary>
          <p className="pr-10 pb-5 leading-relaxed text-ink-soft">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
