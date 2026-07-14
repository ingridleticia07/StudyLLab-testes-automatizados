# StudyLab

O StudyLab é uma plataforma educacional institucional desenvolvida com o propósito de atender estudantes e docentes da Universidade Federal do Ceará (UFC). O sistema tem como objetivo centralizar, organizar e disponibilizar materiais didáticos de forma estruturada por curso e disciplina, promovendo maior acessibilidade aos conteúdos acadêmicos e contribuindo para a organização do processo de ensino e aprendizagem.

Além disso, a plataforma busca incentivar a colaboração entre os usuários por meio do compartilhamento de materiais acadêmicos, como provas, artigos e conteúdos de apoio, bem como pela disponibilização de fóruns de discussão por disciplina. O sistema também contempla funcionalidades de gestão de conteúdo, permitindo a administração e manutenção das informações publicadas.

## Testes Automatizados

Os testes automatizados desenvolvidos para o projeto encontram-se disponíveis na branch `testes-automatizados`.

## Arquitetura do Projeto de Testes Automatizados

Os testes automatizados do projeto foram estruturados com base no **Playwright**, seguindo uma organização voltada para reutilização de código, clareza dos cenários e facilidade de manutenção. A arquitetura adota o padrão **Page Object Model (POM)**, no qual as interações com a interface da aplicação são separadas dos arquivos de teste, tornando o projeto mais legível e escalável.

### Estrutura das Pastas

- **`.github/workflows/`**  
  Contém os arquivos de configuração da integração contínua, responsáveis por automatizar a execução dos testes em pipelines, como no GitHub Actions.

- **`.playwright/fixtures/`**  
  Reúne fixtures, dados auxiliares e arquivos de suporte utilizados pelos testes.
  
- **`.playwright/fixtures/files/`**  
  Armazena arquivos de apoio utilizados em cenários específicos, como upload de arquivos ou validações relacionadas a documentos e mídias.

- **`pages/`**  
  Contém os arquivos que representam as páginas da aplicação no padrão **Page Object Model**. Cada arquivo centraliza seletores e ações de uma tela específica, como login, conteúdos, disciplinas, tópicos e usuários, além de componentes reutilizáveis, como paginação.

- **`scripts/`**  
  Contém scripts auxiliares utilizados para apoiar a execução, configuração ou preparação do ambiente de testes.
  
- **`tests/`**  
  Armazena os cenários de teste automatizado, organizados por módulo da aplicação. Cada subpasta agrupa os testes de uma funcionalidade específica, como autenticação, conteúdos, usuários, disciplinas e tópicos.

## Como executar a suíte de testes automatizados

Para reproduzir a execução dos testes automatizados utilizados neste estudo, siga os passos abaixo.

### Pré-requisitos

Antes de executar a suíte, é necessário possuir:

- Node.js instalado
- npm instalado
- Google Chrome disponível no ambiente
- Aplicação StudyLab acessível no ambiente configurado para os testes
- Credenciais válidas de acesso ao sistema, especialmente para os cenários administrativos

### 1. Acessar a branch dos testes automatizados

```bash
git checkout testes-automatizados
````

### 2. Instalar as dependências do projeto

Na raiz do repositório, execute:

```bash
npm install
````

Caso necessário, instale também os navegadores utilizados pelo Playwright:
````bash
npx playwright install
````

### 3. Configurar o ambiente de execução

Antes da execução da suíte, certifique-se de que:

- o Playwright e suas dependências estejam instalados;
- o sistema esteja acessível no link configurado na automação;
- as credenciais utilizadas nos testes estejam válidas.

### 4. Executar a suíte completa

Para executar todos os testes automatizados:
````bash
npx playwright test
````

### 5. Executar testes por módulo

Caso seja necessário executar apenas um conjunto específico de testes, podem ser utilizados os scripts por módulo:
````bash
npm run test:auth
npm run test:users
npm run test:subjects
npm run test:topics
npm run test:contents
````


### 6. Visualizar o relatório

Após a execução, o relatório do Playwright pode ser aberto com:
````bash
npx playwright show-report
````

## Execução na Integração Contínua

Os testes automatizados foram executados em pipeline por meio do **GitHub Actions** configurado no repositório original do StudyLab.

A reprodução dessa execução em integração contínua depende das configurações e credenciais disponíveis nesse repositório, razão pela qual a pipeline não pode ser executada de forma isolada apenas a partir desta branch.

Para fins de replicação, recomenda-se a execução local da suíte, conforme descrito nas etapas anteriores deste README.
