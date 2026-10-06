"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { megaMenu, type MegaLink } from "@/data/site";
import { projectImage } from "@/data/projects";

const DEFAULT_PREVIEW = { label: "Daylora", note: "SaaS mariage", image: "daylora" };

/**
 * Three columns of entries plus a live preview: hovering or focusing a
 * project swaps the capture on the right, so the menu doubles as a glance at
 * the work. Entries without a public page yet are listed, but not linked.
 */
export default function MegaMenu({ onNavigate }: { onNavigate: () => void }) {
  const [preview, setPreview] = useState<{ label: string; note: string; image: string }>(
    DEFAULT_PREVIEW,
  );

  const show = (link: MegaLink) => {
    if (link.image) setPreview({ label: link.label, note: link.note, image: link.image });
  };

  return (
    <div className="border-b border-ink-line bg-ink/95 backdrop-blur-xl">
      <div className="shell grid grid-cols-12 gap-8 py-10">
        {megaMenu.map((column) => (
          <div key={column.title} className="col-span-3">
            <p className="meta">{column.title}</p>
            <ul className="mt-5 space-y-1">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <Link
                      href={link.href}
                      onClick={onNavigate}
                      onPointerEnter={() => show(link)}
                      onFocus={() => show(link)}
                      className="group -mx-3 flex items-baseline justify-between gap-4 rounded-sm px-3 py-2.5 transition-colors duration-200 hover:bg-ink-soft focus-visible:bg-ink-soft"
                    >
                      <span className="text-[1.0625rem] font-medium text-paper">{link.label}</span>
                      <span className="text-sm text-grey transition-colors duration-200 group-hover:text-gold">
                        {link.note}
                      </span>
                    </Link>
                  ) : (
                    <span className="-mx-3 flex items-baseline justify-between gap-4 px-3 py-2.5">
                      <span className="text-[1.0625rem] font-medium text-paper/45">{link.label}</span>
                      <span className="text-sm text-grey/70">Bientôt en ligne</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-3">
          <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-ink-raised">
            <AnimatePresence initial={false}>
              <motion.div
                key={preview.image}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src={projectImage(preview.image)}
                  alt=""
                  fill
                  sizes="24vw"
                  className="object-cover object-top"
                />
              </motion.div>
            </AnimatePresence>
            <span className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-ink-line" />
          </div>
          <p className="mt-3 flex justify-between text-sm">
            <span className="text-paper">{preview.label}</span>
            <span className="text-grey">{preview.note}</span>
          </p>
          <Link
            href="/projets"
            onClick={onNavigate}
            className="link-underline mt-5 inline-block text-sm text-gold"
          >
            Tous les projets
          </Link>
        </div>
      </div>
    </div>
  );
}
