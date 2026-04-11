const API_BASE_URL = import.meta.env.VITE_API_URL;

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

  const finalUrl = `${API_BASE_URL}${endpoint}`;

  console.log("API_BASE_URL:", API_BASE_URL);
  console.log("ENDPOINT:", endpoint);
  console.log("URL FINAL:", finalUrl);

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

  return response.json();
}