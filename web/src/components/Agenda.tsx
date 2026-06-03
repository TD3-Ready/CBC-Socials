import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import type { CalEvent, Category } from "../lib/types";
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

const ACCENT: Record<Category | "all", string> = {
  all: "#B8935C",
  worship: "#4A6FA5",
  study: "#8B7355",
  music: "#8B7AA8",
  youth: "#C2774A",
  outreach: "#6B8E6B",
  other: "#6B6B6B",
};

interface Props {
  events: CalEvent[];
  filter: Category | "all";
  onOpen: (id: string) => void;
}

function AnimatedTitle({ text, filter }: { text: string; filter: Category | "all" }) {
  const chars = Array.from(text);
  return (
    <h3 className="font-display font-medium text-[20px] md:text-[22px] tracking-[-0.01em] m-0 leading-none">
      {chars.map((char, i) => (
        <motion.span
          key={`${filter}-${i}`}
          initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.45,
            delay: i * 0.025,
            ease: [0.2, 0.7, 0.2, 1],
          }}
          style={{
            display: "inline-block",
            whiteSpace: char === " " ? "pre" : "normal",
          }}
        >
          {char}
        </motion.span>
      ))}
    </h3>
  );
}

export function Agenda({ events, filter, onOpen }: Props) {
  const horizonDays = filter === "all" ? 30 : 15;

  const upcoming = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const horizon = new Date(now);
    horizon.setDate(now.getDate() + horizonDays);
    return events
      .filter((e) => e.end >= now && e.start <= horizon)
      .sort((a, b) => +a.start - +b.start)
      .slice(0, 12);
  }, [events, horizonDays]);

  const title =
    filter === "all" ? "Upcoming" : `Upcoming · ${CATEGORY_LABEL[filter as Category]}`;
  const subtitle = `Next ${horizonDays} days`;

  return (
    <aside className="bg-card border border-line rounded-[18px] shadow-soft p-5 md:p-6 self-start lg:sticky lg:top-6">
      <div className="mb-5">
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
          <AnimatedTitle text={title} filter={filter} />
          <motion.span
            key={`subtitle-${filter}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            className="text-[10.5px] uppercase tracking-[0.12em] text-ink-3 font-semibold"
          >
            {subtitle}
          </motion.span>
        </div>
        <motion.div
          key={`underline-${filter}`}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
          className="h-[2px] origin-left rounded-full"
          style={{ background: ACCENT[filter], width: 64 }}
        />
      </div>

      {/* Ferris-wheel container — perspective makes the 3D rotation feel deep */}
      <div
        className="relative"
        style={{ perspective: 1400, perspectiveOrigin: "center 30%" }}
      >
        <AnimatePresence mode="wait">
          {!upcoming.length ? (
            <motion.p
              key={`empty-${filter}`}
              initial={{ opacity: 0, rotateX: 60, scale: 0.85, z: -180 }}
              animate={{ opacity: 1, rotateX: 0, scale: 1, z: 0 }}
              exit={{ opacity: 0, rotateX: -60, scale: 0.85, z: -180 }}
              transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
              style={{ transformStyle: "preserve-3d", transformOrigin: "center" }}
              className="text-[14px] text-ink-2"
            >
              {filter === "all"
                ? "No events in the next 30 days."
                : `No ${CATEGORY_LABEL[filter as Category].toLowerCase()} events in the next ${horizonDays} days.`}
            </motion.p>
          ) : (
            <motion.ol
              key={`list-${filter}`}
              initial={{ opacity: 0, rotateX: 65, scale: 0.85, z: -200, y: 40 }}
              animate={{
                opacity: 1,
                rotateX: 0,
                scale: 1,
                z: 0,
                y: 0,
                transition: {
                  duration: 0.55,
                  ease: [0.2, 0.7, 0.2, 1],
                  delay: 0.05,
                  when: "beforeChildren",
                  staggerChildren: 0.045,
                  delayChildren: 0.12,
                },
              }}
              exit={{
                opacity: 0,
                rotateX: -65,
                scale: 0.85,
                z: -200,
                y: -40,
                transition: { duration: 0.4, ease: [0.4, 0, 0.6, 1] },
              }}
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: "center 80%",
              }}
              className="list-none m-0 p-0 flex flex-col"
            >
              {upcoming.map((ev) => (
                <motion.li
                  key={ev.id}
                  variants={agendaItemVariants}
                  onClick={() => onOpen(ev.id)}
                  whileHover={{ x: 2 }}
                  className="grid grid-cols-[52px_1fr] md:grid-cols-[56px_1fr] gap-3 md:gap-[14px] py-[14px] px-2 -mx-2 border-t border-line first:border-t-0 cursor-pointer rounded-lg hover:bg-paper-2 transition-colors"
                >
                  <div className="text-center border-r border-line pr-3 md:pr-[14px]">
                    <div className="text-[11px] tracking-[0.12em] uppercase text-gold-ink font-semibold">
                      {fmtMonth(ev.start)}
                    </div>
                    <div className="font-display font-medium text-[24px] md:text-[26px] leading-none mt-0.5">
                      {ev.start.getDate()}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-1.5 text-[10.5px] md:text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-2 mb-1">
                      <span className={`w-[6px] h-[6px] rounded-full ${CAT_DOT[ev.category]}`} />
                      {CATEGORY_LABEL[ev.category]}
                    </div>
                    <p className="text-[15px] font-medium m-0 leading-[1.3]">{ev.title}</p>
                    <div className="text-[12.5px] md:text-[13px] text-ink-2 tabular">
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
        </AnimatePresence>
      </div>
    </aside>
  );
}

// avoid TS unused import error if agendaContainer ever gets unused
void agendaContainer;
