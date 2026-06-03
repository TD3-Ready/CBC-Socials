import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import type { CalEvent } from "../lib/types";
import { CATEGORY_LABEL } from "../lib/types";
import { fmtFullDate, fmtTime, isAllDay } from "../lib/format";
import { easeOut, spring } from "../lib/motion";
import { modalTopFor, useVisibleRegion } from "../lib/viewport";

const PIP: Record<CalEvent["category"], string> = {
  worship: "bg-cat-worship",
  study: "bg-cat-study",
  music: "bg-cat-music",
  youth: "bg-cat-youth",
  outreach: "bg-cat-outreach",
  other: "bg-cat-other",
};

interface Props {
  day: Date;
  events: CalEvent[];
  onOpenEvent: (id: string) => void;
  onClose: () => void;
}

export function DaySheet({ day, events, onOpenEvent, onClose }: Props) {
  const region = useVisibleRegion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const dayEvents = useMemo(() => {
    const start = new Date(day); start.setHours(0, 0, 0, 0);
    const end = new Date(day); end.setHours(23, 59, 59, 999);
    return events
      .filter((e) => e.end >= start && e.start <= end)
      .sort((a, b) => +a.start - +b.start);
  }, [day, events]);

  const top = modalTopFor(region, 360 + Math.min(dayEvents.length, 6) * 56);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={easeOut}
        onClick={onClose}
        className="fixed inset-0 z-[9998] backdrop-blur-md"
        style={{ background: "rgba(20,18,12,0.32)" }}
      />

      <div
        className="absolute left-0 right-0 z-[9999] flex justify-center px-4"
        style={{ top, pointerEvents: "none" }}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0, scale: 0.94, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={spring}
          onClick={(e) => e.stopPropagation()}
          style={{ pointerEvents: "auto" }}
          className="bg-card rounded-[28px] p-6 md:p-8 w-full max-w-[520px] shadow-lift"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-ink-2 hover:bg-paper-2 hover:text-ink p-1.5 rounded-full transition-colors"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gold-ink m-0 mb-2">
            {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"}
          </p>
          <h2 className="font-display font-medium text-[22px] md:text-[28px] tracking-[-0.015em] leading-[1.15] m-0 mb-6 pr-8">
            {fmtFullDate(day)}
          </h2>

          {!dayEvents.length ? (
            <p className="text-[14px] text-ink-2">Nothing scheduled this day.</p>
          ) : (
            <ol className="list-none m-0 p-0 flex flex-col">
              {dayEvents.map((ev, i) => (
                <motion.li
                  key={ev.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.04, duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                  onClick={() => onOpenEvent(ev.id)}
                  whileHover={{ x: 2 }}
                  className="grid grid-cols-[60px_1fr] gap-3 py-3 px-2 -mx-2 border-t border-line first:border-t-0 cursor-pointer rounded-lg hover:bg-paper-2 transition-colors"
                >
                  <div className="text-[13px] tabular text-ink-2 pt-0.5">
                    {isAllDay(ev.start, ev.end) ? "All day" : `${fmtTime(ev.start)}`}
                  </div>
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.08em] uppercase text-ink-2 mb-0.5">
                      <span className={`w-[6px] h-[6px] rounded-full ${PIP[ev.category]}`} />
                      {CATEGORY_LABEL[ev.category]}
                    </div>
                    <p className="text-[15px] font-medium m-0 leading-[1.3]">{ev.title}</p>
                    {ev.location && (
                      <div className="text-[12.5px] text-ink-2 mt-0.5">{ev.location}</div>
                    )}
                  </div>
                </motion.li>
              ))}
            </ol>
          )}
        </motion.div>
      </div>
    </>
  );
}
