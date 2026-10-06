"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import GamePicker from "./GamePicker";
import type { GameId } from "./GameOverlay";
import { ArrowRight } from "@/components/ui/Icons";

const GameOverlay = dynamic(() => import("./GameOverlay"), { ssr: false });
// The attract loop is desktop-only, so phones never pay for it.
const Snake = dynamic(() => import("./Snake"), { ssr: false });

/**
 * The playful half of the 404: a picker, and on a wide screen a board playing
 * itself in the background. Typing the monogram anywhere on the page starts a
 * real round — undocumented on purpose.
 */
export default function Arcade404() {
  const [game, setGame] = useState<GameId | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [attract, setAttract] = useState(false);
  const typed = useRef("");

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (wide.matches && !calm.matches) setAttract(true);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.length !== 1 || event.metaKey || event.ctrlKey) return;
      typed.current = (typed.current + event.key).toUpperCase().slice(-3);
      if (typed.current === "AMY") {
        typed.current = "";
        setGame("snake");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setShowPicker((v) => !v)}
          className="btn btn-ghost"
         
          aria-expanded={showPicker}
        >
          Jouer
          <ArrowRight className="arrow h-4 w-4" />
        </button>
      </div>

      {showPicker && (
        <div className="mt-6 max-w-md animate-[rib-in_0.35s_cubic-bezier(0.16,1,0.3,1)_both]">
          <GamePicker onPick={setGame} />
        </div>
      )}

      {attract && (
        <div className="pointer-events-none mt-14 hidden max-w-xl opacity-40 transition-opacity duration-500 hover:opacity-70 lg:block">
          <div className="pointer-events-auto">
            <button
              type="button"
              onClick={() => setGame("snake")}
              aria-label="Jouer à AMY Snake"
              className="block w-full text-left"
             
            >
              <Snake autoplay compact />
            </button>
          </div>
        </div>
      )}

      {game && <GameOverlay game={game} onClose={() => setGame(null)} />}
    </>
  );
}
