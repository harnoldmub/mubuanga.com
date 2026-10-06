"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import { nav } from "@/data/site";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Transparent over the hero, a dark glass bar once the page moves. Hides on
 * the way down and returns on the way up. "Projets" opens the mega menu on
 * hover, and on click/Enter of its disclosure button for keyboard users.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<number>();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 200 && y > last + 2);
      if (y < last - 2) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMega(false);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    if (hidden) setMega(false);
  }, [hidden]);

  useEffect(() => {
    if (!mega) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMega(false);
        headerRef.current?.querySelector<HTMLElement>("[data-mega-trigger]")?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMega(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [mega]);

  const open = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setMega(true);
  }, []);
  const scheduleClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMega(false), 140);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const solid = scrolled || mega;

  return (
    <>
      <header
        ref={headerRef}
        onPointerLeave={scheduleClose}
        className={cn(
          "fixed inset-x-0 top-0 z-[100] transition-transform duration-500 ease-expo",
          hidden && !mobile && "-translate-y-full",
        )}
      >
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 border-b transition-[background-color,border-color,backdrop-filter] duration-500",
            solid
              ? "border-ink-line bg-ink/80 backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        />

        <div className="shell relative flex h-[var(--header-h)] items-center gap-6">
          <Link
            href="/"
            className="group flex items-baseline gap-2 text-paper"
            aria-label="Arnold Mubuanga — accueil"
          >
            <span className="whitespace-nowrap text-[1.05rem] font-semibold tracking-[-0.03em]">Arnold Mubuanga</span>
            <span className="hidden text-sm text-grey transition-colors duration-300 group-hover:text-gold sm:inline">
              Studio digital
            </span>
          </Link>

          <nav aria-label="Navigation principale" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) =>
                "mega" in item ? (
                  <li key={item.href} className="flex items-center" onPointerEnter={open}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn("nav-link", isActive(item.href) && "is-active")}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      data-mega-trigger
                      aria-expanded={mega}
                      aria-controls="mega-menu"
                      aria-label={mega ? "Fermer le menu des projets" : "Ouvrir le menu des projets"}
                      onClick={() => (mega ? setMega(false) : open())}
                      className="-ml-2 grid h-8 w-6 place-items-center text-grey hover:text-paper"
                    >
                      <svg
                        viewBox="0 0 10 6"
                        className={cn("h-1.5 w-2.5 transition-transform duration-300", mega && "rotate-180")}
                        aria-hidden
                      >
                        <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                    </button>
            <AnimatePresence>
              {mega && (
                <motion.div
                  id="mega-menu"
                  className="fixed inset-x-0 top-[var(--header-h)] hidden lg:block"
                  onPointerEnter={open}
                  initial={reduced ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <MegaMenu onNavigate={() => setMega(false)} />
                </motion.div>
              )}
            </AnimatePresence>
                  </li>
                ) : (
                  <li key={item.href} onPointerEnter={scheduleClose}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn("nav-link", isActive(item.href) && "is-active")}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="ml-4 hidden lg:block">
            <Link href="/contact" className="btn btn-primary min-h-0 py-2.5">
              Me contacter
            </Link>
          </div>

          <button
            type="button"
            className="ml-auto flex h-11 items-center gap-3 text-sm text-paper lg:hidden"
            aria-expanded={mobile}
            aria-controls="mobile-menu"
            onClick={() => setMobile(true)}
          >
            Menu
            <span aria-hidden className="flex w-5 flex-col gap-[5px]">
              <span className="h-px w-full bg-paper" />
              <span className="h-px w-3/5 self-end bg-paper" />
            </span>
          </button>
        </div>

      </header>

      <MobileMenu open={mobile} onClose={() => setMobile(false)} activeHref={pathname} />
    </>
  );
}
