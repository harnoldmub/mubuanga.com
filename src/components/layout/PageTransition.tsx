"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const EASE = [0.76, 0, 0.24, 1] as const;

const LABELS: Record<string, string> = {
  "/": "AMY",
  "/projets": "WORK",
  "/about": "ABOUT",
  "/contact": "CONTACT",
  "/carte": "CARTE",
  "/rib": "RIB",
};

function labelFor(pathname: string) {
  if (LABELS[pathname]) return LABELS[pathname];
  if (pathname.startsWith("/projets/")) return "Étude de cas";
  return "Arnold Mubuanga";
}

/**
 * A single ink panel sweeps up carrying the destination name, then clears.
 * Total cost ~0.75s — short enough that it reads as part of the navigation
 * rather than as a wait.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [first, setFirst] = useState(true);

  useEffect(() => setFirst(false), []);

  if (reduced) return <>{children}</>;

  return (
    <>
      <AnimatePresence mode="wait">
        {!first && (
          <motion.div
            key={pathname}
            className="pointer-events-none fixed inset-0 z-[110] flex items-center justify-center bg-night"
            initial={{ y: "100%" }}
            animate={{ y: ["100%", "0%", "0%", "-100%"] }}
            transition={{ duration: 0.85, times: [0, 0.42, 0.52, 1], ease: EASE }}
            aria-hidden
          >
            <motion.span
              className="text-title font-semibold text-paper"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.85, times: [0, 0.42, 0.52, 0.75] }}
            >
              {labelFor(pathname)}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
      {/* The panel already covers the swap, so the incoming page needs no
          entrance of its own — and can never be left invisible by a stalled
          animation loop. */}
      {children}
    </>
  );
}
