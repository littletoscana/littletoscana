import { X } from "lucide-react";
import { useState } from "react";

import { galleryPhotos } from "@/lib/gallery";
import { useLocale } from "@/lib/i18n";

export function GalleryGrid() {
  const { pick } = useLocale();
  const [active, setActive] = useState<number | null>(null);
  const activePhoto = active !== null ? galleryPhotos[active] : undefined;

  return (
    <>
      <div className="grid auto-rows-[12rem] grid-cols-2 gap-2 sm:auto-rows-[18rem] lg:grid-cols-4 lg:gap-3">
        {galleryPhotos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setActive(index)}
             aria-label={`${pick("Deschide fotografia", "Открыть фотографию")} ${index + 1}`}
            className={`group overflow-hidden bg-sand ${
              index === 0 || index === 5 ? "col-span-2 row-span-2" : ""
            } ${index === 3 || index === 8 ? "row-span-2" : ""}`}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading={index < 3 ? "eager" : "lazy"}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
            />
          </button>
        ))}
      </div>

      {activePhoto ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 sm:p-10"
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
             aria-label={pick("Închide", "Закрыть")}
            onClick={() => setActive(null)}
            className="absolute right-4 top-4 grid size-11 place-items-center border border-cream/30 text-cream transition hover:bg-cream/15"
          >
            <X className="size-5" />
          </button>
          <img
            src={activePhoto.src}
            alt={activePhoto.alt}
            className="max-h-[90vh] max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
