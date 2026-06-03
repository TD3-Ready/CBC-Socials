import type { CalEvent, EventsPayload } from "./types";

const DATA_URL = "https://cdn.jsdelivr.net/gh/TD3-Ready/CBC-Socials@main/data/events.json";

export async function loadEvents(): Promise<CalEvent[]> {
  const res = await fetch(`${DATA_URL}?t=${Date.now()}`);
  if (!res.ok) throw new Error(`Data fetch failed: ${res.status}`);
  const payload = (await res.json()) as EventsPayload;
  return (payload.events ?? []).map((e) => ({
    ...e,
    start: new Date(e.start),
    end: new Date(e.end),
  }));
}
