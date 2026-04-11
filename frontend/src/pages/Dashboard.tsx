import { useEffect, useMemo, useState } from "react"
import logo from "../assets/logo.png"
import {
  LayoutDashboard,
  Package,
  Users,
  Boxes,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  DollarSign,
  ShoppingBag,
  Clock3,
  Factory,
  Menu,
  X,
  TriangleAlert,
} from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts"

type ResumoDashboard = {
  total_pedidos: number
  pedidos_pendentes: number
  pedidos_em_producao: number
  faturamento_total: number
}

type FaturamentoMensalItem = {
  mes: number
  total: number
}

type MaterialMaisUsadoItem = {
  material: string
  quantidade: number
}

type PedidoRecenteItem = {
  id: number
  cliente: string
  descricao: string
  valor: number
  status: string
}

type PedidoStatusItem = {
  status: string
  quantidade: number
}

type TooltipPropsCustom = {
  active?: boolean
  payload?: Array<{
    value: number
    payload: {
      mesLabel: string
      total: number
    }
  }>
}

const API_BASE_URL = "http://127.0.0.1:5000"

function CustomBarTooltip({ active, payload }: TooltipPropsCustom) {
  if (!active || !payload || payload.length === 0) return null

  const item = payload[0].payload

  return (
    <div className="rounded-2xl border border-white/10 bg-[#12081f]/95 px-4 py-3 shadow-[0_0_20px_rgba(168,85,247,0.18)] backdrop-blur-xl">
      <p className="text-sm font-semibold text-white">{item.mesLabel}</p>
      <p className="mt-1 text-sm text-fuchsia-300">
        Faturamento:{" "}
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(item.total)}
      </p>
    </div>
  )
}

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState("")

  const [resumo, setResumo] = useState<ResumoDashboard | null>(null)
  const [faturamentoMensal, setFaturamentoMensal] = useState<FaturamentoMensalItem[]>([])
  const [materiaisMaisUsados, setMateriaisMaisUsados] = useState<MaterialMaisUsadoItem[]>([])
  const [pedidosRecentes, setPedidosRecentes] = useState<PedidoRecenteItem[]>([])
  const [pedidosStatus, setPedidosStatus] = useState<PedidoStatusItem[]>([])

  const nomeUsuario = useMemo(() => {
    const usuarioSalvo = localStorage.getItem("usuario")

    if (!usuarioSalvo) return "Usuário"

    try {
      const usuario = JSON.parse(usuarioSalvo)
      return usuario?.nome || "Usuário"
    } catch {
      return "Usuário"
    }
  }, [])

  function getToken(): string | null {
    return localStorage.getItem("token")
  }

  async function fetchComAuth<T>(endpoint: string): Promise<T> {
    const token = getToken()

    if (!token) {
      throw new Error("Token não encontrado. Faça login novamente.")
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 401) {
      throw new Error("Sessão expirada ou token inválido.")
    }

    if (!response.ok) {
      throw new Error(`Erro ao buscar ${endpoint}`)
    }

    return response.json()
  }

  useEffect(() => {
    async function carregarDashboard() {
      try {
        setLoading(true)
        setErro("")

        const [
          resumoData,
          faturamentoMensalData,
          materiaisMaisUsadosData,
          pedidosRecentesData,
          pedidosStatusData,
        ] = await Promise.all([
          fetchComAuth<ResumoDashboard>("/dashboard/resumo"),
          fetchComAuth<FaturamentoMensalItem[]>("/dashboard/faturamento-mensal"),
          fetchComAuth<MaterialMaisUsadoItem[]>("/dashboard/materiais-mais-usados"),
          fetchComAuth<PedidoRecenteItem[]>("/dashboard/pedidos-recentes"),
          fetchComAuth<PedidoStatusItem[]>("/dashboard/pedidos-status"),
        ])

        setResumo(resumoData)
        setFaturamentoMensal(faturamentoMensalData)
        setMateriaisMaisUsados(materiaisMaisUsadosData)
        setPedidosRecentes(pedidosRecentesData)
        setPedidosStatus(pedidosStatusData)
      } catch (error) {
        console.error(error)
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar dados do dashboard."
        )
      } finally {
        setLoading(false)
      }
    }

    carregarDashboard()
  }, [])

  function formatarMoeda(valor: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  function formatarMes(numeroMes: number): string {
    const meses = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ]

    return meses[numeroMes - 1] || "-"
  }

  function getStatusClasses(status: string): string {
    const statusNormalizado = status.toLowerCase()

    if (statusNormalizado.includes("produção") || statusNormalizado.includes("producao")) {
      return "bg-cyan-400/15 text-cyan-300 border border-cyan-400/20"
    }

    if (statusNormalizado.includes("pendente")) {
      return "bg-amber-400/15 text-amber-300 border border-amber-400/20"
    }

    if (statusNormalizado.includes("concluído") || statusNormalizado.includes("concluido")) {
      return "bg-emerald-400/15 text-emerald-300 border border-emerald-400/20"
    }

    if (statusNormalizado.includes("cancelado")) {
      return "bg-rose-400/15 text-rose-300 border border-rose-400/20"
    }

    return "bg-fuchsia-400/15 text-fuchsia-300 border border-fuchsia-400/20"
  }

  function getStatusColor(index: number): string {
    const cores = [
      "#f59e0b",
      "#22d3ee",
      "#10b981",
      "#d946ef",
      "#fb7185",
      "#8b5cf6",
    ]

    return cores[index % cores.length]
  }

  const faturamentoChartData = faturamentoMensal.map((item) => ({
    mes: formatarMes(item.mes),
    mesLabel: formatarMes(item.mes),
    total: item.total,
  }))

  const pedidosStatusChartData = pedidosStatus.map((item, index) => ({
    name: item.status,
    value: item.quantidade,
    fill: getStatusColor(index),
  }))

  const totalStatus = useMemo(() => {
    return pedidosStatus.reduce((acc, item) => acc + item.quantidade, 0)
  }, [pedidosStatus])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#24103d_0%,_#12081f_35%,_#05030a_100%)] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.12),transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(217,70,239,0.08),transparent_20%)]" />

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="relative flex min-h-screen">
        {/* Sidebar Desktop */}
        <aside
          className={`relative hidden border-r border-white/10 bg-black/20 backdrop-blur-xl transition-all duration-300 lg:block ${
            sidebarOpen ? "w-72" : "w-24"
          }`}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-4 top-8 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#1b102d] text-white/70 shadow-lg transition hover:text-white"
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>

          <div className="border-b border-white/10 px-4 py-6">
            <div className={`flex items-center ${sidebarOpen ? "gap-4" : "justify-center"}`}>
              <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
              {sidebarOpen && (
                <div>
                  <h2 className="text-base font-bold">Ludarte Acrílicos</h2>
                  <p className="text-xs text-white/45">Gestão de Acrílico</p>
                </div>
              )}
            </div>
          </div>

          <nav className="p-4">
            <ul className="space-y-3">
              <li className={`flex items-center rounded-2xl bg-gradient-to-r from-fuchsia-600/30 to-violet-500/20 px-4 py-3 font-medium text-white shadow-[0_0_20px_rgba(168,85,247,0.18)] ${sidebarOpen ? "gap-3" : "justify-center"}`}>
                <LayoutDashboard size={20} />
                {sidebarOpen && <span>Dashboard</span>}
              </li>

              <li className={`flex items-center rounded-2xl px-4 py-3 text-white/65 transition hover:bg-white/5 hover:text-white ${sidebarOpen ? "gap-3" : "justify-center"}`}>
                <Package size={20} />
                {sidebarOpen && <span>Pedidos</span>}
              </li>

              <li className={`flex items-center rounded-2xl px-4 py-3 text-white/65 transition hover:bg-white/5 hover:text-white ${sidebarOpen ? "gap-3" : "justify-center"}`}>
                <Users size={20} />
                {sidebarOpen && <span>Clientes</span>}
              </li>

              <li className={`flex items-center rounded-2xl px-4 py-3 text-white/65 transition hover:bg-white/5 hover:text-white ${sidebarOpen ? "gap-3" : "justify-center"}`}>
                <Boxes size={20} />
                {sidebarOpen && <span>Materiais</span>}
              </li>

            </ul>
          </nav>
        </aside>

        {/* Sidebar Mobile */}
        <aside
          className={`fixed left-0 top-0 z-50 h-full w-72 border-r border-white/10 bg-[#12081f]/95 backdrop-blur-xl transition-transform duration-300 lg:hidden ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-6">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
              <div>
                <h2 className="text-base font-bold">Ludarte Acrílicos</h2>
                <p className="text-xs text-white/45">Gestão de Acrílico</p>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl p-2 text-white/70 hover:bg-white/5 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="p-4">
            <ul className="space-y-3">
              <li className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-fuchsia-600/30 to-violet-500/20 px-4 py-3 font-medium text-white">
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </li>

              <li className="flex items-center gap-3 rounded-2xl px-4 py-3 text-white/65 transition hover:bg-white/5 hover:text-white">
                <Package size={20} />
                <span>Pedidos</span>
              </li>

              <li className="flex items-center gap-3 rounded-2xl px-4 py-3 text-white/65 transition hover:bg-white/5 hover:text-white">
                <Users size={20} />
                <span>Clientes</span>
              </li>

              <li className="flex items-center gap-3 rounded-2xl px-4 py-3 text-white/65 transition hover:bg-white/5 hover:text-white">
                <Boxes size={20} />
                <span>Materiais</span>
              </li>

            </ul>
          </nav>
        </aside>

        {/* Conteúdo */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="mt-1 rounded-2xl border border-white/10 bg-white/5 p-3 text-white/70 lg:hidden"
              >
                <Menu size={18} />
              </button>

              <div>
                <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                  Dashboard
                </h1>
                <p className="mt-2 text-sm text-white/50 md:text-base">
                  Visão geral da sua operação
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
                <Search size={18} className="text-white/45" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none sm:w-48"
                />
              </div>

              <div className="flex items-center gap-3">
                <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/65 transition hover:bg-white/10 hover:text-white">
                  <Bell size={18} />
                </button>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
                  {nomeUsuario}
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 text-white/60 backdrop-blur-xl">
              Carregando dashboard...
            </div>
          )}

          {!loading && erro && (
            <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 p-6 text-rose-200 backdrop-blur-xl">
              {erro}
            </div>
          )}

          {!loading && !erro && (
            <>
              <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-[0_0_25px_rgba(168,85,247,0.06)]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                        Faturamento Total
                      </p>
                      <h3 className="mt-3 text-3xl font-bold">
                        {formatarMoeda(resumo?.faturamento_total ?? 0)}
                      </h3>
                    </div>

                    <div className="rounded-2xl bg-emerald-400/15 p-3 text-emerald-300">
                      <DollarSign size={20} />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-[0_0_25px_rgba(168,85,247,0.06)]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                        Pedidos Totais
                      </p>
                      <h3 className="mt-3 text-3xl font-bold">
                        {resumo?.total_pedidos ?? 0}
                      </h3>
                    </div>

                    <div className="rounded-2xl bg-cyan-400/15 p-3 text-cyan-300">
                      <ShoppingBag size={20} />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-[0_0_25px_rgba(168,85,247,0.06)]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                        Pedidos Pendentes
                      </p>
                      <h3 className="mt-3 text-3xl font-bold">
                        {resumo?.pedidos_pendentes ?? 0}
                      </h3>
                    </div>

                    <div className="rounded-2xl bg-amber-400/15 p-3 text-amber-300">
                      <Clock3 size={20} />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-[0_0_25px_rgba(168,85,247,0.06)]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                        Em Produção
                      </p>
                      <h3 className="mt-3 text-3xl font-bold">
                        {resumo?.pedidos_em_producao ?? 0}
                      </h3>
                    </div>

                    <div className="rounded-2xl bg-fuchsia-400/15 p-3 text-fuchsia-300">
                      <Factory size={20} />
                    </div>
                  </div>
                </div>
              </section>

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
  {/* Coluna esquerda */}
  <div className="space-y-6">
    {/* Faturamento Mensal */}
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 sm:p-6 backdrop-blur-xl shadow-[0_0_25px_rgba(168,85,247,0.06)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold sm:text-xl">Faturamento Mensal</h2>
      </div>

      {faturamentoChartData.length === 0 ? (
        <p className="text-white/45">Nenhum dado encontrado.</p>
      ) : (
        <div className="h-[220px] sm:h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={faturamentoChartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                stroke="rgba(255,255,255,0.08)"
                vertical={false}
              />

              <XAxis
                dataKey="mes"
                tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
                tickLine={false}
                width={45}
              />

              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                content={<CustomBarTooltip />}
              />

              <Bar
                dataKey="total"
                radius={[14, 14, 0, 0]}
                barSize={faturamentoChartData.length <= 2 ? 70 : 50}
              >
                {faturamentoChartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill="url(#barGradient)" />
                ))}
              </Bar>

              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f0abfc" />
                  <stop offset="55%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>

    {/* Pedidos Recentes */}
    <section className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 sm:p-6 backdrop-blur-xl shadow-[0_0_25px_rgba(168,85,247,0.06)]">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold sm:text-xl">Pedidos Recentes</h2>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-white/10 md:block">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-sm uppercase tracking-wider text-white/45">
            <tr>
              <th className="px-4 py-4">ID</th>
              <th className="px-4 py-4">Cliente</th>
              <th className="px-4 py-4">Descrição</th>
              <th className="px-4 py-4">Valor</th>
              <th className="px-4 py-4">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10 text-white/75">
            {pedidosRecentes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-white/45">
                  Nenhum pedido encontrado.
                </td>
              </tr>
            ) : (
              pedidosRecentes.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-white/5">
                  <td className="px-4 py-4">
                    PED-{String(pedido.id).padStart(3, "0")}
                  </td>
                  <td className="px-4 py-4">{pedido.cliente}</td>
                  <td className="px-4 py-4">{pedido.descricao}</td>
                  <td className="px-4 py-4">{formatarMoeda(pedido.valor)}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs ${getStatusClasses(pedido.status)}`}>
                      {pedido.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {pedidosRecentes.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-white/45">
            Nenhum pedido encontrado.
          </div>
        ) : (
          pedidosRecentes.map((pedido) => (
            <div
              key={pedido.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-semibold text-white">
                  PED-{String(pedido.id).padStart(3, "0")}
                </span>

                <span className={`rounded-full px-3 py-1 text-xs ${getStatusClasses(pedido.status)}`}>
                  {pedido.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-white/70">
                <p><span className="text-white/40">Cliente:</span> {pedido.cliente}</p>
                <p><span className="text-white/40">Descrição:</span> {pedido.descricao}</p>
                <p><span className="text-white/40">Valor:</span> {formatarMoeda(pedido.valor)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  </div>

  {/* Coluna direita */}
  <div className="space-y-6">
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 sm:p-6 backdrop-blur-xl shadow-[0_0_25px_rgba(168,85,247,0.06)]">
      <h2 className="mb-6 text-lg font-semibold sm:text-xl">Pedidos por Status</h2>

      {pedidosStatusChartData.length === 0 ? (
        <p className="text-white/45">Nenhum dado encontrado.</p>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-center">
            <div className="h-[220px] w-full max-w-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pedidosStatusChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={84}
                    paddingAngle={3}
                    stroke="transparent"
                  >
                    {pedidosStatusChartData.map((entry, index) => (
                      <Cell key={`pie-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      background: "rgba(18, 8, 31, 0.95)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "16px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mb-4 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
              Total
            </p>
            <p className="mt-1 text-2xl font-bold text-white">
              {totalStatus}
            </p>
          </div>

          <div className="space-y-3">
            {pedidosStatusChartData.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-white/75">{item.name}</span>
                </div>

                <span className="font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>

    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 sm:p-6 backdrop-blur-xl shadow-[0_0_25px_rgba(168,85,247,0.06)]">
      <h2 className="mb-4 text-lg font-semibold sm:text-xl">Materiais Mais Usados</h2>

      {materiaisMaisUsados.length === 0 ? (
        <p className="text-white/45">Nenhum material encontrado.</p>
      ) : (
        <div className="space-y-4">
          {materiaisMaisUsados.map((item) => (
            <div
              key={`${item.material}-${item.quantidade}`}
              className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3"
            >
              <span className="text-white/75">{item.material}</span>
              <span className="font-semibold text-fuchsia-300">
                {item.quantidade}x
              </span>
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 sm:p-6 backdrop-blur-xl shadow-[0_0_25px_rgba(168,85,247,0.06)]">
      <h2 className="mb-4 text-lg font-semibold sm:text-xl">Alertas</h2>

      <div className="space-y-3 text-sm text-white/70">
        <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
          <TriangleAlert size={18} className="text-amber-300" />
          <span>Verifique pedidos próximos do vencimento</span>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
          <TriangleAlert size={18} className="text-fuchsia-300" />
          <span>Verifique materiais com maior giro</span>
        </div>
      </div>
    </div>
  </div>
</section>

            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default Dashboard