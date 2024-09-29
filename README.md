# Zeztra

### Algumas Observações:

Em razão do pedido para que o projeto fosse entregue em poucas horas, priorizei as funcionalidades em vez do design CSS. Busquei um equilíbrio entre a busca rápida para a exibição dos dados na tela e a eficiência no salvamento das transações no banco de dados. Decidi não utilizar variáveis de ambiente para facilitar a execução do código pelo recrutador.

## Como Rodar a Aplicação

Para executar a aplicação, você precisa iniciar o cliente e a API.

## Versão

Versão do node v18.19.1
Versão npm 10.8.3

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

| Ação                                       | Requisição                                                                  | Descrição                                                                                       |
|--------------------------------------------|----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| Obter transações ordenadas por data       | `GET /transactions?sortBy=date&sortOrder=asc`                            | Transações ordenadas por data em ordem crescente.                                             |
| Obter transações ordenadas por valor      | `GET /transactions?sortBy=value&sortOrder=desc`                          | Transações ordenadas por valor em ordem decrescente.                                          |
| Listar transações de forma paginada       | `GET /transactions?page=1&limit=100`                                     | Altere `page` para mudar a página e `limit` para ajustar o número de transações por página.   |
| Realizar upload de um arquivo .txt        | `POST /upload`                                                            | A key do form-data deve ser chamada de `file`.                                                |
| Filtragem de dados                         | `GET /transactions?nome=Beverly Shanahan&startDate=2024-09-01&endDate=2024-09-01` | Altere `nome` para buscar outro cliente, `startDate` para trocar a data de início, e `endDate` para trocar a data final. |
| Compilando as queries                      | `GET /transactions?page=1&limit=100&nome=Beverly Shanahan&startDate=2024-01-01&endDate=2024-11-01&sortBy=date&sortOrder=asc` | Você pode utilizar todas as queries no mesmo endpoint.                                       |

