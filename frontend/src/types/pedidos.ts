export type Pedido = {
  id: number;
  cliente: string;
  descricao: string;
  valor: number;
  data_entrada: string | null;
  data_entrega: string | null;
  horario_entrega?: string | null;
  status_pedido: string;
  can_edit?: boolean;
  can_delete?: boolean;
};

export type PaginatedPedidos = {
  pedidos: Pedido[];
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type PedidoMaterial = {
  material_id: number;
  tipo: string;
  cor: string;
  espessura: string;
  quantidade: number;
  preco_m2: number;
};

export type Pagamento = {
  id?: number;
  forma_pagamento: string;
  status_pagamento: string;
  valor_pago: number;
  data_pagamento: string | null;
};

export type PedidoDetail = Pedido & {
  materiais: PedidoMaterial[];
  pagamentos: Pagamento[];
  cliente_id?: number;
};

export type PedidoFormValues = {
  cliente_id: number | "";
  descricao: string;
  valor: number | string;
  valor_pago: number | string;
  forma_pagamento: string;
  status_pagamento: string;
  data_pagamento: string;
  data_entrada: string;
  data_entrega: string;
  horario_entrega: string;
  status_pedido: string;
  materiais: {
    material_id: number | "";
    quantidade: number | string;
  }[];
};
