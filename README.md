# Acrilico Dashboard

Projeto com backend em Flask e frontend em React + Vite.

## Requisitos

- Python 3.11+
- Node.js 20+
- npm
- Docker Desktop ou PostgreSQL local

## 1. Backend

Crie e ative um ambiente virtual:

```powershell
python -m venv .venv
.venv\Scripts\activate
```

Instale as dependências:

```powershell
pip install -r requirements.txt
```

Suba o banco com Docker, se for usar o `docker-compose.yml`:

```powershell
docker compose up -d
```

Se quiser usar variável de ambiente para o backend, crie `backend/.env` com base no exemplo:

```powershell
Copy-Item backend/.env.example backend/.env
```

Inicie a API:

```powershell
python backend/app.py
```

## 2. Frontend

Entre na pasta do frontend:

```powershell
cd frontend
```

Crie o `.env`:

```powershell
Copy-Item .env.example .env
```

Instale as dependências:

```powershell
npm install
```

Rode o frontend:

```powershell
npm run dev
```

## Endereços padrão

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Observações

- O frontend não usa `requirements.txt`; ele precisa de `node` e `npm`.
- O arquivo `frontend/package-lock.json` já está versionado, então `npm install` instala as versões esperadas.
- O backend continua funcionando mesmo sem `backend/.env`, porque o valor padrão atual da conexão permanece o mesmo do projeto.
