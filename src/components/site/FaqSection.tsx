import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLocale } from "@/lib/i18n";

const faqs = [
  {
    q: "Care este ora de check-in?",
    a: "Check-in-ul se face începând cu ora 14:00.",
  },
  {
    q: "Care este ora de check-out?",
    a: "Check-out-ul se face până la ora 11:00.",
  },
  {
    q: "Pentru câte persoane este disponibilă căsuța?",
    a: "Rezervările standard sunt disponibile pentru maximum 6 persoane. Pentru grupuri mai mari, vă rugăm să ne contactați pentru o ofertă personalizată.",
  },
  {
    q: "Ce este inclus în preț?",
    a: "În preț sunt incluse cazarea, jacuzzi, sauna și foișorul.",
  },
  {
    q: "Este proprietatea privată?",
    a: "Da. Teritoriul este privat și nu sunt alți vizitatori pe teritoriu în timpul sejurului.",
  },
  {
    q: "Este permis fumatul?",
    a: "Fumatul este interzis în interiorul căsuței.",
  },
  {
    q: "Care sunt orele de liniște?",
    a: "Orele de liniște sunt între 22:00 și 09:00.",
  },
  {
    q: "Pot veni mai mult de 6 persoane?",
    a: "Pentru grupuri mai mari de 6 persoane, vă rugăm să ne contactați pentru o ofertă personalizată.",
  },
];

export function FaqSection() {
  const { locale, pick } = useLocale();
  const ruFaqs = [
    { q: "Во сколько заезд?", a: "Заезд начинается с 14:00." },
    { q: "Во сколько выезд?", a: "Выезд до 11:00." },
    { q: "На сколько гостей рассчитан дом?", a: "Стандартное бронирование доступно максимум для 6 гостей. Для больших групп свяжитесь с нами." },
    { q: "Что входит в стоимость?", a: "В стоимость входят проживание, джакузи, сауна и беседка." },
    { q: "Территория приватная?", a: "Да. Во время вашего проживания других гостей на территории нет." },
    { q: "Можно ли курить?", a: "Курение внутри дома запрещено." },
    { q: "Когда нужно соблюдать тишину?", a: "Часы тишины: с 22:00 до 09:00." },
    { q: "Можно приехать группой более 6 человек?", a: "Для групп более 6 человек свяжитесь с нами для индивидуального предложения." },
  ];
  const items = locale === "ro" ? faqs : ruFaqs;
  return (
    <section id="intrebari" className="bg-sand/45">
      <div className="section-shell grid gap-10 py-20 lg:grid-cols-[0.7fr_1.3fr] lg:py-28">
        <div><p className="eyebrow mb-4">
           {pick("Întrebări frecvente", "Частые вопросы")}
        </p>
        <h2 className="editorial-title text-5xl text-brand lg:text-6xl">
           {pick("Ce este bine de știut", "Что важно знать")}
        </h2></div>

        <Accordion type="single" collapsible className="border-t border-brand/20">
           {items.map((faq, index) => (
            <AccordionItem
              key={faq.q}
              value={`item-${index}`}
              className="border-b border-brand/20 px-0"
            >
              <AccordionTrigger className="py-6 text-left font-display text-xl font-semibold text-brand hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-ink/70">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
