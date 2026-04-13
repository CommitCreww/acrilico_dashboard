# Frontend

Frontend em React + TypeScript + Vite.

## Requisitos

- Node.js 20+
- npm

## Configuração

1. Entre na pasta `frontend`
2. Crie o arquivo `.env` com base no exemplo:

```powershell
Copy-Item .env.example .env
```

3. Instale as dependências:

```powershell
npm install
```

4. Rode o projeto:

```powershell
npm run dev
```

## Variáveis de ambiente

Arquivo esperado:

```env
VITE_API_URL=http://localhost:5000
```

## Scripts

- `npm run dev`: inicia o frontend
- `npm run build`: gera build de produção
- `npm run lint`: roda o lint
- `npm run preview`: abre preview local do build
