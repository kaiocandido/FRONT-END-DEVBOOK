# 🌐 Frontend - Rede Social

Interface web da aplicação de rede social construída com **React + Vite**, consumindo a API backend em Go.

---

## 🚀 Tecnologias utilizadas

* React 18
* Vite
* Tailwind CSS (TW)
* CSS
* Axios
* React Router DOM

---

## 📦 Dependências principais

```json
"dependencies": {
  "axios": "^1.7.2",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.24.0"
}
```

---

## 🎨 Funcionalidades

* 🔐 Login de usuário com JWT
* 👤 Cadastro de usuário
* 📝 Criação de publicações
* 📄 Listagem de publicações
* ✏️ Edição de publicações
* ❌ Exclusão de publicações
* 📊 Dashboard
* 🔄 Navegação entre páginas (SPA)

---

## 📂 Estrutura do Projeto

```
.
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/          # Telas (Login, Dashboard, etc)
│   ├── services/       # Configuração do Axios e chamadas API
│   ├── routes/         # Definição de rotas
│   ├── styles/         # Tailwind / CSS
│   └── utils/          # Funções auxiliares
```

---

## 🔗 Integração com API

### Configuração base do Axios

```javascript
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

---

## 🔐 Autenticação

* Token JWT salvo no **localStorage**
* Enviado automaticamente via interceptor do Axios
* Rotas protegidas podem ser implementadas com wrapper (PrivateRoute)

---

## ▶️ Como rodar o projeto

1. Instale as dependências:

```bash
npm install
```

2. Rode em ambiente de desenvolvimento:

```bash
npm run dev
```

3. Build para produção:

```bash
npm run build
```

4. Preview do build:

```bash
npm run preview
```

---

## 🧠 Boas práticas aplicadas

* Separação de responsabilidades (pages, services, components)
* Uso de SPA com React Router
* Centralização das chamadas HTTP
* Uso de interceptors para autenticação

---

## 📌 Melhorias futuras

* Context API ou Zustand para estado global
* Tratamento global de erros
* Loading states e skeletons
* Responsividade completa
* Testes (Jest / React Testing Library)

---
