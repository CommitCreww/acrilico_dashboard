export type Material = {
  id: number;
  tipo: string;
  cor: string;
  espessura: string;
  altura: number;
  largura: number;
  preco_m2: number;
};

export type MaterialFormValues = {
  tipo: string;
  cor: string;
  espessura: string;
  altura: number | string;
  largura: number | string;
  preco_m2: number | string;
};
