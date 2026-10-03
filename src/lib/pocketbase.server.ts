const PB_URL = "https://oes8dpdf51amidx.ba7w.pocketbasecloud.com";

export type PbRecord = Record<string, unknown> & { id: string };

type PbList<T> = { items: T[]; totalItems: number };

async function pbFetch(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<Response> {
  const { token, headers, ...rest } = init;
  return fetch(`${PB_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: token } : {}),
      ...(headers ?? {}),
    },
  });
}

async function pbJson<T>(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<T> {
  const res = await pbFetch(path, init);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PocketBase ${res.status} ${path}: ${body}`);
  }
  return (await res.json()) as T;
}

export async function pbList<T = PbRecord>(
  collection: string,
  query: Record<string, string>,
  token?: string,
): Promise<PbList<T>> {
  const search = new URLSearchParams(query).toString();
  return pbJson<PbList<T>>(
    `/api/collections/${collection}/records?${search}`,
    token ? { token } : {},
  );
}

export async function pbCreate<T = PbRecord>(
  collection: string,
  data: unknown,
  token?: string,
): Promise<T> {
  return pbJson<T>(`/api/collections/${collection}/records`, {
    method: "POST",
    body: JSON.stringify(data),
    ...(token ? { token } : {}),
  });
}

export async function pbUpdate<T = PbRecord>(
  collection: string,
  id: string,
  data: unknown,
  token?: string,
): Promise<T> {
  return pbJson<T>(`/api/collections/${collection}/records/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    ...(token ? { token } : {}),
  });
}

export async function pbDelete(
  collection: string,
  id: string,
  token: string,
): Promise<void> {
  const res = await pbFetch(`/api/collections/${collection}/records/${id}`, {
    method: "DELETE",
    token,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PocketBase ${res.status}: ${body}`);
  }
}

export type PbAuthUser = {
  id: string;
  email: string;
  name?: string;
  role?: string;
};

/** Autentifică un utilizator din colecția `users`. */
export async function pbAuthWithPassword(identity: string, password: string) {
  return pbJson<{ token: string; record: PbAuthUser }>(
    "/api/collections/users/auth-with-password",
    { method: "POST", body: JSON.stringify({ identity, password }) },
  );
}

/**
 * Verifică serverside tokenul primit de la client și confirmă rolul de admin.
 * Aruncă o eroare dacă tokenul este invalid sau utilizatorul nu este admin.
 */
export async function pbRequireAdmin(token: string): Promise<PbAuthUser> {
  if (!token) throw new Error("UNAUTHORIZED");
  let record: PbAuthUser;
  try {
    const res = await pbJson<{ token: string; record: PbAuthUser }>(
      "/api/collections/users/auth-refresh",
      { method: "POST", token },
    );
    record = res.record;
  } catch {
    throw new Error("UNAUTHORIZED");
  }
  if (record.role !== "admin") throw new Error("FORBIDDEN");
  return record;
}

/** Interval de filtrare PocketBase pentru o zi calendaristică. */
export function dayFilter(field: string, isoDate: string): string {
  return `${field} >= "${isoDate} 00:00:00" && ${field} <= "${isoDate} 23:59:59"`;
}
