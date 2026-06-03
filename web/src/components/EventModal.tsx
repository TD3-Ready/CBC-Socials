import { motion } from "framer-motion";
import { useEffect } from "react";
import type { CalEvent } from "../lib/types";
import { CATEGORY_LABEL } from "../lib/types";
import { fmtFullDate, fmtTime, isAllDay } from "../lib/format";
import { downloadICS, googleAddURL } from "../lib/ics";
import { easeOut, spring } from "../lib/motion";

const PIP_VAR: Record<CalEvent["category"], string> = {
  worship: "var(--c-worship)",
  study: "var(--c-study)",
  music: "var(--c-music)",
  youth: "var(--c-youth)",
  outreach: "var(--c-outreach)",
  other: "var(--c-other)",
};

const PIP_HEX: Record<CalEvent["category"], string> = {
  worship: "#4A6FA5",
  study: "#8B7355",
  music: "#8B7AA8",
  youth: "#C2774A",
  outreach: "#6B8E6B",
  other: "#6B6B6B",
};

interface Props {
  event: CalEvent;
  onClose: () => void;
}

export function EventModal({ event, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const when = isAllDay(event.start, event.end)
    ? `${fmtFullDate(event.start)} · All day`
    : `${fmtFullDate(event.start)} · ${fmtTime(event.start)} – ${fmtTime(event.end)}`;

  void PIP_VAR;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={easeOut}
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6 backdrop-blur-md"
      style={{ background: "rgba(20,18,12,0.32)" }}
    >
      <motion.div
        layoutId={`event-${event.id}`}
        transition={spring}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-card rounded-[28px] p-9 max-w-[520px] w-full shadow-lift"
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

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...easeOut, delay: 0.1 }}
          className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-ink-2 m-0 mb-2.5"
        >
          <span className="w-[7px] h-[7px] rounded-full" style={{ background: PIP_HEX[event.category] }} />
          {CATEGORY_LABEL[event.category]}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...easeOut, delay: 0.14 }}
          className="font-display font-medium text-[30px] tracking-[-0.015em] leading-[1.15] m-0 mb-5"
        >
          {event.title}
        </motion.h2>

        <motion.dl
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...easeOut, delay: 0.18 }}
          className="m-0 mb-5 flex flex-col gap-2"
        >
          <div className="grid grid-cols-[64px_1fr] gap-2 text-[14px]">
            <dt className="text-ink-3 text-[11px] font-semibold tracking-[0.12em] uppercase pt-0.5">When</dt>
            <dd className="m-0 text-ink">{when}</dd>
          </div>
          <div className="grid grid-cols-[64px_1fr] gap-2 text-[14px]">
            <dt className="text-ink-3 text-[11px] font-semibold tracking-[0.12em] uppercase pt-0.5">Where</dt>
            <dd className="m-0 text-ink">{event.location || "—"}</dd>
          </div>
        </motion.dl>

        {event.description && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...easeOut, delay: 0.22 }}
            className="text-ink-2 text-[15px] leading-[1.55] m-0 mb-6 whitespace-pre-line"
          >
            {event.description}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...easeOut, delay: 0.26 }}
          className="flex gap-2.5 flex-wrap"
        >
          <button
            type="button"
            onClick={() => downloadICS(event)}
            className="px-[18px] py-[11px] rounded-full text-[14px] font-medium bg-ink text-paper hover:bg-[#2E2C26] transition-colors active:translate-y-px"
          >
            Add to my calendar
          </button>
          <a
            href={event.htmlLink || googleAddURL(event)}
            target="_blank"
            rel="noopener"
            className="px-[18px] py-[11px] rounded-full text-[14px] font-medium border border-line-2 text-ink hover:bg-paper-2 transition-colors no-underline"
          >
            {event.htmlLink ? "Open in Google Calendar" : "Add via Google Calendar"}
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
