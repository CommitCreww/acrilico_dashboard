import { apiFetch } from "./api";
import type { Cliente, ClienteFormValues, ClienteResumo } from "../types/clientes";

export async function getClientes() {
  return apiFetch<Cliente[]>("/clientes", {
    method: "GET",
    auth: true,
  });
}

export async function getCliente(id: number) {
  return apiFetch<Cliente>(`/clientes/${id}`, {
    method: "GET",
    auth: true,
  });
}

export async function getClienteResumo(id: number) {
  return apiFetch<ClienteResumo>(`/clientes/${id}/resumo`, {
    method: "GET",
    auth: true,
  });
}

export async function createCliente(data: ClienteFormValues) {
  return apiFetch<{ message: string; id: number }>("/clientes", {
    method: "POST",
    auth: true,
    body: JSON.stringify(data),
  });
}

export async function updateCliente(id: number, data: ClienteFormValues) {
  return apiFetch<{ message: string }>(`/clientes/${id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(data),
  });
}
