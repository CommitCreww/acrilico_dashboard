import type { Cliente } from "../../types/clientes";

type ClientesTableProps = {
  clientes: Cliente[];
  total: number;
  page: number;
  pages: number;
  search: string;
  tipoFilter: string;
  sortBy: string;
  onSearch: (value: string) => void;
  onTipoFilterChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onView: (clienteId: number) => void;
  onEdit: (clienteId: number) => void;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function ClientesTable({
  clientes,
  total,
  page,
  pages,
  search,
  tipoFilter,
  sortBy,
  onSearch,
  onTipoFilterChange,
  onSortByChange,
  onPageChange,
  onView,
  onEdit,
}: ClientesTableProps) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-300">Clientes</p>
          <p className="mt-1 text-sm text-zinc-500">{total} cliente{total === 1 ? "" : "s"} cadastrado{total === 1 ? "" : "s"}</p>
        </div>

        <div className="flex w-full max-w-4xl flex-col gap-3 sm:flex-row sm:justify-end">
          <div className="w-full sm:max-w-md">
            <label htmlFor="cliente-search" className="sr-only">
              Buscar cliente
            </label>
            <input
              id="cliente-search"
              type="text"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Buscar por nome, email ou documento"
              className="w-full rounded-full border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
            />
          </div>

          <div className="w-full sm:max-w-48">
            <label htmlFor="cliente-tipo-filter" className="sr-only">
              Filtrar por tipo
            </label>
            <select
              id="cliente-tipo-filter"
              value={tipoFilter}
              onChange={(event) => onTipoFilterChange(event.target.value)}
              className="w-full rounded-full border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
            >
              <option value="">Todos</option>
              <option value="NOVO">Novos</option>
              <option value="RECORRENTE">Recorrentes</option>
            </select>
          </div>

          <div className="w-full sm:max-w-56">
            <label htmlFor="cliente-sort" className="sr-only">
              Ordenar clientes
            </label>
            <select
              id="cliente-sort"
              value={sortBy}
              onChange={(event) => onSortByChange(event.target.value)}
              className="w-full rounded-full border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
            >
              <option value="nome">Nome</option>
              <option value="recentes">Mais recentes</option>
              <option value="pedidos">Mais pedidos</option>
            </select>
          </div>
        </div>
      </div>

      {clientes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center text-sm text-zinc-500">
          Nenhum cliente encontrado.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
                    Cliente
                  </th>
                  <th className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
                    Email
                  </th>
                  <th className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
                    Telefone
                  </th>
                  <th className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
                    CPF/CNPJ
                  </th>
                  <th className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
                    Tipo
                  </th>
                  <th className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
                    Acoes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="bg-white/2">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-sm font-semibold text-violet-200">
                          {getInitials(cliente.nome) || "C"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{cliente.nome}</p>
                          <p className="text-xs text-zinc-500">ID #{cliente.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-zinc-300">{cliente.email || "-"}</td>
                    <td className="px-4 py-4 text-sm text-zinc-300">{cliente.telefone || "-"}</td>
                    <td className="px-4 py-4 text-sm text-zinc-300">{cliente.cpf_cnpj || "-"}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                        cliente.tipo_cliente === "RECORRENTE"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                          : "border-violet-500/20 bg-violet-500/10 text-violet-200"
                      }`}>
                        {cliente.tipo_cliente === "RECORRENTE" ? "Recorrente" : "Novo"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => onView(cliente.id)}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white transition hover:bg-white/10"
                        >
                          Ver
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(cliente.id)}
                          className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200 transition hover:bg-violet-500/20"
                        >
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 md:hidden">
            {clientes.map((cliente) => (
              <div key={cliente.id} className="rounded-[24px] border border-white/10 bg-zinc-950 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-sm font-semibold text-violet-200">
                    {getInitials(cliente.nome) || "C"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{cliente.nome}</p>
                    <p className="mt-1 break-words text-sm text-zinc-400">{cliente.email || "-"}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Tipo</p>
                    <p className="mt-2 text-sm text-zinc-300">
                      {cliente.tipo_cliente === "RECORRENTE" ? "Recorrente" : "Novo"} - {cliente.total_pedidos ?? 0} pedidos
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Telefone</p>
                    <p className="mt-2 text-sm text-zinc-300">{cliente.telefone || "-"}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">CPF/CNPJ</p>
                    <p className="mt-2 text-sm text-zinc-300">{cliente.cpf_cnpj || "-"}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onView(cliente.id)}
                    className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    Ver
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(cliente.id)}
                    className="flex-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-4 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Mostrando {clientes.length} de {total} clientes - pagina {page} de {pages}
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
                Proxima
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
