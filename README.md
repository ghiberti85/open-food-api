# Open Food Facts API

## Descrição

Uma API RESTful para gerenciamento de produtos do Open Food Facts, integrando com o MongoDB Atlas e incluindo um trabalho CRON para importação diária de dados.

## Tecnologias Utilizadas

- **Linguagem:** JavaScript (Node.js)
- **Framework:** Express.js
- **Banco de Dados:** MongoDB Atlas
- **ODM:** Mongoose
- **Agendador de Tarefas:** node-cron
- **Framework de Testes:** Jest
- **Documentação da API:** Swagger (OpenAPI 3.0)
- **Containerização:** Docker
- **Outros:** dotenv, nodemailer

## Instalação e Uso

### Pré-requisitos

- **Node.js** instalado na sua máquina.
- **Git** instalado na sua máquina.
- **Conta no MongoDB Atlas** com um cluster e banco de dados configurados.
- **Docker** (se você pretende executar a aplicação usando Docker).

### Clonar o Repositório

```bash
git clone <url-do-repositório>
cd open-food-api
```

### Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:

```env
MONGODB_URI=<Sua string de conexão do MongoDB Atlas>
PORT=3000
CRON_SCHEDULE='0 0 * * *' # Agendamento para o trabalho CRON (padrão: diariamente à meia-noite)
API_KEY=<Sua chave de API para autenticação>
```

### Instalar Dependências

```bash
npm install
```

### Executando a Aplicação

#### Sem Docker

```bash
# Inicie a aplicação
npm start

# O servidor estará rodando em http://localhost:3000
```

#### Com Docker

Certifique-se de que o Docker esteja instalado e em execução na sua máquina.

```bash
# Construir e executar o container Docker
docker-compose up --build

# O servidor estará rodando em http://localhost:3000
```

### Endpoints da API

#### GET /

Retorna detalhes da API, incluindo:

- Status da conexão com o banco de dados.
- Horário da última execução do CRON.
- Tempo online do servidor.
- Uso de memória.

#### PUT /products/:code

Atualiza as informações de um produto específico. **Requer autenticação via API Key**.

#### DELETE /products/:code

Altera o status de um produto para `trash`. **Requer autenticação via API Key**.

#### GET /products/:code

Retorna as informações de um produto específico.

#### GET /products

Lista todos os produtos cadastrados no banco de dados com paginação.

### Executando os Testes

```bash
npm test
```

### Documentação da API

A documentação completa da API pode ser acessada em:

```
http://localhost:3000/api-docs
```

### Arquivo .gitignore

O projeto inclui um arquivo `.gitignore` configurado para excluir:

- `node_modules/`
- `.env`
- `logs/`
- Arquivos ou diretórios sensíveis que não devem ser versionados.

## Este é um desafio da Coodesh