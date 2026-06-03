import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import type { CalEvent, Category } from "../lib/types";
import { dayVariants, easeOut, monthGridVariants } from "../lib/motion";
import { fmtMonthLong, fmtTime, sameDay } from "../lib/format";
import { EventPill } from "./EventPill";

interface Props {
  view: Date;
  events: CalEvent[];
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onOpen: (id: string) => void;
}

const DOT_BG: Record<Category, string> = {
  worship: "bg-cat-worship",
  study: "bg-cat-study",
  music: "bg-cat-music",
  youth: "bg-cat-youth",
  outreach: "bg-cat-outreach",
  other: "bg-cat-other",
};

function uniqueCategories(events: CalEvent[]): Category[] {
  const seen = new Set<Category>();
  const out: Category[] = [];
  for (const e of events) {
    if (!seen.has(e.category)) {
      seen.add(e.category);
      out.push(e.category);
    }
  }
  return out;
}

function buildDays(view: Date) {
  const year = view.getFullYear();
  const month = view.getMonth();
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const gridStart = new Date(year, month, 1 - startWeekday);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push(d);
  }
  return { days, month };
}

export function MonthGrid({ view, events, onPrev, onNext, onToday, onOpen }: Props) {
  const today = useMemo(() => new Date(), []);
  const { days, month } = useMemo(() => buildDays(view), [view]);
  const monthKey = `${view.getFullYear()}-${view.getMonth()}`;

  return (
    <div className="bg-card border border-line rounded-[18px] shadow-soft overflow-hidden">
      {/* Month header */}
      <div className="flex items-center gap-2 md:gap-3 px-3 md:px-5 py-3 md:py-4 border-b border-line">
        <motion.button
          type="button"
          onClick={onPrev}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          className="w-8 h-8 md:w-9 md:h-9 inline-flex items-center justify-center rounded-full border border-line-2 hover:bg-paper-2 transition-colors"
          aria-label="Previous month"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>

        <div className="flex-1 overflow-hidden h-[26px] md:h-[28px] relative">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.h2
              key={monthKey}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={easeOut}
              className="absolute inset-0 font-display font-medium text-[18px] md:text-[22px] tracking-[-0.01em]"
            >
              {fmtMonthLong(view)}
            </motion.h2>
          </AnimatePresence>
        </div>

        <motion.button
          type="button"
          onClick={onNext}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          className="w-8 h-8 md:w-9 md:h-9 inline-flex items-center justify-center rounded-full border border-line-2 hover:bg-paper-2 transition-colors"
          aria-label="Next month"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>

        <motion.button
          type="button"
          onClick={onToday}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.96 }}
          className="px-3 md:px-[14px] py-[6px] md:py-[7px] rounded-full text-[12px] md:text-[13px] font-medium border border-line-2 text-ink hover:bg-paper-2 transition-colors"
        >
          Today
        </motion.button>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 border-b border-line bg-paper-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => (
          <span key={w} className="px-1.5 md:px-3 py-2 md:py-[10px] text-[9px] md:text-[11px] font-semibold uppercase tracking-[0.1em] md:tracking-[0.12em] text-ink-2 text-center md:text-left">
            <span className="hidden md:inline">{w}</span>
            <span className="md:hidden">{w.charAt(0)}</span>
          </span>
        ))}
      </div>

      {/* Grid */}
      <motion.div
        key={monthKey}
        variants={monthGridVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-7 [grid-auto-rows:minmax(54px,1fr)] md:[grid-auto-rows:minmax(124px,1fr)]"
      >
        {days.map((day) => {
          const isOutside = day.getMonth() !== month;
          const isToday = sameDay(day, today);
          const dayStart = new Date(day); dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(day); dayEnd.setHours(23, 59, 59, 999);
          const dayEvents = events
            .filter((e) => e.end >= dayStart && e.start <= dayEnd)
            .sort((a, b) => +a.start - +b.start);
          const cats = uniqueCategories(dayEvents);

          return (
            <motion.div
              key={`${monthKey}-${day.toISOString()}`}
              variants={dayVariants}
              onClick={() => {
                if (dayEvents.length >= 1) onOpen(dayEvents[0].id);
              }}
              className={[
                "relative p-1 md:p-2 border-r border-b border-line bg-card flex flex-col gap-1 cursor-pointer transition-colors min-h-0",
                "[&:nth-child(7n)]:border-r-0",
                isOutside ? "bg-paper-2" : "",
                "hover:bg-paper-2",
              ].join(" ")}
            >
              <span
                className={[
                  "inline-flex items-center justify-center min-w-[20px] md:min-w-[26px] h-[20px] md:h-[26px] px-1 md:px-1.5 text-[11px] md:text-[13px] font-medium rounded-full self-start tabular",
                  isOutside ? "text-ink-3" : "text-ink",
                  isToday ? "bg-ink text-paper" : "",
                ].join(" ")}
              >
                {day.getDate()}
              </span>

              {/* Mobile: dot cluster, one dot per unique category */}
              <div className="flex flex-wrap items-center gap-[3px] md:hidden self-start pl-0.5">
                {cats.slice(0, 4).map((c) => (
                  <span
                    key={c}
                    className={`w-1.5 h-1.5 rounded-full ${DOT_BG[c]}`}
                  />
                ))}
                {cats.length > 4 && <span className="text-[8px] text-ink-3 leading-none">+</span>}
              </div>

              {/* Desktop: full event pills */}
              <div className="hidden md:flex md:flex-col gap-[2px] min-h-0">
                <AnimatePresence initial={false}>
                  {dayEvents.slice(0, 3).map((ev) => (
                    <EventPill key={ev.id} event={ev} onOpen={onOpen} time={fmtTime(ev.start)} />
                  ))}
                </AnimatePresence>
                {dayEvents.length > 3 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen(dayEvents[0].id);
                    }}
                    className="inline-flex self-start px-2 py-0.5 text-[11px] text-ink-2 hover:text-gold-ink transition-colors"
                  >
                    +{dayEvents.length - 3} more
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
