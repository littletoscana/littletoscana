import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useLocale } from "@/lib/i18n";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { locale, setLocale, pick } = useLocale();
  const navItems = [
    { to: "/", label: pick("Acasă", "Главная") },
    { to: "/despre", label: pick("Despre", "О нас") },
    { to: "/facilitati", label: pick("Facilități", "Удобства") },
    { to: "/galerie", label: pick("Galerie", "Галерея") },
    { to: "/contact", label: pick("Contact", "Контакты") },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-cream/90 backdrop-blur-xl">
      <div className="section-shell grid h-20 grid-cols-[minmax(0,1fr)_auto] items-center lg:grid-cols-[1fr_auto_1fr]">
        <Link
          to="/"
          className="min-w-0 truncate font-display text-[1.75rem] font-semibold text-brand"
          onClick={() => setOpen(false)}
        >
          LittleToscana
        </Link>

        <nav className="hidden items-center gap-9 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink/65 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-brand" }}
              className="transition-colors hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>

         <div className="flex shrink-0 items-center justify-end gap-2">
          <div className="hidden items-center border border-border text-[0.65rem] font-semibold sm:flex" aria-label={pick("Alege limba", "Выберите язык")}>
            {(["ro", "ru"] as const).map((value) => (
              <button key={value} type="button" onClick={() => setLocale(value)} className={`min-h-9 px-2.5 uppercase transition ${locale === value ? "bg-brand text-cream" : "text-brand hover:bg-brand/5"}`} aria-pressed={locale === value}>
                {value}
              </button>
            ))}
          </div>
          <Link
            to="/"
            hash="rezervare"
            className="hidden min-h-11 items-center border border-brand bg-brand px-6 text-xs font-semibold uppercase tracking-[0.1em] text-cream transition-colors hover:bg-brand-soft sm:inline-flex"
          >
             {pick("Rezervă acum", "Забронировать")}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
             aria-label={open ? pick("Închide meniul", "Закрыть меню") : pick("Deschide meniul", "Открыть меню")}
            aria-expanded={open}
            className="inline-flex size-11 items-center justify-center text-brand transition-colors hover:bg-brand/5 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-cream lg:hidden">
          <nav className="section-shell flex flex-col py-6">
            <div className="mb-4 flex w-fit border border-border text-xs font-semibold">
              {(["ro", "ru"] as const).map((value) => (
                <button key={value} type="button" onClick={() => setLocale(value)} className={`min-h-10 px-4 uppercase ${locale === value ? "bg-brand text-cream" : "text-brand"}`} aria-pressed={locale === value}>{value}</button>
              ))}
            </div>
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-brand" }}
                onClick={() => setOpen(false)}
                className="border-b border-border/70 px-1 py-4 font-display text-2xl text-ink/80 transition-colors hover:text-brand"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/"
              hash="rezervare"
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex min-h-12 items-center justify-center bg-brand px-5 text-xs font-semibold uppercase tracking-[0.12em] text-cream"
            >
               {pick("Rezervă acum", "Забронировать")}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
