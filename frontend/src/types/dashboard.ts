export type ResumoDashboard = {
  total_pedidos: number;
  pedidos_pendentes: number;
  pedidos_em_producao: number;
  faturamento_total: number;
};

export type PedidoStatus = {
  status: string;
  quantidade: number;
};

export type FaturamentoMensalItem = {
  mes: number;
  total: number;
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