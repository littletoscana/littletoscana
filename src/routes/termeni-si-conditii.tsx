import { createFileRoute } from "@tanstack/react-router";
import { useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/termeni-si-conditii")({
  head: () => ({
    meta: [
      { title: "Termeni și Condiții — LittleToscana" },
      {
        name: "description",
        content:
          "Termenii și condițiile de cazare la LittleToscana, inclusiv regulamentul de cazare, orele de check-in și check-out și regulile de ordine.",
      },
      { property: "og:title", content: "Termeni și Condiții — LittleToscana" },
      {
        property: "og:description",
        content:
          "Obligațiile locatorului și ale locatarului, regulamentul de cazare și regulile de ordine.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermeniPage,
});

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-semibold text-brand">
        {title}
      </h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink/75">
        {children}
      </div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function TermeniPage() {
  const { locale, pick } = useLocale();
  const roSections = {
    landlord: ["să transmită imobilul în stare bună de folosință;", "să asigure liniștea și posibilitatea de folosință conform destinației;", "să remedieze, în termen rezonabil, eventualele defecțiuni majore care nu sunt cauzate de Locatar."],
    tenant: ["să utilizeze imobilul conform destinației sale;", "să nu deterioreze bunurile din dotare;", "să respecte regulile de ordine și liniște stabilite de Locator;", "să restituie imobilul în aceeași stare în care l-a primit, ținând cont de uzura normală;", "să comunice inițial numărul de persoane pentru care se închiriază imobilul."],
    stay: [
      ["Check-in: de la ora 14:00", "Check-out: până la ora 11:00"],
      ["Plata se face integral la sosire sau conform rezervării."],
      ["Căsuța este destinată exclusiv odihnei și recreerii.", "Vă rugăm să utilizați cu grijă mobilierul, electrocasnicele, sauna, jacuzzi și zona de grătar.", "Este interzis fumatul în interior.", "Este interzis mâncatul în jacuzzi și piscină."],
      ["Se respectă orele de liniște între 22:00 - 09:00.", "Muzica și petrecerile zgomotoase nu sunt permise după orele 22:00."],
      ["Orice daună provocată se achită la valoarea de înlocuire/reparație.", "Locatorul nu răspunde pentru obiectele personale lăsate în cabană."],
      ["Copiii trebuie supravegheați permanent.", "Nu lăsați focul/grătarul nesupravegheat."],
      ["În caz de nerespectare a regulamentului, rezervarea poate fi anulată fără restituirea plății."],
    ],
  };
  const ruSections = {
    landlord: ["передать недвижимость в надлежащем для использования состоянии;", "обеспечить спокойствие и возможность использования по назначению;", "устранить в разумный срок существенные неисправности, не вызванные Нанимателем."],
    tenant: ["использовать недвижимость по назначению;", "не повреждать имущество и оснащение;", "соблюдать правила порядка и тишины, установленные Наймодателем;", "вернуть недвижимость в состоянии, в котором она была получена, с учётом нормального износа;", "заранее сообщить количество гостей, для которых арендуется недвижимость."],
    stay: [
      ["Заезд: с 14:00", "Выезд: до 11:00"],
      ["Оплата производится полностью по прибытии или в соответствии с бронированием."],
      ["Дом предназначен исключительно для отдыха.", "Просим бережно пользоваться мебелью, бытовой техникой, сауной, джакузи и зоной барбекю.", "Курение внутри запрещено.", "Запрещено принимать пищу в джакузи и бассейне."],
      ["Соблюдайте тишину с 22:00 до 09:00.", "Громкая музыка и шумные вечеринки после 22:00 запрещены."],
      ["Причинённый ущерб оплачивается по стоимости замены или ремонта.", "Наймодатель не отвечает за личные вещи, оставленные в доме."],
      ["Дети должны постоянно находиться под присмотром.", "Не оставляйте огонь или гриль без присмотра."],
      ["При несоблюдении правил бронирование может быть отменено без возврата оплаты."],
    ],
  };
  const content = locale === "ro" ? roSections : ruSections;
  const stayTitles = locale === "ro" ? ["1. Check-in și check-out", "2. Plata și garanția", "3. Folosirea imobilului", "4. Liniștea", "5. Responsabilitatea locatarului", "6. Siguranță", "7. Încetarea sejurului"] : ["1. Заезд и выезд", "2. Оплата и гарантия", "3. Использование недвижимости", "4. Тишина", "5. Ответственность нанимателя", "6. Безопасность", "7. Прекращение проживания"];
  return (
    <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:py-24">
      <p className="eyebrow mb-5">
         {pick("Informații", "Информация")}
      </p>
      <h1 className="editorial-title text-6xl text-brand sm:text-7xl">
         {pick("Termeni și Condiții", "Условия проживания")}
      </h1>

       <Section title={pick("Obligațiile Locatorului", "Обязанности Наймодателя")}>
         <List items={content.landlord} />
      </Section>

       <Section title={pick("Obligațiile Locatarului", "Обязанности Нанимателя")}>
         <List items={content.tenant} />
        <p>
           {pick("Locatarul poartă răspunderea materială pentru eventualele deteriorări cauzate imobilului sau bunurilor din dotare.", "Наниматель несёт материальную ответственность за ущерб недвижимости или её оснащению.")}
        </p>
        <p>
           {pick("Locatorul nu răspunde pentru bunurile personale ale Locatarului aduse în imobil.", "Наймодатель не отвечает за личные вещи Нанимателя, принесённые в дом.")}
        </p>
      </Section>

      <div className="mt-16 border-l border-accent bg-sand/45 p-6 sm:p-10">
        <h2 className="font-display text-2xl font-semibold text-brand">
           {pick("Anexa 1: Regulament de cazare – căsuță de vacanță", "Приложение 1: Правила проживания в доме для отдыха")}
        </h2>

         {stayTitles.map((title, index) => (
           <Section key={title} title={title}><List items={content.stay[index] ?? []} /></Section>
         ))}
      </div>
    </section>
  );
}
