import { motion } from "framer-motion";
import type { Category } from "../lib/types";
import { CATEGORY_LABEL, CATEGORY_ORDER } from "../lib/types";
import { filterContainer, chipVariants, spring } from "../lib/motion";

interface Props {
  value: Category | "all";
  onChange: (v: Category | "all") => void;
}

const DOT: Record<Category, string> = {
  worship: "bg-cat-worship",
  study: "bg-cat-study",
  music: "bg-cat-music",
  youth: "bg-cat-youth",
  outreach: "bg-cat-outreach",
  other: "bg-cat-other",
};

function Chip({
  active,
  label,
  dot,
  onClick,
}: {
  active: boolean;
  label: string;
  dot?: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      variants={chipVariants}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={spring}
      className={[
        "relative inline-flex items-center gap-2 px-[14px] py-[8px] rounded-full text-[13px] font-medium border transition-colors",
        active
          ? "bg-ink text-paper border-ink"
          : "bg-transparent text-ink-2 border-line hover:text-ink hover:border-line-2",
      ].join(" ")}
    >
      {active && (
        <motion.span
          layoutId="active-chip-bg"
          className="absolute inset-0 rounded-full bg-ink -z-10"
          transition={spring}
        />
      )}
      {dot && <span className={`w-[7px] h-[7px] rounded-full ${dot}`} />}
      <span className="relative">{label}</span>
    </motion.button>
  );
}

export function FilterBar({ value, onChange }: Props) {
  return (
    <motion.div
      variants={filterContainer}
      initial="hidden"
      animate="show"
      className="flex flex-wrap gap-2 py-6"
    >
      <Chip active={value === "all"} label="All" onClick={() => onChange("all")} />
      {CATEGORY_ORDER.map((c) => (
        <Chip
          key={c}
          active={value === c}
          label={CATEGORY_LABEL[c]}
          dot={DOT[c]}
          onClick={() => onChange(c)}
        />
      ))}
    </motion.div>
  );
}
