import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Cliente } from "../../types/clientes";
import type { Material } from "../../types/materiais";
import type { PedidoDetail, PedidoFormValues } from "../../types/pedidos";

type PedidoFormProps = {
  open: boolean;
  mode: "create" | "edit";
  clients: Cliente[];
  materials: Material[];
  initialData?: PedidoDetail | null;
  onClose: () => void;
  onSubmit: (payload: PedidoFormValues) => Promise<void>;
  submitting: boolean;
};

const statusOptions = [
  { value: "PENDENTE", label: "Pendente" },
  { value: "EM_PRODUCAO", label: "Em produção" },
  { value: "CONCLUIDO", label: "Concluído" },
  { value: "ATRASADO", label: "Atrasado" },
];

const emptyForm: PedidoFormValues = {
  cliente_id: "",
  descricao: "",
  valor: "",
  valor_pago: "",
  forma_pagamento: "",
  status_pagamento: "NAO_PAGO",
  data_pagamento: new Date().toISOString().slice(0, 10),
  data_entrada: new Date().toISOString().slice(0, 10),
  data_entrega: new Date().toISOString().slice(0, 10),
  horario_entrega: "",
  status_pedido: "PENDENTE",
  materiais: [{ material_id: "", quantidade: "1" }],
};

export default function PedidoForm({
  open,
  mode,
  clients,
  materials,
  initialData,
  onClose,
  onSubmit,
  submitting,
}: PedidoFormProps) {
  const [formValues, setFormValues] = useState<PedidoFormValues>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      const pagamento = initialData.pagamentos?.[0];
      setFormValues({
        cliente_id: initialData.cliente_id ?? "",
        descricao: initialData.descricao,
        valor: initialData.valor,
        valor_pago: pagamento?.valor_pago ?? "",
        forma_pagamento: pagamento?.forma_pagamento ?? "",
        status_pagamento: pagamento?.status_pagamento ?? "NAO_PAGO",
        data_pagamento: pagamento?.data_pagamento ?? new Date().toISOString().slice(0, 10),
        data_entrada: initialData.data_entrada ?? new Date().toISOString().slice(0, 10),
        data_entrega: initialData.data_entrega ?? new Date().toISOString().slice(0, 10),
        horario_entrega: initialData.horario_entrega ? initialData.horario_entrega.slice(0, 5) : "",
        status_pedido: initialData.status_pedido,
        materiais: initialData.materiais.map((item) => ({
          material_id: item.material_id,
          quantidade: item.quantidade,
        })),
      });
      return;
    }

    setFormValues(emptyForm);
    setError(null);
  }, [open, mode, initialData]);

  const clientOptions = useMemo(
    () => clients.map((client) => ({ value: client.id, label: client.nome })),
    [clients]
  );

  const materialOptions = useMemo(
    () => materials.map((material) => ({
      value: material.id,
      label: `${material.tipo} • ${material.cor} • ${material.espessura} • ${material.largura} x ${material.altura}m`,
    })),
    [materials]
  );

  function setField<Value extends keyof PedidoFormValues>(field: Value, value: PedidoFormValues[Value]) {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }

  function setMaterialField(index: number, field: "material_id" | "quantidade", value: number | string) {
    setFormValues((prev) => {
      const materiais = [...prev.materiais];
      materiais[index] = { ...materiais[index], [field]: value } as PedidoFormValues["materiais"][number];
      return { ...prev, materiais };
    });
  }

  function addMaterial() {
    setFormValues((prev) => ({
      ...prev,
      materiais: [...prev.materiais, { material_id: "", quantidade: "1" }],
    }));
  }

  function removeMaterial(index: number) {
    setFormValues((prev) => ({
      ...prev,
      materiais: prev.materiais.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formValues.cliente_id) {
      setError("Selecione um cliente.");
      return;
    }

    const validMaterials = formValues.materiais.filter((item) => item.material_id && Number(item.quantidade) > 0);

    if (validMaterials.length === 0) {
      setError("Adicione ao menos um material ao pedido.");
      return;
    }

    try {
      setError(null);
      await onSubmit({
        ...formValues,
        valor: Number(formValues.valor),
        valor_pago: Number(formValues.valor_pago) || 0,
        materiais: validMaterials.map((item) => ({
          material_id: Number(item.material_id),
          quantidade: Number(item.quantidade),
        })),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao salvar pedido.";
      setError(errorMessage);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-end justify-center overflow-hidden bg-black/70 px-3 py-3 sm:items-start sm:px-4 sm:py-4">
      <div className="w-full max-w-[calc(100vw-1rem)] max-h-[calc(100vh-2rem)] min-h-[40vh] flex flex-col overflow-hidden rounded-t-[32px] border border-white/10 bg-zinc-950 shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:max-h-[calc(100vh-3rem)] sm:max-w-[min(100%,_58rem)] sm:rounded-[32px]">
        <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 sm:px-6 sm:py-5">
          <div className="mx-auto h-1.5 w-14 rounded-full bg-white/20 sm:hidden" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300 sm:text-sm">{mode === "create" ? "Novo pedido" : "Editar pedido"}</p>
              <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">{mode === "create" ? "Criar novo pedido" : "Editar dados do pedido"}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
            >
              Fechar
            </button>
          </div>
          <p className="text-sm text-zinc-400 sm:text-base">Preencha os campos do pedido. No mobile, o formulário se ajusta à altura do dispositivo.</p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 pt-3 sm:px-6 sm:pb-6 sm:pt-5">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-zinc-400">
              Cliente
              <select
                value={formValues.cliente_id}
                onChange={(event) => setField("cliente_id", Number(event.target.value) || "")}
                className="w-full rounded-3xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 appearance-none select-dark"
              >
                <option value="">Selecione um cliente</option>
                {clientOptions.map((client) => (
                  <option key={client.value} value={client.value}>
                    {client.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-zinc-400">
              Status
              <select
                value={formValues.status_pedido}
                onChange={(event) => setField("status_pedido", event.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 appearance-none select-dark"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-zinc-400">
              Descrição
              <input
                value={formValues.descricao}
                onChange={(event) => setField("descricao", event.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                placeholder="Ex: Pedido de placas acrílicas"
              />
            </label>

            <label className="space-y-2 text-sm text-zinc-400">
              Valor total
              <input
                type="number"
                value={formValues.valor}
                onChange={(event) => setField("valor", event.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-zinc-400">
              Valor pago
              <input
                type="number"
                value={formValues.valor_pago}
                onChange={(event) => setField("valor_pago", event.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </label>

            <label className="space-y-2 text-sm text-zinc-400">
              Status do pagamento
              <select
                value={formValues.status_pagamento}
                onChange={(event) => setField("status_pagamento", event.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 appearance-none select-dark"
              >
                <option value="NAO_PAGO">Não pago</option>
                <option value="PARCIAL">Parcial</option>
                <option value="PAGO">Pago</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-zinc-400">
              Forma de pagamento
              <select
                value={formValues.forma_pagamento}
                onChange={(event) => setField("forma_pagamento", event.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 appearance-none select-dark"
              >
                <option value="">Selecione a forma</option>
                <option value="DINHEIRO">Dinheiro</option>
                <option value="PIX">PIX</option>
                <option value="CARTAO">Cartão</option>
                <option value="BOLETO">Boleto</option>
              </select>
            </label>

            <label className="space-y-2 text-sm text-zinc-400">
              Data do pagamento
              <input
                type="date"
                value={formValues.data_pagamento}
                onChange={(event) => setField("data_pagamento", event.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-zinc-400">
              Data de entrada
              <input
                type="date"
                value={formValues.data_entrada}
                onChange={(event) => setField("data_entrada", event.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-400">
              Data de entrega
              <input
                type="date"
                value={formValues.data_entrega}
                onChange={(event) => setField("data_entrega", event.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-400">
              Horário de entrega (opcional)
              <input
                type="time"
                value={formValues.horario_entrega}
                onChange={(event) => setField("horario_entrega", event.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
              />
            </label>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">Materiais do pedido</p>
                <p className="text-sm text-zinc-400">Escolha os materiais e as quantidades a serem usados.</p>
              </div>
              <button
                type="button"
                onClick={addMaterial}
                className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 transition hover:border-violet-500/50 hover:bg-violet-500/20"
              >
                Adicionar material
              </button>
            </div>
            <div className="space-y-3">
              {formValues.materiais.map((item, index) => (
                <div key={index} className="grid gap-3 rounded-3xl border border-white/10 bg-zinc-950 p-4 md:grid-cols-[1.6fr_1fr_0.8fr_90px] md:items-end">
                  <label className="space-y-2 text-sm text-zinc-400">
                    Material
                    <select
                      value={item.material_id}
                      onChange={(event) => setMaterialField(index, "material_id", Number(event.target.value) || "")}
                      className="w-full rounded-3xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 appearance-none select-dark"
                    >
                      <option value="">Selecione o material</option>
                      {materialOptions.map((material) => (
                        <option key={material.value} value={material.value}>
                          {material.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2 text-sm text-zinc-400">
                    Quantidade
                    <input
                      type="number"
                      min="1"
                      value={item.quantidade}
                      onChange={(event) => setMaterialField(index, "quantidade", event.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                    />
                  </label>

                  <div className="space-y-2 text-sm text-zinc-400">
                    <p className="font-medium text-white">Preview</p>
                    <p className="text-sm text-zinc-400">
                      {(() => {
                        const material = materials.find((current) => current.id === Number(item.material_id));
                        return material ? `${material.tipo} - ${material.largura} x ${material.altura}m` : "-";
                      })()}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeMaterial(index)}
                    className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>

          {error && <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

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
              {submitting ? "Salvando..." : mode === "create" ? "Criar pedido" : "Atualizar pedido"}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
}
