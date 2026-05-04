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
- Tokens de design (cores, espaçamentos customizados) definidos em `tailwind.config.ts`, não hardcoded

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

- API porta configurável via `PORT` (padrão: 3000)
- Nenhum `.env` configurado ainda — adicionar `@nestjs/config` se necessário
