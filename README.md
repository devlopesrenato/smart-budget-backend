# Budget API

API de orçamento para gerenciar as despesas e receitas de um usuário.

###### Swagger: https://budget-api-7c18.onrender.com/api

# Tecnologias Utilizadas
- TypeScript
- NestJS
- Prisma
- Swagger
- Docker
- PostgreSQL
- BCrypt
- JWT Web Tokens

# Pré-requisitos
- Node.js v14 ou superior
- Docker

# Instalação

1. Clone o repositório
2. Execute o comando yarn install para instalar as dependências
3. Crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis de ambiente:

```properties
# prisma/nestjs
DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}/${POSTGRES_DATABASE}?schema=public

# postgres
POSTGRES_HOST=postgresdb:5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=12345678
POSTGRES_DATABASE=budgetdb
TIMEZONE='America/Sao_Paulo'

# pgadmin
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin

# auth
JWT_SECRET="12345678"
ENCRYPT_JWT_SECRET="87654321"
JWT_EXPIRATION="7d"

# URLS
API_URL="http://backend:3000"
FRONT_URL="http://frontend:3000"

# email
EMAIL_SERVICE='seu=provedor'
EMAIL_USER='seu-email@exemplo.com'
EMAIL_PASS='sua-senha'

```

4. Execute o comando **docker-compose up -d** para iniciar o banco de dados Postgres e a api em containers do Docker



# Autenticação
A API utiliza autenticação baseada em JWT (JSON Web Token). Cada requisição deve incluir um cabeçalho Authorization contendo o token de autenticação. O token pode ser obtido através da rota /user/login, que recebe um objeto JSON com as credenciais do usuário e retorna um token válido.

Durante o processo de inicialização da Api usando o Docker, um script é executado para adicionar um usuário inicial ao sistema. Esse usuário é criado com as seguintes credenciais:

- Email: admin@admin.com
- Senha: 12345

# Banco de Dados
A API utiliza o banco de dados Postgres, e o ORM Prisma para se comunicar com o banco. As tabelas do banco de dados são:

1. accounts-payable: esta tabela armazena informações sobre as contas a pagar pessoais do usuário.
2. accounts-receivable: esta tabela armazena informações sobre as contas a receber pessoais do usuário.
3. sheets: esta tabela armazena as folhas de orçamento criadas pelo usuário, cada uma contendo informações sobre receitas e despesas pessoais. 
4. users: esta tabela armazena as informações do usuário, incluindo o nome de usuário, senha e endereço de e-mail.


# Arquitetura
A API utiliza o framework NestJS, que utiliza o padrão arquitetural MVC (Model-View-Controller). 

# Docker
A API utiliza o Docker para facilitar o processo de instalação e configuração do ambiente de desenvolvimento. O arquivo Dockerfile define como a imagem da aplicação será construída. Além disso, a API utiliza o Docker Compose para orquestrar os contêineres da aplicação e do banco de dados. O arquivo docker-compose.yml define como os contêineres serão criados e configurados.

# Conclusão
A API Budget é uma aplicação RESTful que permite aos usuários gerenciar seus orçamentos. Ela utiliza TypeScript, NestJS, Prisma, Postgres e Docker, seguindo padrões de arquitetura e segurança para fornecer uma experiência de uso consistente e segura.
