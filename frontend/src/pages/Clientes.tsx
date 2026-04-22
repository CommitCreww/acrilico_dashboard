import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppTopbar from "../components/layout/AppTopbar";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import ClientesTable from "../components/clientes/ClientesTable";
import ClienteDetail from "../components/clientes/ClienteDetail";
import ClienteForm from "../components/clientes/ClienteForm";
import ClientesRecorrenciaChart from "../components/clientes/ClientesRecorrenciaChart";
import PedidoDetail from "../components/pedidos/PedidoDetail";
import { createCliente, getCliente, getClienteResumo, getClientes, updateCliente } from "../services/clientesService";
import { getPedidosClientesRecorrencia } from "../services/dashboardServices";
import { downloadPedidoRecibo, getPedido } from "../services/pedidosService";
import type { Cliente, ClienteFormValues, ClienteResumo } from "../types/clientes";
import type { PedidosClientesRecorrenciaItem } from "../types/dashboard";
import type { PedidoDetail as PedidoDetailType } from "../types/pedidos";

export default function Clientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [selectedClienteResumo, setSelectedClienteResumo] = useState<ClienteResumo | null>(null);
  const [selectedPedido, setSelectedPedido] = useState<PedidoDetailType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingClienteId, setEditingClienteId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [sortBy, setSortBy] = useState("nome");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [recorrenciaData, setRecorrenciaData] = useState<PedidosClientesRecorrenciaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const userName =
    user?.nome ||
    user?.name ||
    user?.username ||
    user?.usuario ||
    user?.email?.split("@")[0] ||
    "Usuario";

  async function loadClientes() {
    try {
      setLoading(true);
      setError(null);
      const [clientesData, recorrenciaResult] = await Promise.all([
        getClientes(),
        getPedidosClientesRecorrencia(),
      ]);
      setClientes(clientesData);
      setRecorrenciaData(recorrenciaResult);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar clientes.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClientes();
  }, []);

  const filteredClientes = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = term
      ? clientes.filter((cliente) =>
          [cliente.nome, cliente.email, cliente.telefone, cliente.cpf_cnpj, cliente.endereco, cliente.observacoes]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(term))
        )
      : clientes;

    const byTipo = tipoFilter
      ? filtered.filter((cliente) => cliente.tipo_cliente === tipoFilter)
      : filtered;

    return [...byTipo].sort((a, b) => {
      if (sortBy === "recentes") {
        return b.id - a.id;
      }

      if (sortBy === "pedidos") {
        return (b.total_pedidos ?? 0) - (a.total_pedidos ?? 0);
      }

      return a.nome.localeCompare(b.nome, "pt-BR");
    });
  }, [clientes, search, tipoFilter, sortBy]);

  const totalFilteredClientes = filteredClientes.length;
  const pages = Math.max(Math.ceil(totalFilteredClientes / limit), 1);
  const paginatedClientes = filteredClientes.slice((page - 1) * limit, page * limit);

  function handleSearchChange(value: string) {
    setPage(1);
    setSearch(value);
  }

  function handleTipoFilterChange(value: string) {
    setPage(1);
    setTipoFilter(value);
  }

  function handleSortByChange(value: string) {
    setPage(1);
    setSortBy(value);
  }

  function handlePageChange(newPage: number) {
    if (newPage < 1 || newPage > pages) return;
    setPage(newPage);
  }

  async function handleViewCliente(id: number) {
    try {
      setError(null);
      const resumo = await getClienteResumo(id);
      setSelectedClienteResumo(resumo);
      setSelectedCliente(resumo.cliente);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao obter detalhes do cliente.";
      setError(message);
    }
  }

  async function handleEditCliente(id: number) {
    try {
      setError(null);
      const cliente = await getCliente(id);
      setSelectedCliente(cliente);
      setSelectedClienteResumo(null);
      setEditingClienteId(id);
      setFormMode("edit");
      setShowForm(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar cliente para edicao.";
      setError(message);
    }
  }

  async function handleSubmitCliente(payload: ClienteFormValues) {
    setSaving(true);
    try {
      setError(null);

      if (formMode === "create") {
        const result = await createCliente(payload);
        await loadClientes();
        setShowForm(false);
        await handleViewCliente(result.id);
        return;
      }

      if (editingClienteId !== null) {
        await updateCliente(editingClienteId, payload);
        await loadClientes();
        setShowForm(false);
        await handleViewCliente(editingClienteId);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao salvar cliente.";
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  }

  function openCreateModal() {
    setFormMode("create");
    setEditingClienteId(null);
    setSelectedCliente(null);
    setSelectedClienteResumo(null);
    setShowForm(true);
  }

  async function handleViewPedido(id: number) {
    try {
      setError(null);
      const pedido = await getPedido(id);
      setSelectedPedido(pedido);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao obter detalhes do pedido.";
      setError(message);
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
                  <p className="text-sm font-medium tracking-wide text-violet-300">Clientes</p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                    Painel de clientes
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
                    Cadastre clientes e mantenha os dados de contato prontos para novos pedidos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center justify-center rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
                >
                  Novo cliente
                </button>
              </div>
            </div>

            <ClientesRecorrenciaChart data={recorrenciaData} />
          </section>

          {error ? (
            <div className="rounded-[28px] border border-red-500/20 bg-red-500/10 p-6 text-red-200">
              {error}
            </div>
          ) : null}

          <ClientesTable
            clientes={paginatedClientes}
            total={totalFilteredClientes}
            page={page}
            pages={pages}
            search={search}
            tipoFilter={tipoFilter}
            sortBy={sortBy}
            onSearch={handleSearchChange}
            onTipoFilterChange={handleTipoFilterChange}
            onSortByChange={handleSortByChange}
            onPageChange={handlePageChange}
            onView={handleViewCliente}
            onEdit={handleEditCliente}
          />

          {loading && (
            <div className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-6 text-zinc-400">
              Carregando clientes...
            </div>
          )}
        </div>
      </main>

      {selectedClienteResumo && (
        <ClienteDetail
          resumo={selectedClienteResumo}
          onEdit={() => handleEditCliente(selectedClienteResumo.cliente.id)}
          onViewPedido={handleViewPedido}
          onClose={() => {
            setSelectedClienteResumo(null);
            setSelectedCliente(null);
          }}
        />
      )}

      {selectedPedido && (
        <PedidoDetail
          pedido={selectedPedido}
          onEdit={() => navigate("/pedidos")}
          onDelete={() => navigate("/pedidos")}
          onDownload={() => handleDownloadPedidoRecibo(selectedPedido.id)}
          onClose={() => setSelectedPedido(null)}
        />
      )}

      <ClienteForm
        open={showForm}
        mode={formMode}
        initialData={formMode === "edit" ? selectedCliente : null}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmitCliente}
        submitting={saving}
      />
    </>
  );
}
