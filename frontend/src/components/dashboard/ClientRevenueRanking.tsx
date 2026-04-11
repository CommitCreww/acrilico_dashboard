type ClientRevenueItem = {
  cliente: string;
  faturamento: number;
};

type ClientRevenueRankingProps = {
  data?: ClientRevenueItem[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ClientRevenueRanking({
  data = [],
}: ClientRevenueRankingProps) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="mb-6">
        <p className="text-sm font-medium text-zinc-300">
          Faturamento por cliente
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          Clientes com maior representatividade no faturamento
        </p>
      </div>

      {data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center text-sm text-zinc-500">
          Nenhum cliente encontrado.
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => (
            <div
              key={`${item.cliente}-${index}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/15 text-sm font-semibold text-violet-300">
                  {index + 1}
                </div>

                <div>
                  <p className="font-medium text-white">{item.cliente}</p>
                  <p className="text-sm text-zinc-500">Cliente</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-medium text-white">
                  {formatCurrency(item.faturamento)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}