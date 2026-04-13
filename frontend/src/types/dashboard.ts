export type ResumoDashboard = {
  total_pedidos: number;
  pedidos_pendentes: number;
  pedidos_em_producao: number;
  pedidos_atrasados: number;
  faturamento_total: number;
};

export type PedidoStatus = {
  status: string;
  quantidade: number;
};

export type PedidoEntregaHoje = {
  id: number;
  cliente: string;
  colaborador: string;
  data_entrega: string | null;
  horario_entrega: string | null;
  status_pedido: string;
};

export type FaturamentoMensalItem = {
  mes: number;
  total: number;
  recebido: number;
  em_aberto: number;
};

export type MaterialMaisUsado = {
  material: string;
  quantidade: number;
};

export type PedidoRecente = {
  id: number;
  cliente: string;
  descricao: string;
  valor: number;
  status: string;
};

export type FaturamentoPorClienteItem = {
  cliente: string;
  faturamento: number;
};
