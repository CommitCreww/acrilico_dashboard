import type { Material } from "../../types/materiais";
import { formatCurrency, formatNumber, getArea } from "./materialVisuals";

type MateriaisStatsProps = {
  materiais: Material[];
};

export default function MateriaisStats({ materiais }: MateriaisStatsProps) {
  const total = materiais.length;
  const tipos = new Set(materiais.map((material) => material.tipo.trim()).filter(Boolean)).size;
  const areaTotal = materiais.reduce((sum, material) => sum + getArea(material.altura, material.largura), 0);
  const precoMedio = total
    ? materiais.reduce((sum, material) => sum + Number(material.preco_m2 || 0), 0) / total
    : 0;

  const stats = [
    { label: "Itens", value: String(total), detail: "materiais cadastrados" },
    { label: "Tipos", value: String(tipos), detail: "familias de material" },
    { label: "Area total", value: `${formatNumber(areaTotal)} m2`, detail: "soma das chapas" },
    { label: "Preco medio", value: formatCurrency(precoMedio), detail: "por metro quadrado" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {stats.map((item) => (
        <div key={item.label} className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <p className="text-sm text-zinc-400">{item.label}</p>
          <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
          <p className="mt-1 text-xs text-zinc-500">{item.detail}</p>
        </div>
      ))}
    </div>
  );
}
