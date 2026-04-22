import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MaterialMaisUsadoMensal } from "../../types/dashboard";

type MateriaisUsoMensalChartProps = {
  data: MaterialMaisUsadoMensal[];
};

const palette = ["#8b5cf6", "#34d399", "#38bdf8", "#f59e0b", "#f472b6", "#a3e635"];

export default function MateriaisUsoMensalChart({ data }: MateriaisUsoMensalChartProps) {
  const { chartData, materials } = useMemo(() => {
    const totals = new Map<string, number>();

    data.forEach((month) => {
      month.materiais.forEach((item) => {
        totals.set(item.material, (totals.get(item.material) ?? 0) + item.quantidade);
      });
    });

    const topMaterials = [...totals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([material]) => material);

    const rows = data.map((month) => {
      const row: Record<string, string | number> = { mes: month.mes };

      topMaterials.forEach((material) => {
        row[material] = 0;
      });

      month.materiais.forEach((item) => {
        if (topMaterials.includes(item.material)) {
          row[item.material] = item.quantidade;
        }
      });

      return row;
    });

    return { chartData: rows, materials: topMaterials };
  }, [data]);

  return (
    <section className="h-full rounded-[28px] border border-white/10 bg-zinc-900/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="mb-6">
        <p className="text-sm font-medium text-zinc-300">Materiais mais usados por mes</p>
        <p className="mt-1 text-sm text-zinc-500">Top materiais por quantidade vinculada aos pedidos.</p>
      </div>

      {chartData.length === 0 || materials.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-sm text-zinc-500">
          Nenhum uso de material encontrado.
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="mes" stroke="#a1a1aa" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis stroke="#71717a" tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={{
                  background: "#09090b",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "18px",
                  color: "#fff",
                }}
                labelStyle={{ color: "#d4d4d8" }}
              />
              <Legend wrapperStyle={{ color: "#d4d4d8", fontSize: 12 }} />
              {materials.map((material, index) => (
                <Bar
                  key={material}
                  dataKey={material}
                  stackId="materiais"
                  fill={palette[index % palette.length]}
                  radius={index === materials.length - 1 ? [12, 12, 0, 0] : [0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
