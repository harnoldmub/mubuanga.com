"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const FieldScene = dynamic(() => import("./FieldScene"), { ssr: false });

/**
 * Mounts the field scene only once it nears the viewport, pauses it when it
 * leaves, and tracks the pointer inside its own box. Without WebGL the box
 * keeps a quiet dotted texture instead.
 */
export default function LabField({ className }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0, inside: false });
  const [env, setEnv] = useState<{ ok: boolean; reduced: boolean; light: boolean } | null>(null);
  const [near, setNear] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let ok = false;
    try {
      const c = document.createElement("canvas");
      ok = Boolean(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      ok = false;
    }
    setEnv({
      ok,
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      light:
        window.matchMedia("(max-width: 767px)").matches ||
        window.matchMedia("(pointer: coarse)").matches,
    });
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={box}
      className={cn("lab-field relative overflow-hidden", className)}
      onPointerMove={(event) => {
        const rect = box.current!.getBoundingClientRect();
        pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.current.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
        pointer.current.inside = true;
      }}
      onPointerLeave={() => {
        pointer.current.inside = false;
      }}
    >
      {env?.ok && near && (
        <FieldScene pointer={pointer} active={active} reduced={env.reduced} light={env.light} />
      )}
    </div>
  );
}
