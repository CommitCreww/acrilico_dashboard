import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RevenueItem = {
  mes: number;
  total: number;
  recebido: number;
  em_aberto: number;
};

type RevenueChartProps = {
  data?: RevenueItem[];
};

const monthMap: Record<number, string> = {
  1: "Jan",
  2: "Fev",
  3: "Mar",
  4: "Abr",
  5: "Mai",
  6: "Jun",
  7: "Jul",
  8: "Ago",
  9: "Set",
  10: "Out",
  11: "Nov",
  12: "Dez",
};

const revenueColors = {
  recebido: "#8b5cf6",
  emAberto: "#f59e0b",
} as const;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function RevenueChart({ data = [] }: RevenueChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    nomeMes: monthMap[item.mes] ?? String(item.mes),
  }));

  return (
    <section className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-300">Faturamento mensal</p>
          <p className="mt-1 text-sm text-zinc-500">
            Evolução do faturamento ao longo dos meses
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Legenda
          </p>

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-300">
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: revenueColors.recebido }}
              />
              <span>Recebido</span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: revenueColors.emAberto }}
              />
              <span>Em aberto</span>
            </div>
          </div>
        </div>
      </div>

      {formattedData.length === 0 ? (
        <div className="flex h-80 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-sm text-zinc-500">
          Nenhum dado de faturamento encontrado.
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />

              <XAxis
                dataKey="nomeMes"
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) =>
                  new Intl.NumberFormat("pt-BR", {
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(Number(value))
                }
              />

              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
                contentStyle={{
                  background: "#111827",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  color: "#fff",
                }}
                formatter={(value, name) => {
                  const dataKey = String(name);
                  const labels: Record<string, string> = {
                    recebido: "Recebido",
                    em_aberto: "Em aberto",
                  };

                  return [formatCurrency(Number(value)), labels[dataKey] ?? dataKey];
                }}
                labelFormatter={(_, payload) => {
                  const current = payload?.[0]?.payload as RevenueItem | undefined;

                  if (!current) {
                    return "";
                  }

                  return `${monthMap[current.mes] ?? current.mes} • Total ${formatCurrency(current.total)}`;
                }}
              />

              <Bar
                dataKey="recebido"
                stackId="faturamento"
                fill={revenueColors.recebido}
                radius={[0, 0, 12, 12]}
              />

              <Bar
                dataKey="em_aberto"
                stackId="faturamento"
                fill={revenueColors.emAberto}
                radius={[12, 12, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
