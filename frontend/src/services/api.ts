const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

if (!API_BASE_URL) {
  throw new Error("VITE_API_URL nao configurada.");
}

type ApiFetchOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (options.auth && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const finalUrl = buildApiUrl(endpoint);

  const response = await fetch(finalUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "Erro ao processar a requisição.";

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.erro || errorMessage;
    } catch {
      errorMessage = `Erro HTTP ${response.status}`;
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export function buildApiUrl(endpoint: string) {
  return `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
}
