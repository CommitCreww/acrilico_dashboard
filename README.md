# Acrilico Dashboard

Projeto com backend em Flask e frontend em React + Vite.

## Requisitos

- Python 3.11+
- Node.js 20+
- npm
- Docker Desktop ou PostgreSQL local

## Ambiente

Crie os arquivos locais a partir dos exemplos:

```powershell
Copy-Item .env.example .env
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Antes de deploy, troque obrigatoriamente:

- `JWT_SECRET_KEY`
- `SECRET_KEY`
- `DATABASE_URL`
- `CORS_ORIGINS`
- `POSTGRES_PASSWORD`

Em producao, use `APP_ENV=production`. Nesse modo, o backend falha ao iniciar se secrets ou banco nao estiverem configurados corretamente.

## Backend

Crie e ative um ambiente virtual:

```powershell
python -m venv .venv
.venv\Scripts\activate
```

Instale as dependencias:

```powershell
pip install -r backend/requirements.txt
```

Suba o banco com Docker:

```powershell
docker compose up -d
```

Para abrir o Adminer localmente:

```powershell
docker compose --profile tools up -d adminer
```

Inicie a API:

```powershell
python backend/app.py
```

## Frontend

Entre na pasta do frontend:

```powershell
cd frontend
```

Instale as dependencias:

```powershell
npm install
```

Rode o frontend:

```powershell
npm run dev
```

## Enderecos padrao

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Observacoes

- O frontend precisa de `VITE_API_URL` apontando para a API.
- O frontend nao usa `requirements.txt`; ele precisa de `node` e `npm`.
- O arquivo `frontend/package-lock.json` ja esta versionado, entao `npm install` instala as versoes esperadas.
