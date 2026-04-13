import { apiFetch } from "./api";
import type { PaginatedPedidos, PedidoDetail, PedidoFormValues } from "../types/pedidos";

export async function getPedidos(page = 1, limit = 5, search = "") {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));

  if (search.trim()) {
    params.set("search", search.trim());
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
