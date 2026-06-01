# GC2 API Rest

![Docker Build](https://img.shields.io/github/actions/workflow/status/L3onVictor/gs2_apiRest/build-image.yaml?label=Docker%20CI)
![Docker Pulls](https://img.shields.io/docker/pulls/oliveiraleon/gc2-repository)
![License](https://img.shields.io/github/license/L3onVictor/gs2_apiRest)

## Docker Hub

A imagem Docker da aplicação está disponível no Docker Hub:

[Docker Hub Repository](https://hub.docker.com/r/oliveiraleon/gc2-repository)

### Pull da imagem

```bash
docker pull oliveiraleon/gc2-repository:latest
```

## Descrição

Este projeto é uma API REST simples para gerenciamento de livros, desenvolvida como atividade de Gestão de Configuração 2. A API permite listar livros cadastrados e inclui uma interface web básica para visualização.

## Funcionalidades

- Listar todos os livros via endpoint GET `/api/books`
- Interface web simples para acessar a API

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


## Infraestrutura com Vagrant
 
A infraestrutura é composta por duas VMs:
 
| VM | IP | Função |
|---|---|---|
| vm1 | 192.168.22.3 | Cliente — realiza requisições para a vm2 |
| vm2 | 192.168.22.4 | Servidor — executa a API REST |
 
### Pré-requisitos
 
- [VirtualBox](https://www.virtualbox.org/)
- [Vagrant](https://www.vagrantup.com/)
### Subindo a infraestrutura
 
 Com o repositório clonado e na raiz no projeto:

1. Suba as VMs:
   ```bash
   vagrant up
   ```

O provisionamento irá automaticamente instalar o Node.js e as dependências da aplicação na vm2.

> [!IMPORTANT]
> Se durante o `vagrant up` ocorrer o erro de boot timeout em uma das VMs, execute apenas para a VM com problema:
>
> ```bash
> # Caso seja a primeira vm pode executar:
>
> vagrant destroy -f
>
> # Caso seja outra, execute:
>
> vagrant destroy -f <nome_da_vm>
>
> # Depois de destruir, execute:
> 
> vagrant up
> ```
>
> Se durante o provisionamento ocorrer o erro abaixo:
> ```
> timeout during server version negotiating
> ```
> Desative o OpenSSH Authentication Agent do Windows e tente novamente:
> ```bash
> vagrant destroy -f <nome_da_vm>
> vagrant up
> ```
 

2. Acesse a vm2 e inicie o servidor:
   ```bash
   vagrant ssh vm2
   cd /vagrant_data
   npm start
   ```
 
### Testando a rota GET a partir da vm1
 
Com o servidor rodando na vm2, abra um novo terminal e acesse a vm1:
 
```bash
vagrant ssh vm1
```
 
Dentro da vm1, faça a requisição para a API:
 
```bash
curl http://192.168.22.4:3030/api/books
```
 
A resposta esperada é:
 
```json
{"books":[{"id":1,"title":"A arte da guerra","author":"Sun Tzu"},{"id":2,"title":"Clean Code","author":"Robert C. Martin"}]}
```
 
## Provisionamento com o Ansible
```sh
# 1. Sobe as VMs
vagrant up

# 2. Acessa a vm1
vagrant ssh vm1

# 3. Copia a chave SSH para a vm2
ssh-keygen -t ed25519 # Defina uma senha e escolha o arquivo padão

ssh-copy-id -i /home/vagrant/.ssh/id_ed25519.pub vagrant@192.168.22.4
# Após o -i coloque o caminho para a sua chave ssh pública e o ip da sua segunda vm
# senha: vagrant

# 4. Entra na pasta do ansible
cd /vagrant/ansible

# 5. Executa o playbook
ansible-playbook -i inventory.ini configura-node.yaml

# 6. Testa
curl http://192.168.22.4:3030/api/books 
```

### Encerrando as VMs
 
```bash
vagrant halt
```
 
Para destruir e recriar do zero:
 
```bash
vagrant destroy -f
vagrant up
```
 

# Workflow escolhido

> - **Gitlab Flow:**
>
>   - Optei pelo *GitLab Flow* por ser simples de integrar e adequado para projetos pequenos, como este. Ele não exige versões prévias ou atualizações frequentes, diferentemente do *Git Flow*, nem depende exclusivamente de pull requests como o GitHub Flow. Por essas características, o *GitLab Flow* é a estratégia mais adequada para este projeto.

## Licença

Este projeto está sob a licença Apache License.