import { apiFetch } from "./api";
import type { Cliente } from "../types/clientes";

export async function getClientes() {
  return apiFetch<Cliente[]>("/clientes", {
    method: "GET",
    auth: true,
  });
}
