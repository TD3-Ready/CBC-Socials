export const fmtTime = (d: Date) =>
  d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).replace(" ", "").toLowerCase();

export const fmtDay = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short" });
export const fmtMonth = (d: Date) => d.toLocaleDateString("en-US", { month: "short" });
export const fmtMonthLong = (d: Date) => d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
export const fmtFullDate = (d: Date) =>
  d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

export const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const isAllDay = (start: Date, end: Date) =>
  start.getHours() === 0 && start.getMinutes() === 0 && end.getHours() === 0 && end.getMinutes() === 0;
