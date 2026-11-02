"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

// Copies `value`; shows a check for 1.5s.
export default function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={async () => {
        await navigator.clipboard.writeText(value).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 hover:text-light-blue-800 focus-visible:outline-2 focus-visible:outline-light-blue-800"
    >
      {copied ? <Check className="size-4 text-green-700" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      <span className="sr-only" aria-live="polite">{copied ? "✓" : ""}</span>
    </button>
  );
}
