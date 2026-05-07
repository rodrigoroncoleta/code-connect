# code-connect — Agent Instructions

Monorepo pnpm com dois apps: **API** (NestJS) em `apps/api` e **Web** (React + Vite) em `apps/web`.

## Comandos essenciais

### Raiz (executar de `d:\ProjetosTestes\code-connect`)
| Propósito | Comando |
|-----------|---------|
| Dev ambos em paralelo | `pnpm dev` |
| Dev API | `pnpm api:dev` |
| Dev Web | `pnpm web:dev` |
| Build API | `pnpm api:build` |
| Build Web | `pnpm web:build` |

### API (`apps/api`)
| Propósito | Comando |
|-----------|---------|
| Testes unitários | `pnpm --filter api test` |
| Testes com watch | `pnpm --filter api test:watch` |
| Cobertura | `pnpm --filter api test:cov` |
| Testes E2E | `pnpm --filter api test:e2e` |
| Lint + fix | `pnpm --filter api lint` |
| Formatar | `pnpm --filter api format` |

### Web (`apps/web`)
| Propósito | Comando |
|-----------|---------|
| Lint | `pnpm --filter web lint` |

## Stack

- **API**: NestJS 11, TypeScript 5.7, Jest, ESLint + Prettier
- **Web**: React 19, TypeScript 6, Vite 8, Tailwind CSS 4, Vitest + Testing Library, ESLint
- **Banco**: PostgreSQL 16 (Docker) + TypeORM 0.3

## Banco de dados

### Subir o PostgreSQL (Docker)

```bash
# Na raiz do monorepo
docker compose up -d
```

O container `code-connect-postgres` sobe o PostgreSQL 16 na porta **5432** com volume persistente `postgres_data`.

### Variáveis de ambiente da API

Crie o arquivo `apps/api/.env` com o conteúdo abaixo (espelhando o `docker-compose.yml`):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=codeConnect
DB_PASSWORD=codeConnect123
DB_NAME=code_connect

JWT_SECRET=troque-por-um-segredo-forte
```

> O módulo `@nestjs/config` já está configurado com `ConfigModule.forRoot({ isGlobal: true })` e lê o `.env` automaticamente.

### TypeORM

- Driver: **pg** (PostgreSQL)
- `synchronize: true` em desenvolvimento — o schema é criado/atualizado automaticamente a partir das entidades
- Entidades declaradas em `AppModule` via array `entities: [...]`
- Para produção, desativar `synchronize` e usar migrações TypeORM

### Comandos úteis do banco

| Propósito | Comando |
|-----------|----------|
| Subir banco | `docker compose up -d` |
| Parar banco | `docker compose stop` |
| Remover container + volume | `docker compose down -v` |
| Logs do container | `docker compose logs -f postgres` |
| Conectar via psql | `docker exec -it code-connect-postgres psql -U codeConnect -d code_connect` |

## Convenções

### Git — Conventional Commits (ambos os projetos)
Todo commit deve seguir o formato: `<tipo>(escopo opcional): descrição`

| Tipo | Quando usar |
|------|------------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `chore` | Tarefas de manutenção, configs, deps |
| `refactor` | Refatoração sem mudar comportamento |
| `test` | Adição ou correção de testes |
| `docs` | Documentação |
| `style` | Formatação, sem mudança de lógica |
| `perf` | Melhoria de performance |
| `ci` | Mudanças em CI/CD |

Exemplos:
```
feat(api): add POST /posts endpoint
fix(web): correct button hover state
test(api): add unit tests for PostsService
chore: update pnpm dependencies
```

### API (NestJS) — Princípios REST
- **Recursos no plural e em kebab-case**: `/posts`, `/user-profiles`
- **Verbos HTTP corretos**: `GET` lista/detalhe, `POST` criação, `PUT`/`PATCH` atualização, `DELETE` remoção
- **`PUT`** substitui o recurso inteiro; **`PATCH`** atualiza parcialmente
- **Status HTTP semânticos**: `200` OK, `201` Created (POST), `204` No Content (DELETE), `400` Bad Request, `401` Unauthorized, `403` Forbidden, `404` Not Found, `409` Conflict, `422` Unprocessable Entity
- **Sem verbos na URL**: ~~`/posts/create`~~ → `POST /posts`
- **Respostas consistentes**: sempre retornar o recurso criado/atualizado no corpo (exceto `204`)
- **Versionamento**: prefixar com `/v1/` quando houver necessidade de versionar
- **DTOs de entrada** validados com `class-validator`; **DTOs de saída** com `class-transformer` para não vazar campos sensíveis
- Arquivos: `kebab-case` com sufixo de tipo — `user.service.ts`, `user.controller.ts`, `user.module.ts`
- Classes: `PascalCase` com sufixo — `UserService`, `UserController`, `UserModule`
- Testes unitários: `{arquivo}.spec.ts` na mesma pasta do fonte
- Testes E2E: `{arquivo}.e2e-spec.ts` em `test/`
- Decorators habilitados: `emitDecoratorMetadata` e `experimentalDecorators` estão ativos no tsconfig
- Usar `@nestjs/testing` nos testes; injeção de dependência via `Test.createTestingModule()`

### Web (React) — Atomic Design + Tailwind
#### Estrutura de componentes (Atomic Design)
```
web/src/components/
  atoms/        # Elementos base: Button, Input, Label, Badge, Icon
  molecules/    # Combinações de atoms: FormField, Card, SearchBar
  organisms/    # Seções complexas: Header, PostList, CommentSection
  templates/    # Layouts de página sem dados reais
  pages/        # Templates preenchidos com dados, conectados à API
