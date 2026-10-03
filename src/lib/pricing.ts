export type PriceTier = {
  guest_min: number;
  guest_max: number;
  weekday_price: number;
  weekend_price: number;
};

/**
 * Tarifele oficiale LittleToscana. Sunt folosite doar ca rezervă atunci când
 * colecția `pricing` din PocketBase nu poate fi citită.
 */
export const FALLBACK_TIERS: PriceTier[] = [
  { guest_min: 1, guest_max: 2, weekday_price: 5000, weekend_price: 6000 },
  { guest_min: 3, guest_max: 4, weekday_price: 7000, weekend_price: 8000 },
  { guest_min: 5, guest_max: 6, weekday_price: 8000, weekend_price: 9000 },
];

export const MAX_GUESTS = 6;
export const MAX_NIGHTS = 60;
export const CHECK_IN_TIME = "14:00";
export const CHECK_OUT_TIME = "11:00";
export const QUOTE_FORM_URL = "https://formspree.io/f/xkjndzgg";

/** Vineri, sâmbătă și duminică sunt tarifate ca weekend. */
export function isWeekendDate(isoDate: string): boolean {
  const day = new Date(`${isoDate}T12:00:00`).getDay();
  return day === 5 || day === 6 || day === 0;
}

export function findTier(tiers: PriceTier[], guests: number): PriceTier | null {
  return (
    tiers.find((t) => guests >= t.guest_min && guests <= t.guest_max) ?? null
  );
}

export function computePrice(
  tiers: PriceTier[],
  guests: number,
  isoDate: string,
): number | null {
  const tier = findTier(tiers, guests);
  if (!tier) return null;
  return isWeekendDate(isoDate) ? tier.weekend_price : tier.weekday_price;
}

export function enumerateNights(checkIn: string, checkOut: string): string[] {
  if (checkOut <= checkIn) return [];
  const nights: string[] = [];
  let current = checkIn;
  while (current < checkOut && nights.length < MAX_NIGHTS) {
    nights.push(current);
    current = nextDay(current);
  }
  return current === checkOut ? nights : [];
}

export function computeRangePrice(
  tiers: PriceTier[],
  guests: number,
  checkIn: string,
  checkOut: string,
): number | null {
  const nights = enumerateNights(checkIn, checkOut);
  if (nights.length === 0) return null;
  let total = 0;
  for (const night of nights) {
    const price = computePrice(tiers, guests, night);
    if (price === null) return null;
    total += price;
  }
  return total;
}

export function formatMdl(value: number): string {
  return `${value.toLocaleString("ro-RO")} MDL`;
}

/** Adaugă o zi la o dată ISO (YYYY-MM-DD). */
export function nextDay(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setDate(d.getDate() + 1);
  return toIsoDate(d);
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const WEEKDAYS = [
  "duminică",
  "luni",
  "marți",
  "miercuri",
  "joi",
  "vineri",
  "sâmbătă",
];

const MONTHS = [
  "ianuarie",
  "februarie",
  "martie",
  "aprilie",
  "mai",
  "iunie",
  "iulie",
  "august",
  "septembrie",
  "octombrie",
  "noiembrie",
  "decembrie",
];

export function formatRoDate(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatShortRoDate(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatShortDate(isoDate: string, locale: "ro" | "ru"): string {
  return new Intl.DateTimeFormat(locale === "ro" ? "ro-RO" : "ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${isoDate}T12:00:00`));
}
