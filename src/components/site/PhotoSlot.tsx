import { ImageIcon } from "lucide-react";

/**
 * Spațiu rezervat pentru o fotografie originală LittleToscana.
 * Se folosește doar până la încărcarea fotografiilor reale; nu conține
 * imagini generate sau stock.
 */
export function PhotoSlot({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div className={`photo-slot rounded-2xl ${className}`}>
      <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
        <ImageIcon className="size-5 text-stone" aria-hidden="true" />
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone">
          {label}
        </span>
      </div>
    </div>
  );
}
