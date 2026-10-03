import { Link, createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { FacilitiesGrid } from "@/components/site/FacilitiesGrid";
import { FALLBACK_TIERS, formatMdl } from "@/lib/pricing";
import { galleryPhotos } from "@/lib/gallery";
import { useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/facilitati")({
  head: () => ({
    meta: [
      { title: "Facilități LittleToscana — Jacuzzi, saună, terasă" },
      {
        name: "description",
        content:
          "Căsuța este dotată cu terasă, saună, bucătărie utilată, zonă de grătar și jacuzzi. În preț sunt incluse cazarea, jacuzzi, sauna și foișorul.",
      },
      { property: "og:title", content: "Facilități LittleToscana" },
      {
        property: "og:description",
        content:
          "Terasă, saună, bucătărie utilată, zonă de grătar și jacuzzi, pe teritoriu privat.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FacilitatiPage,
});

const included = ["Cazarea", "Jacuzzi", "Sauna", "Foișorul"];

function FacilitatiPage() {
  const { locale, pick } = useLocale();
  const includedItems = locale === "ro" ? included : ["Проживание", "Джакузи", "Сауна", "Беседка"];
  return (
    <>
      <section className="section-shell py-16 lg:py-24">
        <p className="eyebrow mb-5">
           {pick("Facilități", "Удобства")}
        </p>
        <h1 className="editorial-title max-w-3xl text-6xl text-brand sm:text-7xl">
           {pick("Dotările căsuței LittleToscana", "Удобства LittleToscana")}
        </h1>
        <p className="mt-5 max-w-xl leading-relaxed text-ink/70">
           {pick("Teritoriul este privat și nu mai sunt alți vizitatori în timpul sejurului.", "Территория полностью приватна, во время вашего проживания других гостей нет.")}
        </p>
        <div className="mt-14 lg:mt-20">
          <FacilitiesGrid />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-3">
          {[galleryPhotos[6], galleryPhotos[2], galleryPhotos[11]].map((photo, index) =>
            photo ? <img key={photo.src} src={photo.src} alt={photo.alt} loading="lazy" className={`w-full object-cover ${index === 0 ? "col-span-2 aspect-[16/8] lg:col-span-1 lg:aspect-[4/5]" : "aspect-[4/5]"}`} /> : null,
          )}
        </div>
      </section>

      <section className="bg-sand/45">
        <div className="section-shell grid gap-12 py-20 lg:grid-cols-12 lg:items-center lg:py-28">
          <div className="lg:col-span-5">
            <h2 className="font-display text-3xl font-medium leading-tight text-brand sm:text-4xl">
               {pick("Ce este inclus în preț", "Что входит в стоимость")}
            </h2>
            <ul className="mt-6 space-y-3">
               {includedItems.map((item) => (
                <li key={item} className="flex items-center gap-3 text-ink/75">
                  <span className="grid size-6 place-items-center rounded-full bg-accent/15 text-accent">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            {galleryPhotos[2] ? (
              <img
                src={galleryPhotos[2].src}
                alt={galleryPhotos[2].alt}
                className="aspect-[16/10] w-full object-cover"
              />
            ) : null}
          </div>
        </div>
      </section>

      <section className="section-shell py-20 lg:py-28">
        <h2 className="font-display text-3xl font-medium leading-tight text-brand sm:text-4xl">
           {pick("Tarife pentru sejurul de 21 de ore", "Тарифы за 21-часовой заезд")}
        </h2>
        <div className="mt-10 grid border-t border-brand/20 sm:grid-cols-3">
          {FALLBACK_TIERS.map((tier) => (
            <div
              key={tier.guest_max}
              className="border-b border-brand/20 py-8 sm:border-r sm:px-8 sm:last:border-r-0"
            >
              <p className="font-display text-xl font-semibold text-brand">
                {tier.guest_min === 1
                   ? pick("Până la 2 persoane", "До 2 гостей")
                   : pick(`Până la ${tier.guest_max} persoane`, `До ${tier.guest_max} гостей`)}
              </p>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-baseline justify-between">
                   <dt className="text-stone">{pick("Luni–Joi", "Понедельник–четверг")}</dt>
                  <dd className="font-display text-lg font-semibold text-brand">
                    {formatMdl(tier.weekday_price)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between">
                   <dt className="text-stone">{pick("Vineri–Duminică", "Пятница–воскресенье")}</dt>
                  <dd className="font-display text-lg font-semibold text-brand">
                    {formatMdl(tier.weekend_price)}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-ink/65">
           {pick("Pentru grupuri mai mari de 6 persoane, vă rugăm să ne contactați pentru o ofertă personalizată.", "Для групп более 6 человек свяжитесь с нами для индивидуального предложения.")}
        </p>
        <Link
          to="/"
          hash="rezervare"
          className="mt-9 inline-flex min-h-12 items-center bg-brand px-7 text-xs font-semibold uppercase tracking-[0.1em] text-cream transition hover:bg-brand-soft"
        >
           {pick("Verifică disponibilitatea", "Проверить доступность")}
        </Link>
      </section>
    </>
  );
}
