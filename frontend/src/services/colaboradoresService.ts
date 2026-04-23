import { apiFetch } from "./api";
import type { Colaborador, ColaboradorFormValues, Role } from "../types/colaboradores";

export async function getColaboradores() {
  return apiFetch<Colaborador[]>("/colaboradores", {
    method: "GET",
    auth: true,
  });
}

export async function getColaboradorRoles() {
  return apiFetch<Role[]>("/colaboradores/roles", {
    method: "GET",
    auth: true,
  });
}

export async function createColaborador(payload: ColaboradorFormValues) {
  return apiFetch<{ message: string; colaborador: Colaborador }>("/colaboradores", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}
