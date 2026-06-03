import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import type { CalEvent } from "../lib/types";
import { CATEGORY_LABEL } from "../lib/types";
import { fmtFullDate, fmtTime, isAllDay } from "../lib/format";
import { downloadICS, googleAddURL } from "../lib/ics";
import { easeOut, spring } from "../lib/motion";

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
  anchorY: number;
  onClose: () => void;
}

export function EventModal({ event, anchorY, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const top = useMemo(() => {
    const estHeight = 520;
    const viewport =
      typeof window === "undefined"
        ? 800
        : window.innerHeight || document.documentElement.clientHeight;
    // Anchor below click, but clamp so modal stays fully in iframe viewport
    const desired = Math.max(20, anchorY - 80);
    const max = Math.max(20, viewport - estHeight - 20);
    return Math.min(desired, max);
  }, [anchorY]);

  const when = isAllDay(event.start, event.end)
    ? `${fmtFullDate(event.start)} · All day`
    : `${fmtFullDate(event.start)} · ${fmtTime(event.start)} – ${fmtTime(event.end)}`;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={easeOut}
        onClick={onClose}
        className="fixed inset-0 z-[9998] backdrop-blur-md"
        style={{ background: "rgba(20,18,12,0.32)" }}
      />

      {/* Modal card — anchored near click */}
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, scale: 0.94, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={spring}
        onClick={(e) => e.stopPropagation()}
        className="fixed left-1/2 -translate-x-1/2 z-[9999] bg-card rounded-[28px] p-6 md:p-9 max-w-[520px] w-[calc(100%-32px)] shadow-lift"
        style={{ top }}
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

        <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-ink-2 m-0 mb-2.5">
          <span className="w-[7px] h-[7px] rounded-full" style={{ background: PIP_HEX[event.category] }} />
          {CATEGORY_LABEL[event.category]}
        </p>

        <h2 className="font-display font-medium text-[26px] md:text-[30px] tracking-[-0.015em] leading-[1.15] m-0 mb-5">
          {event.title}
        </h2>

        <dl className="m-0 mb-5 flex flex-col gap-2">
          <div className="grid grid-cols-[64px_1fr] gap-2 text-[14px]">
            <dt className="text-ink-3 text-[11px] font-semibold tracking-[0.12em] uppercase pt-0.5">When</dt>
            <dd className="m-0 text-ink">{when}</dd>
          </div>
          <div className="grid grid-cols-[64px_1fr] gap-2 text-[14px]">
            <dt className="text-ink-3 text-[11px] font-semibold tracking-[0.12em] uppercase pt-0.5">Where</dt>
            <dd className="m-0 text-ink">{event.location || "—"}</dd>
          </div>
        </dl>

        {event.description && (
          <p className="text-ink-2 text-[15px] leading-[1.55] m-0 mb-6 whitespace-pre-line">
            {event.description}
          </p>
        )}

        <div className="flex gap-2.5 flex-wrap">
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
        </div>
      </motion.div>
    </>
  );
}
