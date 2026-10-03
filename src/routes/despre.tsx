import { Link, createFileRoute } from "@tanstack/react-router";
import { Heart, Lock, Users } from "lucide-react";

import { galleryPhotos } from "@/lib/gallery";
import { useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/despre")({
  head: () => ({
    meta: [
      { title: "Despre LittleToscana — Odihnă în intimitate" },
      {
        name: "description",
        content:
          "LittleToscana este o căsuță de vacanță destinată odihnei și recreerii, potrivită pentru cupluri, familii și grupuri mici, pe teritoriu privat.",
      },
      { property: "og:title", content: "Despre LittleToscana" },
      {
        property: "og:description",
        content:
          "Căsuță de vacanță pentru odihnă și recreere, pe teritoriu privat, fără alți vizitatori în timpul sejurului.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DesprePage,
});

const points = [
  {
    title: "Pentru cupluri, familii și grupuri mici",
    text: "Spațiul este gândit pentru un număr restrâns de oaspeți, într-un cadru liniștit.",
    Icon: Users,
  },
  {
    title: "Intimitate deplină",
    text: "Teritoriul este privat, iar în timpul sejurului nu sunt alți vizitatori.",
    Icon: Lock,
  },
  {
    title: "Odihnă și recreere",
    text: "Căsuța este destinată exclusiv odihnei, relaxării și timpului petrecut în privat.",
    Icon: Heart,
  },
];

function DesprePage() {
  const { locale, pick } = useLocale();
  const translatedPoints = [
    { title: "Для пар, семей и небольших групп", text: "Пространство создано для небольшого числа гостей в спокойной обстановке.", Icon: Users },
    { title: "Полное уединение", text: "Территория приватна, во время проживания других гостей нет.", Icon: Lock },
    { title: "Отдых и восстановление", text: "Дом предназначен исключительно для отдыха, расслабления и времени наедине.", Icon: Heart },
  ];
  const displayPoints = locale === "ro" ? points : translatedPoints;
  return (
    <>
      <section className="section-shell py-16 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5 lg:pr-8">
            <p className="eyebrow mb-5">
               {pick("Despre", "О нас")}
            </p>
            <h1 className="editorial-title text-5xl text-brand sm:text-6xl lg:text-7xl">
               {pick("O căsuță de vacanță pentru momente liniștite", "Дом для спокойных моментов")}
            </h1>
            <p className="mt-6 leading-relaxed text-ink/70">
               {pick("LittleToscana este o căsuță de vacanță destinată odihnei, relaxării și timpului petrecut în privat. Este potrivită pentru cupluri, familii și grupuri mici care caută un loc retras, departe de agitație.", "LittleToscana — дом для отдыха, расслабления и уединения. Он подходит парам, семьям и небольшим компаниям, которые ищут тихое место вдали от суеты.")}
            </p>
            <p className="mt-4 leading-relaxed text-ink/70">
               {pick("Teritoriul este privat și oferă intimitate: în timpul sejurului nu există alți vizitatori pe teritoriu, iar locul rămâne doar la dispoziția dumneavoastră.", "Частная территория обеспечивает полное уединение: во время вашего проживания других гостей нет, и всё пространство принадлежит только вам.")}
            </p>
            <Link
              to="/"
              hash="rezervare"
              className="mt-9 inline-flex min-h-12 items-center bg-brand px-7 text-xs font-semibold uppercase tracking-[0.1em] text-cream transition hover:bg-brand-soft"
            >
               {pick("Rezervă acum", "Забронировать")}
            </Link>
          </div>
          <div className="grid grid-cols-5 items-end gap-3 lg:col-span-7">
            {galleryPhotos[4] ? (
              <img
                src={galleryPhotos[4].src}
                alt={galleryPhotos[4].alt}
                className="col-span-4 aspect-[4/5] h-full w-full object-cover"
              />
            ) : null}
            {galleryPhotos[11] ? <img src={galleryPhotos[11].src} alt={galleryPhotos[11].alt} className="col-span-1 mb-12 aspect-[2/3] h-full w-full object-cover" /> : null}
          </div>
        </div>
      </section>

      <section className="bg-sand/45">
        <div className="section-shell grid py-20 sm:grid-cols-3 lg:py-28">
           {displayPoints.map(({ title, text, Icon }) => (
            <div
              key={title}
              className="border-t border-brand/20 py-8 sm:px-7 sm:first:pl-0 sm:last:pr-0"
            >
              <div className="mb-7 text-accent">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h2 className="mb-2 font-display text-xl font-semibold text-brand">
                {title}
              </h2>
              <p className="text-sm leading-relaxed text-ink/65">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
