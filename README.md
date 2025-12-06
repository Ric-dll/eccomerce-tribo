📋 Guia: Como rodar o projeto na sua máquina

Para rodar o projeto que está no Git, sigam estes passos exatos.
1. Pré-requisitos(Obrigatório)
    Ter o Node.js instalado.
    Ter o MySQL instalado e rodando.

2. Banco de Dados
    Antes de qualquer coisa, abram o MySQL Workbench e rodem este comando para criar o banco vazio:
    SQL
   
    CREATE DATABASE eccomerce_tribo;

3. Configurar o BACKEND (Terminal 1)
    Abra um terminal, entre na pasta backend e faça isso:

    Instalar dependências:
    Bash
   
    npm install

    Criar o arquivo .env: Crie um arquivo chamado .env dentro da pasta backend e cole isso (ajustem a senha se precisar):
    Snippet de código

    DB_NAME=eccomerce_tribo
    DB_USER=root
    DB_PASS=SUA_SENHA_MYSQL_AQUI
    DB_HOST=localhost
    DB_DIALECT=mysql
    PORT=3001

    Popular o Banco (Mágica): Rode este comando para criar as tabelas e encher o banco com dados de teste:
    Bash

    npm run seed

    Rodar:
    Bash

    npm run dev

4. Configurar o FRONTEND (Terminal 2)

    Abra outro terminal, entre na pasta frontend e faça isso:

    Instalar dependências:
    Bash

    npm install
    (Se der erro de permissão ou algo estranho, tentem npm install --force, mas o normal deve funcionar).

    Rodar:
    Bash

    npm run dev

    Resumo: É basicamente npm install nas duas pastas, criar o .env no backend e rodar o npm run seed uma vez para criar os dados.
