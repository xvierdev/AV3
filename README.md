# ✈️ AeroCode - Sistema de Gestão da Produção de Aeronaves

<p>
    <img src="https://img.shields.io/badge/status-em%20desenvolvimento-orange?logo=github&logoColor=white" alt="Status" />
    <img src="https://img.shields.io/badge/front--end-React%20%2B%20Vite-0d8aff?logo=react&logoColor=white" alt="Front-end" />
    <img src="https://img.shields.io/badge/back--end-Node.js%20%2B%20Express-97ca00?logo=node.js&logoColor=white" alt="Back-end" />
    <img src="https://img.shields.io/badge/database-MySQL%20%2B%20Prisma-6f42c1?logo=mysql&logoColor=white" alt="Banco de Dados" />
</p>

Este repositório entrega a **AeroCode** descrita no documento `docs/AV3.pdf`: uma aplicação web crítica para orquestrar o ciclo de produção de aeronaves comerciais e militares, agora com GUI moderna em React, back-end Node.js/Express, Prisma ORM e MySQL.

## Sumário

- [1. Visão Geral](#1-visão-geral)
- [2. Arquitetura](#2-arquitetura)
- [3. Pré-requisitos](#3-pré-requisitos)
- [4. Configuração](#4-configuração)
- [5. Execução](#5-execução)
- [6. Funcionalidades entregues](#6-funcionalidades-entregues)
- [7. Scripts úteis](#7-scripts-úteis)
- [8. Alinhamento com o documento AV3](#8-alinhamento-com-o-documento-av3)
- [9. Testes de Desempenho e Coleta de Métricas](#9-testes-de-desempenho-e-coleta-de-métricas)
  - [9.1. Métricas Coletadas](#91-métricas-coletadas)
  - [9.2. Cenários de Teste](#92-cenários-de-teste)
  - [9.3. Como Executar os Testes](#93-como-executar-os-testes)
  - [9.4. Notas Técnicas](#94-notas-técnicas)

## 1. Visão Geral

- **Objetivo**: substituir a CLI legada por uma SPA em TypeScript que mantenha todos os requisitos funcionais do sistema original (cadastro e gestão de usuários, aeronaves, tarefas, peças, testes e autenticação). 
- **Criticidade**: o sistema precisa operar em ambientes regulados, com controle de acesso por nível (Administrador, Engenheiro, Operador) e garantia de disponibilidade.
- **Documentos úteis**: [AV3.pdf](./docs/AV3.pdf) · [Wireframe de baixa fidelidade](./docs/wireframe%20de%20baixa%20fidelidade.pdf) · [Fluxo do usuário](./docs/diagrama%20de%20fluxo%20do%20usuário.pdf)

## 2. Arquitetura

| Camada | Tecnologias |
| --- | --- |
| Front-end | React 19, Vite 7, React Router 7, TypeScript 5, CSS Modules |
| Back-end | Node.js 20+, Express 4, CORS, Prisma Client |
| Banco de dados | MySQL 8 (relacional) com schema Prisma |
| Autenticação | Context API + armazenamento local, níveis: administrador/engenheiro/operador |

Principais diretórios:

```
av3/
├── src/                    # SPA em React/TypeScript
│   ├── components/         # Componentes reutilizáveis
│   │   ├── ProtectedRoute.tsx
│   │   ├── RootRedirect.tsx
│   │   └── [modais e listas]/
│   ├── context/            # Context API para autenticação
│   ├── pages/              # Páginas da aplicação
│   ├── styles/             # Estilos compartilhados
│   ├── types/              # Definições TypeScript
│   ├── utils/              # Utilitários e dados mock
│   ├── App.tsx             # Componente raiz
│   └── main.tsx            # Ponto de entrada
├── backend/                # API Node.js/Express + Prisma
│   ├── prisma/             # Schema, seeds e migrations
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/
│   ├── server.js           # Servidor Express
│   └── package.json
├── load-tests/             # Scripts de teste de carga K6
│   └── aircrafts-test.js
├── docs/                   # Documentação AV3
├── package.json            # Dependências e scripts raiz
├── vite.config.ts          # Configuração Vite
├── tsconfig*.json          # Configurações TypeScript
└── README.md               # Este arquivo
```

## 3. Pré-requisitos

| Ferramenta | Versão mínima | Notas |
| --- | --- | --- |
| Node.js | 20 LTS | Inclui npm 10 |
| MySQL Server | 8.0 | Usuário `aluno` com senha `fatec` e banco `aerocode` |
| Sistemas suportados | Windows 10+, Ubuntu 24.04.3+ (ou derivados) | Conforme exigido em `AV3.pdf` |

## 4. Configuração

1. **Clone**
    ```bash
    git clone https://github.com/xvierdev/av3
    cd av3
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

4. **Configure o banco** (o arquivo `backend/.env` já vem com as configurações padrão para facilitar o uso local):
    ```env
    # backend/.env
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=aluno
    DB_PASS=fatec
    DB_NAME=aerocode
    HOST=localhost
    PORT=3000
    ```

    > O `DATABASE_URL` é composto dinamicamente no código a partir dessas variáveis, permitindo fácil alteração para acesso via IP (ex.: `DB_HOST=192.168.1.100`).

4.1 **Configure o front-end** (opcional, crie o arquivo `.env` baseado no template `.env.template` para customizar a URL da API):
    ```env
    # .env
    VITE_API_BASE=http://localhost:3000/api
    ```

    > Por padrão, o front-end usa `http://localhost:3000/api` se não configurado. Use este arquivo para apontar para um backend remoto.

5. **Configure o banco e popule os dados**
    ```bash
    cd backend
    npm run setup
    cd ..
    ```

> O script `setup` gera o cliente Prisma, sincroniza o schema no banco e executa o seed de dados iniciais.

## 5. Execução

Na raiz do projeto:

```bash
npm run dev
```

> Este comando instala dependências do frontend, instala e configura o backend (incluindo banco de dados), e inicia a aplicação completa.

- Porta do back-end: `http://localhost:3000` (ou conforme HOST configurado)
- Porta do front-end (Vite): `http://localhost:5173`

**Usuários de teste** (disponíveis na página de login):
- Administrador: `admin` / `123`
- Engenheiro: `eng` / `123`
- Operador: `op` / `123`

Execuções independentes:

```bash
# Backend apenas
cd backend && npm run dev

# Front-end apenas
npm run dev
```

> Nota: `npm run dev` na raiz sobrescreve o comando padrão do Vite para fazer setup completo.

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
| `cd backend && npm run setup` | Configura e popula o banco de dados. |
| `cd backend && npm run generate` | Atualiza o Prisma Client. |
| `cd backend && npm run seed` | Reaplica o seed de dados padrão. |
| `cd backend && npm run dev` | Alternativa direta para desenvolvimento do servidor. |

## 8. Alinhamento com o documento AV3

- ✅ **Tecnologias abertas e amplamente utilizadas**: React/TypeScript no front-end, Node.js + Prisma + MySQL no back-end, conforme recomendado.
- ✅ **Compatibilidade Windows/Ubuntu**: stack baseada em Node e MySQL garante suporte multi-plataforma; já executado com sucesso no Windows 11.
- ✅ **Persistência relacional**: schema Prisma estrutura todas as entidades exigidas (usuários, aeronaves, tarefas, peças, testes) com relacionamentos e campos JSON para arrays.
- ✅ **Requisitos herdados da CLI**: os fluxos principais (cadastro/edição/consulta/remoção) foram reimplementados na GUI.
- ✅ **Relatório de qualidade**: implementado middleware no backend para medição automática de Tempo de Processamento (TP) via header `X-Process-Time`, e script K6 para coletar Tempo de Resposta (TR) e calcular Latência (L = TR - TP) em cenários de 1, 5 e 10 usuários simultâneos.

## 9. Testes de Desempenho e Coleta de Métricas

> 📋 **Relatório detalhado**: Consulte o documento [`docs/Testes.md`](./docs/Testes.md) para um relatório completo dos testes de desempenho, incluindo resultados detalhados, gráficos e análises.

A aplicação inclui instrumentação para coleta de métricas de desempenho conforme exigido na AV3:

### 9.1. Métricas Coletadas
- **Tempo de Resposta (TR)**: Medido pelo K6 (tempo total da requisição HTTP).
- **Tempo de Processamento (TP)**: Medido pelo backend via middleware, enviado no header `X-Process-Time`.
- **Latência (L)**: Calculada como L = TR - TP (diferença entre resposta e processamento).

### 9.2. Cenários de Teste
- **Cenário 1**: 1 usuário virtual (VU) por 10 segundos.
- **Cenário 2**: 5 VUs por 10 segundos (inicia após 11s).
- **Cenário 3**: 10 VUs por 10 segundos (inicia após 22s).

### 9.3. Como Executar os Testes
1. **Pré-requisito: Instale o K6**
   - **No Linux (Ubuntu/Debian)**:
     ```bash
     sudo apt update
     sudo apt install k6
     ```
     Ou via Snap: `sudo snap install k6`
   - **No Windows**:
     - Baixe o instalador MSI de https://k6.io/docs/get-started/installation/
     - Execute o MSI e siga o assistente de instalação.
     - Adicione o K6 ao PATH se necessário.
   - Verifique a instalação: `k6 version`

2. **Inicie o backend**:
   ```bash
   cd backend && npm run dev
   ```

3. **Execute o teste** (na raiz do projeto):
   ```bash
   k6 run load-tests/aircrafts-test.js
   ```

   > Para salvar os resultados em JSON (como no arquivo `resultados_av3_finais_remoto.json`):
   > ```bash
   > k6 run load-tests/aircrafts-test.js --out json=resultados_av3_finais_remoto.json
   > ```

4. **Interprete os resultados**:
   - Procure `http_req_duration` (TR médio) e `tempo_de_processamento_ms` (TP médio) na saída.
   - Calcule L = TR - TP para cada cenário.
   - Exemplo de saída esperada:
     ```
     http_req_duration...........: avg=150.5ms
     tempo_de_processamento_ms...: avg=45.2ms
     # Latência ≈ 105.3ms
     ```

### 9.4. Notas Técnicas
- O middleware intercepta `res.send()` para medir TP com precisão até 6 casas decimais.
- Testes rodam na rota `GET /api/aircrafts` (ideal para carga devido ao acesso ao banco).
- Resultados são exibidos no terminal; salve em arquivo com `k6 run load-tests/aircrafts-test.js > resultados.txt` para análise posterior.