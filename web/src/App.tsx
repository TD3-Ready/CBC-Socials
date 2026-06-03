import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { loadEvents } from "./lib/data";
import type { CalEvent, Category } from "./lib/types";
import { Hero } from "./components/Hero";
import { FilterBar } from "./components/FilterBar";
import { MonthGrid } from "./components/MonthGrid";
import { Agenda } from "./components/Agenda";
import { EventModal } from "./components/EventModal";
import { easeOut } from "./lib/motion";

export default function App() {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [view, setView] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [filter, setFilter] = useState<Category | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadEvents()
      .then((es) => {
        setEvents(es);
        setLoaded(true);
      })
      .catch((e) => {
        setError(e.message);
        setLoaded(true);
      });
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? events : events.filter((e) => e.category === filter)),
    [events, filter]
  );

  const selectedEvent = useMemo(
    () => events.find((e) => e.id === selectedId) ?? null,
    [events, selectedId]
  );

  const handlePrev = () => setView((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1));
  const handleNext = () => setView((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1));
  const handleToday = () => {
    const n = new Date();
    setView(new Date(n.getFullYear(), n.getMonth(), 1));
  };

  return (
    <div className="min-h-screen px-6 md:px-10 py-10 md:py-14 max-w-[1180px] mx-auto">
      <Hero events={filtered} loaded={loaded} error={error} onOpen={setSelectedId} />

      <FilterBar value={filter} onChange={setFilter} />

      {/* Mobile order: Agenda (with ferris wheel) above, Calendar below.
          Desktop order: Calendar left, Agenda right. */}
      <motion.div
        layout
        transition={easeOut}
        className="flex flex-col md:grid md:grid-cols-[minmax(0,1fr)_320px] gap-6 md:gap-8 mt-4"
      >
        <div className="order-2 md:order-none">
          <MonthGrid
            view={view}
            events={filtered}
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={handleToday}
            onOpen={setSelectedId}
          />
        </div>
        <div className="order-1 md:order-none">
          <Agenda events={filtered} filter={filter} onOpen={setSelectedId} />
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedEvent && (
          <EventModal event={selectedEvent} onClose={() => setSelectedId(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
