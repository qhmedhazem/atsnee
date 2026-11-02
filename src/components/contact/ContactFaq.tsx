import { Plus } from "lucide-react";
import type { ContactPage } from "@/payload-types";
import RichText from "@/components/RichText";

// Native <details>: works without JS; the first answer starts open.
export default function ContactFaq({ items }: { items: NonNullable<ContactPage["faq"]> }) {
  return (
    <div className="divide-y divide-gray-200 rounded-2xl border border-gray-300 bg-white">
      {items.map((item, i) => (
        <details key={item.id ?? i} open={i === 0} className="group px-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-bold text-gray-900 [&::-webkit-details-marker]:hidden">
            {item.question}
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-light-blue-100/60 text-light-blue-800 motion-safe:transition-transform group-open:rotate-45">
              <Plus className="size-4" aria-hidden />
            </span>
          </summary>
          <div className="pb-4 text-gray-700">
            <RichText data={item.answer} enableGutter={false} enableProse={false} />
          </div>
        </details>
      ))}
    </div>
  );
}
