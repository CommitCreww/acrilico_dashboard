import { useEffect, useState } from "react";
import AppTopbar from "../components/layout/AppTopbar";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import SummaryCard from "../components/dashboard/SummaryCard";
import StatusOverview from "../components/dashboard/StatusOverview";
import DelayedOrdersBox from "../components/pedidos/DelayedOrdersBox";
import PedidosTable from "../components/pedidos/PedidosTable";
import PedidoForm from "../components/pedidos/PedidoForm";
import PedidoDetail from "../components/pedidos/PedidoDetail";
import {
  createPedido,
  deletePedido,
  downloadPedidoRecibo,
  getPedido,
  getPedidos,
  updatePedido,
} from "../services/pedidosService";
import { getClientes } from "../services/clientesService";
import { getMateriais } from "../services/materiaisService";
import { getPedidosStatus, getPedidosAtrasados, getResumoDashboard } from "../services/dashboardServices";
import type { Pedido, PedidoDetail as PedidoDetailType, PedidoFormValues } from "../types/pedidos";
import type { Cliente } from "../types/clientes";
import type { Material } from "../types/materiais";
import type { PedidoAtrasado, ResumoDashboard, PedidoStatus } from "../types/dashboard";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [clients, setClients] = useState<Cliente[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedPedido, setSelectedPedido] = useState<PedidoDetailType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingPedidoId, setEditingPedidoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [resumo, setResumo] = useState<ResumoDashboard | null>(null);
  const [statusData, setStatusData] = useState<PedidoStatus[]>([]);
  const [delayedOrders, setDelayedOrders] = useState<PedidoAtrasado[]>([]);
  const [pedidoToDelete, setPedidoToDelete] = useState<{
    id: number;
    cliente: string | null;
  } | null>(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const userName =
    user?.nome ||
    user?.name ||
    user?.username ||
    user?.usuario ||
    user?.email?.split("@")[0] ||
    "Usuário";

  async function loadResumoData() {
    try {
      const [resumoData, statusDataResult, delayedOrdersResult] = await Promise.all([
        getResumoDashboard(),
        getPedidosStatus(),
        getPedidosAtrasados(5),
      ]);

      setResumo(resumoData);
      setStatusData(statusDataResult);
      setDelayedOrders(delayedOrdersResult);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar resumo de pedidos.";
      setError(message);
    }
  }

  async function loadPageData() {
    try {
      setLoading(true);
      setError(null);

      const [pedidosResponse, clientsData, materialsData] = await Promise.all([
        getPedidos(page, limit, search, statusFilter),
        getClientes(),
        getMateriais(),
      ]);

      setPedidos(pedidosResponse.pedidos);
      setTotal(pedidosResponse.total);
      setPages(pedidosResponse.pages);
      setClients(clientsData);
      setMaterials(materialsData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar dados de pedidos.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function refreshPedidos() {
    try {
      const pedidosResponse = await getPedidos(page, limit, search, statusFilter);
      setPedidos(pedidosResponse.pedidos);
      setTotal(pedidosResponse.total);
      setPages(pedidosResponse.pages);
      await loadResumoData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar pedidos.";
      setError(message);
    }
  }

  useEffect(() => {
    loadPageData();
  }, [page, search, statusFilter]);

  useEffect(() => {
    loadResumoData();
  }, []);

  const totalPedidos = resumo?.total_pedidos ?? total;
  const pedidosPendentes = resumo?.pedidos_pendentes ?? 0;
  const pedidosEmProducao = resumo?.pedidos_em_producao ?? 0;
  const pedidosAtrasados = resumo?.pedidos_atrasados ?? 0;

  async function handleViewPedido(id: number) {
    try {
      setError(null);
      const pedido = await getPedido(id);

      if (!pedido.cliente_id) {
        const found = clients.find((client) => client.nome === pedido.cliente);
        pedido.cliente_id = found?.id;
      }

      setSelectedPedido(pedido);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao obter detalhes do pedido.";
      setError(message);
    }
  }

  async function handleEditPedido(id: number) {
    try {
      setError(null);
      const pedido = await getPedido(id);
      const found = clients.find((client) => client.nome === pedido.cliente);
      pedido.cliente_id = found?.id;

      setSelectedPedido(pedido);
      setEditingPedidoId(id);
      setFormMode("edit");
      setShowForm(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar pedido para edição.";
      setError(message);
    }
  }

  function handleSearchChange(value: string) {
    setPage(1);
    setSearch(value);
  }

  function handleStatusFilterChange(value: string) {
    setPage(1);
    setStatusFilter(value);
  }

  function handlePageChange(newPage: number) {
    if (newPage < 1 || newPage > pages) return;
    setPage(newPage);
  }

  function openDeleteConfirmation(id: number) {
    const pedido = pedidos.find((item) => item.id === id);
    setPedidoToDelete({
      id,
      cliente: pedido?.cliente ?? null,
    });

    if (selectedPedido?.id === id) {
      setSelectedPedido(null);
    }
  }

  async function handleDeletePedido() {
    if (!pedidoToDelete) {
      return;
    }

    try {
      setError(null);
      await deletePedido(pedidoToDelete.id);
      await refreshPedidos();
      if (selectedPedido?.id === pedidoToDelete.id) {
        setSelectedPedido(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao excluir pedido.";
      setError(message);
    } finally {
      setPedidoToDelete(null);
    }
  }

  async function handleDownloadPedidoRecibo(id: number) {
    try {
      setError(null);
      await downloadPedidoRecibo(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao baixar o recibo.";
      setError(message);
    }
  }

  function cancelDeletePedido() {
    setPedidoToDelete(null);
  }

  async function handleSubmitPedido(payload: PedidoFormValues) {
    setSaving(true);
    try {
      setError(null);

      if (formMode === "create") {
        await createPedido(payload);
      } else if (editingPedidoId !== null) {
        await updatePedido(editingPedidoId, payload);
      }

      await refreshPedidos();
      setShowForm(false);
      if (formMode === "edit" && editingPedidoId !== null) {
        await handleViewPedido(editingPedidoId);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao salvar pedido.";
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  }

  function openCreateModal() {
    setFormMode("create");
    setEditingPedidoId(null);
    setSelectedPedido(null);
    setShowForm(true);
  }

  return (
    <>
      <AnimatedBackground />
      <AppTopbar userName={userName} />

      <main className="min-h-screen px-4 py-6 text-white md:px-6 xl:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.8fr_1fr]">
            <div className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium tracking-wide text-violet-300">Pedidos</p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                    Painel de pedidos
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
                    Crie os pedidos e acompanhe pendentes, em produção e atrasados.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center justify-center rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
                >
                  Novo pedido
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
              <SummaryCard title="Total de pedidos" value={totalPedidos} accent="violet" />
              <SummaryCard title="Em produção" value={pedidosEmProducao} accent="amber" />
              <SummaryCard title="Pendentes" value={pedidosPendentes} accent="emerald" />
              <SummaryCard title="Atrasados" value={pedidosAtrasados} accent="red" />
            </div>
          </section>

          {error ? (
            <div className="rounded-[28px] border border-red-500/20 bg-red-500/10 p-6 text-red-200">
              {error}
            </div>
          ) : null}

          <section className="grid gap-6 items-start xl:grid-cols-[1.8fr_1fr]">
            <div className="space-y-6">
              <PedidosTable
                pedidos={pedidos}
                page={page}
                pages={pages}
                total={total}
                search={search}
                statusFilter={statusFilter}
                onSearch={handleSearchChange}
                onStatusFilterChange={handleStatusFilterChange}
                onPageChange={handlePageChange}
                onView={handleViewPedido}
                onEdit={handleEditPedido}
                onDelete={openDeleteConfirmation}
              />
            </div>

            <div className="grid gap-6">
              <StatusOverview data={statusData} />
              <DelayedOrdersBox delayedOrders={delayedOrders} onViewPedido={handleViewPedido} />
            </div>
          </section>

          {loading && (
            <div className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-6 text-zinc-400">
              Carregando pedidos...
            </div>
          )}
        </div>
      </main>

      {selectedPedido && (
        <PedidoDetail
          pedido={selectedPedido}
          onEdit={() => handleEditPedido(selectedPedido.id)}
          onDelete={() => openDeleteConfirmation(selectedPedido.id)}
          onDownload={() => handleDownloadPedidoRecibo(selectedPedido.id)}
          onClose={() => setSelectedPedido(null)}
        />
      )}

      {pedidoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
            <div className="border-b border-white/10 px-6 py-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">Atenção</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Excluir pedido</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Você está prestes a excluir o pedido
                {pedidoToDelete.cliente ? ` do cliente ${pedidoToDelete.cliente}` : ""}.
                Essa ação é permanente e não poderá ser recuperada depois.
              </p>
            </div>
            <div className="p-6">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-medium text-white">Confirmação</p>
                <p className="mt-3 text-sm text-zinc-300">
                  Deseja realmente apagar este pedido? Todos os dados associados serão removidos permanentemente.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={cancelDeletePedido}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDeletePedido}
                  className="rounded-full border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
                >
                  Excluir permanentemente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <PedidoForm
        open={showForm}
        mode={formMode}
        clients={clients}
        materials={materials}
        initialData={formMode === "edit" ? selectedPedido : null}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmitPedido}
        submitting={saving}
      />
    </>
  );
}
