type StatusItem = {
  status: string;
  quantidade: number;
};

type StatusOverviewProps = {
  data?: StatusItem[];
};

const statusMap: Record<string, { label: string; dot: string; bar: string }> = {
  PENDENTE: {
    label: "Pendente",
    dot: "bg-amber-400",
    bar: "bg-amber-400",
  },
  EM_PRODUCAO: {
    label: "Em produção",
    dot: "bg-violet-400",
    bar: "bg-violet-400",
  },
  CONCLUIDO: {
    label: "Concluído",
    dot: "bg-emerald-400",
    bar: "bg-emerald-400",
  },
  ATRASADO: {
    label: "Atrasado",
    dot: "bg-red-400",
    bar: "bg-red-400",
  },
};

export default function StatusOverview({ data = [] }: StatusOverviewProps) {
  const total = data.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <section className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="mb-6">
        <p className="text-sm font-medium text-zinc-300">Pedidos por status</p>
        <p className="mt-1 text-sm text-zinc-500">
          Distribuição atual da operação
        </p>
      </div>

      {data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center text-sm text-zinc-500">
          Nenhum status encontrado.
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item) => {
            const percent = total > 0 ? (item.quantidade / total) * 100 : 0;
            const config = statusMap[item.status] ?? {
              label: item.status.replace(/_/g, " "),
              dot: "bg-zinc-400",
              bar: "bg-zinc-400",
            };

            return (
              <div key={item.status} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${config.dot}`} />
                    <span className="text-sm text-zinc-300">{config.label}</span>
                  </div>

                  <span className="text-sm font-medium text-white">
                    {item.quantidade}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-white/5">
                  <div
                    className={`h-2 rounded-full transition-all ${config.bar}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
