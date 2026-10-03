import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, LogOut, RefreshCw, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  adminLogin,
  deleteReservation,
  listReservations,
  updateReservationStatus,
  type AdminReservation,
} from "@/lib/admin.functions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatMdl } from "@/lib/pricing";
import { useLocale } from "@/lib/i18n";

const STORAGE_KEY = "littletoscana_admin_token";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Administrare rezervări — LittleToscana" },
      {
        name: "description",
        content:
          "Panou de administrare pentru gestionarea rezervărilor LittleToscana.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Administrare rezervări — LittleToscana" },
      { property: "og:description", content: "Panou de administrare pentru gestionarea rezervărilor LittleToscana." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const statusLabels: Record<AdminReservation["status"], string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

const statusClasses: Record<AdminReservation["status"], string> = {
  pending: "bg-accent/15 text-accent",
  confirmed: "bg-brand/10 text-brand",
  cancelled: "bg-muted text-stone",
};

function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored) setToken(stored);
    setReady(true);
  }, []);

  function handleLogin(newToken: string) {
    window.sessionStorage.setItem(STORAGE_KEY, newToken);
    setToken(newToken);
  }

  function handleLogout() {
    window.sessionStorage.removeItem(STORAGE_KEY);
    setToken(null);
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-5 animate-spin text-stone" />
      </div>
    );
  }

  if (!token) return <LoginForm onSuccess={handleLogin} />;

  return <Dashboard token={token} onLogout={handleLogout} />;
}

