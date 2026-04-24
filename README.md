# 🟣 Acrílico Dashboard

Sistema completo de gestão para uma loja de produtos em acrílico, com foco em controle de pedidos, produção e faturamento em tempo real.

🔗 **Acesse o projeto:** [https://acrilico-dashboard.vercel.app/dashboard](https://acrilico-dashboard.vercel.app/dashboard)

---

## 📌 Sobre o projeto

O **Acrílico Dashboard** foi desenvolvido para centralizar e simplificar a operação de uma empresa de produtos em acrílico, permitindo:

* Gestão de pedidos
* Controle de produção
* Acompanhamento de faturamento
* Monitoramento de status (pendente, em produção, atrasado)

A aplicação oferece uma visão clara e em tempo real da operação, ajudando na tomada de decisões.

---

## 🚀 Tecnologias utilizadas

### Backend

* Python 3.11+
* Flask
* PostgreSQL
* Docker
* JWT (autenticação)

### Frontend

* React
* Vite
* JavaScript

---

## 🧱 Arquitetura

O projeto segue uma arquitetura separada entre frontend e backend:

* **Frontend (React + Vite):** Interface moderna e responsiva
* **Backend (Flask):** API REST responsável pela lógica de negócio
* **Banco de dados:** PostgreSQL
* **Containerização:** Docker

---

## ⚙️ Configuração do ambiente

Clone o repositório:

```bash
git clone <url-do-repositorio>
cd acrilico-dashboard
```

Crie os arquivos de ambiente:

```bash
Copy-Item .env.example .env
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

### 🔐 Variáveis obrigatórias

Antes de rodar em produção, configure:

* JWT_SECRET_KEY
* SECRET_KEY
* FERNET_KEY
* CPF_HASH_KEY
* DATABASE_URL
* CORS_ORIGINS
* POSTGRES_PASSWORD

Gere as chaves com:

```bash
python -c "import secrets; from cryptography.fernet import Fernet; print('FERNET_KEY=' + Fernet.generate_key().decode()); print('CPF_HASH_KEY=' + secrets.token_urlsafe(64)); print('JWT_SECRET_KEY=' + secrets.token_urlsafe(64)); print('SECRET_KEY=' + secrets.token_urlsafe(64))"
```

---

## 🖥️ Backend

Crie o ambiente virtual:

```bash
python -m venv .venv
.venv\Scripts\activate
```

Instale as dependências:

```bash
pip install -r backend/requirements.txt
```

Suba o banco com Docker:

```bash
docker compose up -d
```

Inicialize o banco e crie o admin:

```bash
cd backend
python -m database.init_db
cd ..
```

Inicie a API:

```bash
python backend/app.py
```

---

## 💻 Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Endereços padrão

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend: [http://localhost:5000](http://localhost:5000)

---

## ☁️ Deploy

### Backend (Render)

```bash
cd backend && python -m database.init_db && gunicorn app:app
```

### Frontend (Vercel)

Deploy simples utilizando integração com repositório Git.

---

## 📊 Funcionalidades

* Dashboard com métricas em tempo real
* Controle de pedidos
* Status de produção
* Indicadores de atraso
* Faturamento mensal

---

## 🧠 Diferenciais

* Interface moderna e intuitiva
* Arquitetura escalável
* Separação clara entre frontend e backend
* Preparado para ambiente de produção

---

## 👨‍💻 Autores

Desenvolvido por:

* Felipe Gonçalves
* Lucas Tukaze

---

## 📄 Licença

Este projeto é de uso privado para fins educacionais e profissionais.

---

## ✨ Considerações finais

Este projeto demonstra habilidades práticas em desenvolvimento full stack, incluindo:

* Integração frontend/backend
* Autenticação segura
* Deploy em produção
* Boas práticas de organização de código

---
## 🚀 Futuras Features

Algumas ideias para complementar o projeto, fique a vontade para fazer sugestões!

* Integrar com marketplace
* Adição de animações modernas
* Integração com n8n para notificações via email
