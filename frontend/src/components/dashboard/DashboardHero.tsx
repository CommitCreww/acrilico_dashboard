import { useEffect, useMemo, useState } from "react";

type DashboardHeroProps = {
  totalPedidos: number;
  pedidosPendentes: number;
  pedidosEmProducao: number;
  faturamentoTotal: number;
  userName?: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function getGreeting(hour: number) {
  if (hour >= 5 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function DashboardHero({
  totalPedidos,
  pedidosPendentes,
  pedidosEmProducao,
  faturamentoTotal,
  userName,
}: DashboardHeroProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const greeting = useMemo(() => getGreeting(now.getHours()), [now]);

  const currentTime = useMemo(() => {
    return now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [now]);

  const currentDate = useMemo(() => {
    return now.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [now]);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-900/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(139,92,246,0.20),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.15),_transparent_30%)]" />

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium tracking-wide text-violet-300">
              Ludarte Acrílicos
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              {userName ? `${greeting}, ${userName}` : greeting}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
              Visão geral da operação, produção e faturamento da empresa em
              tempo real.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-400">
                Total de pedidos
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">
                {totalPedidos}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-400">
                Pendentes
              </p>
              <p className="mt-3 text-2xl font-semibold text-amber-300">
                {pedidosPendentes}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-400">
                Em produção
              </p>
              <p className="mt-3 text-2xl font-semibold text-violet-300">
                {pedidosEmProducao}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Horário atual
            </p>

            <p className="mt-4 text-5xl font-semibold tracking-tight text-white md:text-6xl">
              {currentTime}
            </p>

            <p className="mt-3 text-sm capitalize text-zinc-400">
              {currentDate}
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            <div className="rounded-2xl bg-violet-500/15 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-violet-200/80">
                Faturamento total
              </p>
              <p className="mt-1 text-lg font-semibold text-white">
                {formatCurrency(faturamentoTotal)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Status do painel
              </p>
              <p className="mt-1 text-sm text-zinc-300">
                Atualização em tempo real da operação
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}