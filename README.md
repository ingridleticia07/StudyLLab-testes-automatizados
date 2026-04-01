# StudyLab

O StudyLab é uma plataforma educacional institucional desenvolvida para estudantes e professores da Universidade Federal do Ceará (UFC). O sistema tem como objetivo centralizar e organizar materiais didáticos por disciplina e curso, além de facilitar a troca de conhecimento entre alunos e professores. O sistema permite o compartilhamento de materiais acadêmicos (provas, artigos e materiais de apoio), discussões em fóruns por disciplina e gestão de conteúdo pelos administradores.

## 🛠️ Tecnologias Utilizadas

A solução é composta por três camadas principais que se comunicam de forma independente e segura:

**Backend:** API REST desenvolvida em .NET 8 (C#).
**Banco de Dados:** PostgreSQL 15+ hospedado e gerenciado pelo Supabase.
**Armazenamento:** Supabase Storage (S3-compatible) para armazenar os arquivos enviados pelos usuários, como PDFs e imagens.
**Serviços de E-mail:** Supabase Edge Functions em ambiente Deno para envios de e-mails transacionais.
**Infraestrutura:** A aplicação .NET 8 é empacotada em uma imagem Docker, e o container é hospedado na plataforma Render.
**Frontend:** Aplicações clientes em Node.js separadas por perfis (Admin, Client e Student).

## ⚙️ Pré-requisitos

Antes de iniciar a configuração local, certifique-se de ter as seguintes ferramentas instaladas:

* .NET 8 SDK (Para rodar a API)
* Node.js e npm (Para rodar os clientes web)
* Git (Para clonar o repositório) 

## 🚀 Como Executar o Projeto Localmente

Siga o passo a passo abaixo para rodar a aplicação em sua máquina local.

### 1. Clonando o Repositório

Abra o terminal e clone o projeto principal do StudyLab:

```bash
git clone [https://github.com/LearningLabUFC/studylab.git](https://github.com/LearningLabUFC/studylab.git)
cd studylab
```

### 2. Configurando Variáveis de Ambiente

Antes de rodar as aplicações, é necessário configurar as credenciais de acesso ao Supabase:

1. Localize o arquivo de exemplo de variáveis de ambiente (`.env.example`) na pasta `StudyLabAPI`.
2. Faça uma cópia desse arquivo e renomeie a cópia para `.env`.
3. Abra o novo arquivo `.env` e preencha com as credenciais do Supabase de desenvolvimento:

```env
SUPA_URL=URL
SUPA_KEY=key
```

> **Aviso de Segurança:** Todas as credenciais sensíveis devem ser configuradas como variáveis de ambiente, nunca no código-fonte. 

### 3. Rodando a API (Backend)

Com o `.env` configurado, inicie o servidor. Execute o comando abaixo na pasta do backend:

```bash
dotnet run
```
A API iniciará e ficará escutando as requisições locais.

### 4. Rodando o Frontend

O StudyLab possui 3 interfaces distintas (client, admin e student). O processo é o mesmo para as três aplicações. Abra um novo terminal, navegue até a pasta do projeto desejado e execute os comandos de instalação e inicialização:

**Para o perfil Admin:**
```bash
cd ...studylab\StudylabWeb\admin
npm install
npm run dev
```

**Para o perfil Client:**
```bash
cd ...studylab\StudylabWeb\client
npm install
npm run dev
```

**Para o perfil Student:**
```bash
cd ...studylab\StudylabWeb\student
npm install
npm run dev
```

Cada frontend rodará em uma porta local diferente, e todos se conectarão à API em .NET que já está rodando.
