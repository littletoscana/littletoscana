import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Music2 } from "lucide-react";
import { useLocale } from "@/lib/i18n";

const MAPS_URL = "https://maps.app.goo.gl/Pwiz7WRbEfh8nDc3A";

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/little_toscana/",
    Icon: Instagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61579463107715",
    Icon: Facebook,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@little_toscana",
    Icon: Music2,
  },
] as const;

export function SiteFooter() {
  const { pick } = useLocale();
  return (
    <footer className="bg-brand text-cream">
      <div className="section-shell py-16 lg:py-20">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <p className="font-display text-4xl font-semibold">LittleToscana</p>
            <p className="mt-3 text-sm leading-relaxed text-cream/60">
               {pick("Căsuță de vacanță în natură, pentru momente de odihnă în intimitate.", "Дом для отдыха на природе, созданный для уединённых моментов покоя.")}
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-cream/50">
               {pick("Navigare", "Навигация")}
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-cream/80 transition hover:text-accent">
                   {pick("Acasă", "Главная")}
                </Link>
              </li>
              <li>
                <Link
                  to="/despre"
                  className="text-cream/80 transition hover:text-accent"
                >
                   {pick("Despre", "О нас")}
                </Link>
              </li>
              <li>
                <Link
                  to="/facilitati"
                  className="text-cream/80 transition hover:text-accent"
                >
                   {pick("Facilități", "Удобства")}
                </Link>
              </li>
              <li>
                <Link
                  to="/galerie"
                  className="text-cream/80 transition hover:text-accent"
                >
                   {pick("Galerie", "Галерея")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-cream/80 transition hover:text-accent"
                >
                   {pick("Contact", "Контакты")}
                </Link>
              </li>
              <li>
                <Link
                  to="/termeni-si-conditii"
                  className="text-cream/80 transition hover:text-accent"
                >
                   {pick("Termeni și Condiții", "Условия")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-cream/50">
               {pick("Social", "Социальные сети")}
            </p>
            <ul className="space-y-2 text-sm">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-cream/80 transition hover:text-accent"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-cream/50">
               {pick("Locație", "Расположение")}
            </p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
               className="inline-flex min-h-11 items-center border border-accent bg-accent px-5 text-xs font-semibold uppercase tracking-[0.08em] text-accent-foreground transition hover:bg-cream hover:text-brand"
            >
               {pick("Deschide în Google Maps", "Открыть в Google Maps")}
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-cream/15 pt-6 text-xs text-cream/50">
           <p>© {new Date().getFullYear()} LittleToscana. {pick("Toate drepturile rezervate.", "Все права защищены.")}</p>
          <p>Check-in 14:00 · Check-out 11:00</p>
        </div>
      </div>
    </footer>
  );
}
