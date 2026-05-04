# Plan: Página de Login com Atomic Design + Tailwind

## Contexto
- Web app: React 19 + Vite + TypeScript
- Tailwind NÃO instalado — será instalado como passo 1
- Imagens já em `apps/web/public/`: banner.png, github.png, gmail.png
- CSS atual em index.css/App.css (será mantido para reset, substituído gradualmente)
- Nenhum componente criado ainda

## Decisões
- Estilização: Tailwind CSS (instalar + configurar)
- Estrutura: Atomic Design (atoms → molecules → organisms → templates → pages)
- A página de cadastro compartilhará o mesmo template base (AuthTemplate) — apenas o banner e os campos mudam
- Sem roteador ainda — App.tsx renderizará LoginPage diretamente
- Tema escuro conforme design (bg #0d0d0d, verde #22c55e, inputs cinza escuro)

## Fases

### Fase 1 — Setup Tailwind
1. Instalar tailwindcss + @tailwindcss/vite via pnpm no workspace web
2. Configurar plugin no vite.config.ts
3. Adicionar `@import "tailwindcss"` no index.css (remover CSS de boilerplate existente)
4. Definir tokens customizados no CSS (cores do design: background #0d0d0d, accent verde #22c55e)

### Fase 2 — Atoms
5. `atoms/Input.tsx` — input genérico (type, placeholder, value, onChange)
6. `atoms/Label.tsx` — label semântico
7. `atoms/Button.tsx` — botão primário (variant: primary | ghost, com suporte a ícone/texto)
8. `atoms/Checkbox.tsx` — checkbox "Lembrar-me"
9. `atoms/SocialButton.tsx` — botão ícone social (src da imagem, label)
10. `atoms/Divider.tsx` — separador "ou entre com outras contas"

### Fase 3 — Molecules
11. `molecules/FormField.tsx` — Label + Input empilhados
12. `molecules/SocialLogin.tsx` — Divider + grupo de SocialButton (github, gmail)
13. `molecules/RememberRow.tsx` — Checkbox + "Lembrar-me" + link "Esqueci a senha"

### Fase 4 — Organisms
14. `organisms/LoginForm.tsx` — título, subtítulo, campos (email, senha), RememberRow, Button, SocialLogin, link de cadastro
15. `organisms/AuthBanner.tsx` — imagem banner + logo code-connect (recebe `src` como prop para reuso)

### Fase 5 — Template
16. `templates/AuthTemplate.tsx` — layout de duas colunas: slot esquerda (banner) + slot direita (form children) — totalmente genérico, reutilizável para cadastro

### Fase 6 — Page
17. `pages/LoginPage.tsx` — compõe AuthTemplate + AuthBanner + LoginForm
18. Atualizar `App.tsx` para renderizar `<LoginPage />`
19. Limpar App.css (boilerplate desnecessário)

## Arquivos modificados/criados
- `apps/web/vite.config.ts` — adicionar plugin Tailwind
- `apps/web/src/index.css` — substituir por imports Tailwind + tokens de tema
- `apps/web/src/App.tsx` — renderizar LoginPage
- `apps/web/src/App.css` — remover/limpar boilerplate
- `apps/web/src/components/atoms/Input.tsx`
- `apps/web/src/components/atoms/Label.tsx`
- `apps/web/src/components/atoms/Button.tsx`
- `apps/web/src/components/atoms/Checkbox.tsx`
- `apps/web/src/components/atoms/SocialButton.tsx`
- `apps/web/src/components/atoms/Divider.tsx`
- `apps/web/src/components/molecules/FormField.tsx`
- `apps/web/src/components/molecules/SocialLogin.tsx`
- `apps/web/src/components/molecules/RememberRow.tsx`
- `apps/web/src/components/organisms/LoginForm.tsx`
- `apps/web/src/components/organisms/AuthBanner.tsx`
- `apps/web/src/components/templates/AuthTemplate.tsx`
- `apps/web/src/components/pages/LoginPage.tsx`

## Verificação
1. `pnpm web:dev` — app sobe sem erros
2. Visualizar localhost e comparar com o layout da imagem
3. `pnpm --filter web lint` — sem erros de lint
