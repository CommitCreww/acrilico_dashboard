export type LoginCredentials = {
  email: string;
  senha: string;
};

export type LoginResponse = {
  token: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
};