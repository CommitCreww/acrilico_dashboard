import type { Pedido } from "../../types/pedidos";

type PedidosTableProps = {
  pedidos: Pedido[];
  page: number;
  pages: number;
  total: number;
  search: string;
  statusFilter: string;
  onSearch: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onView: (pedidoId: number) => void;
  onEdit: (pedidoId: number) => void;
  onDelete: (pedidoId: number) => void;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const statusStyles: Record<string, string> = {
  PENDENTE: "bg-amber-500/15 text-amber-200 border-amber-500/20",
  EM_PRODUCAO: "bg-violet-500/15 text-violet-200 border-violet-500/20",
  CONCLUIDO: "bg-emerald-500/15 text-emerald-200 border-emerald-500/20",
  ATRASADO: "bg-red-500/15 text-red-200 border-red-500/20",
};

export default function PedidosTable({
  pedidos,
  page,
  pages,
  total,
  search,
  statusFilter,
  onSearch,
  onStatusFilterChange,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}: PedidosTableProps) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-300">Pedidos</p>
        </div>

        <div className="flex w-full max-w-3xl flex-col gap-3 sm:flex-row sm:justify-end">
          <div className="w-full sm:max-w-md">
            <label htmlFor="pedido-search" className="sr-only">
              Buscar pedido por cliente
            </label>
            <input
              id="pedido-search"
              type="text"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Buscar por cliente"
              className="w-full rounded-full border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
            />
          </div>

          <div className="w-full sm:max-w-xs">
            <label htmlFor="pedido-status-filter" className="sr-only">
              Filtrar pedidos por status
            </label>
            <select
              id="pedido-status-filter"
              value={statusFilter}
              onChange={(event) => onStatusFilterChange(event.target.value)}
              className="w-full rounded-full border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
            >
              <option value="">Todos os status</option>
              <option value="PENDENTE">Pendente</option>
              <option value="EM_PRODUCAO">Em produção</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="ATRASADO">Atrasado</option>
            </select>
          </div>
        </div>
      </div>

      {pedidos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center text-sm text-zinc-500">
          Nenhum pedido encontrado.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
                    Pedido
                  </th>
                  <th className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
                    Cliente
                  </th>
                  <th className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
                    Descrição
                  </th>
                  <th className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
                    Entrada
                  </th>
                  <th className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
                    Entrega
                  </th>
                  <th className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
                    Valor
                  </th>
                  <th className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
                    Status
                  </th>
                  <th className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {pedidos.map((pedido) => {
                  const badgeClass = statusStyles[pedido.status_pedido] ?? "bg-white/5 text-zinc-200 border-white/10";
                  const canEdit = pedido.can_edit ?? true;
                  const canDelete = pedido.can_delete ?? true;

                  return (
                    <tr key={pedido.id} className="bg-white/2">
                      <td className="px-4 py-4 text-sm font-medium text-white">#{pedido.id}</td>
                      <td className="px-4 py-4 text-sm text-zinc-300">{pedido.cliente}</td>
                      <td className="px-4 py-4 max-w-[240px] truncate text-sm text-zinc-300">
                        {pedido.descricao}
                      </td>
                      <td className="px-4 py-4 text-sm text-zinc-300">
                        {formatDate(pedido.data_entrada)}
                      </td>
                      <td className="px-4 py-4 text-sm text-zinc-300">
                        {formatDate(pedido.data_entrega)}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-white">
                        {formatCurrency(pedido.valor)}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass}`}>
                          {pedido.status_pedido.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => onView(pedido.id)}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white transition hover:bg-white/10"
                          >
                            Ver
                          </button>
                          {canEdit ? (
                            <button
                              type="button"
                              onClick={() => onEdit(pedido.id)}
                              className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200 transition hover:bg-violet-500/20"
                            >
                              Editar
                            </button>
                          ) : null}
                          {canDelete ? (
                            <button
                              type="button"
                              onClick={() => onDelete(pedido.id)}
                              className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-200 transition hover:bg-red-500/20"
                            >
                              Excluir
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 md:hidden">
            {pedidos.map((pedido) => {
              const badgeClass = statusStyles[pedido.status_pedido] ?? "bg-white/5 text-zinc-200 border-white/10";
              const canEdit = pedido.can_edit ?? true;
              const canDelete = pedido.can_delete ?? true;

              return (
                <div key={pedido.id} className="rounded-[24px] border border-white/10 bg-zinc-950 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">Pedido #{pedido.id}</p>
                      <p className="mt-1 text-sm text-zinc-400">{pedido.cliente}</p>
                    </div>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass}`}>
                      {pedido.status_pedido.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Descrição</p>
                      <p className="mt-2 text-sm text-zinc-300">{pedido.descricao}</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Entrada</p>
                        <p className="mt-2 text-sm text-zinc-300">{formatDate(pedido.data_entrada)}</p>
                      </div>
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Entrega</p>
                        <p className="mt-2 text-sm text-zinc-300">{formatDate(pedido.data_entrega)}</p>
                      </div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Valor</p>
                      <p className="mt-2 text-sm font-semibold text-white">{formatCurrency(pedido.valor)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onView(pedido.id)}
                      className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      Ver
                    </button>
                    {canEdit ? (
                      <button
                        type="button"
                        onClick={() => onEdit(pedido.id)}
                        className="flex-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20"
                      >
                        Editar
                      </button>
                    ) : null}
                    {canDelete ? (
                      <button
                        type="button"
                        onClick={() => onDelete(pedido.id)}
                        className="flex-1 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20"
                      >
                        Excluir
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-4 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Mostrando {pedidos.length} de {total} pedidos — página {page} de {pages}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= pages}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
