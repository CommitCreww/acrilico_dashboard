import { useState, type FormEvent } from "react";
import type { Material, MaterialFormValues } from "../../types/materiais";
import { getMaterialColor } from "./materialVisuals";

type MaterialFormProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: Material | null;
  onClose: () => void;
  onSubmit: (payload: MaterialFormValues) => Promise<void>;
  submitting: boolean;
};

const emptyForm: MaterialFormValues = {
  tipo: "",
  cor: "",
  espessura: "",
  altura: "",
  largura: "",
  preco_m2: "",
};

const quickColors = ["Cristal", "Branco", "Preto", "Azul", "Vermelho", "Verde", "Amarelo", "Fume"];
const quickThickness = ["2mm", "3mm", "4mm", "5mm", "6mm", "8mm", "10mm"];

function getInitialForm(mode: "create" | "edit", initialData?: Material | null): MaterialFormValues {
  if (mode === "edit" && initialData) {
    return {
      tipo: initialData.tipo,
      cor: initialData.cor,
      espessura: initialData.espessura,
      altura: initialData.altura,
      largura: initialData.largura,
      preco_m2: initialData.preco_m2,
    };
  }

  return emptyForm;
}

export default function MaterialForm({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
  submitting,
}: MaterialFormProps) {
  const [formValues, setFormValues] = useState<MaterialFormValues>(() => getInitialForm(mode, initialData));
  const [error, setError] = useState<string | null>(null);

  function setField(field: keyof MaterialFormValues, value: string | number) {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const price = Number(formValues.preco_m2);
    const altura = Number(formValues.altura);
    const largura = Number(formValues.largura);

    if (!formValues.tipo.trim()) {
      setError("Informe o tipo do material.");
      return;
    }

    if (!formValues.cor.trim()) {
      setError("Informe a cor do material.");
      return;
    }

    if (!formValues.espessura.trim()) {
      setError("Informe a espessura.");
      return;
    }

    if (!Number.isFinite(altura) || altura <= 0) {
      setError("Informe uma altura valida.");
      return;
    }

    if (!Number.isFinite(largura) || largura <= 0) {
      setError("Informe uma largura valida.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError("Informe um preco valido.");
      return;
    }

    try {
      setError(null);
      await onSubmit({
        tipo: formValues.tipo.trim(),
        cor: formValues.cor.trim(),
        espessura: formValues.espessura.trim(),
        altura,
        largura,
        preco_m2: price,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao salvar material.";
      setError(errorMessage);
    }
  }

  if (!open) {
    return null;
  }

  const previewColor = getMaterialColor(formValues.cor);

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-end justify-center overflow-hidden bg-black/70 px-3 py-3 sm:items-start sm:px-4 sm:py-4">
      <div className="flex max-h-[calc(100vh-2rem)] min-h-[40vh] w-full max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-t-[32px] border border-white/10 bg-zinc-950 shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:max-h-[calc(100vh-3rem)] sm:max-w-[min(100%,_52rem)] sm:rounded-[32px]">
        <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 sm:px-6 sm:py-5">
          <div className="mx-auto h-1.5 w-14 rounded-full bg-white/20 sm:hidden" />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300 sm:text-sm">
                {mode === "create" ? "Novo material" : "Editar material"}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                {mode === "create" ? "Cadastrar material" : "Ajustar cadastro"}
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
              <div className="grid gap-4">
                <label className="space-y-2 text-sm text-zinc-400">
                  Tipo
                  <input
                    value={formValues.tipo}
                    onChange={(event) => setField("tipo", event.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                    placeholder="Ex: Acrilico, PS, PVC"
                  />
                </label>

                <label className="space-y-2 text-sm text-zinc-400">
                  Cor
                  <input
                    value={formValues.cor}
                    onChange={(event) => setField("cor", event.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                    placeholder="Ex: Cristal"
                  />
                </label>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-white">Preview</p>
                <div className="mt-4 h-28 rounded-[20px] border border-white/10" style={{ backgroundColor: previewColor }} />
                <p className="mt-3 break-words text-sm text-zinc-400">
                  {formValues.tipo || "Tipo"} - {formValues.cor || "Cor"}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {formValues.largura || "0"} x {formValues.altura || "0"} m
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-zinc-400">
                Espessura
                <input
                  value={formValues.espessura}
                  onChange={(event) => setField("espessura", event.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                  placeholder="Ex: 3mm"
                />
              </label>

              <label className="space-y-2 text-sm text-zinc-400">
                Largura
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formValues.largura}
                  onChange={(event) => setField("largura", event.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                  placeholder="Ex: 1.00"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-zinc-400">
                Altura
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formValues.altura}
                  onChange={(event) => setField("altura", event.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                  placeholder="Ex: 2.00"
                />
              </label>

              <label className="space-y-2 text-sm text-zinc-400">
                Preco por m2
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formValues.preco_m2}
                  onChange={(event) => setField("preco_m2", event.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                  placeholder="0.00"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-white">Cores rapidas</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {quickColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setField("cor", color)}
                      className="rounded-full border border-white/10 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:bg-white/10"
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-white">Espessuras rapidas</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {quickThickness.map((thickness) => (
                    <button
                      key={thickness}
                      type="button"
                      onClick={() => setField("espessura", thickness)}
                      className="rounded-full border border-white/10 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:bg-white/10"
                    >
                      {thickness}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error ? (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

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
                {submitting ? "Salvando..." : mode === "create" ? "Criar material" : "Atualizar material"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
