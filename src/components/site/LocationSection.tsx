import { MapPin } from "lucide-react";
import { useLocale } from "@/lib/i18n";

const MAPS_URL = "https://maps.app.goo.gl/Pwiz7WRbEfh8nDc3A";
/** Coordonatele rezultate din linkul Google Maps al locației (Buneț, Moldova). */
const MAPS_EMBED_URL =
  "https://www.google.com/maps?q=47.087701,28.908764&z=15&output=embed";

export function LocationSection() {
  const { pick } = useLocale();
  return (
    <section id="locatie" className="scroll-mt-20">
      <div className="section-shell py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4 lg:pr-8">
            <p className="eyebrow mb-4">
               {pick("Locație", "Расположение")}
            </p>
            <h2 className="editorial-title text-5xl text-brand lg:text-6xl">
               {pick("Ușor de găsit", "Легко найти")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink/70">
               {pick("LittleToscana se află pe un teritoriu privat, în mijlocul naturii. Folosiți harta pentru a deschide traseul direct pe telefon.", "LittleToscana находится на частной территории среди природы. Откройте маршрут на телефоне с помощью карты.")}
            </p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-12 items-center gap-2 bg-brand px-6 text-xs font-semibold uppercase tracking-[0.1em] text-cream transition hover:bg-brand-soft"
            >
              <MapPin className="size-4" aria-hidden="true" />
               {pick("Deschide în Google Maps", "Открыть в Google Maps")}
            </a>
          </div>
          <div className="lg:col-span-8">
            <div className="overflow-hidden border border-border">
              <iframe
                 title={pick("Harta locației LittleToscana", "Карта LittleToscana")}
                src={MAPS_EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[360px] w-full border-0 sm:h-[500px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
