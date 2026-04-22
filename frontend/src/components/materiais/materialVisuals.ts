export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDimensions(altura: number, largura: number) {
  if (!altura && !largura) return "-";
  return `${formatNumber(largura)} x ${formatNumber(altura)} m`;
}

export function getArea(altura: number, largura: number) {
  return Number(altura || 0) * Number(largura || 0);
}

export function normalizeColor(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function getMaterialColor(value: string) {
  const normalized = normalizeColor(value);

  if (normalized.includes("cristal") || normalized.includes("transparente")) return "#dbeafe";
  if (normalized.includes("branco")) return "#f8fafc";
  if (normalized.includes("preto") || normalized.includes("fum")) return "#18181b";
  if (normalized.includes("vermelho")) return "#ef4444";
  if (normalized.includes("azul")) return "#3b82f6";
  if (normalized.includes("verde")) return "#22c55e";
  if (normalized.includes("amarelo")) return "#eab308";
  if (normalized.includes("rosa") || normalized.includes("pink")) return "#ec4899";
  if (normalized.includes("laranja")) return "#f97316";
  if (normalized.includes("roxo") || normalized.includes("violeta")) return "#8b5cf6";
  if (normalized.includes("cinza") || normalized.includes("prata")) return "#94a3b8";
  if (normalized.includes("dourado") || normalized.includes("ouro")) return "#f59e0b";

  return "#06b6d4";
}

export function getContrastColor(hex: string) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.62 ? "#18181b" : "#ffffff";
}
