import { motion } from "framer-motion";
import type { CalEvent } from "../lib/types";
import { eventPillEntry } from "../lib/motion";

const PIP: Record<CalEvent["category"], string> = {
  worship: "bg-cat-worship",
  study: "bg-cat-study",
  music: "bg-cat-music",
  youth: "bg-cat-youth",
  outreach: "bg-cat-outreach",
  other: "bg-cat-other",
};

interface Props {
  event: CalEvent;
  time: string;
  onOpen: (id: string) => void;
}

export function EventPill({ event, time, onOpen }: Props) {
  return (
    <motion.button
      type="button"
      layoutId={`event-${event.id}`}
      variants={eventPillEntry}
      initial="hidden"
      animate="show"
      exit="exit"
      whileHover={{ y: -1 }}
      onClick={(e) => {
        e.stopPropagation();
        onOpen(event.id);
      }}
      className="flex items-center gap-[6px] px-2 py-[3px] rounded-[6px] text-[11.5px] font-medium text-ink bg-paper-2 w-full text-left whitespace-nowrap overflow-hidden hover:bg-gold-soft transition-colors"
    >
      <span className={`flex-none w-[6px] h-[6px] rounded-full ${PIP[event.category]}`} />
      <span className="text-ink-2 tabular font-normal">{time}</span>
      <span className="overflow-hidden text-ellipsis">{event.title}</span>
    </motion.button>
  );
}
