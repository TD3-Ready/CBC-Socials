export type Category = "worship" | "study" | "music" | "youth" | "outreach" | "other";

export interface CalEvent {
  id: string;
  title: string;
  category: Category;
  start: Date;
  end: Date;
  location: string;
  description: string;
  htmlLink: string;
}

export interface RawEvent {
  id: string;
  title: string;
  category: Category;
  start: string;
  end: string;
  location: string;
  description: string;
  htmlLink: string;
}

export interface EventsPayload {
  updated: string | null;
  count: number;
  events: RawEvent[];
}

export const CATEGORY_LABEL: Record<Category, string> = {
  worship: "Worship",
  study: "Studies",
  music: "Music",
  youth: "Youth & Kids",
  outreach: "Outreach",
  other: "Other",
};

export const CATEGORY_ORDER: Category[] = [
  "worship",
  "study",
  "music",
  "youth",
  "outreach",
  "other",
];
