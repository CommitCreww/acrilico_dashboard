import { useEffect, useMemo, useState } from "react";
import AppTopbar from "../components/layout/AppTopbar";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import MaterialForm from "../components/materiais/MaterialForm";
import MateriaisPalette from "../components/materiais/MateriaisPalette";
import MateriaisTable from "../components/materiais/MateriaisTable";
import MateriaisUsoMensalChart from "../components/materiais/MateriaisUsoMensalChart";
import { getMateriaisMaisUsadosMensal } from "../services/dashboardServices";
import {
  createMaterial,
  deleteMaterial,
  getMaterial,
  getMateriais,
  updateMaterial,
} from "../services/materiaisService";
import type { MaterialMaisUsadoMensal } from "../types/dashboard";
import type { Material, MaterialFormValues } from "../types/materiais";

export default function Materiais() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [materiaisUsoMensal, setMateriaisUsoMensal] = useState<MaterialMaisUsadoMensal[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingMaterialId, setEditingMaterialId] = useState<number | null>(null);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [sortBy, setSortBy] = useState("tipo");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
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

  async function loadMateriais() {
    try {
      setLoading(true);
      setError(null);
      const [materiaisData, usoMensalData] = await Promise.all([
        getMateriais(),
        getMateriaisMaisUsadosMensal(),
      ]);
      setMateriais(materiaisData);
      setMateriaisUsoMensal(usoMensalData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar materiais.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMateriais();
  }, []);

  const tipoOptions = useMemo(
    () => [...new Set(materiais.map((material) => material.tipo).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR")),
    [materiais]
  );

  const filteredMateriais = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = term
      ? materiais.filter((material) =>
          [
            material.tipo,
            material.cor,
            material.espessura,
            String(material.altura),
            String(material.largura),
            String(material.preco_m2),
          ]
            .some((value) => value.toLowerCase().includes(term))
        )
      : materiais;

    const byTipo = tipoFilter
      ? filtered.filter((material) => material.tipo === tipoFilter)
      : filtered;

    return [...byTipo].sort((a, b) => {
      if (sortBy === "preco_desc") return Number(b.preco_m2) - Number(a.preco_m2);
      if (sortBy === "preco_asc") return Number(a.preco_m2) - Number(b.preco_m2);
      if (sortBy === "recentes") return b.id - a.id;

      const byType = a.tipo.localeCompare(b.tipo, "pt-BR");
      if (byType !== 0) return byType;

      return a.cor.localeCompare(b.cor, "pt-BR");
    });
  }, [materiais, search, tipoFilter, sortBy]);

  const totalFilteredMateriais = filteredMateriais.length;
  const pages = Math.max(Math.ceil(totalFilteredMateriais / limit), 1);
  const paginatedMateriais = filteredMateriais.slice((page - 1) * limit, page * limit);

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

  function openCreateModal() {
    setSelectedMaterial(null);
    setEditingMaterialId(null);
    setFormMode("create");
    setShowForm(true);
  }

  async function handleEditMaterial(id: number) {
    try {
      setError(null);
      const material = await getMaterial(id);
      setSelectedMaterial(material);
      setEditingMaterialId(id);
      setFormMode("edit");
      setShowForm(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar material para edicao.";
      setError(message);
    }
  }

  async function handleSubmitMaterial(payload: MaterialFormValues) {
    setSaving(true);

    try {
      setError(null);

      if (formMode === "create") {
        const result = await createMaterial(payload);
        await loadMateriais();
        setShowForm(false);
        await handleEditMaterial(result.id);
        return;
      }

      if (editingMaterialId !== null) {
        await updateMaterial(editingMaterialId, payload);
        await loadMateriais();
        setShowForm(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao salvar material.";
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  }

  function openDeleteConfirmation(id: number) {
    const material = materiais.find((item) => item.id === id) ?? null;
    setMaterialToDelete(material);
  }

  async function handleDeleteMaterial() {
    if (!materialToDelete) return;

    try {
      setError(null);
      await deleteMaterial(materialToDelete.id);
      await loadMateriais();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao excluir material.";
      setError(message);
    } finally {
      setMaterialToDelete(null);
    }
  }

  return (
    <>
      <AnimatedBackground />
      <AppTopbar userName={userName} />

      <main className="min-h-screen px-4 py-6 text-white md:px-6 xl:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
            <div className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium tracking-wide text-violet-300">Materiais</p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                    Catalogo de materiais
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
                    Organize tipos, cores, espessuras, medidas em estoque e precos por metro quadrado para montar pedidos com mais agilidade.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center justify-center rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
                >
                  Novo material
                </button>
              </div>
            </div>

            <MateriaisUsoMensalChart data={materiaisUsoMensal} />
          </section>

          {error ? (
            <div className="rounded-[28px] border border-red-500/20 bg-red-500/10 p-6 text-red-200">
              {error}
            </div>
          ) : null}

          <section className="grid items-start gap-6 xl:grid-cols-[1.6fr_0.9fr]">
            <MateriaisTable
              materiais={paginatedMateriais}
              total={totalFilteredMateriais}
              page={page}
              pages={pages}
              search={search}
              tipoFilter={tipoFilter}
              sortBy={sortBy}
              tipoOptions={tipoOptions}
              onSearch={handleSearchChange}
              onTipoFilterChange={handleTipoFilterChange}
              onSortByChange={handleSortByChange}
              onPageChange={handlePageChange}
              onEdit={handleEditMaterial}
              onDelete={openDeleteConfirmation}
            />

            <MateriaisPalette materiais={materiais} onEdit={handleEditMaterial} />
          </section>

          {loading ? (
            <div className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-6 text-zinc-400">
              Carregando materiais...
            </div>
          ) : null}
        </div>
      </main>

      {materialToDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
            <div className="border-b border-white/10 px-6 py-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">Atencao</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Excluir material</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Voce esta prestes a excluir {materialToDelete.tipo} {materialToDelete.cor}. Essa acao nao podera ser desfeita.
              </p>
            </div>

            <div className="p-6">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-medium text-white">{materialToDelete.espessura}</p>
                <p className="mt-2 text-sm text-zinc-300">
                  Confira se nenhum pedido ativo depende deste material antes de remover.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setMaterialToDelete(null)}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDeleteMaterial}
                  className="rounded-full border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
                >
                  Excluir permanentemente
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showForm ? (
        <MaterialForm
          key={`${formMode}-${editingMaterialId ?? "novo"}`}
          open={showForm}
          mode={formMode}
          initialData={formMode === "edit" ? selectedMaterial : null}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmitMaterial}
          submitting={saving}
        />
      ) : null}
    </>
  );
}
