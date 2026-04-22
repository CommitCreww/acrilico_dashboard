import { apiFetch } from "./api";
import type { PaginatedPedidos, PedidoDetail, PedidoFormValues } from "../types/pedidos";

export async function getPedidos(
  page = 1,
  limit = 5,
  search = "",
  status = ""
) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (status.trim()) {
    params.set("status", status.trim());
  }

  return apiFetch<PaginatedPedidos>(`/pedidos?${params.toString()}`, {
    method: "GET",
    auth: true,
  });
}

export async function getPedido(id: number) {
  return apiFetch<PedidoDetail>(`/pedidos/${id}`, {
    method: "GET",
    auth: true,
  });
}

export async function downloadPedidoRecibo(id: number) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${import.meta.env.VITE_API_URL}/pedidos/${id}/recibo`, {
    method: "GET",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  if (!response.ok) {
    let errorMessage = "Erro ao baixar o recibo.";

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.erro || errorMessage;
    } catch {
      errorMessage = `Erro HTTP ${response.status}`;
    }

    throw new Error(errorMessage);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `recibo_pedido_${id}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function createPedido(data: PedidoFormValues) {
  return apiFetch<{ message: string; pedido_id: number }>("/pedidos", {
    method: "POST",
    auth: true,
    body: JSON.stringify(data),
  });
}

export async function updatePedido(id: number, data: PedidoFormValues) {
  return apiFetch<{ message: string }>(`/pedidos/${id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(data),
  });
}

export async function deletePedido(id: number) {
  return apiFetch<{ message: string }>(`/pedidos/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
