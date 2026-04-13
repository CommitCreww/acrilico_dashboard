import { useEffect, useState } from "react";
import DashboardHero from "../components/dashboard/DashboardHero";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import SummaryCard from "../components/dashboard/SummaryCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import StatusOverview from "../components/dashboard/StatusOverview";
import RecentOrdersList from "../components/dashboard/RecentOrdersList";
import MaterialsUsageCard from "../components/dashboard/MaterialsUsageCard";
import ClientRevenueRanking from "../components/dashboard/ClientRevenueRanking";
import AppTopbar from "../components/layout/AppTopbar";

import {
  getResumoDashboard,
  getPedidosStatus,
  getFaturamentoMensal,
  getMateriaisMaisUsados,
  getPedidosEntregaHoje,
  getPedidosRecentes,
  getFaturamentoPorCliente,
} from "../services/dashboardServices";

import type {
  ResumoDashboard,
  PedidoStatus,
  PedidoEntregaHoje,
  FaturamentoMensalItem,
  MaterialMaisUsado,
  PedidoRecente,
  FaturamentoPorClienteItem,
} from "../types/dashboard";

export default function Dashboard() {
  const [resumo, setResumo] = useState<ResumoDashboard>({
    total_pedidos: 0,
    pedidos_pendentes: 0,
    pedidos_em_producao: 0,
    pedidos_atrasados: 0,
    faturamento_total: 0,
  });

  const [pedidosStatus, setPedidosStatus] = useState<PedidoStatus[]>([]);
  const [pedidosEntregaHoje, setPedidosEntregaHoje] = useState<PedidoEntregaHoje[]>([]);
  const [faturamentoMensal, setFaturamentoMensal] = useState<FaturamentoMensalItem[]>([]);
  const [materiaisMaisUsados, setMateriaisMaisUsados] = useState<MaterialMaisUsado[]>([]);
  const [pedidosRecentes, setPedidosRecentes] = useState<PedidoRecente[]>([]);
  const [faturamentoPorCliente, setFaturamentoPorCliente] = useState<FaturamentoPorClienteItem[]>([]);

  const [error, setError] = useState<string | null>(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const userName =
    user?.nome ||
    user?.name ||
    user?.username ||
    user?.usuario ||
    user?.email?.split("@")[0] ||
    "Usuário";

  useEffect(() => {
    async function loadDashboard() {
      try {
        setError(null);

        const [
          resumoData,
          pedidosStatusData,
          pedidosEntregaHojeData,
          faturamentoMensalData,
          materiaisMaisUsadosData,
          pedidosRecentesData,
          faturamentoPorClienteData,
        ] = await Promise.all([
          getResumoDashboard(),
          getPedidosStatus(),
          getPedidosEntregaHoje(),
          getFaturamentoMensal(),
          getMateriaisMaisUsados(),
          getPedidosRecentes(),
          getFaturamentoPorCliente(),
        ]);

        setResumo(resumoData);
        setPedidosStatus(pedidosStatusData);
        setPedidosEntregaHoje(pedidosEntregaHojeData);
        setFaturamentoMensal(faturamentoMensalData);
        setMateriaisMaisUsados(materiaisMaisUsadosData);
        setPedidosRecentes(pedidosRecentesData);
        setFaturamentoPorCliente(faturamentoPorClienteData);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao carregar dashboard.";
        setError(message);
      }
    }

    loadDashboard();
  }, []);

  if (error) {
    return (
      <>
        <AnimatedBackground />
        <div className="min-h-screen px-4 py-6 text-white md:px-6 xl:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-red-300">
              {error}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AnimatedBackground />
      <AppTopbar userName={userName} />

      <div className="min-h-screen px-4 py-6 text-white md:px-6 xl:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div>
              <DashboardHero
                userName={userName}
                entregasHoje={pedidosEntregaHoje}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2 xl:content-start">
              <SummaryCard
                title="Total de pedidos"
                value={resumo.total_pedidos}
                accent="zinc"
              />

              <SummaryCard
                title="Faturamento total"
                value={new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(resumo.faturamento_total)}
                accent="violet"
              />

              <SummaryCard
                title="Pedidos pendentes"
                value={resumo.pedidos_pendentes}
                accent="amber"
              />

              <SummaryCard
                title="Em produção"
                value={resumo.pedidos_em_producao}
                accent="violet"
              />

              <SummaryCard
                title="Atrasados"
                value={resumo.pedidos_atrasados}
                accent="red"
              />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <RevenueChart data={faturamentoMensal} />
            </div>

            <StatusOverview data={pedidosStatus} />
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <RecentOrdersList data={pedidosRecentes} />
            </div>

            <MaterialsUsageCard data={materiaisMaisUsados} />
          </section>

          <section>
            <ClientRevenueRanking data={faturamentoPorCliente} />
          </section>
        </div>
      </div>
    </>
  );
}
