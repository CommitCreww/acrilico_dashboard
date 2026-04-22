# Frontend

Frontend em React + TypeScript + Vite.

## Requisitos

- Node.js 20+
- npm

## Configuracao

1. Entre na pasta `frontend`
2. Crie o arquivo `.env` com base no exemplo:

```powershell
Copy-Item .env.example .env
```

3. Instale as dependencias:

```powershell
npm install
```

4. Rode o projeto:

```powershell
npm run dev
```

## Variaveis de ambiente

Arquivo esperado:

```env
VITE_API_URL=http://localhost:5000
```

Em deploy, `VITE_API_URL` deve apontar para a URL publica da API, sem barra final.

## Scripts

- `npm run dev`: inicia o frontend
- `npm run build`: gera build de producao
- `npm run lint`: roda o lint
- `npm run preview`: abre preview local do build
