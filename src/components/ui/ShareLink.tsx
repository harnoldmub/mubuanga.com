"use client";

import { useState } from "react";

/**
 * The link is the thing people actually pass around — in a message, an email,
 * a bio. So it is shown in full, tappable, with the phone's own share sheet
 * when there is one and a clipboard copy when there isn't.
 */
export default function ShareLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const display = url.replace(/^https?:\/\//, "");

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Arnold Mubuanga Yate — AMY", url });
        return;
      } catch {
        return; // sheet dismissed
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-10 border-t border-ink-line pt-8">
      <p className="meta">Partager cette carte</p>

      <button
        type="button"
        onClick={share}
       
        className="group mt-4 flex w-full items-center justify-between gap-4 border border-ink-line px-5 py-4 text-left transition-colors duration-300 hover:border-paper/40"
      >
        <span className="min-w-0 truncate font-mono text-sm text-paper">{display}</span>
        <span
          className={`shrink-0 font-mono text-[0.68rem] uppercase tracking-[0.14em] transition-colors duration-200 ${
            copied ? "text-gold" : "text-paper/45 group-hover:text-paper"
          }`}
        >
          {copied ? "Copié" : "Partager"}
        </span>
      </button>

      <p className="mt-3 text-sm leading-6 text-paper/55">
        Envoyez ce lien pour transmettre mes coordonnées.
      </p>

      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Lien copié" : ""}
      </span>
    </div>
  );
}
