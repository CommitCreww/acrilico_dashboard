export type LoginCredentials = {
  email: string;
  senha: string;
};

export type LoginResponse = {
  token: string;
  user?: {
    id: number;
    nome?: string;
    name?: string;
    email: string;
    role_id?: number;
  };
};