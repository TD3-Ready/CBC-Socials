import { motion } from "framer-motion";
import type { CalEvent } from "../lib/types";
import { fmtFullDate, fmtTime, isAllDay } from "../lib/format";
import { heroVariants } from "../lib/motion";
import { downloadICS } from "../lib/ics";

interface Props {
  events: CalEvent[];
  loaded: boolean;
  error: string | null;
  onOpen: (id: string, y: number) => void;
}

export function Hero({ events, loaded, error, onOpen }: Props) {
  const now = new Date();
  const next = events.filter((e) => e.end >= now).sort((a, b) => +a.start - +b.start)[0];

  let title = "Loading the calendar…";
  let meta = " ";

  if (error) {
    title = "Calendar unavailable";
    meta = "We couldn't load the calendar. Please refresh in a minute.";
  } else if (loaded && !next) {
    title = "No upcoming events";
    meta = "Check back soon — new dates are added each week.";
  } else if (next) {
    title = next.title;
    const when = isAllDay(next.start, next.end)
      ? fmtFullDate(next.start)
      : `${fmtFullDate(next.start)} · ${fmtTime(next.start)} – ${fmtTime(next.end)}`;
    meta = next.location ? `${when} · ${next.location}` : when;
  }

  return (
    <section className="pb-10 md:pb-14 border-b border-line">
      <motion.p
        className="text-[12px] uppercase tracking-[0.16em] font-medium text-gold-ink mb-4"
        variants={heroVariants}
        custom={0}
        initial="hidden"
        animate="show"
      >
        Next gathering
      </motion.p>
      <motion.h1
        key={title}
        className="font-display font-medium text-[clamp(34px,5.4vw,64px)] leading-[1.04] tracking-[-0.022em] max-w-[18ch] mb-5"
        variants={heroVariants}
        custom={1}
        initial="hidden"
        animate="show"
      >
        {title}
      </motion.h1>
      <motion.p
        key={meta}
        className="text-[17px] text-ink-2 mb-7"
        variants={heroVariants}
        custom={2}
        initial="hidden"
        animate="show"
      >
        {meta}
      </motion.p>

      {next && (
        <motion.div
          className="flex gap-3 flex-wrap"
          variants={heroVariants}
          custom={3}
          initial="hidden"
          animate="show"
        >
          <button
            type="button"
            onClick={() => downloadICS(next)}
            className="px-[18px] py-[11px] rounded-full text-[14px] font-medium bg-ink text-paper hover:bg-[#2E2C26] transition-colors active:translate-y-px"
          >
            Add to my calendar
          </button>
          <button
            type="button"
            onClick={(e) => onOpen(next.id, e.clientY)}
            className="px-[18px] py-[11px] rounded-full text-[14px] font-medium border border-line-2 text-ink hover:bg-paper-2 transition-colors active:translate-y-px"
          >
            Event details
          </button>
        </motion.div>
      )}
    </section>
  );
}
