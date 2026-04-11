import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RevenueItem = {
  mes: number;
  total: number;
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
      <div className="mb-6">
        <p className="text-sm font-medium text-zinc-300">Faturamento mensal</p>
        <p className="mt-1 text-sm text-zinc-500">
          Evolução do faturamento ao longo dos meses
        </p>
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
                formatter={(value) => [formatCurrency(Number(value)), "Total"]}
              />

              <Bar
                dataKey="total"
                radius={[12, 12, 0, 0]}
                fill="rgba(139, 92, 246, 0.85)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}