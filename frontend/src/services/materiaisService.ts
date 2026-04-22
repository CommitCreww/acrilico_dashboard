import { apiFetch } from "./api";
import type { Material, MaterialFormValues } from "../types/materiais";

export async function getMateriais() {
  return apiFetch<Material[]>("/materiais", {
    method: "GET",
    auth: true,
  });
}

export async function getMaterial(id: number) {
  return apiFetch<Material>(`/materiais/${id}`, {
    method: "GET",
    auth: true,
  });
}

export async function createMaterial(payload: MaterialFormValues) {
  return apiFetch<{ message: string; id: number }>("/materiais", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateMaterial(id: number, payload: MaterialFormValues) {
  return apiFetch<{ message: string }>(`/materiais/${id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function deleteMaterial(id: number) {
  return apiFetch<{ message: string }>(`/materiais/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
