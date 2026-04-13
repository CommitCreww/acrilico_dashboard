import { apiFetch } from "./api";
import type { Material } from "../types/materiais";

export async function getMateriais() {
  return apiFetch<Material[]>("/materiais", {
    method: "GET",
    auth: true,
  });
}
