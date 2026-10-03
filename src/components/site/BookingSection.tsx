import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { ro, ru } from "date-fns/locale";
import { CalendarCheck, Loader2, Phone } from "lucide-react";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";

import { Calendar } from "@/components/ui/calendar";
import {
  checkAvailability,
  createReservation,
  getBookedDates,
  getPricingTiers,
} from "@/lib/booking.functions";
import {
  CHECK_IN_TIME,
  CHECK_OUT_TIME,
  FALLBACK_TIERS,
  MAX_GUESTS,
  computeRangePrice,
  enumerateNights,
  formatMdl,
  formatShortDate,
  toIsoDate,
} from "@/lib/pricing";
import { useLocale } from "@/lib/i18n";

const guestOptions = [1, 2, 3, 4, 5, 6] as const;

type FormState = {
  client_name: string;
  phone: string;
  email: string;
};

const emptyForm: FormState = { client_name: "", phone: "", email: "" };

export function BookingSection() {
  const [guests, setGuests] = useState<number>(2);
  const [largeGroup, setLargeGroup] = useState(false);
  const [selected, setSelected] = useState<DateRange | undefined>(undefined);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const { locale, pick } = useLocale();

  const fetchPricing = useServerFn(getPricingTiers);
  const fetchBooked = useServerFn(getBookedDates);
  const verifyDate = useServerFn(checkAvailability);
  const submitReservation = useServerFn(createReservation);

  const pricingQuery = useQuery({
    queryKey: ["pricing"],
    queryFn: () => fetchPricing(),
  });

  const bookedQuery = useQuery({
    queryKey: ["booked-dates"],
    queryFn: () => fetchBooked(),
  });

  const tiers = pricingQuery.data?.tiers ?? FALLBACK_TIERS;
  const bookedDates = bookedQuery.data?.dates ?? [];

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const bookedDateObjects = useMemo(
    () => bookedDates.map((iso) => new Date(`${iso}T12:00:00`)),
    [bookedDates],
  );

  const checkInIso = selected?.from ? toIsoDate(selected.from) : null;
  const checkOutIso = selected?.to ? toIsoDate(selected.to) : null;
  const nights = checkInIso && checkOutIso ? enumerateNights(checkInIso, checkOutIso) : [];
  const isBooked = nights.some((night) => bookedDates.includes(night));
  const price =
    checkInIso && checkOutIso && !largeGroup ? computeRangePrice(tiers, guests, checkInIso, checkOutIso) : null;

  function validate() {
    const next: Record<string, string> = {};
    if (form.client_name.trim().length < 2)
      next["client_name"] = pick("Numele este obligatoriu.", "Имя обязательно.");
    if (form.phone.trim().length < 6)
      next["phone"] = pick("Telefonul este obligatoriu.", "Телефон обязателен.");
    else if (!/^[0-9+()\s-]+$/.test(form.phone.trim()))
      next["phone"] = pick("Telefonul nu are un format valid.", "Неверный формат телефона.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next["email"] = pick("Adresa de email nu este validă.", "Неверный адрес электронной почты.");
    if (!checkInIso || !checkOutIso) next["check_in"] = pick("Selectați datele de check-in și check-out.", "Выберите даты заезда и выезда.");
    else if (isBooked) next["check_in"] = pick("Perioada selectată nu este disponibilă.", "Выбранный период недоступен.");
    if (guests < 1 || guests > MAX_GUESTS)
      next["guests"] = pick("Numărul de persoane trebuie să fie între 1 și 6.", "Количество гостей должно быть от 1 до 6.");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSuccess(null);
    if (!validate() || !checkInIso || !checkOutIso) return;

    setSubmitting(true);
    try {
      const availability = await verifyDate({ data: { check_in: checkInIso, check_out: checkOutIso } });
      if (!availability.available) {
        setErrors({ check_in: pick("Perioada selectată nu este disponibilă.", "Выбранный период недоступен.") });
        await bookedQuery.refetch();
        return;
      }

      const result = await submitReservation({
        data: {
          client_name: form.client_name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          guests,
          check_in: checkInIso,
          check_out: checkOutIso,
          locale,
        },
      });

      if (!result.ok) {
        setErrors({ check_in: result.message });
        await bookedQuery.refetch();
        return;
      }

      setSuccess(result.message);
      setForm(emptyForm);
      setSelected(undefined);
      toast.success(pick("Solicitare trimisă", "Запрос отправлен"));
    } catch (error) {
      console.error(error);
      toast.error(
         pick("Momentan nu am putut trimite solicitarea. Vă rugăm să încercați din nou.", "Не удалось отправить запрос. Попробуйте ещё раз."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="rezervare" className="scroll-mt-20">
      <div className="section-shell py-20 lg:py-28">
        <div className="mb-10 max-w-xl">
          <p className="eyebrow mb-4">
             {pick("Rezervare", "Бронирование")}
          </p>
          <h2 className="editorial-title text-5xl text-brand lg:text-6xl">
             {pick("Calculează sejurul și rezervă", "Рассчитайте проживание и забронируйте")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink/70">
             {pick(`Fiecare zi rezervată reprezintă un sejur de 21 de ore: check-in de la ${CHECK_IN_TIME}, check-out până la ${CHECK_OUT_TIME} a doua zi.`, `Каждый забронированный день — это 21-часовой заезд: с ${CHECK_IN_TIME} до ${CHECK_OUT_TIME} следующего дня.`)}
          </p>
        </div>

        <div className="grid gap-px bg-border lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="h-full bg-card p-5 sm:p-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone">
                 {pick("Perioada sejurului", "Период проживания")}
              </p>
              {bookedQuery.isLoading ? (
                <div className="flex items-center gap-2 py-10 text-sm text-stone">
                  <Loader2 className="size-4 animate-spin" />
                   {pick("Se verifică disponibilitatea…", "Проверяем доступность…")}
                </div>
              ) : (
                <Calendar
                   mode="range"
                   locale={locale === "ro" ? ro : ru}
                  weekStartsOn={1}
                  selected={selected}
                   onSelect={(range) => {
                     if (range?.from && range.to) {
                       const rangeNights = enumerateNights(toIsoDate(range.from), toIsoDate(range.to));
                       if (rangeNights.some((night) => bookedDates.includes(night))) {
                         setErrors((prev) => ({ ...prev, check_in: pick("Perioada conține o zi ocupată.", "В выбранном периоде есть занятая дата.") }));
                         return;
                       }
                     }
                     setSelected(range);
                    setErrors((prev) => ({ ...prev, check_in: "" }));
                    setSuccess(null);
                  }}
                  disabled={[{ before: today }, ...bookedDateObjects]}
                  modifiers={{ booked: bookedDateObjects }}
                  modifiersClassNames={{
                    booked:
                      "line-through text-destructive/70 opacity-70",
                  }}
                  className="w-full"
                />
              )}
              {bookedQuery.isError ? (
                <p className="mt-3 text-sm text-destructive">
                   {pick("Momentan nu am putut verifica disponibilitatea. Vă rugăm să încercați din nou.", "Не удалось проверить доступность. Попробуйте ещё раз.")}
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-stone">
                <span className="inline-flex items-center gap-1.5">
                   <span className="size-2.5 rounded-full bg-accent" /> {pick("Selectat", "Выбрано")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-destructive/60" />{" "}
                   {pick("Ocupat", "Занято")}
                </span>
              </div>
              <a
                href="tel:+37360890008"
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 border border-brand px-6 text-xs font-semibold uppercase tracking-[0.1em] text-brand transition hover:bg-brand hover:text-cream"
              >
                <Phone className="size-4" aria-hidden="true" />
                 {pick("Sună acum", "Позвонить сейчас")}
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="h-full bg-card p-5 sm:p-10" noValidate>
              <div className="mb-6">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone">
                   {pick("Număr de persoane", "Количество гостей")}
                </label>
                <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {guestOptions.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setGuests(value);
                        setLargeGroup(false);
                      }}
                       className={`border py-3 font-display text-lg transition ${
                        !largeGroup && guests === value
                          ? "border-brand bg-brand text-cream"
                          : "border-border bg-cream/60 text-brand-soft hover:border-accent/40"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setLargeGroup(true)}
                     className={`col-span-4 border py-3 text-sm font-semibold transition sm:col-span-1 ${
                      largeGroup
                        ? "border-brand bg-brand text-cream"
                        : "border-border bg-cream/60 text-brand-soft hover:border-accent/40"
                    }`}
                  >
                    6+
                  </button>
                </div>
                {errors["guests"] ? (
                  <p className="mt-2 text-sm text-destructive">
                    {errors["guests"]}
                  </p>
                ) : null}
              </div>

              {largeGroup ? (
                <div className="rounded-2xl border border-accent/30 bg-accent/5 px-5 py-6">
                  <p className="text-sm leading-relaxed text-ink/75">
                     <strong className="mb-2 block font-display text-xl text-brand">{pick("Grupuri mai mari de 6 persoane", "Группы более 6 человек")}</strong>
                     {pick("Dacă doriți să veniți în grup de peste 6 persoane, contactați-ne pentru o ofertă personalizată.", "Если вы планируете приехать группой более 6 человек, свяжитесь с нами для индивидуального предложения.")}
                  </p>
                   <Link
                     to="/contact"
                    className="mt-4 inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition hover:brightness-95"
                  >
                     {pick("Solicită o ofertă", "Запросить предложение")}
                   </Link>
                </div>
              ) : (
                <>
                  <div className="mb-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-stone">
                        Check-in
                      </p>
                      <div className="mt-2 flex items-center justify-between rounded-xl border border-border bg-cream/40 px-4 py-3 text-sm font-medium">
                         {checkInIso ? formatShortDate(checkInIso, locale) : pick("Selectați o dată", "Выберите дату")}
                        <span className="text-xs text-stone">{CHECK_IN_TIME}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-stone">
                        Check-out
                      </p>
                      <div className="mt-2 flex items-center justify-between rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm font-medium">
                         {checkOutIso ? formatShortDate(checkOutIso, locale) : "—"}
                        <span className="text-xs font-semibold text-accent">
                          {CHECK_OUT_TIME}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 rounded-2xl border border-border bg-brand/5 px-5 py-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm text-ink/70">
                         {checkInIso && checkOutIso
                           ? `${nights.length} ${pick(nights.length === 1 ? "sejur" : "sejururi", nights.length === 1 ? "заезд" : "заезда")} · ${guests} ${pick(guests === 1 ? "persoană" : "persoane", guests === 1 ? "гость" : "гостей")}`
                           : pick("Selectați perioada pentru a vedea prețul", "Выберите период, чтобы увидеть стоимость")}
                      </span>
                      <span className="font-display text-3xl font-semibold text-brand">
                        {pricingQuery.isLoading ? (
                          <Loader2 className="size-5 animate-spin text-stone" />
                        ) : price !== null ? (
                          formatMdl(price)
                        ) : (
                          "—"
                        )}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-stone">
                       {pick("Fiecare sejur: 21 ore · cazare, jacuzzi, saună și foișor incluse", "Каждый заезд: 21 час · проживание, джакузи, сауна и беседка включены")}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="client_name"
                        className="text-xs font-semibold uppercase tracking-wider text-stone"
                      >
                         {pick("Nume", "Имя")}
                      </label>
                      <input
                        id="client_name"
                        value={form.client_name}
                        onChange={(e) =>
                          setForm({ ...form, client_name: e.target.value })
                        }
                        maxLength={100}
                        className="mt-2 w-full rounded-xl border border-border bg-cream/40 px-4 py-3 text-sm outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-ring"
                         placeholder={pick("Numele complet", "Полное имя")}
                      />
                      {errors["client_name"] ? (
                        <p className="mt-1.5 text-sm text-destructive">
                          {errors["client_name"]}
                        </p>
                      ) : null}
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="text-xs font-semibold uppercase tracking-wider text-stone"
                      >
                         {pick("Telefon", "Телефон")}
                      </label>
                      <input
                        id="phone"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        maxLength={30}
                        className="mt-2 w-full rounded-xl border border-border bg-cream/40 px-4 py-3 text-sm outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-ring"
                        placeholder="+373 000 00000"
                      />
                      {errors["phone"] ? (
                        <p className="mt-1.5 text-sm text-destructive">
                          {errors["phone"]}
                        </p>
                      ) : null}
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="email"
                        className="text-xs font-semibold uppercase tracking-wider text-stone"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        maxLength={255}
                        className="mt-2 w-full rounded-xl border border-border bg-cream/40 px-4 py-3 text-sm outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-ring"
                        placeholder="email@exemplu.md"
                      />
                      {errors["email"] ? (
                        <p className="mt-1.5 text-sm text-destructive">
                          {errors["email"]}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {errors["check_in"] ? (
                    <p className="mt-4 text-sm text-destructive">
                      {errors["check_in"]}
                    </p>
                  ) : null}

                  {success ? (
                    <p className="mt-4 rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-sm text-brand">
                      {success}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-7 inline-flex min-h-13 w-full items-center justify-center gap-2 bg-brand text-xs font-semibold uppercase tracking-[0.08em] text-cream transition hover:bg-brand-soft disabled:opacity-70"
                  >
                    {submitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <CalendarCheck className="size-4" />
                    )}
                     {pick("Trimite solicitarea de rezervare", "Отправить запрос на бронирование")}
                  </button>
                  <p className="mt-3 text-center text-xs text-stone">
                     {pick("Rezervarea este confirmată de noi prin telefon sau email.", "Мы подтверждаем бронирование по телефону или электронной почте.")}
                  </p>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
