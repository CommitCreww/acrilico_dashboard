import type { ClienteResumo } from "../../types/clientes";

type ClienteDetailProps = {
  resumo: ClienteResumo;
  onEdit: () => void;
  onViewPedido: (pedidoId: number) => void;
  onClose: () => void;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export default function ClienteDetail({ resumo, onEdit, onViewPedido, onClose }: ClienteDetailProps) {
  const { cliente } = resumo;
  const whatsappPhone = onlyDigits(cliente.telefone || "");

  async function copyToClipboard(value: string) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[min(100%,_62rem)] max-h-[calc(100vh-2rem)] overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950 shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet-300">Detalhes do cliente</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{cliente.nome}</h2>
            <p className="mt-2 text-sm text-zinc-400">Cadastro #{cliente.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Fechar
          </button>
        </div>

        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto p-6">
          <div className="mb-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onEdit}
              className="rounded-3xl border border-white/10 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20"
            >
              Editar
            </button>
            {cliente.telefone ? (
              <button
                type="button"
                onClick={() => copyToClipboard(cliente.telefone)}
                className="rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Copiar telefone
              </button>
            ) : null}
            {cliente.email ? (
              <button
                type="button"
                onClick={() => copyToClipboard(cliente.email)}
                className="rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Copiar email
              </button>
            ) : null}
            {whatsappPhone ? (
              <a
                href={`https://wa.me/55${whatsappPhone}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20"
              >
                WhatsApp
              </a>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Pedidos</p>
              <p className="mt-3 text-2xl font-semibold text-white">{resumo.total_pedidos}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Total comprado</p>
              <p className="mt-3 text-lg font-semibold text-white">{formatCurrency(resumo.total_comprado)}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Ultimo pedido</p>
              <p className="mt-3 text-sm text-zinc-200">{resumo.ultimo_pedido ? `#${resumo.ultimo_pedido.id}` : "-"}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Status recente</p>
              <p className="mt-3 text-sm text-zinc-200">{resumo.ultimo_pedido?.status_pedido.replace(/_/g, " ") ?? "-"}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Email</p>
              <p className="mt-3 break-words text-sm text-zinc-200">{cliente.email || "-"}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Telefone</p>
              <p className="mt-3 text-sm text-zinc-200">{cliente.telefone || "-"}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">CPF/CNPJ</p>
              <p className="mt-3 text-sm text-zinc-200">{cliente.cpf_cnpj || "-"}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Tipo</p>
              <p className="mt-3 text-sm text-zinc-200">{cliente.tipo_cliente === "RECORRENTE" ? "Recorrente" : "Novo"}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:col-span-2">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Endereco</p>
              <p className="mt-3 text-sm text-zinc-200">{cliente.endereco || "-"}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:col-span-2">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Observacoes</p>
              <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-200">{cliente.observacoes || "-"}</p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-white">Ultimos pedidos</p>
            {resumo.pedidos.length === 0 ? (
              <p className="mt-4 text-sm text-zinc-400">Nenhum pedido encontrado para este cliente.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {resumo.pedidos.map((pedido) => (
                  <div key={pedido.id} className="grid gap-3 rounded-3xl border border-white/10 bg-zinc-950 p-4 md:grid-cols-[1fr_140px_140px_110px] md:items-center">
                    <div>
                      <p className="text-sm font-medium text-white">Pedido #{pedido.id}</p>
                      <p className="mt-1 text-sm text-zinc-400">{pedido.descricao || "-"}</p>
                    </div>
                    <p className="text-sm font-semibold text-white">{formatCurrency(pedido.valor)}</p>
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Entrada</p>
                      <p className="mt-1 text-sm text-zinc-300">{formatDate(pedido.data_entrada)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onViewPedido(pedido.id)}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      Abrir
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
