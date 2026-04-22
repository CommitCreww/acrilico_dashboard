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
import type { PedidosClientesRecorrenciaItem } from "../../types/dashboard";

type ClientesRecorrenciaChartProps = {
  data: PedidosClientesRecorrenciaItem[];
};

export default function ClientesRecorrenciaChart({ data }: ClientesRecorrenciaChartProps) {
  return (
    <section className="h-full rounded-[28px] border border-white/10 bg-zinc-900/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="mb-6">
        <p className="text-sm font-medium text-zinc-300">Novos Clientes x Clientes Antigos</p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-sm text-zinc-500">
          Nenhum pedido encontrado.
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis
                dataKey="mes"
                stroke="#a1a1aa"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
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
              <Bar dataKey="novos" name="Novos" fill="#8b5cf6" radius={[12, 12, 0, 0]} barSize={28} />
              <Bar dataKey="recorrentes" name="Recorrentes" fill="#34d399" radius={[12, 12, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
