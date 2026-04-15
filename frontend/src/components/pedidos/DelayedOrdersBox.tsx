import type { PedidoAtrasado } from "../../types/dashboard";

type DelayedOrdersBoxProps = {
  delayedOrders: PedidoAtrasado[];
  onViewPedido?: (id: number) => void;
};

export default function DelayedOrdersBox({
  delayedOrders,
  onViewPedido,
}: DelayedOrdersBoxProps) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] max-h-[34rem] overflow-hidden">
      <div className="mb-6">
        <p className="text-sm font-medium tracking-wide text-red-300">Mais atrasados</p>
        <p className="mt-1 text-sm text-zinc-500">Os 5 pedidos que estão há mais tempo atrasados</p>
      </div>

      {delayedOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-red-500/20 bg-black/10 px-4 py-8 text-center text-sm text-red-100/70">
          Nenhum pedido atrasado no momento.
        </div>
      ) : (
        <div className="space-y-3 max-h-[26rem] overflow-y-auto pr-1 [scrollbar-color:rgba(248,113,113,0.55)_rgba(255,255,255,0.06)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-red-400/60 [&::-webkit-scrollbar-thumb]:to-rose-400/60">
          {delayedOrders.map((pedido) => (
            <div key={pedido.id} className="rounded-2xl border border-red-500/15 bg-black/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{pedido.cliente}</p>
                  <p className="mt-1 text-xs text-zinc-400">Pedido #{pedido.id}</p>
                </div>
                <span className="rounded-full bg-red-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                  {pedido.atraso_label}
                </span>
              </div>

              <p className="mt-3 line-clamp-2 text-sm text-zinc-300">{pedido.descricao}</p>
              <p className="mt-3 text-xs text-zinc-500">
                Entrega prevista: {pedido.data_entrega ?? "-"}
                {pedido.horario_entrega ? ` às ${pedido.horario_entrega}` : ""}
              </p>

              {onViewPedido ? (
                <button
                  type="button"
                  onClick={() => onViewPedido(pedido.id)}
                  className="mt-4 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-500/20"
                >
                  Ver pedido
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