function LoginForm({ onSuccess }: { onSuccess: (token: string) => void }) {
  const { pick } = useLocale();
  const login = useServerFn(adminLogin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
       setError(pick("Completați emailul și parola.", "Введите email и пароль."));
      return;
    }
    setLoading(true);
    try {
      const result = await login({
        data: { email: email.trim(), password },
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      onSuccess(result.token);
    } catch (error) {
      console.error(error);
       setError(pick("Momentan nu am putut verifica datele. Încercați din nou.", "Не удалось проверить данные. Попробуйте снова."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-12">
      <form onSubmit={handleSubmit} className="surface-card w-full max-w-sm p-7" noValidate>
        <Link
          to="/"
          className="font-display text-2xl font-semibold tracking-tight text-brand"
        >
          LittleToscana
        </Link>
        <h1 className="mt-6 font-display text-xl font-semibold text-brand">
           {pick("Administrare rezervări", "Управление бронированиями")}
        </h1>
        <p className="mt-2 text-sm text-ink/65">
           {pick("Accesul este permis doar contului de administrator.", "Доступ разрешён только администратору.")}
        </p>

        <label
          htmlFor="email"
          className="mt-6 block text-xs font-semibold uppercase tracking-wider text-stone"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-xl border border-border bg-cream/40 px-4 py-3 text-sm outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-ring"
        />

        <label
          htmlFor="password"
          className="mt-4 block text-xs font-semibold uppercase tracking-wider text-stone"
        >
           {pick("Parolă", "Пароль")}
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-xl border border-border bg-cream/40 px-4 py-3 text-sm outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-ring"
        />

        {error ? (
          <p className="mt-4 text-sm text-destructive">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-semibold text-cream transition hover:bg-brand-soft disabled:opacity-70"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
           {pick("Autentificare", "Войти")}
        </button>
      </form>
    </div>
  );
}

function Dashboard({
  token,
  onLogout,
}: {
  token: string;
  onLogout: () => void;
}) {
  const { locale, pick } = useLocale();
  const fetchReservations = useServerFn(listReservations);
  const setStatus = useServerFn(updateReservationStatus);
  const removeReservation = useServerFn(deleteReservation);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminReservation | null>(null);
  const [filter, setFilter] = useState<"all" | AdminReservation["status"]>("all");

  const query = useQuery({
    queryKey: ["admin-reservations"],
    queryFn: () => fetchReservations({ data: { token } }),
    retry: false,
  });

  useEffect(() => {
    if (query.isError) {
       toast.error(pick("Sesiunea a expirat. Autentificați-vă din nou.", "Сессия истекла. Войдите снова."));
      onLogout();
    }
  }, [query.isError, onLogout]);

  async function handleStatus(
    id: string,
    status: "confirmed" | "cancelled",
  ) {
    setPendingId(id);
    try {
      await setStatus({ data: { token, id, status } });
      await query.refetch();
      toast.success(
        status === "confirmed"
           ? pick("Rezervarea a fost confirmată.", "Бронирование подтверждено.")
           : pick("Rezervarea a fost anulată.", "Бронирование отменено."),
      );
    } catch (error) {
      console.error(error);
       toast.error(pick("Acțiunea nu a putut fi finalizată. Încercați din nou.", "Не удалось выполнить действие. Попробуйте снова."));
    } finally {
      setPendingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setPendingId(deleteTarget.id);
    try {
      await removeReservation({ data: { token, id: deleteTarget.id } });
      setDeleteTarget(null);
      await query.refetch();
       toast.success(pick("Rezervarea a fost ștearsă definitiv.", "Бронирование удалено навсегда."));
    } catch (error) {
      console.error(error);
       toast.error(pick("Rezervarea nu a putut fi ștearsă. Încercați din nou.", "Не удалось удалить бронирование. Попробуйте снова."));
    } finally {
      setPendingId(null);
    }
  }

  const reservations = query.data?.reservations ?? [];
  const visibleReservations =
    filter === "all" ? reservations : reservations.filter((item) => item.status === filter);

  return (
    <div className="min-h-screen bg-sand/35">
      <header className="border-b border-border bg-cream">
        <div className="section-shell grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-5">
          <Link
            to="/"
            className="font-display text-xl font-semibold tracking-tight text-brand"
          >
            LittleToscana
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => query.refetch()}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-brand transition hover:bg-brand/5"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
               {pick("Reîmprospătează", "Обновить")}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-cream transition hover:bg-brand-soft"
            >
              <LogOut className="size-4" aria-hidden="true" />
               {pick("Ieșire", "Выйти")}
            </button>
          </div>
        </div>
      </header>

      <main className="section-shell py-10 lg:py-14">
        <h1 className="editorial-title text-5xl text-brand">
           {pick("Rezervări", "Бронирования")}
        </h1>
        <p className="mt-2 text-sm text-ink/65">
           {pick("Confirmarea unei rezervări blochează toate zilele sejurului pe site.", "Подтверждение бронирования блокирует все дни проживания на сайте.")}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
          {(["all", "pending", "confirmed", "cancelled"] as const).map((value) => {
            const count = value === "all" ? reservations.length : reservations.filter((item) => item.status === value).length;
             const translatedStatus = { pending: pick("În așteptare", "Ожидает"), confirmed: pick("Confirmată", "Подтверждено"), cancelled: pick("Anulată", "Отменено") };
             const label = value === "all" ? pick("Toate", "Все") : translatedStatus[value];
            return (
              <button key={value} type="button" onClick={() => setFilter(value)} className={`min-h-16 bg-card px-4 text-left transition ${filter === value ? "text-brand shadow-[inset_0_-2px_var(--color-accent)]" : "text-stone hover:text-brand"}`}>
                <span className="block text-xs font-semibold uppercase tracking-[0.1em]">{label}</span>
                <span className="mt-1 block font-display text-2xl font-semibold">{count}</span>
              </button>
            );
          })}
        </div>

        {query.isLoading ? (
          <div className="mt-10 flex items-center gap-2 text-sm text-stone">
            <Loader2 className="size-4 animate-spin" />
             {pick("Se încarcă rezervările…", "Загрузка бронирований…")}
          </div>
        ) : visibleReservations.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-border bg-card p-8 text-sm text-ink/65">
             {pick("Nu există rezervări înregistrate.", "Бронирований нет.")}
          </p>
        ) : (
          <div className="mt-8 space-y-4">
            {visibleReservations.map((item) => (
              <article
                key={item.id}
                className="relative border border-border bg-card p-5 sm:p-7"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-semibold text-brand">
                      {item.client_name}
                    </h2>
                    <p className="mt-1 text-sm text-ink/65">
                      {item.phone} · {item.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pr-10 sm:pr-0"><span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[item.status]}`}
                  >
                     {{ pending: pick("În așteptare", "Ожидает"), confirmed: pick("Confirmată", "Подтверждено"), cancelled: pick("Anulată", "Отменено") }[item.status]}
                  </span>
                  {item.status !== "cancelled" ? (
                    <button type="button" onClick={() => setDeleteTarget(item)} className="hidden size-9 items-center justify-center text-stone transition hover:text-destructive sm:inline-flex" aria-label={pick("Șterge rezervarea", "Удалить бронирование")}><Trash2 className="size-4" /></button>
                  ) : null}</div>
                  {item.status === "cancelled" ? (
                    <button type="button" onClick={() => setDeleteTarget(item)} className="absolute right-4 top-4 grid size-9 place-items-center text-stone transition hover:text-destructive" aria-label={pick("Șterge rezervarea anulată", "Удалить отменённое бронирование")}><X className="size-4" /></button>
                  ) : null}
                </div>

                <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-4">
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-stone">
                     {pick("Persoane", "Гости")}
                    </dt>
                    <dd className="mt-1 text-ink">{item.guests}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-stone">
                      Check-in
                    </dt>
                    <dd className="mt-1 text-ink">
                       {item.check_in ? new Intl.DateTimeFormat(locale === "ro" ? "ro-RO" : "ru-RU", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${item.check_in}T12:00:00`)) : "—"}
                      <span className="text-stone"> · 14:00</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-stone">
                      Check-out
                    </dt>
                    <dd className="mt-1 text-ink">
                       {item.check_out ? new Intl.DateTimeFormat(locale === "ro" ? "ro-RO" : "ru-RU", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${item.check_out}T12:00:00`)) : "—"}
                      <span className="text-stone"> · 11:00</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-stone">
                       {pick("Preț", "Стоимость")}
                    </dt>
                    <dd className="mt-1 font-display text-lg font-semibold text-brand">
                      {formatMdl(item.price)}
                    </dd>
                  </div>
                </dl>

                 {item.status === "pending" ? (
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={pendingId === item.id}
                      onClick={() => handleStatus(item.id, "confirmed")}
                      className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-brand-soft disabled:opacity-70"
                    >
                      {pendingId === item.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : null}
                       {pick("Confirmă", "Подтвердить")}
                    </button>
                    <button
                      type="button"
                      disabled={pendingId === item.id}
                      onClick={() => handleStatus(item.id, "cancelled")}
                      className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand/5 disabled:opacity-70"
                    >
                       {pick("Anulează", "Отменить")}
                    </button>
                  </div>
                 ) : null}
                {item.status !== "cancelled" ? (
                  <button type="button" onClick={() => setDeleteTarget(item)} className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-stone transition hover:text-destructive sm:hidden"><Trash2 className="size-4" />{pick("Șterge", "Удалить")}</button>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </main>
      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent className="max-w-md rounded-none border-border bg-cream p-7">
          <AlertDialogHeader>
           <AlertDialogTitle className="font-display text-2xl text-brand">{pick("Sigur doriți să ștergeți această rezervare?", "Вы уверены, что хотите удалить это бронирование?")}</AlertDialogTitle>
             <AlertDialogDescription>{pick("Rezervarea va fi eliminată definitiv, iar toate zilele vor deveni disponibile din nou.", "Бронирование будет удалено навсегда, а все даты снова станут доступными.")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
             <AlertDialogCancel>{pick("Anulează", "Отмена")}</AlertDialogCancel>
             <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{pick("Șterge rezervarea", "Удалить бронирование")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
