type RecentOrder = {
  id: number;
  cliente: string;
  descricao: string;
  valor: number;
  status: string;
};

type RecentOrdersListProps = {
  data?: RecentOrder[];
};

export default function RecentOrdersList({ data = [] }: RecentOrdersListProps) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="mb-8">
        <p className="text-sm font-medium text-zinc-2000">Pedidos recentes</p>
        <p className="mt-1 text-sm text-zinc-500">
          Últimos pedidos registrados no sistema
        </p>
      </div>

      {data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center text-sm text-zinc-500">
          Nenhum pedido recente encontrado.
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((pedido) => (
            <div
              key={pedido.id}
              className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[90px_1fr_1.2fr_150px_140px] md:items-center"
            >
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Pedido
                </p>
                <p className="mt-1 font-medium text-white">#{pedido.id}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Cliente
                </p>
                <p className="mt-1 text-sm text-zinc-300">{pedido.cliente}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Descrição
                </p>
                <p className="mt-1 text-sm text-zinc-300">{pedido.descricao}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Valor
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  {pedido.valor}
                </p>
              </div>

              <div>
                <span className="inline-flex rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-zinc-300">
                  {pedido.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}