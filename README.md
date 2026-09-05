# Techify

Blog administrativo para publicação e leitura de artigos sobre tecnologia. O sistema possui uma área pública renderizada no servidor e uma área administrativa para gerenciar artigos, categorias e usuários.

O nome do pacote em `package.json` é `guiapress`, enquanto a interface usa o nome Techify.

## Índice

- [Visão geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Estrutura](#estrutura-do-projeto)
- [Mapa de arquivos](#mapa-de-arquivos)
- [Fluxo geral](#fluxo-geral)
- [Funcionalidades](#funcionalidades)
- [Rotas HTTP](#rotas-http)
- [Banco de dados](#banco-de-dados)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Execução](#execução)
- [Scripts](#scripts-do-packagejson)
- [Guia rápido](#guia-rápido-onde-encontrar-cada-coisa)
- [Manutenção](#manutenção-e-evolução)
- [Pontos de atenção](#pontos-de-atenção)

## Visão geral

O Techify implementa o fluxo básico de um blog de tecnologia: artigos são cadastrados no painel, associados a categorias e publicados em páginas públicas com URLs baseadas em slug.

### Funcionalidades confirmadas

- Listagem dos quatro artigos mais recentes na página inicial.
- Leitura de um artigo por slug.
- Filtro de artigos por categoria.
- Paginação pública com quatro artigos por página.
- Cadastro, edição, listagem e exclusão de categorias.
- Cadastro, listagem e exclusão de usuários.
- Cadastro, edição, listagem e exclusão de artigos.
- Login, logout e autenticação por sessão.
- Hash de senhas com bcryptjs.
- Geração de slug a partir do título.
- Edição do conteúdo com TinyMCE.

Não há evidência no código de uma API JSON separada, frontend independente, testes automatizados ou deploy em produção.

## Tecnologias

| Tecnologia | Uso no projeto |
|---|---|
| Node.js | Ambiente de execução do backend. |
| TypeScript | Implementação atual em `src/`, compilada para `dist/`. |
| Express | Servidor HTTP, middlewares e rotas. |
| EJS | Templates HTML renderizados no servidor em `views/`. |
| Sequelize 6 | ORM, modelos, associações, consultas e sincronização do schema. |
| MySQL / mysql2 | Banco de dados e driver usado pelo Sequelize. |
| express-session | Sessão de autenticação. |
| dotenv | Carregamento das configurações do `.env`. |
| body-parser | Leitura de formulários URL-encoded e JSON. |
| bcryptjs | Hash e comparação de senhas. |
| slugify | Geração de slugs de artigos e categorias. |
| Bootstrap | CSS e JavaScript estáticos em `public/`. |
| TinyMCE | Editor local do corpo dos artigos. |
| ts-node / nodemon | Execução e reinicialização durante o desenvolvimento. |

`moment` e `moment-timezone` estão declarados em `package.json`, mas não foram encontrados em uso no código atual.

## Arquitetura

O projeto é um monólito web server-rendered organizado de forma próxima a MVC. Não existe uma camada `services/`; os controllers executam diretamente as operações dos modelos Sequelize.

```text
Navegador
   |
   v
Express / rotas
   |
   v
Controllers em src/
   |
   v
Modelos Sequelize -> MySQL
   |
   v
Templates EJS em views/
   |
   v
HTML renderizado
```

## Estrutura do projeto

```text
project-techify-administrative-blog/
├── src/                         # Implementação TypeScript atual
│   ├── index.ts                 # Bootstrap do Express e rotas públicas
│   ├── database/database.ts     # Conexão Sequelize/MySQL
│   ├── articles/                # Modelo e controller de artigos
│   ├── categories/              # Modelo e controller de categorias
│   ├── users/                   # Modelo e controller de usuários
│   ├── middlewares/             # Autenticação
│   └── types/                   # Declarações auxiliares
├── dist/                        # Saída gerada; não editar
├── views/                       # Templates EJS e parciais
├── public/                      # Bootstrap, TinyMCE e assets
├── articles/                    # Código JavaScript legado
├── categories/                  # Código JavaScript legado
├── users/                       # Código JavaScript legado
├── database/                    # Conexão JavaScript legada
├── middlewares/                 # Middleware JavaScript legado
├── index.js                     # Bootstrap JavaScript legado
├── package.json                 # Dependências e scripts
├── package-lock.json            # Lockfile
├── tsconfig.json                # Configuração TypeScript
├── .env.example                 # Modelo de variáveis de ambiente
└── README.md                   # Documentação
```

O fluxo oficial usa `src/index.ts` em desenvolvimento e `dist/index.js` na execução compilada. Os arquivos JavaScript antigos permanecem durante a migração e não devem receber novas funcionalidades.

## Mapa de arquivos

### Inicialização e infraestrutura

| Arquivo | Responsabilidade |
|---|---|
| `src/index.ts` | Cria o Express, configura EJS, sessão, assets, parsers, controllers, rotas públicas, banco e servidor na porta `1212`. |
| `src/database/database.ts` | Carrega `.env`, cria o Sequelize e configura MySQL e timezone `-03:00`. |
| `tsconfig.json` | Define `src` como raiz, `dist` como saída, CommonJS, ES2020, `strict` e source maps. |
| `package.json` | Dependências e comandos de desenvolvimento, build e execução. |
| `.env.example` | Lista as configurações do banco. |

### Domínios

| Arquivo | Responsabilidade |
|---|---|
| `src/articles/Article.ts` | Modelo `articles`, campos e associação com categoria. |
| `src/articles/ArticlesController.ts` | CRUD administrativo, slugs, associação de categoria e paginação. |
| `src/categories/Category.ts` | Modelo `categories` com `title` e `slug`. |
| `src/categories/CategoriesController.ts` | CRUD de categorias e geração de slugs. |
| `src/users/User.ts` | Modelo `users` com nome, e-mail e senha. |
| `src/users/UsersController.ts` | Usuários, login, bcrypt, sessão e logout. |
| `src/middlewares/adminAuth.ts` | Redireciona para `/login` quando não há usuário na sessão. |
| `src/types/express-session.d.ts` | Tipagem de `req.session.user`. |
| `src/types/modules.d.ts` | Declaração TypeScript local para `slugify`. |

### Views e assets

| Caminho | Responsabilidade |
|---|---|
| `views/index.ejs` | Página inicial com artigos recentes. |
| `views/article.ejs` | Página pública de um artigo. |
| `views/admin/articles/` | Listagem, criação, edição e paginação de artigos. |
| `views/admin/categories/` | Listagem, criação e edição de categorias. |
| `views/admin/users/` | Listagem, criação e login de usuários. |
| `views/partials/header.ejs` | Cabeçalho, Bootstrap CSS e fonte externa. |
| `views/partials/footer.ejs` | Rodapé comum. |
| `views/partials/homenavbar.ejs` | Navegação pública e categorias. |
| `views/partials/navbar.ejs` | Navegação administrativa existente, mas não incluída pelas telas administrativas atuais. |
| `public/css/` e `public/js/` | Arquivos estáticos do Bootstrap. |
| `public/tinymce/` | TinyMCE, idioma português e plugins. |

### Código legado

`index.js`, `database/database.js`, `articles/*.js`, `categories/*.js`, `users/*.js` e `middlewares/adminAuth.js` são equivalentes anteriores à migração. Consulte-os apenas para comparar comportamento; novas alterações devem ser feitas em `src/`.

## Fluxo geral

```text
Navegador
   |
   v
Rota Express em src/index.ts ou controller
   |
   +--> adminAuth, quando aplicável
   |
   v
Controller
   |
   v
Modelo Sequelize -> MySQL
   |
   v
View EJS ou redirecionamento
```

`src/index.ts` registra os controllers, e os controllers recebem formulários, fazem validações básicas, chamam os modelos Sequelize e renderizam uma view ou redirecionam o navegador.

## Funcionalidades

### Página inicial e leitura pública

**Arquivos:** `src/index.ts`, `src/articles/Article.ts`, `src/categories/Category.ts`, `views/index.ejs`, `views/article.ejs` e `views/partials/homenavbar.ejs`.

1. `GET /` busca até quatro artigos ordenados por `id DESC` e todas as categorias.
2. `views/index.ejs` lista os artigos e aponta para `/<slug>`.
3. `GET /:slug` consulta o artigo pelo slug.
4. Se encontrado, busca categorias e renderiza `views/article.ejs`; em caso de ausência ou erro, redireciona para `/`.

### Categorias

**Arquivos:** `src/categories/CategoriesController.ts`, `src/categories/Category.ts` e `views/admin/categories/`.

1. O formulário envia `title` para `POST /categories/save`.
2. O controller cria o slug com `slugify` e chama `Category.create`.
3. A edição envia `id` e `title` para `POST /categories/update`.
4. A exclusão envia `id` para `POST /categories/delete`.
5. Essas rotas não usam `adminAuth` no código atual.

### Artigos

**Arquivos:** `src/articles/ArticlesController.ts`, `src/articles/Article.ts`, `src/categories/Category.ts`, `src/middlewares/adminAuth.ts` e `views/admin/articles/`.

1. As telas e operações administrativas de artigos usam `adminAuth`.
2. A listagem inclui a categoria associada.
3. Criação e atualização geram o slug novamente a partir do título.
4. O campo `category` do formulário é convertido em `categoryId`.
5. O corpo HTML é produzido pelo TinyMCE e gravado em `articles.body`.
6. A paginação usa limite de quatro registros e calcula o offset a partir de `:num`.

### Usuários e autenticação

**Arquivos:** `src/users/UsersController.ts`, `src/users/User.ts`, `src/index.ts`, `src/middlewares/adminAuth.ts` e `views/admin/users/`.

1. `POST /users/create` verifica previamente se o e-mail existe.
2. A senha é transformada em hash bcrypt com salt de fator 10 antes do cadastro.
3. `POST /authenticate` compara a senha recebida com o hash armazenado.
4. Em caso de sucesso, a sessão recebe `id` e `email`, e o navegador vai para `/admin/articles`.
5. `GET /logout` remove o usuário da sessão e redireciona para `/`.
6. A autorização atual verifica apenas a existência da sessão; não há papéis ou permissões por usuário.

### Filtro e paginação

`GET /category/:slug` busca a categoria incluindo seus artigos e reutiliza `views/index.ejs`. `GET /articles/page/:num` usa `findAndCountAll`, quatro itens por página e `views/admin/articles/page.ejs`.

## Rotas HTTP

### Públicas

| Método | Endpoint | Finalidade | Arquivo |
|---|---|---|---|
| `GET` | `/` | Quatro artigos recentes e categorias. | `src/index.ts` |
| `GET` | `/:slug` | Artigo pelo slug. | `src/index.ts` |
| `GET` | `/category/:slug` | Artigos da categoria. | `src/index.ts` |
| `GET` | `/articles/page/:num` | Paginação de artigos. | `src/articles/ArticlesController.ts` |

### Artigos

| Método | Endpoint | Dados | Proteção |
|---|---|---|---|
| `GET` | `/admin/articles` | Nenhum | `adminAuth` |
| `GET` | `/admin/articles/new` | Nenhum | `adminAuth` |
| `POST` | `/articles/save` | `title`, `body`, `category` | `adminAuth` |
| `POST` | `/articles/delete` | `id` | `adminAuth` |
| `GET` | `/admin/articles/edit/:id` | `id` na URL | `adminAuth` |
| `POST` | `/articles/update` | `id`, `title`, `body`, `category` | `adminAuth` |

### Categorias

| Método | Endpoint | Dados | Proteção |
|---|---|---|---|
| `GET` | `/admin/categories` | Nenhum | Nenhuma |
| `GET` | `/admin/categories/new` | Nenhum | Nenhuma |
| `POST` | `/categories/save` | `title` | Nenhuma |
| `POST` | `/categories/delete` | `id` | Nenhuma |
| `GET` | `/admin/categories/edit/:id` | `id` na URL | Nenhuma |
| `POST` | `/categories/update` | `id`, `title` | Nenhuma |

### Usuários e sessão

| Método | Endpoint | Dados | Proteção |
|---|---|---|---|
| `GET` | `/admin/users` | Nenhum | Nenhuma |
| `GET` | `/admin/users/create` | Nenhum | Nenhuma |
| `POST` | `/users/create` | `nome`, `email`, `password` | Nenhuma |
| `POST` | `/users/delete` | `id` | Nenhuma |
| `GET` | `/login` | Nenhum | Nenhuma |
| `POST` | `/authenticate` | `email`, `password` | Nenhuma |
| `GET` | `/logout` | Nenhum | Nenhuma |

As respostas são principalmente HTML renderizado ou redirecionamentos; não há contrato JSON separado.

## Banco de dados

O MySQL é acessado por Sequelize 6 e `mysql2`. `src/index.ts` chama `connection.authenticate()` e `connection.sync({ force: false })` na inicialização.

### Modelos

| Tabela | Campos definidos | Arquivo |
|---|---|---|
| `categories` | `id`, `title` obrigatório, `slug` obrigatório | `src/categories/Category.ts` |
| `articles` | `id`, `title` obrigatório, `slug` obrigatório, `body` obrigatório, `categoryId` obrigatório | `src/articles/Article.ts` |
| `users` | `id`, `nome` obrigatório, `email` obrigatório, `password` obrigatório | `src/users/User.ts` |

As chaves `id` são criadas automaticamente pelo Sequelize. O relacionamento definido é `Category.hasMany(Article)` e `Article.belongsTo(Category)`, usando `categoryId`.

Não foram encontradas migrations, seeders, índices `UNIQUE`, cascade explícito ou associação entre usuários e artigos. O schema é sincronizado em tempo de execução.

## Variáveis de ambiente

Crie `.env` na raiz, sem versioná-lo, usando `.env.example`:

```env
DB_NAME=guiapress
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_DIALECT=mysql
SESSION_SECRET=defina-um-segredo-local
```

| Variável | Finalidade | Uso |
|---|---|---|
| `DB_NAME` | Nome do banco. | `src/database/database.ts` |
| `DB_USER` | Usuário MySQL. | `src/database/database.ts` |
| `DB_PASSWORD` | Senha MySQL. | `src/database/database.ts` |
| `DB_HOST` | Host MySQL. | `src/database/database.ts` |
| `DB_DIALECT` | Dialeto Sequelize, normalmente `mysql`. | `src/database/database.ts` |
| `SESSION_SECRET` | Segredo de assinatura da sessão. | `src/index.ts` |

`SESSION_SECRET` é usado pelo código, mas ainda não aparece em `.env.example`. Nunca coloque senhas, tokens ou credenciais reais na README.

## Execução

### Pré-requisitos

- Node.js instalado.
- MySQL em execução.
- Banco e usuário disponíveis conforme o `.env`.

### Instalação e configuração

```bash
npm install
```

Depois, copie `.env.example` para `.env`, preencha as credenciais e defina `SESSION_SECRET`.

### Desenvolvimento

```bash
npm run typecheck
npm run dev
```

O script `dev` executa `src/index.ts` com `ts-node` e `nodemon`.

### Build e execução compilada

```bash
npm run build
npm start
```

O servidor escuta na porta fixa `1212`, que não é configurável por variável de ambiente no código atual.

Não há migrations ou seeders. O banco é sincronizado pelo Sequelize com `sync({ force: false })` durante a inicialização.

## Scripts do `package.json`

| Script | Comando | Finalidade |
|---|---|---|
| `npm run typecheck` | `tsc --noEmit` | Verifica os tipos sem gerar arquivos. |
| `npm run build` | `tsc` | Compila `src/` para `dist/`. |
| `npm run dev` | `nodemon --exec ts-node src/index.ts` | Executa em desenvolvimento. |
| `npm start` | `node dist/index.js` | Executa a versão compilada. |
| `npm test` | `echo "Error: no test specified"` | Placeholder; não há testes automatizados configurados. |

## Guia rápido: onde encontrar cada coisa

| Preciso encontrar... | Onde procurar |
|---|---|
| Inicialização do servidor | `src/index.ts` |
| Rotas públicas | `src/index.ts` |
| Rotas de artigos | `src/articles/ArticlesController.ts` |
| Rotas de categorias | `src/categories/CategoriesController.ts` |
| Login e usuários | `src/users/UsersController.ts` |
| Proteção de rotas | `src/middlewares/adminAuth.ts` |
| Sessão Express | `src/index.ts` e `src/types/express-session.d.ts` |
| Conexão com o banco | `src/database/database.ts` |
| Modelo de artigo | `src/articles/Article.ts` |
| Modelo de categoria | `src/categories/Category.ts` |
| Modelo de usuário | `src/users/User.ts` |
| Relacionamento artigo/categoria | `src/articles/Article.ts` |
| Formulário de artigo | `views/admin/articles/new.ejs` e `edit.ejs` |
| Listagem/paginação de artigos | `views/admin/articles/index.ejs` e `page.ejs` |
| Formulários de categoria | `views/admin/categories/` |
| Login e cadastro de usuário | `views/admin/users/` |
| Página inicial | `views/index.ejs` |
| Página pública de artigo | `views/article.ejs` |
| Navegação pública | `views/partials/homenavbar.ejs` |
| CSS e Bootstrap | `public/css/` e `public/js/` |
| Editor de conteúdo | `public/tinymce/` |
| Variáveis de ambiente | `.env.example` e `src/database/database.ts` |
| Configuração TypeScript | `tsconfig.json` |
| Código legado | `index.js`, `articles/`, `categories/`, `users/`, `database/` e `middlewares/` |

## Manutenção e evolução

### Alterar funcionalidade existente

1. Localize a rota no controller ou em `src/index.ts`.
2. Confira os nomes dos campos na view EJS correspondente.
3. Atualize o modelo se a alteração mudar os dados persistidos.
4. Execute `npm run typecheck` e `npm run build`.
5. Teste com o MySQL configurado.

### Adicionar rota

- Rota pública simples: `src/index.ts`.
- Rota de artigo, categoria ou usuário: controller da entidade.
- Rota protegida: aplicar `adminAuth`.
- Resposta HTML: criar ou atualizar uma view em `views/`.

### Adicionar entidade

1. Crie o modelo em uma pasta de domínio dentro de `src/`.
2. Use a conexão de `src/database/database.ts`.
3. Defina associações no modelo responsável.
4. Crie controller e views.
5. Registre o controller em `src/index.ts`.
6. Avalie o efeito de `sync({ force: false })` sobre o banco existente.

Faça alterações no TypeScript em `src/`, não em `dist/` nem nos arquivos legados. Não versione `.env` ou credenciais e mantenha controller e formulário sincronizados quando os nomes dos campos mudarem.

## Pontos de atenção

Os itens abaixo foram identificados diretamente no código:

1. **Exclusão de artigos:** `views/admin/articles/index.ejs` usa `action="//delete"`, enquanto o controller espera `POST /articles/delete`.
2. **Proteção incompleta:** categorias e usuários não usam `adminAuth`.
3. **Fallback inseguro:** sem `SESSION_SECRET`, `src/index.ts` usa `"qualquercoisa"`.
4. **Sessão não persistente:** nenhum store explícito é configurado para `express-session`.
5. **HTML não escapado:** `views/article.ejs` usa `<%- article.body %>` para preservar HTML do TinyMCE.
6. **Sem CSRF:** os formulários POST não usam tokens CSRF.
7. **Validação limitada:** não há unicidade explícita de slug/e-mail, senha mínima ou limites de tamanho.
8. **Erros parciais:** vários handlers de consulta/mutação não têm `catch` explícito.
9. **Inicialização independente:** `app.listen` não aguarda o resultado de `authenticate()` e `sync()`.
10. **Paginação acoplada ao admin:** a rota pública de paginação renderiza `views/admin/articles/page.ejs`.
11. **Sem testes:** `npm test` é apenas um placeholder.
12. **Dependências sem uso confirmado:** `moment` e `moment-timezone` estão declarados, mas não aparecem no código atual.

## Migração de JavaScript para TypeScript

`src/` é a referência para novas alterações. `src/index.ts` substitui `index.js`, os modelos/controllers equivalentes ficam em `src/`, `npm run build` gera `dist/` e `npm start` executa `dist/index.js`.

Os arquivos JavaScript legados só devem ser removidos depois de confirmar que nenhum fluxo depende de executar `node index.js` diretamente.

## Autoria

O projeto foi desenvolvido por [Samuel](https://github.com/SamCampel/).
