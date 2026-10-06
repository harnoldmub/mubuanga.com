"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { megaMenu, nav } from "@/data/site";
import { profile } from "@/data/profile";
import { ArrowUpRight } from "@/components/ui/Icons";

const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Full-screen menu for touch and narrow screens: the main entries large, the
 * project shortcuts of the mega menu underneath, contact pinned at the bottom. Focus is trapped while it is open and the
 * underlying page cannot scroll.
 */
export default function MobileMenu({
  open,
  onClose,
  activeHref,
}: {
  open: boolean;
  onClose: () => void;
  activeHref: string;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a, button")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") return onClose();
      if (event.key !== "Tab" || !panel.current) return;
      const focusables = panel.current.querySelectorAll<HTMLElement>("a[href], button");
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      previous?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className="fixed inset-0 z-[105] flex flex-col overflow-y-auto bg-ink lg:hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="shell flex h-[var(--header-h)] shrink-0 items-center justify-between">
            <Image src="/assets/brand/amy-monogram.webp" alt="AMY" width={190} height={73} className="h-6 w-auto" />
            <button type="button" onClick={onClose} className="h-11 text-sm text-paper">
              Fermer
            </button>
          </div>

          <nav className="shell flex flex-1 flex-col justify-center py-6" aria-label="Navigation principale">
            <ul>
              {nav.map((item, i) => {
                const active = item.href === "/" ? activeHref === "/" : activeHref.startsWith(item.href);
                return (
                  <motion.li
                    key={item.href}
                    className="border-b border-ink-line"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.22 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className="flex items-baseline gap-4 py-3.5"
                    >
                      <span className="text-[2rem] font-medium leading-tight tracking-[-0.03em] text-paper">
                        {item.label}
                      </span>
                      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold" />}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
            <motion.div
              className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {megaMenu
                .flatMap((column) => column.links)
                .filter((link) => link.href)
                .map((link) => (
                  <Link
                    key={link.label}
                    href={link.href as string}
                    onClick={onClose}
                    className="py-1.5 text-sm text-grey hover:text-paper"
                  >
                    {link.label}
                  </Link>
                ))}
            </motion.div>
          </nav>

          <motion.div
            className="shell shrink-0 pb-10 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <p className="meta">Écrire</p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-2 inline-flex items-center gap-2 text-lg text-paper"
            >
              {profile.email}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
