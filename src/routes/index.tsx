import { Link, createFileRoute } from "@tanstack/react-router";

import { BookingSection } from "@/components/site/BookingSection";
import { FacilitiesGrid } from "@/components/site/FacilitiesGrid";
import { FaqSection } from "@/components/site/FaqSection";
import { LocationSection } from "@/components/site/LocationSection";
import { galleryPhotos } from "@/lib/gallery";
import { useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LittleToscana — Căsuță de vacanță pe teritoriu privat" },
      {
        name: "description",
        content:
          "O evadare în natură, creată pentru momente de neuitat. Cazare cu jacuzzi, saună, terasă și zonă de grătar, pe teritoriu privat.",
      },
      {
        property: "og:title",
        content: "LittleToscana — Căsuță de vacanță pe teritoriu privat",
      },
      {
        property: "og:description",
        content:
          "O evadare în natură, creată pentru momente de neuitat. Rezervați sejurul de 21 de ore.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { pick } = useLocale();
  return (
    <>
      <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-brand">
        {galleryPhotos[0] ? <img src={galleryPhotos[0].src} alt={galleryPhotos[0].alt} className="absolute inset-0 h-full w-full object-cover" /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/35 to-ink/20" aria-hidden="true" />
        <div className="section-shell relative flex min-h-[calc(100svh-5rem)] items-end pb-14 pt-24 sm:pb-20 lg:pb-24">
          <div className="hero-copy max-w-4xl text-cream reveal-soft">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-cream/80">
              {pick("Căsuță de vacanță · Teritoriu privat", "Дом для отдыха · Частная территория")}
            </p>
            <h1 className="editorial-title text-5xl sm:text-8xl lg:text-[8.5rem]">
              LittleToscana
            </h1>
            <p className="mt-4 max-w-2xl font-display text-2xl italic leading-snug text-cream sm:text-4xl">
               {pick("O evadare în natură, creată pentru momente de neuitat.", "Уединение на природе, созданное для незабываемых моментов.")}
            </p>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-cream/80 sm:text-base">
               {pick("O căsuță intimă, destinată odihnei și recreerii. Teritoriul este privat, iar în timpul sejurului nu sunt alți vizitatori.", "Уютный дом для отдыха. Территория полностью приватна, во время вашего пребывания других гостей нет.")}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/"
                hash="rezervare"
                className="inline-flex min-h-12 items-center bg-cream px-7 text-xs font-semibold uppercase tracking-[0.1em] text-brand transition hover:bg-sand"
              >
                 {pick("Rezervă acum", "Забронировать")}
              </Link>
              <Link
                to="/despre"
                className="inline-flex min-h-12 items-center border border-cream/60 px-7 text-xs font-semibold uppercase tracking-[0.1em] text-cream transition hover:bg-cream hover:text-brand"
              >
                 {pick("Descoperă LittleToscana", "Откройте LittleToscana")}
              </Link>
            </div>
            <div className="mt-12 flex gap-8 text-sm text-cream">
              <div>
                <p className="font-display text-2xl font-semibold">
                  14:00
                </p>
                <p className="text-cream/65">Check-in</p>
              </div>
              <div className="border-l border-cream/30 pl-8">
                <p className="font-display text-2xl font-semibold">
                  11:00
                </p>
                <p className="text-cream/65">Check-out</p>
              </div>
              <div className="border-l border-cream/30 pl-8">
                <p className="font-display text-2xl font-semibold">
                  21h
                </p>
                 <p className="text-cream/65">{pick("Sejur", "Заезд")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="cazare"
         className="bg-sand/45 scroll-mt-20"
      >
        <div className="section-shell py-20 lg:py-28">
          <div className="mb-12 max-w-xl">
            <p className="eyebrow mb-4">
               {pick("Facilități", "Удобства")}
            </p>
            <h2 className="editorial-title text-5xl text-brand lg:text-6xl">
               {pick("Totul inclus, pentru un sejur complet.", "Всё включено для полноценного отдыха.")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink/70">
               {pick("În preț sunt incluse cazarea, jacuzzi, sauna și foișorul.", "В стоимость входят проживание, джакузи, сауна и беседка.")}
            </p>
          </div>
          <FacilitiesGrid />
        </div>
      </section>

      <section className="section-shell py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-4">
               {pick("Cazare", "Проживание")}
            </p>
            <h2 className="editorial-title text-5xl text-brand lg:text-6xl">
               {pick("Un sejur de 21 de ore, doar pentru dumneavoastră", "Каждый 21-часовой заезд — только для вас")}
            </h2>
            <p className="mt-5 leading-relaxed text-ink/70">
               {pick("Căsuța este potrivită pentru cupluri, familii și grupuri mici. Check-in-ul se face de la ora 14:00, iar check-out-ul până la ora 11:00 în ziua următoare. Rezervările standard sunt disponibile pentru maximum 6 persoane.", "Дом подходит парам, семьям и небольшим компаниям. Заезд с 14:00, выезд до 11:00 следующего дня. Стандартное бронирование доступно максимум для 6 гостей.")}
            </p>
            <Link
              to="/facilitati"
              className="mt-8 inline-flex min-h-12 items-center border border-brand px-6 text-xs font-semibold uppercase tracking-[0.1em] text-brand transition hover:bg-brand hover:text-cream"
            >
               {pick("Vezi toate facilitățile", "Все удобства")}
            </Link>
          </div>
          <div className="lg:col-span-7">
            {galleryPhotos[1] ? (
              <img
                src={galleryPhotos[1].src}
                alt={galleryPhotos[1].alt}
                className="aspect-[16/11] w-full object-cover"
              />
            ) : null}
          </div>
        </div>
      </section>

      <section>
        <div className="section-shell py-20 lg:py-28">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-4">
                 {pick("Galerie", "Галерея")}
              </p>
              <h2 className="editorial-title text-5xl text-brand lg:text-6xl">
                 {pick("Un colț de liniște", "Уголок спокойствия")}
              </h2>
            </div>
            <Link
              to="/galerie"
              className="hidden text-sm font-semibold text-brand transition hover:text-accent sm:inline-flex"
            >
               {pick("Vezi galeria completă", "Смотреть всю галерею")}
            </Link>
          </div>
           <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
            {galleryPhotos.length > 0
              ? galleryPhotos.slice(0, 4).map((photo) => (
                  <img
                    key={photo.src}
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                     className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-[1.015]"
                  />
                ))
               : null}
          </div>
          <Link
            to="/galerie"
            className="mt-6 inline-flex text-sm font-semibold text-brand transition hover:text-accent sm:hidden"
          >
             {pick("Vezi galeria completă", "Смотреть всю галерею")}
          </Link>
        </div>
      </section>

      <div className="border-t border-border bg-sand/30">
        <BookingSection />
      </div>

      <LocationSection />

      <FaqSection />

      <section className="section-shell py-20 lg:py-28">
        <div className="bg-brand px-6 py-16 text-center text-cream sm:px-12 lg:py-20">
          <h2 className="font-display text-3xl font-medium leading-tight sm:text-4xl">
             {pick("Rezervați sejurul la LittleToscana", "Забронируйте отдых в LittleToscana")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream/70">
             {pick("Trimiteți solicitarea de rezervare sau scrieți-ne pentru orice întrebare.", "Отправьте запрос на бронирование или напишите нам с любым вопросом.")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              hash="rezervare"
              className="inline-flex min-h-12 items-center bg-accent px-7 text-xs font-semibold uppercase tracking-[0.1em] text-accent-foreground transition hover:bg-cream hover:text-brand"
            >
               {pick("Rezervă acum", "Забронировать")}
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-12 items-center border border-cream/40 px-7 text-xs font-semibold uppercase tracking-[0.1em] text-cream transition hover:bg-cream hover:text-brand"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
