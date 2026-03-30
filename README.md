# GC2 API Rest

## Descrição

Este projeto é uma API REST simples para gerenciamento de livros, desenvolvida como atividade de Gestão de Configuração 2. A API permite listar livros cadastrados e inclui uma interface web básica para visualização.

## Funcionalidades

- Listar todos os livros via endpoint GET `/api/books`
- Interface web simples para acessar a API
- Dados mockados para demonstração

## Tecnologias Utilizadas

- Node.js
- Express.js
- HTML/CSS para a interface web

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/L3onVictor/gs2_apiRest.git
   ```

2. Entre no diretório do projeto:
   ```bash
   cd gs2_apiRest
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

## Uso

Para iniciar o servidor:

```bash
npm start
```

O servidor será executado na porta 3030. Acesse `http://localhost:3030` para ver a interface web, ou `http://localhost:3030/api/books` para obter os dados em JSON.

## Endpoints da API

#### GET /api/books
Retorna uma lista de todos os livros cadastrados.

---

#### POST /api/books
Permite o cadastro de livros.

# Workflow escolhido

> - **Gitlab Flow:**
>
>   - Optei pelo *GitLab Flow* por ser simples de integrar e adequado para projetos pequenos, como este. Ele não exige versões prévias ou atualizações frequentes, diferentemente do *Git Flow*, nem depende exclusivamente de pull requests como o GitHub Flow. Por essas características, o *GitLab Flow* é a estratégia mais adequada para este projeto.

## Licença

Este projeto está sob a licença Apache License.