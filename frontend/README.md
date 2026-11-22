# Taskflow — Front-end

Interface React para gerenciamento de tarefas em quadros Kanban. Este repositório contém somente o front-end; a API Node.js/Express e o banco MySQL serão implementados separadamente.

## Stack

- React 18 + Vite
- Tailwind CSS 3
- React Router
- Axios (cliente HTTP + interceptors)
- Lucide React
- dnd-kit (arrastar e soltar cartões)

## Requisitos

- Node.js 20 ou superior recomendado
- npm
- API REST em execução (para login, quadros e persistência)

## Executar localmente

```bash
npm install
```

Copie `.env.example` para `.env` e ajuste a URL da API:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Inicie o front-end:

```bash
npm run dev
```

Acesse `http://localhost:5173`.

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

> O front-end não possui dados falsos nem modo offline. Sem a API, as telas de login e registro serão exibidas, mas as operações que dependem do servidor mostrarão uma mensagem de conexão.

## Contrato esperado da API

Prefixo: `http://localhost:3000/api/v1`

As respostas JSON devem seguir o padrão abaixo. O cliente espera os recursos dentro de `data`.

### Autenticação

| Método | Rota | Autenticação |
|---|---|---|
| POST | `/auth/register` | Não |
| POST | `/auth/login` | Não |
| GET | `/auth/me` | Bearer token |

Cadastro:

```json
{
  "name": "Lucas Silva",
  "email": "lucas@email.com",
  "password": "Senha123!"
}
```

Login:

```json
{
  "email": "lucas@email.com",
  "password": "Senha123!"
}
```

Resposta de login/registro:

```json
{
  "data": {
    "user": {
      "id": 1,
      "name": "Lucas Silva",
      "email": "lucas@email.com"
    },
    "accessToken": "jwt_token"
  }
}
```

Resposta de `GET /auth/me`:

```json
{
  "data": {
    "id": 1,
    "name": "Lucas Silva",
    "email": "lucas@email.com"
  }
}
```

### Quadros

| Método | Rota | Uso |
|---|---|---|
| GET | `/boards?page=1&limit=50` | Listar quadros do usuário |
| POST | `/boards` | Criar quadro |
| GET | `/boards/:boardId` | Consultar quadro com listas e cartões |
| PATCH | `/boards/:boardId` | Atualizar nome/descrição |
| DELETE | `/boards/:boardId` | Excluir quadro |

Criar quadro:

```json
{
  "name": "Novo projeto",
  "description": "Descrição opcional"
}
```

Listagem:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Projeto principal",
      "description": "Organização do trabalho",
      "createdAt": "2026-11-20T10:00:00.000Z",
      "updatedAt": "2026-11-22T08:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 1,
    "totalPages": 1
  }
}
```

Detalhe do quadro:

```json
{
  "data": {
    "id": 1,
    "name": "Projeto principal",
    "description": "Descrição do quadro",
    "columns": [
      {
        "id": 10,
        "name": "A fazer",
        "position": 0,
        "cards": [
          {
            "id": 100,
            "title": "Criar página inicial",
            "description": "Desenvolver o layout",
            "priority": "high",
            "position": 0,
            "dueDate": "2026-11-30"
          }
        ]
      }
    ]
  }
}
```

### Listas (columns)

| Método | Rota | Uso |
|---|---|---|
| POST | `/boards/:boardId/columns` | Criar lista |
| PATCH | `/columns/:columnId` | Renomear lista |
| DELETE | `/columns/:columnId` | Excluir lista vazia |
| PATCH | `/boards/:boardId/columns/order` | Reordenar listas (serviço preparado; UI de ordenação de listas pode ser adicionada depois) |

Criar lista:

```json
{ "name": "Em andamento" }
```

### Cartões (cards)

| Método | Rota | Uso |
|---|---|---|
| POST | `/columns/:columnId/cards` | Criar cartão |
| GET | `/cards/:cardId` | Consultar cartão (serviço preparado) |
| PATCH | `/cards/:cardId` | Atualizar cartão |
| DELETE | `/cards/:cardId` | Excluir cartão |
| PATCH | `/cards/:cardId/move` | Mover cartão/reordenar posição |

Criar/atualizar cartão:

```json
{
  "title": "Implementar autenticação",
  "description": "Criar tela e integrar login",
  "priority": "high",
  "dueDate": "2026-11-30"
}
```

Mover cartão:

```json
{
  "targetColumnId": 11,
  "position": 0
}
```

Valores de prioridade aceitos pelo front-end: `low`, `medium`, `high`. `dueDate` pode ser `null` ou uma data `YYYY-MM-DD`.

### Erros

O front-end procura a mensagem em `error.message`:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Os dados enviados são inválidos.",
    "details": []
  }
}
```

Use os status HTTP convencionais (`400`, `401`, `403`, `404`, `409`, `500`). Em resposta `401` para uma rota protegida, o front remove o access token e envia o usuário para o login.

## Organização do código

```text
src/
├── components/     # Layout, modais, cartões, colunas, skeletons e feedback
├── contexts/       # Contexto de autenticação
├── lib/            # Cliente Axios e tratamento de erros
├── pages/          # Login, cadastro, listagem e quadro Kanban
├── services/       # Chamadas HTTP separadas por recurso
├── App.jsx         # Rotas e proteção de páginas
├── main.jsx        # Inicialização
└── styles.css      # Tailwind e estilos globais
```

## Autenticação e segurança

O front guarda o access token em `localStorage` para simplificar a integração inicial e adiciona `Authorization: Bearer <token>` automaticamente pelo interceptor Axios. Para uma aplicação publicada, prefira access token em memória com renovação por refresh token em cookie `HttpOnly`, `Secure` e `SameSite`, além de HTTPS. Nunca confie no `ownerId` enviado pelo navegador: a API deve identificar o usuário pelo JWT e validar propriedade/permissão em cada recurso.

## Observações de integração

- Configure CORS no Express para permitir a origem do Vite (`http://localhost:5173`).
- A API deve retornar datas compatíveis com ISO 8601.
- IDs podem ser números ou strings, desde que sejam consistentes em todas as respostas e rotas.
- O movimento de cartão é otimista: o front atualiza a posição na tela e restaura a posição anterior se a API falhar.
- A API deve atualizar as posições envolvidas em uma transação para evitar inconsistências.
- A exclusão de lista com cartões é tratada como conflito pela interface; a API deve responder `409` nesse caso.
