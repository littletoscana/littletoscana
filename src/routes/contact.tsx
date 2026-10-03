import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { LocationSection } from "@/components/site/LocationSection";
import { QUOTE_FORM_URL } from "@/lib/pricing";
import { useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact LittleToscana — Scrieți-ne" },
      {
        name: "description",
        content:
          "Contactați LittleToscana pentru rezervări, oferte personalizate sau întrebări. Locația este disponibilă pe hartă.",
      },
      { property: "og:title", content: "Contact LittleToscana" },
      {
        property: "og:description",
        content:
          "Formular de contact și locația exactă a căsuței LittleToscana.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const emptyForm: ContactForm = { name: "", email: "", phone: "", message: "" };

function ContactPage() {
  const { pick } = useLocale();
  const [form, setForm] = useState<ContactForm>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function validate() {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next["name"] = pick("Numele este obligatoriu.", "Имя обязательно.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next["email"] = pick("Adresa de email nu este validă.", "Неверный адрес электронной почты.");
    if (form.phone.trim() && !/^[0-9+()\s-]{6,30}$/.test(form.phone.trim()))
      next["phone"] = pick("Telefonul nu are un format valid.", "Неверный формат телефона.");
    if (form.message.trim().length < 5)
      next["message"] = pick("Mesajul este obligatoriu.", "Сообщение обязательно.");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setSending(true);
    try {
      const response = await fetch(QUOTE_FORM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
        }),
      });

      if (!response.ok) throw new Error(`Formspree ${response.status}`);

      setSent(true);
      setForm(emptyForm);
      toast.success(pick("Mesajul a fost trimis", "Сообщение отправлено"));
    } catch (error) {
      console.error(error);
      toast.error(
        pick("Momentan nu am putut trimite mesajul. Vă rugăm să încercați din nou.", "Не удалось отправить сообщение. Попробуйте ещё раз."),
      );
    } finally {
      setSending(false);
    }
  }

  const inputClass =
    "mt-2 w-full border-0 border-b border-brand/25 bg-transparent px-0 py-3 text-sm outline-none transition focus:border-brand focus:ring-0";
  const labelClass =
    "text-xs font-semibold uppercase tracking-wider text-stone";

  return (
    <>
      <section className="section-shell py-16 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-5">
              Contact
            </p>
            <h1 className="editorial-title text-6xl text-brand sm:text-7xl">
               {pick("Vă răspundem cu plăcere", "Будем рады ответить")}
            </h1>
            <p className="mt-5 leading-relaxed text-ink/70">
               {pick("Scrieți-ne pentru rezervări, disponibilitate sau orice întrebare despre sejur.", "Напишите нам по вопросам бронирования, доступности или проживания.")}
            </p>
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone">
                 {pick("Telefon", "Телефон")}
              </p>
              <a
                href="tel:+37360890008"
                className="mt-2 inline-flex items-center gap-2.5 font-display text-3xl font-semibold text-brand transition hover:text-accent"
              >
                <Phone className="size-5" aria-hidden="true" />
                +373 60 890 008
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="border border-border bg-card p-6 sm:p-10" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>
                     {pick("Nume", "Имя")}
                  </label>
                  <input
                    id="name"
                    value={form.name}
                    maxLength={100}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                     placeholder={pick("Numele complet", "Полное имя")}
                  />
                  {errors["name"] ? (
                    <p className="mt-1.5 text-sm text-destructive">
                      {errors["name"]}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>
                     {pick("Telefon", "Телефон")}
                  </label>
                  <input
                    id="phone"
                    value={form.phone}
                    maxLength={30}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass}
                    placeholder="+373 000 00000"
                  />
                  {errors["phone"] ? (
                    <p className="mt-1.5 text-sm text-destructive">
                      {errors["phone"]}
                    </p>
                  ) : null}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    maxLength={255}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                    placeholder="email@exemplu.md"
                  />
                  {errors["email"] ? (
                    <p className="mt-1.5 text-sm text-destructive">
                      {errors["email"]}
                    </p>
                  ) : null}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className={labelClass}>
                     {pick("Mesaj", "Сообщение")}
                  </label>
                  <textarea
                    id="message"
                    value={form.message}
                    maxLength={1000}
                    rows={5}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className={inputClass}
                     placeholder={pick("Cum vă putem ajuta?", "Чем мы можем помочь?")}
                  />
                  {errors["message"] ? (
                    <p className="mt-1.5 text-sm text-destructive">
                      {errors["message"]}
                    </p>
                  ) : null}
                </div>
              </div>

              {sent ? (
                <p className="mt-5 rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-sm text-brand">
                   {pick("Mesajul dumneavoastră a fost trimis. Vă vom răspunde în cel mai scurt timp.", "Ваше сообщение отправлено. Мы ответим как можно скорее.")}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={sending}
                className="mt-8 inline-flex min-h-13 w-full items-center justify-center gap-2 bg-brand text-xs font-semibold uppercase tracking-[0.1em] text-cream transition hover:bg-brand-soft disabled:opacity-70"
              >
                {sending ? <Loader2 className="size-4 animate-spin" /> : null}
                 {pick("Trimite mesajul", "Отправить сообщение")}
              </button>
            </form>
          </div>
        </div>
      </section>

      <div className="border-t border-border bg-sand/30">
        <LocationSection />
      </div>
    </>
  );
}
