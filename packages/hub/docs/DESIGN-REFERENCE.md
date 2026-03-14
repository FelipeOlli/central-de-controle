# Referência de design — Hub

O layout e as cores do Hub foram alinhados às recomendações do repositório **[UI UX Pro Max Skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)** (nextlevelbuilder), usado como base de consulta para UI/UX.

## Paleta

- **Produto de referência:** Productivity Tool (ferramenta de produtividade).
- **Tokens aplicados em `src/styles.css`:**
  - **Primary:** teal `#0d9488` (ações principais, links, nav ativo).
  - **Secondary:** `#14b8a6`.
  - **Accent:** laranja `#ea580c` (opcional para CTAs de destaque).
  - **Background:** `#f0fdfa`.
  - **Foreground:** `#134e4a`.
  - **Card:** branco com borda e sombra leve.
  - **Muted / Border:** tons claros para texto secundário e divisórias.
  - **Destructive:** `#dc2626` para ações destrutivas.

## Diretrizes UX aplicadas

- **Transições:** 150–300 ms em hovers e mudanças de estado (`--hub-transition: 200ms ease-out`).
- **Navegação:** estado ativo visível (cor + borda inferior); `scroll-behavior: smooth` no `html`.
- **Foco:** `:focus-visible` com outline em links, botões e controles.
- **Hover:** feedback visual em links e botões (cor/background).
- **Acessibilidade:** `prefers-reduced-motion` para reduzir animações quando o usuário preferir.
- **Contraste:** texto principal em foreground escuro sobre fundo claro (WCAG).

Para mais estilos, paletas e regras por tipo de produto, consulte o repositório [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) e os arquivos em `src/ui-ux-pro-max/data/` (cores, estilos, ux-guidelines).
