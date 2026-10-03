import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  dayFilter,
  pbCreate,
  pbList,
  type PbRecord,
} from "./pocketbase.server";
import {
  FALLBACK_TIERS,
  MAX_GUESTS,
  computePrice,
  computeRangePrice,
  enumerateNights,
  MAX_NIGHTS,
  type PriceTier,
} from "./pricing";

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data selectată nu este validă.");

function pbDateTime(iso: string, time: string) {
  return `${iso} ${time}:00.000Z`;
}

async function loadTiers(): Promise<PriceTier[]> {
  try {
    const res = await pbList<PbRecord>("pricing", {
      perPage: "50",
      sort: "guest_min",
    });
    const tiers = res.items
      .map((item) => ({
        guest_min: Number(item["guest_min"]),
        guest_max: Number(item["guest_max"]),
        weekday_price: Number(item["weekday_price"]),
        weekend_price: Number(item["weekend_price"]),
      }))
      .filter(
        (t) =>
          Number.isFinite(t.guest_min) &&
          Number.isFinite(t.guest_max) &&
          t.weekday_price > 0 &&
          t.weekend_price > 0,
      );
    if (tiers.length > 0) return tiers;
  } catch (error) {
    console.error("Nu am putut citi colecția pricing:", error);
  }
  return FALLBACK_TIERS;
}

async function isRangeBooked(checkIn: string, checkOut: string): Promise<boolean> {
  const res = await pbList<PbRecord>("availability", {
    perPage: "1",
    filter: `date >= "${checkIn} 00:00:00" && date < "${checkOut} 00:00:00" && status = "booked"`,
  });
  return res.items.length > 0;
}

function message(locale: "ro" | "ru", ro: string, ru: string) {
  return locale === "ru" ? ru : ro;
}

export const getPricingTiers = createServerFn({ method: "GET" }).handler(
  async () => {
    const tiers = await loadTiers();
    return { tiers };
  },
);

export const getBookedDates = createServerFn({ method: "GET" }).handler(
  async () => {
    const today = new Date().toISOString().slice(0, 10);
    const res = await pbList<PbRecord>("availability", {
      perPage: "400",
      filter: `status = "booked" && date >= "${today} 00:00:00"`,
      sort: "date",
    });
    const dates = res.items
      .map((item) => String(item["date"] ?? "").slice(0, 10))
      .filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value));
    return { dates: Array.from(new Set(dates)) };
  },
);

export const checkAvailability = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ check_in: isoDate, check_out: isoDate }).parse(data))
  .handler(async ({ data }) => {
    const nights = enumerateNights(data.check_in, data.check_out);
    return { available: nights.length > 0 && !(await isRangeBooked(data.check_in, data.check_out)) };
  });

const reservationSchema = z.object({
  client_name: z.string().trim().min(2, "Numele este obligatoriu.").max(100),
  phone: z
    .string()
    .trim()
    .min(6, "Telefonul este obligatoriu.")
    .max(30)
    .regex(/^[0-9+()\s-]+$/, "Telefonul nu are un format valid."),
  email: z
    .string()
    .trim()
    .email("Adresa de email nu este validă.")
    .max(255),
  guests: z
    .number()
    .int()
    .min(1, "Numărul de persoane trebuie să fie între 1 și 6.")
    .max(MAX_GUESTS, "Numărul de persoane trebuie să fie între 1 și 6."),
  check_in: isoDate,
  check_out: isoDate,
  locale: z.enum(["ro", "ru"]).default("ro"),
});

export const createReservation = createServerFn({ method: "POST" })
  .inputValidator((data) => reservationSchema.parse(data))
  .handler(async ({ data }) => {
    const today = new Date().toISOString().slice(0, 10);
    if (data.check_in < today) {
      return {
        ok: false as const,
        message: message(data.locale, "Data selectată nu poate fi în trecut.", "Выбранная дата не может быть в прошлом."),
      };
    }

    const nights = enumerateNights(data.check_in, data.check_out);
    if (nights.length === 0 || nights.length > MAX_NIGHTS) {
      return {
        ok: false as const,
        message: message(data.locale, "Selectați o perioadă validă.", "Выберите корректный период."),
      };
    }

    if (await isRangeBooked(data.check_in, data.check_out)) {
      return {
        ok: false as const,
        message: message(data.locale, "Perioada selectată nu este disponibilă.", "Выбранный период недоступен."),
      };
    }

    const tiers = await loadTiers();
    const price = computeRangePrice(tiers, data.guests, data.check_in, data.check_out);
    if (price === null) {
      return {
        ok: false as const,
        message: message(data.locale, "Pentru grupuri mai mari de 6 persoane, vă rugăm să ne contactați pentru o ofertă personalizată.", "Для групп более 6 человек свяжитесь с нами для индивидуального предложения."),
      };
    }

    await pbCreate("reservations", {
      client_name: data.client_name,
      phone: data.phone,
      email: data.email,
      guests: data.guests,
      check_in: pbDateTime(data.check_in, "14:00"),
      check_out: pbDateTime(data.check_out, "11:00"),
      price,
      status: "pending",
    });

    return {
      ok: true as const,
      message: message(data.locale, "Solicitarea dvs. de rezervare a fost trimisă. Vă vom contacta pentru confirmarea rezervării.", "Ваш запрос на бронирование отправлен. Мы свяжемся с вами для подтверждения."),
      price,
      check_out: data.check_out,
    };
  });
