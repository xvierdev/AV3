# ✈️ AV3 - Sistema de Gestão da Produção de Aeronaves

<p>
    <img src="https://img.shields.io/badge/status-em%20desenvolvimento-orange?logo=github&logoColor=white" alt="Status" />
    <img src="https://img.shields.io/badge/front--end-React%20%2B%20Vite-0d8aff?logo=react&logoColor=white" alt="Front-end" />
    <img src="https://img.shields.io/badge/back--end-Node.js%20%2B%20Express-97ca00?logo=node.js&logoColor=white" alt="Back-end" />
    <img src="https://img.shields.io/badge/database-MySQL%20%2B%20Prisma-6f42c1?logo=mysql&logoColor=white" alt="Banco de Dados" />
</p>

Este repositório entrega a **AV3** descrita no documento `docs/AV3.pdf`: uma aplicação web crítica para orquestrar o ciclo de produção de aeronaves comerciais e militares, agora com GUI moderna em React, back-end Node.js/Express, Prisma ORM e MySQL.

## 1. Visão Geral

- **Objetivo**: substituir a CLI legada por uma SPA em TypeScript que mantenha todos os requisitos funcionais do sistema original (cadastro e gestão de usuários, aeronaves, tarefas, peças, testes e autenticação). 
- **Criticidade**: o sistema precisa operar em ambientes regulados, com controle de acesso por nível (Administrador, Engenheiro, Operador) e garantia de disponibilidade.
- **Documentos úteis**: [AV3.pdf](./docs/AV3.pdf) · [Wireframe de baixa fidelidade](./docs/wireframe%20de%20baixa%20fidelidade.pdf) · [Fluxo do usuário](./docs/diagrama%20de%20fluxo%20do%20usuário.pdf)

## 2. Arquitetura

| Camada | Tecnologias |
| --- | --- |
| Front-end | React 19, Vite 7, React Router 7, TypeScript 5, CSS Modules |
| Back-end | Node.js 20+, Express 4, CORS, Prisma Client |
| Banco de dados | MySQL 8 (relacional) com migrations/seed Prisma |
| Autenticação | Context API + armazenamento local, níveis: administrador/engenheiro/operador |

Principais diretórios:

```
AV3/
├── src/               # SPA em React
├── backend/           # API Node/Express + Prisma + MySQL
└── docs/              # Material de apoio (PDFs da AV3)
```

## 3. Pré-requisitos

| Ferramenta | Versão mínima | Notas |
| --- | --- | --- |
| Node.js | 20 LTS | Inclui npm 10 |
| MySQL Server | 8.0 | Usuário com permissão de CREATE/ALTER no schema `av3` |
| Sistemas suportados | Windows 10+, Ubuntu 24.04.3+ (ou derivados) | Conforme exigido em `AV3.pdf` |

## 4. Configuração

1. **Clone**
    ```bash
    git clone https://github.com/xvierdev/AV3
    cd AV3
    ```

2. **Instale as dependências da SPA**
    ```bash
    npm install
    ```

3. **Instale as dependências do back-end**
    ```bash
    cd backend
    npm install
    ```

4. **Configure o banco** (ajuste os valores conforme seu ambiente):
    ```env
    # backend/.env
    DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/av3"
    ```

5. **Crie e popule o schema**
    ```bash
    cd backend
    npx prisma migrate dev
    npx prisma db seed
    cd ..
    ```

> Dica: utilize `npm run prisma:migrate`, `npm run prisma:generate` e `npm run prisma:seed` na raiz para executar os comandos acima em série.

## 5. Execução

Na raiz do projeto:

```bash
npm start
```

- Porta do back-end: `http://localhost:3001`
- Porta do front-end (Vite): `http://localhost:5173`

Execuções independentes:

```bash
# Backend apenas
cd backend && npm run dev

# Front-end apenas
npm run dev
```

## 6. Funcionalidades entregues

- Autenticação com preservação no `localStorage` e bloqueios de rota via `ProtectedRoute`.
- Gestão completa de usuários (CRUD + alteração de senha) respeitando restrições do Admin Master.
- Cadastro e edição de aeronaves, tarefas, peças e testes com persistência no MySQL.
- Associações muitas-para-muitas representadas por colunas JSON (`associatedEngineers`, `responsibleUserIds`).
- Interface responsiva baseada nos wireframes fornecidos.

## 7. Scripts úteis

| Comando | Descrição |
| --- | --- |
| `npm start` | Sobe API e SPA em paralelo (concurrently). |
| `npm run backend` / `npm run frontend` | Executa somente uma das camadas. |
| `npm run prisma:migrate` | Roda `prisma migrate dev` no diretório `backend/`. |
| `npm run prisma:generate` | Atualiza o Prisma Client. |
| `npm run prisma:seed` | Reaplica o seed de dados padrão. |
| `cd backend && npm run dev` | Alternativa direta para desenvolvimento do servidor. |

## 8. Alinhamento com o documento AV3

- ✅ **Tecnologias abertas e amplamente utilizadas**: React/TypeScript no front-end, Node.js + Prisma + MySQL no back-end, conforme recomendado.
- ✅ **Compatibilidade Windows/Ubuntu**: stack baseada em Node e MySQL garante suporte multi-plataforma; já executado com sucesso no Windows 11.
- ✅ **Persistência relacional**: migrations/seed Prisma estruturam todas as entidades exigidas (usuários, aeronaves, tarefas, peças, testes) com relacionamentos e campos JSON para arrays.
- ✅ **Requisitos herdados da CLI**: os fluxos principais (cadastro/edição/consulta/remoção) foram reimplementados na GUI.
- ⚠️ **Relatório de qualidade**: ainda não há automação para coletar e exibir as métricas de latência, tempo de resposta e tempo de processamento para 1, 5 e 10 usuários, conforme solicitado no PDF. Essa atividade permanece pendente.

## 9. Próximos passos recomendados

1. Implementar coleta de métricas (latência, tempo de resposta e processamento) diretamente no backend e armazenar resultados para gerar gráficos exigidos na AV3.
2. Adicionar testes automatizados básicos (API e componentes) para reforçar a criticidade do sistema.
3. Documentar o procedimento de implantação em servidores Ubuntu (systemd, PM2 ou Docker) e Windows (serviço NSSM), demonstrando aderência total ao requisito multi-plataforma.

---

> Em caso de dúvidas sobre instalação, execução ou aderência ao documento `AV3.pdf`, consulte este README ou abra uma issue descrevendo o contexto.