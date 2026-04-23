import { useEffect, useState, type FormEvent } from "react";
import AppTopbar from "../components/layout/AppTopbar";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import { createColaborador, deleteColaborador, getColaboradorRoles, getColaboradores } from "../services/colaboradoresService";
import type { Colaborador, ColaboradorFormValues, Role } from "../types/colaboradores";

const emptyForm: ColaboradorFormValues = {
  nome: "",
  email: "",
  telefone: "",
  senha: "",
  role_id: "",
};

export default function Colaboradores() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [formValues, setFormValues] = useState<ColaboradorFormValues>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userName = user?.nome || user?.name || user?.email?.split("@")[0] || "Usuario";
  const currentUserId = Number(user?.id ?? 0);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [colaboradoresData, rolesData] = await Promise.all([
        getColaboradores(),
        getColaboradorRoles(),
      ]);
      setColaboradores(colaboradoresData);
      setRoles(rolesData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar colaboradores.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function setField(field: keyof ColaboradorFormValues, value: string | number) {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formValues.nome.trim() || !formValues.email.trim() || !formValues.telefone.trim() || !formValues.role_id) {
      setError("Preencha nome, email, telefone e permissao.");
      return;
    }

    if (formValues.senha.length < 10) {
      setError("A senha precisa ter pelo menos 10 caracteres.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      await createColaborador({
        ...formValues,
        nome: formValues.nome.trim(),
        email: formValues.email.trim().toLowerCase(),
        telefone: formValues.telefone.trim(),
        role_id: Number(formValues.role_id),
      });
      setFormValues(emptyForm);
      setSuccess("Colaborador criado com sucesso.");
      await loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao criar colaborador.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(colaborador: Colaborador) {
    if (colaborador.id === currentUserId) {
      setError("Voce nao pode excluir o proprio usuario logado.");
      return;
    }

    const confirmed = window.confirm(`Excluir o colaborador ${colaborador.nome}?`);
    if (!confirmed) return;

    try {
      setDeletingId(colaborador.id);
      setError(null);
      setSuccess(null);
      await deleteColaborador(colaborador.id);
      setSuccess("Colaborador excluido com sucesso.");
      await loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao excluir colaborador.";
      setError(message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <AnimatedBackground />
      <AppTopbar userName={userName} />

      <main className="min-h-screen px-4 py-6 text-white md:px-6 xl:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <p className="text-sm font-medium tracking-wide text-violet-300">Administracao</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Colaboradores
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
              Crie acessos para a equipe. O backend permite essa acao apenas para administradores.
            </p>
          </section>

          {error ? (
            <div className="rounded-[28px] border border-red-500/20 bg-red-500/10 p-6 text-red-200">{error}</div>
          ) : null}

          {success ? (
            <div className="rounded-[28px] border border-emerald-500/20 bg-emerald-500/10 p-6 text-emerald-200">{success}</div>
          ) : null}

          <section className="grid items-start gap-6 xl:grid-cols-[0.9fr_1.4fr]">
            <form onSubmit={handleSubmit} className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
              <p className="text-sm font-medium text-zinc-300">Novo colaborador</p>
              <div className="mt-5 grid gap-4">
                <input value={formValues.nome} onChange={(event) => setField("nome", event.target.value)} placeholder="Nome" className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20" />
                <input type="email" value={formValues.email} onChange={(event) => setField("email", event.target.value)} placeholder="Email" className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20" />
                <input value={formValues.telefone} onChange={(event) => setField("telefone", event.target.value)} placeholder="Telefone" className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20" />
                <input type="password" value={formValues.senha} onChange={(event) => setField("senha", event.target.value)} placeholder="Senha temporaria" className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20" />
                <select value={formValues.role_id} onChange={(event) => setField("role_id", Number(event.target.value) || "")} className="w-full rounded-3xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20">
                  <option value="">Selecione a permissao</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.nome}</option>
                  ))}
                </select>
              </div>

              <button type="submit" disabled={saving} className="mt-5 w-full rounded-3xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50">
                {saving ? "Criando..." : "Criar colaborador"}
              </button>
            </form>

            <section className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-zinc-300">Equipe</p>
                <p className="text-sm text-zinc-500">{colaboradores.length} colaboradores</p>
              </div>

              {loading ? (
                <p className="text-sm text-zinc-500">Carregando colaboradores...</p>
              ) : colaboradores.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center text-sm text-zinc-500">Nenhum colaborador encontrado.</div>
              ) : (
                <div className="space-y-3">
                  {colaboradores.map((colaborador) => (
                    <div key={colaborador.id} className="rounded-[24px] border border-white/10 bg-zinc-950 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-white">{colaborador.nome}</p>
                          <p className="mt-1 text-sm text-zinc-400">{colaborador.email}</p>
                          <p className="text-sm text-zinc-500">{colaborador.telefone}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="w-fit rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-200">{colaborador.role ?? "Sem role"}</span>
                          <button
                            type="button"
                            onClick={() => handleDelete(colaborador)}
                            disabled={deletingId === colaborador.id || colaborador.id === currentUserId}
                            className="w-fit rounded-full border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === colaborador.id ? "Excluindo..." : "Excluir"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </section>
        </div>
      </main>
    </>
  );
}
