import { apiFetch } from "./api";
import type {
  ResumoDashboard,
  PedidoStatus,
  PedidoAtrasado,
  PedidoEntregaHoje,
  FaturamentoMensalItem,
  MaterialMaisUsado,
  PedidoRecente,
  FaturamentoPorClienteItem,
} from "../types/dashboard";

export async function getResumoDashboard() {
  return apiFetch<ResumoDashboard>("/dashboard/resumo", {
    method: "GET",
    auth: true,
  });
}

export async function getPedidosStatus() {
  return apiFetch<PedidoStatus[]>("/dashboard/pedidos-status", {
    method: "GET",
    auth: true,
  });
}

export async function getPedidosAtrasados(limit = 5) {
  const params = new URLSearchParams();
  params.set("limit", String(limit));

  return apiFetch<PedidoAtrasado[]>(`/dashboard/pedidos-atrasados?${params.toString()}`, {
    method: "GET",
    auth: true,
  });
}

export async function getFaturamentoMensal() {
  return apiFetch<FaturamentoMensalItem[]>("/dashboard/faturamento-mensal", {
    method: "GET",
    auth: true,
  });
}

export async function getMateriaisMaisUsados() {
  return apiFetch<MaterialMaisUsado[]>("/dashboard/materiais-mais-usados", {
    method: "GET",
    auth: true,
  });
}

export async function getPedidosRecentes() {
  return apiFetch<PedidoRecente[]>("/dashboard/pedidos-recentes", {
    method: "GET",
    auth: true,
  });
}

export async function getPedidosEntregaHoje() {
  return apiFetch<PedidoEntregaHoje[]>("/dashboard/pedidos-entrega-hoje", {
    method: "GET",
    auth: true,
  });
}

export async function getFaturamentoPorCliente() {
  return apiFetch<FaturamentoPorClienteItem[]>("/dashboard/faturamento-por-cliente", {
    method: "GET",
    auth: true,
  });
}
