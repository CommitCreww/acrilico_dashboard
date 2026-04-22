import type { Material } from "../../types/materiais";
import { formatCurrency, formatDimensions, formatNumber, getArea, getMaterialColor } from "./materialVisuals";

type MateriaisTableProps = {
  materiais: Material[];
  total: number;
  page: number;
  pages: number;
  search: string;
  tipoFilter: string;
  sortBy: string;
  tipoOptions: string[];
  onSearch: (value: string) => void;
  onTipoFilterChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onEdit: (materialId: number) => void;
  onDelete: (materialId: number) => void;
};

export default function MateriaisTable({
  materiais,
  total,
  page,
  pages,
  search,
  tipoFilter,
  sortBy,
  tipoOptions,
  onSearch,
  onTipoFilterChange,
  onSortByChange,
  onPageChange,
  onEdit,
  onDelete,
}: MateriaisTableProps) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-300">Catalogo</p>
          <p className="mt-1 text-sm text-zinc-500">{total} material{total === 1 ? "" : "is"} encontrado{total === 1 ? "" : "s"}</p>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-4xl">
          <input
            type="text"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Buscar tipo, cor, espessura ou medida"
            className="w-full rounded-full border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
          />

          <select
            value={tipoFilter}
            onChange={(event) => onTipoFilterChange(event.target.value)}
            className="w-full rounded-full border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
          >
            <option value="">Todos os tipos</option>
            {tipoOptions.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) => onSortByChange(event.target.value)}
            className="w-full rounded-full border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
          >
            <option value="tipo">Tipo</option>
            <option value="preco_desc">Maior preco</option>
            <option value="preco_asc">Menor preco</option>
            <option value="recentes">Mais recentes</option>
          </select>
        </div>
      </div>

      {materiais.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center text-sm text-zinc-500">
          Nenhum material encontrado.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-zinc-500">Material</th>
                  <th className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-zinc-500">Cor</th>
                  <th className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-zinc-500">Espessura</th>
                  <th className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-zinc-500">Medida</th>
                  <th className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-zinc-500">Preco m2</th>
                  <th className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-zinc-500">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {materiais.map((material) => (
                  <tr key={material.id} className="bg-white/2">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-10 w-10 shrink-0 rounded-2xl border border-white/20"
                          style={{ backgroundColor: getMaterialColor(material.cor) }}
                        />
                        <div>
                          <p className="text-sm font-medium text-white">{material.tipo}</p>
                          <p className="text-xs text-zinc-500">ID #{material.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-zinc-300">{material.cor}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                        {material.espessura}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-zinc-300">
                      <p>{formatDimensions(material.altura, material.largura)}</p>
                      <p className="mt-1 text-xs text-zinc-500">{formatNumber(getArea(material.altura, material.largura))} m2</p>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-white">{formatCurrency(material.preco_m2)}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(material.id)}
                          className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200 transition hover:bg-violet-500/20"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(material.id)}
                          className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-200 transition hover:bg-red-500/20"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 md:hidden">
            {materiais.map((material) => (
              <div key={material.id} className="rounded-[24px] border border-white/10 bg-zinc-950 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <div className="flex items-start gap-3">
                  <span
                    className="h-12 w-12 shrink-0 rounded-2xl border border-white/20"
                    style={{ backgroundColor: getMaterialColor(material.cor) }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">{material.tipo}</p>
                    <p className="mt-1 text-sm text-zinc-400">{material.cor}</p>
                  </div>
                  <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                    {material.espessura}
                  </span>
                </div>

                <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Medida</p>
                  <p className="mt-2 text-sm text-zinc-300">{formatDimensions(material.altura, material.largura)}</p>
                  <p className="mt-1 text-xs text-zinc-500">{formatNumber(getArea(material.altura, material.largura))} m2</p>
                </div>

                <div className="mt-3 rounded-3xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Preco m2</p>
                  <p className="mt-2 text-sm font-semibold text-white">{formatCurrency(material.preco_m2)}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(material.id)}
                    className="flex-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(material.id)}
                    className="flex-1 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-4 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Mostrando {materiais.length} de {total} materiais - pagina {page} de {pages}
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
