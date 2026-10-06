"use client";

import type { GameId } from "./GameOverlay";
import { ArrowRight } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

const GAMES: readonly { id: GameId; index: string; name: string; note: string }[] = [
  { id: "snake", index: "01", name: "Snake", note: "Flèches ou swipe" },
  { id: "breakout", index: "02", name: "Breakout", note: "Le mur écrit AMY" },
];

/** The two entries, in the same numbered rhythm as the rest of the site. */
export default function GamePicker({
  onPick,
  tone = "dark",
  className,
}: {
  onPick: (id: GameId) => void;
  tone?: "dark" | "light";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <ul className={cn("w-full", className)}>
      {GAMES.map((game) => (
        <li
          key={game.id}
          className={cn("border-t last:border-b", light ? "border-paper-line" : "border-ink-line")}
        >
          <button
            type="button"
            onClick={() => onPick(game.id)}
           
            className="group flex w-full items-center justify-between gap-4 py-4 text-left"
          >
            <span className="flex items-baseline gap-4">
              <span className="meta text-gold">{game.index}</span>
              <span
                className={cn(
                  "font-display text-lg font-semibold tracking-[-0.02em] transition-transform duration-300 ease-expo group-hover:translate-x-1",
                  light ? "text-ink" : "text-paper",
                )}
              >
                {game.name}
              </span>
            </span>
            <span className="flex items-center gap-3">
              <span className="meta hidden sm:inline">{game.note}</span>
              <ArrowRight
                className={cn(
                  "h-4 w-4 transition-transform duration-300 ease-expo group-hover:translate-x-1",
                  light ? "text-ink/45" : "text-paper/45",
                )}
              />
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
