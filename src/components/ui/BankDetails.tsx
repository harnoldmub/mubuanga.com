"use client";

import { useState } from "react";

export type BankField = {
  label: string;
  /** Shown as-is, grouped for reading. */
  value: string;
  /** What actually lands on the clipboard — an IBAN is entered unspaced. */
  copyValue?: string;
  copyable?: boolean;
  /** The one line the visitor came for. */
  primary?: boolean;
};

function CopyIcon({ done }: { done: boolean }) {
  return done ? (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 8.5 6.2 12 13 4.5" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="5.6" y="5.6" width="8" height="8" rx="1" />
      <path d="M10.4 2.4H2.4v8" />
    </svg>
  );
}

/**
 * The document block. Copying happens entirely in the browser — no request
 * leaves the page, and nothing about these details is sent anywhere.
 */
export default function BankDetails({ fields }: { fields: readonly BankField[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000);
    } catch {
      setCopied(null);
    }
  };

  const all = fields
    .map((f) => `${f.label} : ${f.copyValue ?? f.value}`)
    .join("\n");

  return (
    <>
      <div className="border border-paper-line bg-paper-soft">
        <dl>
          {fields.map((field) => {
            const isCopied = copied === field.label;
            return (
              <div
                key={field.label}
                className="flex items-start justify-between gap-4 border-b border-paper-line px-5 py-3.5 last:border-b-0 sm:px-6 sm:py-4"
              >
                <div className="min-w-0">
                  <dt className="meta text-ink/45">{field.label}</dt>
                  <dd
                    className={
                      field.primary
                        ? "mt-2 whitespace-nowrap font-mono tabular-nums text-[clamp(0.85rem,3.6vw,1.18rem)] tracking-[0.02em] text-ink"
                        : "mt-2 font-mono text-[clamp(0.85rem,3.2vw,1rem)] text-ink"
                    }
                  >
                    {field.value}
                  </dd>
                </div>

                {field.copyable !== false && (
                  <button
                    type="button"
                    onClick={() => copy(field.label, field.copyValue ?? field.value)}
                    className={`-mr-2 inline-flex min-h-11 shrink-0 items-center gap-2 px-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] transition-colors duration-200 ${
                      isCopied ? "text-gold" : "text-ink/40 hover:text-ink"
                    }`}
                    aria-label={`Copier ${field.label}`}
                  >
                    {/* The prompt is desktop-only, the confirmation always shows —
                        a silent icon flip is not feedback on a phone. */}
                    <span className={isCopied ? "inline" : "hidden sm:inline"}>
                      {isCopied ? "Copié" : "Copier"}
                    </span>
                    <CopyIcon done={isCopied} />
                  </button>
                )}
              </div>
            );
          })}
        </dl>
      </div>

      <button
        type="button"
        onClick={() => copy("__all", all)}
        className="btn btn-primary mt-3 w-full justify-center"
      >
        {copied === "__all" ? "Coordonnées copiées" : "Copier les coordonnées"}
      </button>

      <span role="status" aria-live="polite" className="sr-only">
        {copied === "__all" ? "Coordonnées copiées" : copied ? `${copied} copié` : ""}
      </span>
    </>
  );
}
