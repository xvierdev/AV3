# ✈️ AeroCode - Sistema de Gestão da Produção de Aeronaves

<p>
    <img src="https://img.shields.io/badge/status-em%20desenvolvimento-orange?logo=github&logoColor=white" alt="Status" />
    <img src="https://img.shields.io/badge/front--end-React%20%2B%20Vite-0d8aff?logo=react&logoColor=white" alt="Front-end" />
    <img src="https://img.shields.io/badge/back--end-Node.js%20%2B%20Express-97ca00?logo=node.js&logoColor=white" alt="Back-end" />
    <img src="https://img.shields.io/badge/database-MySQL%20%2B%20Prisma-6f42c1?logo=mysql&logoColor=white" alt="Banco de Dados" />
</p>

Este repositório entrega a **AeroCode** descrita no documento `docs/AV3.pdf`: uma aplicação web crítica para orquestrar o ciclo de produção de aeronaves comerciais e militares, agora com GUI moderna em React, back-end Node.js/Express, Prisma ORM e MySQL.

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
AeroCode/
├── src/               # SPA em React
├── backend/           # API Node/Express + Prisma + MySQL
└── docs/              # Material de apoio (PDFs da AV3)
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

4. **Configure o banco** (já configurado para usuário `aluno`, senha `fatec`, banco `aerocode`):
    ```env
    # backend/.env
    DATABASE_URL="mysql://aluno:fatec@localhost:3306/aerocode"
    PORT=3000
    ```

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
npm start
```

- Porta do back-end: `http://localhost:3000`
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
1. **Pré-requisito**: Instale o K6 (disponível em https://k6.io/docs/get-started/installation/).
2. **Inicie o backend**:
   ```bash
   cd backend && npm run dev
   ```
3. **Execute o teste** (na raiz do projeto):
   ```bash
   k6 run load-tests/aircrafts-test.js
   ```
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

## 11. Próximos passos recomendados

1. ~~Implementar coleta de métricas (latência, tempo de resposta e processamento) diretamente no backend e armazenar resultados para gerar gráficos exigidos na AV3.~~ ✅ **Concluído**: Métricas implementadas via middleware e K6 (ver seção 9).
2. Adicionar testes automatizados básicos (API e componentes) para reforçar a criticidade do sistema.
3. Documentar o procedimento de implantação em servidores Ubuntu (systemd, PM2 ou Docker) e Windows (serviço NSSM), demonstrando aderência total ao requisito multi-plataforma.

---

> Em caso de dúvidas sobre instalação, execução ou aderência ao documento `AV3.pdf`, consulte este README ou abra uma issue descrevendo o contexto.