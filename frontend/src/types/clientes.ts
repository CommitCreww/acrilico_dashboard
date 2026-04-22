export type Cliente = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf_cnpj: string;
  endereco: string;
  observacoes?: string | null;
  total_pedidos?: number;
  tipo_cliente?: "NOVO" | "RECORRENTE";
};

export type ClienteFormValues = {
  nome: string;
  email: string;
  telefone: string;
  cpf_cnpj: string;
  endereco: string;
  observacoes: string;
};

export type ClientePedidoResumo = {
  id: number;
  cliente: string;
  descricao: string;
  valor: number;
  data_entrada: string | null;
  data_entrega: string | null;
  horario_entrega?: string | null;
  status_pedido: string;
};

export type ClienteResumo = {
  cliente: Cliente;
  total_pedidos: number;
  total_comprado: number;
  ultimo_pedido: ClientePedidoResumo | null;
  pedidos: ClientePedidoResumo[];
};
