import type { Material } from "../../types/materiais";
import { formatCurrency, formatDimensions, getContrastColor, getMaterialColor } from "./materialVisuals";

type MateriaisPaletteProps = {
  materiais: Material[];
  onEdit: (materialId: number) => void;
};

export default function MateriaisPalette({ materiais, onEdit }: MateriaisPaletteProps) {
  const featured = [...materiais]
    .sort((a, b) => Number(b.preco_m2 || 0) - Number(a.preco_m2 || 0))
    .slice(0, 6);

  return (
    <section className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-300">Paleta do estoque</p>
          <p className="mt-1 text-sm text-zinc-500">Amostras geradas pela cor cadastrada.</p>
        </div>
      </div>

      {featured.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center text-sm text-zinc-500">
          Nenhum material para visualizar.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {featured.map((material) => {
            const color = getMaterialColor(material.cor);
            const textColor = getContrastColor(color);

            return (
              <button
                key={material.id}
                type="button"
                onClick={() => onEdit(material.id)}
                className="group overflow-hidden rounded-[24px] border border-white/10 bg-zinc-950 text-left transition hover:border-white/20"
              >
                <div
                  className="flex min-h-32 flex-col justify-between p-4"
                  style={{ backgroundColor: color, color: textColor }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-black/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                      {material.espessura}
                    </span>
                    <span className="text-xs font-semibold opacity-80">#{material.id}</span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{material.cor}</p>
                    <p className="text-sm opacity-80">{material.tipo}</p>
                    <p className="mt-1 text-xs opacity-75">{formatDimensions(material.altura, material.largura)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="text-sm font-semibold text-white">{formatCurrency(material.preco_m2)}</span>
                  <span className="text-xs text-zinc-500 transition group-hover:text-zinc-300">Editar</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
