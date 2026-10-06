import Marquee from "@/components/ui/Marquee";
import { expertise } from "@/data/site";

/** The working stack, on one line: static where it fits, scrolling where it does not. */
export default function ExpertiseBand() {
  return (
    <section aria-label="Expertises" className="border-y border-ink-line">
      <div className="shell hidden h-20 items-center justify-between gap-6 lg:flex">
        {expertise.map((item) => (
          <span key={item} className="text-[1.0625rem] text-paper/80">
            {item}
          </span>
        ))}
      </div>
      <Marquee
        items={expertise}
        duration={32}
        className="py-5 lg:hidden"
        itemClassName="text-lg text-paper/80"
      />
    </section>
  );
}
