import { useState } from "react";
import type { PedidoDetail } from "../../types/pedidos";

type PedidoDetailProps = {
  pedido: PedidoDetail;
  onEdit: () => void;
  onDelete: () => void;
  onDownload?: () => Promise<void>;
  onClose: () => void;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function PedidoDetail({ pedido, onEdit, onDelete, onDownload, onClose }: PedidoDetailProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload() {
    if (!onDownload) {
      return;
    }

    try {
      setIsDownloading(true);
      await onDownload();
    } finally {
      setIsDownloading(false);
    }
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[min(100%,_58rem)] max-h-[calc(100vh-2rem)] overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950 shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet-300">Detalhes do pedido</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Pedido #{pedido.id}</h2>
            <p className="mt-2 text-sm text-zinc-400">Cliente: {pedido.cliente}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Fechar
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-wrap gap-3">
              {pedido.can_edit ? (
                <button
                  type="button"
                  onClick={onEdit}
                  className="rounded-3xl border border-white/10 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20"
                >
                  Editar
                </button>
              ) : null}
              {pedido.can_delete ? (
                <button
                  type="button"
                  onClick={onDelete}
                  className="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20"
                >
                  Excluir
                </button>
              ) : null}
              {onDownload ? (
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="rounded-3xl border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-200 transition hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDownloading ? "Baixando recibo..." : "Baixar recibo"}
                </button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Descrição</p>
              <p className="mt-3 text-sm text-zinc-200">{pedido.descricao}</p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Valor</p>
                <p className="mt-3 text-lg font-semibold text-white">{formatCurrency(pedido.valor)}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Status</p>
                <p className="mt-3 text-sm text-zinc-200">{pedido.status_pedido.replace(/_/g, " ")}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Data de entrada</p>
              <p className="mt-3 text-sm text-zinc-200">{pedido.data_entrada ?? "-"}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Data de entrega</p>
              <p className="mt-3 text-sm text-zinc-200">{pedido.data_entrega ?? "-"}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Pagamento</p>
              {pedido.pagamentos.length === 0 ? (
                <p className="mt-3 text-sm text-zinc-400">Nenhum pagamento registrado.</p>
              ) : (
                <div className="space-y-3">
                  {pedido.pagamentos.map((pagamento) => (
                    <div key={pagamento.id} className="rounded-[20px] border border-white/10 bg-zinc-950 p-4">
                      <p className="text-sm font-medium text-white">{pagamento.status_pagamento.replace(/_/g, " ")}</p>
                      <p className="mt-2 text-sm text-zinc-400">Valor pago: {formatCurrency(pagamento.valor_pago)}</p>
                      <p className="text-sm text-zinc-400">Forma: {pagamento.forma_pagamento || "-"}</p>
                      <p className="text-sm text-zinc-400">Data: {pagamento.data_pagamento ?? "-"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Data de entrega</p>
              <p className="mt-3 text-sm text-zinc-200">{pedido.data_entrega ?? "-"}</p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-white">Materiais</p>
            <div className="mt-4 space-y-3">
              {pedido.materiais.length === 0 ? (
                <p className="text-sm text-zinc-400">Nenhum material vinculado.</p>
              ) : (
                pedido.materiais.map((item) => (
                  <div
                    key={`${item.material_id}-${item.tipo}-${item.cor}`}
                    className="grid gap-3 rounded-3xl border border-white/10 bg-zinc-950 p-4 md:grid-cols-[1fr_1fr_120px]"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Material</p>
                      <p className="mt-1 text-sm text-zinc-200">{item.tipo}</p>
                      <p className="text-sm text-zinc-500">{item.cor} • {item.espessura}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Quantidade</p>
                      <p className="mt-1 text-sm text-white">{item.quantidade}</p>
                      <p className="mt-2 text-xs text-zinc-400">Preço m²: R$ {item.preco_m2.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
