import type { ReactNode } from "react";

import Grain from "./Grain";
import Loader from "./Loader";
import PageTransition from "./PageTransition";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import SmoothScroll from "./SmoothScroll";

/**
 * Everything that makes the portfolio feel like the portfolio. Kept out of the
 * root layout so the utility routes can opt out of it entirely.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <Loader />
      <SmoothScroll />
      <Grain />
      <SiteHeader />
      <PageTransition>
        <main id="main" className="relative z-[2]">
          {children}
        </main>
        <SiteFooter />
      </PageTransition>
    </>
  );
}
