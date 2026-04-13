import { useEffect, useMemo, useState } from "react";
import type { PedidoEntregaHoje } from "../../types/dashboard";

type DashboardHeroProps = {
  userName?: string;
  entregasHoje: PedidoEntregaHoje[];
};

function getGreeting(hour: number) {
  if (hour >= 5 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 18) return "Boa tarde";
  return "Boa noite";
}

function getEntregaLabel(horarioEntrega: string | null) {
  if (!horarioEntrega) {
    return "Deve ser entregue hoje";
  }

  return `Deve ser entregue hoje às ${horarioEntrega}`;
}

export default function DashboardHero({
  userName = "Usuário",
  entregasHoje,
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

      <div className="relative z-10 space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <div>
              <p className="text-sm font-medium tracking-wide text-violet-300">
                Ludarte Acrílicos
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {greeting}, {userName}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
                Visão geral da operação, produção e faturamento da empresa em
                tempo real.
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Horário atual
            </p>

            <p className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              {currentTime}
            </p>

            <p className="mt-3 text-sm capitalize text-zinc-400">
              {currentDate}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/5">
          <div className="border-b border-white/10 px-5 py-4">
            <p className="text-sm font-medium text-white">
              Alertas de entrega para hoje
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Visível conforme as permissões da sua role
            </p>
          </div>

          {entregasHoje.length === 0 ? (
            <div className="px-5 py-6 text-sm text-zinc-400">
              Nenhum pedido com entrega prevista para hoje.
            </div>
          ) : (
            <div
              className="max-h-[260px] overflow-y-auto px-5 py-4 [scrollbar-color:rgba(244,114,182,0.55)_rgba(255,255,255,0.06)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-violet-400/70 [&::-webkit-scrollbar-thumb]:to-pink-400/70"
            >
              <div className="grid gap-3 md:grid-cols-2">
                {entregasHoje.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="rounded-2xl border border-red-500/15 bg-red-500/10 p-4"
                  >
                    <p className="text-sm font-semibold text-white">
                      Pedido #{pedido.id} - {pedido.cliente}
                    </p>
                    <p className="mt-2 text-sm text-zinc-200">
                      Vendido por {pedido.colaborador}
                    </p>
                    <p className="mt-2 text-sm font-medium text-red-200">
                      {getEntregaLabel(pedido.horario_entrega)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
