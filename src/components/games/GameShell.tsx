"use client";

import type { RefObject } from "react";

import { cn } from "@/lib/utils";

/**
 * The frame both games share: the same mono metadata, the same rules, the same
 * buttons as the rest of the site. Only the canvas inside it differs.
 */
export default function GameShell({
  title,
  score,
  best,
  extra,
  taunt,
  status,
  soundOn,
  onToggleSound,
  onStart,
  hint,
  canvasRef,
  aspect,
  compact = false,
}: {
  title: string;
  score: number;
  best: number;
  extra?: { label: string; value: string };
  taunt: string | null;
  status: "idle" | "playing" | "over";
  soundOn: boolean;
  onToggleSound: () => void;
  onStart: () => void;
  hint: string;
  canvasRef: RefObject<HTMLCanvasElement>;
  aspect: number;
  compact?: boolean;
}) {
  const pad = (n: number) => String(Math.min(n, 999)).padStart(3, "0");

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="meta text-paper">{title}</p>
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <p className="meta">
            Score <span className="text-paper">{pad(score)}</span>
          </p>
          {extra && (
            <p className="meta">
              {extra.label} <span className="text-paper">{extra.value}</span>
            </p>
          )}
          <p className="meta">
            Record <span className="text-paper">{pad(best)}</span>
          </p>
          <button
            type="button"
            onClick={onToggleSound}
            className="meta transition-colors duration-200 hover:text-paper"
            aria-pressed={soundOn}
          >
            Son {soundOn ? "activé" : "coupé"}
          </button>
        </div>
      </div>

      <div
        className="relative mt-4 w-full overflow-hidden border border-ink-line bg-ink"
        style={{ aspectRatio: String(aspect) }}
      >
        <canvas ref={canvasRef} className="block h-full w-full touch-none" />

        {/* Taunts sit over the board, never in the chrome. */}
        <span
          className={cn(
            "pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold transition-opacity duration-300",
            taunt ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={!taunt}
        >
          {taunt}
        </span>

        {status !== "playing" && (
          <div className="absolute inset-0 grid place-items-center bg-ink/85 px-6 text-center backdrop-blur-[2px]">
            <div>
              <p
                className={cn(
                  "font-display font-semibold tracking-[-0.03em] text-paper",
                  compact ? "text-xl" : "text-title",
                )}
              >
                {status === "over" ? "PARTIE TERMINÉE" : title}
              </p>
              {status === "over" && (
                <p className="meta mt-3">
                  Score <span className="text-paper">{pad(score)}</span>
                  {score >= best && score > 0 && (
                    <span className="text-gold"> · nouveau record</span>
                  )}
                </p>
              )}
              <button type="button" onClick={onStart} className="btn btn-primary mt-6">
                {status === "over" ? "Rejouer" : "Jouer"}
              </button>
              <p className="meta mt-5 max-w-[26ch]">{hint}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
