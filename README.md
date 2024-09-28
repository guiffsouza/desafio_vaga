# Zeztra

### Algumas Observações:

Gostaria de informar que como o projeto deveria ser entregue em poucas horas. Dei um foco maior nas funcionalidades do que a design CSS. Tentei encontrar um equilibrio entre a leitura dos dados em tela e o salvamento das transações no banco de dados.
Não utilizei variaveis de ambiente para facilitar recrutador na hora de executar o código.

## Como Rodar a Aplicação

Para executar a aplicação, você precisa iniciar o cliente e a API.

### Iniciando o Cliente

Na raiz do projeto, execute os comandos abaixo:

```bash
cd frontend
npm install
npm run dev
```

Acesse o Cliente em `http://localhost:3000`.

### Iniciando a API

Na raiz do projeto, execute os comandos abaixo:

```bash
cd backend
npm install
npm run dev
```

Acesse a API em `http://localhost:8000`.

## Funcionalidades da API

A aplicação oferece as seguintes funcionalidades:

#### Obter transações ordenadas por data em ordem crescente:

Requisição: GET /transactions?sortBy=date&sortOrder=asc

#### Obter transações ordenadas por valor em ordem decrescente:

Requisição: GET /transactions?sortBy=date&sortOrder=desc

#### Listar transações de forma paginada:

Altere o valor page para alterar a pagina.
Altere o valor limit para alterar o limite de transações por pagina.

Requisição: GET /transactions?page=1&limit=100

#### Realizar upload de um arquivo .txt:

Requisição: POST /upload

#### Filtragem de dados:

Altere nome para buscar outro cliente
Altere startDate para trocar a data de início
Altere endDate para trocar a data final

Requisição: GET /transactions?nome=Beverly Shanahan&startDate=2024-09-01&endDate=2024-09-01

#### Compilando as queries

Você pode utilizar todos as queries no mesmo endpoint.

Requisição: GET /transactions?page=1&limit=100&nome=Beverly Shanahan&startDate=2024-01-01&endDate=2024-11-01&sortBy=date&sortOrder=asc
