import { motion } from "framer-motion";
import { useMemo } from "react";
import type { CalEvent } from "../lib/types";
import { CATEGORY_LABEL } from "../lib/types";
import { agendaContainer, agendaItemVariants } from "../lib/motion";
import { fmtDay, fmtMonth, fmtTime, isAllDay } from "../lib/format";

const CAT_DOT: Record<CalEvent["category"], string> = {
  worship: "bg-cat-worship",
  study: "bg-cat-study",
  music: "bg-cat-music",
  youth: "bg-cat-youth",
  outreach: "bg-cat-outreach",
  other: "bg-cat-other",
};

interface Props {
  events: CalEvent[];
  onOpen: (id: string) => void;
}

export function Agenda({ events, onOpen }: Props) {
  const upcoming = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const horizon = new Date(now);
    horizon.setDate(now.getDate() + 60);
    return events
      .filter((e) => e.end >= now && e.start <= horizon)
      .sort((a, b) => +a.start - +b.start)
      .slice(0, 8);
  }, [events]);

  return (
    <aside className="bg-card border border-line rounded-[18px] shadow-soft p-6 self-start lg:sticky lg:top-6">
      <h3 className="font-display font-medium text-[18px] tracking-[-0.005em] mb-4">Upcoming</h3>

      {!upcoming.length ? (
        <p className="text-[14px] text-ink-2">No events in this filter.</p>
      ) : (
        <motion.ol
          variants={agendaContainer}
          initial="hidden"
          animate="show"
          className="list-none m-0 p-0 flex flex-col"
        >
          {upcoming.map((ev) => (
            <motion.li
              key={ev.id}
              variants={agendaItemVariants}
              onClick={() => onOpen(ev.id)}
              whileHover={{ x: 2 }}
              className="grid grid-cols-[56px_1fr] gap-[14px] py-[14px] px-2 -mx-2 border-t border-line first:border-t-0 cursor-pointer rounded-lg hover:bg-paper-2 transition-colors"
            >
              <div className="text-center border-r border-line pr-[14px]">
                <div className="text-[11px] tracking-[0.12em] uppercase text-gold-ink font-semibold">
                  {fmtMonth(ev.start)}
                </div>
                <div className="font-display font-medium text-[26px] leading-none mt-0.5">
                  {ev.start.getDate()}
                </div>
              </div>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-2 mb-1">
                  <span className={`w-[6px] h-[6px] rounded-full ${CAT_DOT[ev.category]}`} />
                  {CATEGORY_LABEL[ev.category]}
                </div>
                <p className="text-[15px] font-medium m-0 leading-[1.3]">{ev.title}</p>
                <div className="text-[13px] text-ink-2 tabular">
                  {fmtDay(ev.start)}{" "}
                  {isAllDay(ev.start, ev.end)
                    ? "· all day"
                    : `· ${fmtTime(ev.start)} – ${fmtTime(ev.end)}`}
                  {ev.location ? ` · ${ev.location}` : ""}
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      )}
    </aside>
  );
}
