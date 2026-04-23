export type Colaborador = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  role_id: number;
  role: string | null;
  nivel_acesso: number;
};

export type Role = {
  id: number;
  nome: string;
  nivel_acesso: number;
};

export type ColaboradorFormValues = {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  role_id: number | "";
};
