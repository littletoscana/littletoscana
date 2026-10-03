import {
  Bath,
  Flame,
  Home,
  ShieldCheck,
  Sun,
  UtensilsCrossed,
} from "lucide-react";
import { useLocale } from "@/lib/i18n";

const facilities = [
  {
    title: "Terasă",
    text: "Spațiu exterior pentru cafeaua de dimineață și serile liniștite.",
    Icon: Sun,
  },
  {
    title: "Saună",
    text: "Relaxare termală în mediul privat al căsuței.",
    Icon: Flame,
  },
  {
    title: "Bucătărie utilată",
    text: "Dotată complet, pentru gătit și momentele de masă.",
    Icon: UtensilsCrossed,
  },
  {
    title: "Zonă de grătar",
    text: "Mesele în aer liber, pe teritoriul privat al căsuței.",
    Icon: Home,
  },
  {
    title: "Jacuzzi",
    text: "Moment de odihnă exclusiv, inclus în preț.",
    Icon: Bath,
  },
] as const;

export function FacilitiesGrid() {
  const { locale, pick } = useLocale();
  const translated = facilities.map((item, index) => ({ ...item, title: ["Терраса", "Сауна", "Оборудованная кухня", "Зона барбекю", "Джакузи"][index] ?? item.title, text: ["Открытое пространство для утреннего кофе и спокойных вечеров.", "Тепловое расслабление в приватной атмосфере дома.", "Полностью оборудована для приготовления еды.", "Обеды на свежем воздухе на частной территории.", "Эксклюзивный отдых, включённый в стоимость."][index] ?? item.text }));
  const items = locale === "ru" ? translated : facilities;
  return (
    <div className="grid border-t border-border sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ title, text, Icon }) => (
        <div
          key={title}
          className="group border-b border-border px-1 py-8 sm:border-r sm:px-7 lg:py-10"
        >
          <div className="mb-8 text-accent transition-transform duration-300 group-hover:translate-x-1">
            <Icon className="size-5" aria-hidden="true" />
          </div>
          <h3 className="mb-3 font-display text-2xl font-semibold text-brand">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-ink/65">{text}</p>
        </div>
      ))}

      <div className="bg-brand px-7 py-8 text-cream lg:py-10">
        <div className="mb-8 text-accent">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </div>
        <h3 className="mb-2 font-display text-xl font-semibold">
           {pick("Teritoriu privat", "Частная территория")}
        </h3>
        <p className="text-sm leading-relaxed text-cream/70">
           {pick("Niciun alt vizitor pe teritoriu în timpul sejurului.", "Во время вашего проживания на территории нет других гостей.")}
        </p>
      </div>
    </div>
  );
}
