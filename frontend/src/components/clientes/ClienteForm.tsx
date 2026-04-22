import { useEffect, useState, type FormEvent } from "react";
import type { Cliente, ClienteFormValues } from "../../types/clientes";

type ClienteFormProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: Cliente | null;
  onClose: () => void;
  onSubmit: (payload: ClienteFormValues) => Promise<void>;
  submitting: boolean;
};

const emptyForm: ClienteFormValues = {
  nome: "",
  email: "",
  telefone: "",
  cpf_cnpj: "",
  endereco: "",
  observacoes: "",
};

export default function ClienteForm({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
  submitting,
}: ClienteFormProps) {
  const [formValues, setFormValues] = useState<ClienteFormValues>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      setFormValues({
        nome: initialData.nome ?? "",
        email: initialData.email ?? "",
        telefone: initialData.telefone ?? "",
        cpf_cnpj: initialData.cpf_cnpj ?? "",
        endereco: initialData.endereco ?? "",
        observacoes: initialData.observacoes ?? "",
      });
      setError(null);
      return;
    }

    setFormValues(emptyForm);
    setError(null);
  }, [open, mode, initialData]);

  function setField(field: keyof ClienteFormValues, value: string) {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formValues.nome.trim()) {
      setError("Informe o nome do cliente.");
      return;
    }

    if (!formValues.email.trim()) {
      setError("Informe o email do cliente.");
      return;
    }

    try {
      setError(null);
      await onSubmit({
        nome: formValues.nome.trim(),
        email: formValues.email.trim(),
        telefone: formValues.telefone.trim(),
        cpf_cnpj: formValues.cpf_cnpj.trim(),
        endereco: formValues.endereco.trim(),
        observacoes: formValues.observacoes.trim(),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao salvar cliente.";
      setError(errorMessage);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-end justify-center overflow-hidden bg-black/70 px-3 py-3 sm:items-start sm:px-4 sm:py-4">
      <div className="flex max-h-[calc(100vh-2rem)] min-h-[40vh] w-full max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-t-[32px] border border-white/10 bg-zinc-950 shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:max-h-[calc(100vh-3rem)] sm:max-w-[min(100%,_46rem)] sm:rounded-[32px]">
        <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 sm:px-6 sm:py-5">
          <div className="mx-auto h-1.5 w-14 rounded-full bg-white/20 sm:hidden" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300 sm:text-sm">
                {mode === "create" ? "Novo cliente" : "Editar cliente"}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                {mode === "create" ? "Criar novo cliente" : "Editar dados do cliente"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
            >
              Fechar
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-3 sm:px-6 sm:pb-6 sm:pt-5">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-zinc-400">
                Nome
                <input
                  value={formValues.nome}
                  onChange={(event) => setField("nome", event.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                  placeholder="Nome do cliente"
                />
              </label>

              <label className="space-y-2 text-sm text-zinc-400">
                Email
                <input
                  type="email"
                  value={formValues.email}
                  onChange={(event) => setField("email", event.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                  placeholder="cliente@email.com"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-zinc-400">
                Telefone
                <input
                  value={formValues.telefone}
                  onChange={(event) => setField("telefone", event.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                  placeholder="(00) 00000-0000"
                />
              </label>

              <label className="space-y-2 text-sm text-zinc-400">
                CPF/CNPJ
                <input
                  value={formValues.cpf_cnpj}
                  onChange={(event) => setField("cpf_cnpj", event.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                  placeholder="Documento"
                />
              </label>
            </div>

            <label className="block space-y-2 text-sm text-zinc-400">
              Endereco
              <textarea
                value={formValues.endereco}
                onChange={(event) => setField("endereco", event.target.value)}
                rows={4}
                className="w-full resize-none rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                placeholder="Rua, numero, bairro, cidade"
              />
            </label>

            <label className="block space-y-2 text-sm text-zinc-400">
              Observacoes
              <textarea
                value={formValues.observacoes}
                onChange={(event) => setField("observacoes", event.target.value)}
                rows={4}
                className="w-full resize-none rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                placeholder="Preferencias, combinados, detalhes de atendimento"
              />
            </label>

            {error && (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-3xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Salvando..." : mode === "create" ? "Criar cliente" : "Atualizar cliente"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
