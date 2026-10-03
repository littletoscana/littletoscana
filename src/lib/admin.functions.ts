import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  dayFilter,
  pbAuthWithPassword,
  pbCreate,
  pbDelete,
  pbList,
  pbRequireAdmin,
  pbUpdate,
  type PbRecord,
} from "./pocketbase.server";
import { enumerateNights } from "./pricing";

export type AdminReservation = {
  id: string;
  client_name: string;
  phone: string;
  email: string;
  guests: number;
  check_in: string;
  check_out: string;
  price: number;
  status: "pending" | "confirmed" | "cancelled";
  created: string;
};

function mapReservation(item: PbRecord): AdminReservation {
  const status = String(item["status"] ?? "pending");
  return {
    id: item.id,
    client_name: String(item["client_name"] ?? ""),
    phone: String(item["phone"] ?? ""),
    email: String(item["email"] ?? ""),
    guests: Number(item["guests"] ?? 0),
    check_in: String(item["check_in"] ?? "").slice(0, 10),
    check_out: String(item["check_out"] ?? "").slice(0, 10),
    price: Number(item["price"] ?? 0),
    status:
      status === "confirmed" || status === "cancelled" ? status : "pending",
    created: String(item["created"] ?? ""),
  };
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        email: z.string().trim().email("Adresa de email nu este validă."),
        password: z.string().min(1, "Parola este obligatorie."),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    let auth;
    try {
      auth = await pbAuthWithPassword(data.email, data.password);
    } catch {
      return { ok: false as const, message: "Email sau parolă incorecte." };
    }
    if (auth.record.role !== "admin") {
      return {
        ok: false as const,
        message: "Acest cont nu are drepturi de administrare.",
      };
    }
    return {
      ok: true as const,
      token: auth.token,
      email: auth.record.email,
    };
  });

const tokenInput = z.object({ token: z.string().min(1) });

export const listReservations = createServerFn({ method: "POST" })
  .inputValidator((data) => tokenInput.parse(data))
  .handler(async ({ data }) => {
    await pbRequireAdmin(data.token);
    const res = await pbList<PbRecord>(
      "reservations",
      { perPage: "500", sort: "-created" },
      data.token,
    );
    return { reservations: res.items.map(mapReservation) };
  });

async function setAvailability(
  isoDate: string,
  status: "available" | "booked",
  token: string,
) {
  const existing = await pbList<PbRecord>(
    "availability",
    { perPage: "1", filter: dayFilter("date", isoDate) },
    token,
  );
  const current = existing.items[0];
  if (current) {
    await pbUpdate("availability", current.id, { status }, token);
    return;
  }
  await pbCreate(
    "availability",
    { date: `${isoDate} 00:00:00.000Z`, status },
    token,
  );
}

async function setAvailabilityRange(
  checkIn: string,
  checkOut: string,
  status: "available" | "booked",
  token: string,
) {
  for (const night of enumerateNights(checkIn, checkOut)) {
    await setAvailability(night, status, token);
  }
}

export const updateReservationStatus = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        token: z.string().min(1),
        id: z.string().min(1),
        status: z.enum(["confirmed", "cancelled"]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    await pbRequireAdmin(data.token);

    const updated = await pbUpdate<PbRecord>(
      "reservations",
      data.id,
      { status: data.status },
      data.token,
    );
    const checkIn = String(updated["check_in"] ?? "").slice(0, 10);
    const checkOut = String(updated["check_out"] ?? "").slice(0, 10);

    if (/^\d{4}-\d{2}-\d{2}$/.test(checkIn) && /^\d{4}-\d{2}-\d{2}$/.test(checkOut)) {
      await setAvailabilityRange(
        checkIn,
        checkOut,
        data.status === "confirmed" ? "booked" : "available",
        data.token,
      );
    }

    return { ok: true as const, reservation: mapReservation(updated) };
  });

export const deleteReservation = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ token: z.string().min(1), id: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data }) => {
    await pbRequireAdmin(data.token);
    const reservations = await pbList<PbRecord>(
      "reservations",
      { perPage: "1", filter: `id = "${data.id}"` },
      data.token,
    );
    const reservation = reservations.items[0];
    if (!reservation) throw new Error("RESERVATION_NOT_FOUND");

    const checkIn = String(reservation["check_in"] ?? "").slice(0, 10);
    const checkOut = String(reservation["check_out"] ?? "").slice(0, 10);
    await pbDelete("reservations", data.id, data.token);
    if (/^\d{4}-\d{2}-\d{2}$/.test(checkIn) && /^\d{4}-\d{2}-\d{2}$/.test(checkOut)) {
      await setAvailabilityRange(checkIn, checkOut, "available", data.token);
    }
    return { ok: true as const };
  });
