import { useEffect, useState } from "react";
import DashboardHero from "../components/dashboard/DashboardHero";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import SummaryCard from "../components/dashboard/SummaryCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import StatusOverview from "../components/dashboard/StatusOverview";
import RecentOrdersList from "../components/dashboard/RecentOrdersList";
import MaterialsUsageCard from "../components/dashboard/MaterialsUsageCard";
import ClientRevenueRanking from "../components/dashboard/ClientRevenueRanking";

import {
  getResumoDashboard,
  getPedidosStatus,
  getFaturamentoMensal,
  getMateriaisMaisUsados,
  getPedidosRecentes,
  getFaturamentoPorCliente,
} from "../services/dashboardServices";

import type {
  ResumoDashboard,
  PedidoStatus,
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
    faturamento_total: 0,
  });

  const [pedidosStatus, setPedidosStatus] = useState<PedidoStatus[]>([]);
  const [faturamentoMensal, setFaturamentoMensal] = useState<FaturamentoMensalItem[]>([]);
  const [materiaisMaisUsados, setMateriaisMaisUsados] = useState<MaterialMaisUsado[]>([]);
  const [pedidosRecentes, setPedidosRecentes] = useState<PedidoRecente[]>([]);
  const [faturamentoPorCliente, setFaturamentoPorCliente] = useState<FaturamentoPorClienteItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;


  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const [
          resumoData,
          pedidosStatusData,
          faturamentoMensalData,
          materiaisMaisUsadosData,
          pedidosRecentesData,
          faturamentoPorClienteData,
        ] = await Promise.all([
          getResumoDashboard(),
          getPedidosStatus(),
          getFaturamentoMensal(),
          getMateriaisMaisUsados(),
          getPedidosRecentes(),
          getFaturamentoPorCliente(),
        ]);

        setResumo(resumoData);
        setPedidosStatus(pedidosStatusData);
        setFaturamentoMensal(faturamentoMensalData);
        setMateriaisMaisUsados(materiaisMaisUsadosData);
        setPedidosRecentes(pedidosRecentesData);
        setFaturamentoPorCliente(faturamentoPorClienteData);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao carregar dashboard.";
        setError(message);
      } finally {
        setLoading(false);
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

      <div className="min-h-screen px-4 py-6 text-white md:px-6 xl:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-4">
            <div className="xl:col-span-2">
              <DashboardHero
                totalPedidos={resumo.total_pedidos}
                pedidosPendentes={resumo.pedidos_pendentes}
                pedidosEmProducao={resumo.pedidos_em_producao}
                faturamentoTotal={resumo.faturamento_total}
                
              />
            </div>

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