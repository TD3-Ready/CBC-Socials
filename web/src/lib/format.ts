export const fmtTime = (d: Date) => {
  const h = d.getHours();
  const m = d.getMinutes();
  const period = h >= 12 ? "pm" : "am";
  const hh = h % 12 || 12;
  return m === 0 ? `${hh}${period}` : `${hh}:${m.toString().padStart(2, "0")}${period}`;
};

export const fmtTimeLong = (d: Date) => {
  const h = d.getHours();
  const m = d.getMinutes();
  const period = h >= 12 ? "PM" : "AM";
  const hh = h % 12 || 12;
  return `${hh}:${m.toString().padStart(2, "0")} ${period}`;
};

export const fmtDay = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short" });
export const fmtMonth = (d: Date) => d.toLocaleDateString("en-US", { month: "short" });
export const fmtMonthLong = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
export const fmtFullDate = (d: Date) =>
  d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const isAllDay = (start: Date, end: Date) =>
  start.getHours() === 0 &&
  start.getMinutes() === 0 &&
  end.getHours() === 0 &&
  end.getMinutes() === 0;