```
- Todo componente fica em seu próprio arquivo `PascalCase.tsx` dentro da pasta de nível correspondente
- Atoms não importam molecules/organisms; molecules não importam organisms (hierarquia estrita)
- Exportar componentes por index barrel apenas quando o nível tiver 3+ componentes

#### Tailwind CSS
- Estilização exclusivamente via classes utilitárias do Tailwind — sem CSS inline ou arquivos `.css` por componente
- Extrair classes repetidas para variáveis com `cn()` (clsx + tailwind-merge) quando a lógica condicional for complexa
- Tokens de design definidos no bloco `@theme` em `src/index.css` (Tailwind v4) — nunca hardcodar hex diretamente nas classes

##### Paleta de cores (tokens `@theme`)
| Token | Hex | Uso |
|-------|-----|-----|
| `page` | `#0d0d0d` | Fundo da página (`bg-page`) |
| `surface` | `#171d1f` | Card / surface principal (`bg-surface`) |
| `grafite` | `#00090e` | Elemento mais escuro (`bg-grafite`) |
| `offwhite` | `#e1e1e1` | Texto principal (`text-offwhite`) |
| `muted` | `#888888` | Texto secundário, fundo de input, divisores (`text-muted`, `bg-muted`) |
| `accent` | `#81fe88` | Verde destaque — CTAs, links ativos (`bg-accent`, `text-accent`) |
| `accent-hover` | `#6ee077` | Hover do verde destaque (`hover:bg-accent-hover`) |
| `accent-text` | `#132e35` | Texto sobre fundo accent (`text-accent-text`) |

##### Tamanhos de fonte — tokens Tailwind
Usar sempre os tokens padrão do Tailwind mais próximos ao valor do Figma. **Nunca** usar `text-[Npx]` arbitrário.

| Figma (px) | Classe Tailwind | Tailwind (px) |
|-----------|-----------------|---------------|
| 31 | `text-3xl` | 30 |
| 22 | `text-xl` | 20 |
| 18 | `text-lg` | 18 |
| 15 | `text-sm` | 14 |
| 12–12.5 | `text-xs` | 12 |

#### Testes de componentes
- Todo componente deve ter um arquivo `PascalCase.test.tsx` na mesma pasta
- Usar **Vitest** + **@testing-library/react**
- Cada teste cobre o **uso essencial**: renderização padrão, interações principais e estados críticos (loading, erro, vazio)
- Preferir queries semânticas: `getByRole`, `getByLabelText`, `getByText` — evitar `getByTestId`
- Não testar detalhes de implementação (classes CSS, estrutura interna do DOM)

#### Outras convenções
- `noUnusedLocals` e `noUnusedParameters` estão ativos — remova imports/variáveis não usadas
- `moduleResolution: "bundler"` — imports relativos sem extensão são resolvidos pelo Vite

### Prettier (API)
```json
{ "singleQuote": true, "trailingComma": "all" }
```

## Estrutura de arquivos

```
apps/
  api/src/          # Código NestJS — módulos, controllers, services, specs
  api/test/         # Testes E2E
  web/src/
    components/
      atoms/        # Button, Input, Label…
      molecules/    # FormField, Card…
      organisms/    # Header, PostList…
      templates/    # Layouts
      pages/        # Páginas conectadas à API
    assets/         # Imagens, SVGs
```

## Variáveis de ambiente

### API (`apps/api/.env`)

| Variável | Valor padrão (dev) | Descrição |
|----------|--------------------|-----------|
| `DB_HOST` | `localhost` | Host do PostgreSQL |
| `DB_PORT` | `5432` | Porta do PostgreSQL |
| `DB_USER` | `codeConnect` | Usuário do banco |
| `DB_PASSWORD` | `codeConnect123` | Senha do banco |
| `DB_NAME` | `code_connect` | Nome do banco |
| `JWT_SECRET` | — | Segredo para assinar tokens JWT (obrigatório) |
| `PORT` | `3000` | Porta HTTP da API |
