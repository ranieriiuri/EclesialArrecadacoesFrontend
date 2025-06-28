
---

## 💻 Frontend - `README.md`

```markdown
# Eclesial - Frontend

Frontend do sistema **Eclesial**, uma aplicação React moderna para controle de usuários, igrejas, estoque de peças, eventos, doações e vendas.

## ⚙️ Tecnologias

- React + Vite
- TypeScript
- TailwindCSS + ShadCN UI
- Axios (com interceptor de JWT)
- React Query
- React Router
- Cloudinary (upload de imagem via backend)
- Zod (validação de formulários)
- Modal/Dialog (ShadCN)
- Framer Motion (animações)

## 📦 Funcionalidades

### 🔐 Autenticação
- Login e registro com token JWT
- Hook `useAuth` para controle global de autenticação
- Armazenamento de token no `localStorage`

### 👤 Conta do Usuário
- Visualização de dados completos (nome, CPF, igreja, endereço)
- Atualização de informações e senha
- Upload de foto de perfil
- Exclusão da conta

### 🏛 Igreja
- Visualização e vínculo com igreja no cadastro

### 📦 Estoque
- Página de estoque com:
  - Listagem paginada de peças (máx. 30)
  - Filtro por categoria
  - Cadastro de nova peça com doador e doação
  - Atualização e exclusão de peça
  - Modal com formulário validado

### 📆 Painel de Eventos
- Listagem de eventos ativos (planejando/em andamento)
- Acesso direto via rota `/events/panel/:id`
- Iniciar/finalizar evento
- Listar peças disponíveis
- Registrar venda de peça
  - Quantidade ajustável
  - Preço editável
  - Valor arrecadado calculado automaticamente

### 📈 Relatórios
- Relatórios de vendas por evento ou período (em construção)
- Integração com backend para dados prontos
- Ranking "maiores doadores" por período

## 🚀 Rodando o projeto

```bash
npm install
npm run dev
```
Acesso https em: https://localhost:5173
