import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge has to be taught this project's scales. Without it, custom
 * names collide inside a single group — `text-heading` (a size) and
 * `text-paper` (a colour) both look like `text-*`, and the last one silently
 * wins, dropping the type scale.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["mega", "display", "title", "heading", "lead", "meta"] }],
      "text-color": [
        { text: ["ink", "paper", "grey", "gold", "congo", "night", "current", "transparent"] },
        "text-ink-raised",
        "text-ink-line",
        "text-ink-soft",
        "text-paper-line",
        "text-paper-soft",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
