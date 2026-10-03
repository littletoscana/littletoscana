import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { lazy, useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteFooter } from "../components/site/SiteFooter";
import { SiteHeader } from "../components/site/SiteHeader";
import { Toaster } from "../components/ui/sonner";
import { LocaleProvider, useLocale } from "../lib/i18n";

function NotFoundComponent() {
  const { pick } = useLocale();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-semibold text-brand">404</h1>
        <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
          {pick("Pagina nu a fost găsită", "Страница не найдена")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {pick("Pagina căutată nu există sau a fost mutată.", "Страница не существует или была перемещена.")}
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-brand-soft"
          >
            {pick("Înapoi la pagina principală", "На главную")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponentView({ error, reset }: { error: unknown; reset: () => void }) {
  const { pick } = useLocale();
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
          {pick("Pagina nu s-a încărcat", "Страница не загрузилась")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {pick("A apărut o problemă. Încercați să reîncărcați pagina.", "Возникла ошибка. Попробуйте загрузить страницу снова.")}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-brand-soft"
          >
            {pick("Încearcă din nou", "Повторить")}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent/10"
          >
            {pick("Pagina principală", "Главная")}
          </a>
        </div>
      </div>
    </div>
  );
}

const ErrorComponent = lazy(async () => ({ default: ErrorComponentView }));

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LittleToscana — Căsuță de vacanță în natură" },
      {
        name: "description",
        content:
          "LittleToscana, căsuță de vacanță pe teritoriu privat, cu jacuzzi, saună, terasă și zonă de grătar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ro">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <div className="flex min-h-screen flex-col">
          {isAdmin ? null : <SiteHeader />}
          <main className="flex-1">
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
          </main>
          {isAdmin ? null : <SiteFooter />}
        </div>
        <Toaster />
      </LocaleProvider>
    </QueryClientProvider>
  );
}
