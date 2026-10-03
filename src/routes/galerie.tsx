import { createFileRoute } from "@tanstack/react-router";

import { GalleryGrid } from "@/components/site/GalleryGrid";
import { useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/galerie")({
  head: () => ({
    meta: [
      { title: "Galerie LittleToscana — Fotografii ale căsuței" },
      {
        name: "description",
        content:
          "Fotografii ale căsuței LittleToscana: interior, terasă, jacuzzi, saună și teritoriul privat.",
      },
      { property: "og:title", content: "Galerie LittleToscana" },
      {
        property: "og:description",
        content: "Fotografii ale căsuței de vacanță LittleToscana.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GaleriePage,
});

function GaleriePage() {
  const { pick } = useLocale();
  return (
    <section className="section-shell py-16 lg:py-24">
      <p className="eyebrow mb-5">
         {pick("Galerie", "Галерея")}
      </p>
      <h1 className="editorial-title text-6xl text-brand sm:text-7xl">
         {pick("Un colț de liniște", "Уголок спокойствия")}
      </h1>
      <p className="mt-5 max-w-xl leading-relaxed text-ink/70">
         {pick("Fotografiile prezintă căsuța și teritoriul privat al LittleToscana.", "Фотографии показывают дом и частную территорию LittleToscana.")}
      </p>
      <div className="mt-14 lg:mt-20">
        <GalleryGrid />
      </div>
    </section>
  );
}
