import { apiFetch } from "./api";
import type { LoginCredentials, LoginResponse } from "../types/auth";

export async function loginUser(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}