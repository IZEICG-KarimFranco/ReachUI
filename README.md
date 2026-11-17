# ReachUI

Espejo de `reach-web-app/frontend` con lo necesario para trabajar la UI del rediseño Reach y sus pantallas mock sin auth, Supabase ni PWA. Misma estructura y alias `@/`, bajo `frontend/`.

```sh
cd frontend
pnpm install
pnpm dev          # http://localhost:3100/dev/mock
pnpm typecheck && pnpm lint && pnpm test:run && pnpm build
```

## Contenido de `frontend/`

- `src/components/`: carpeta completa. `src/test/`: solo `setup.ts` y `components/` (ui, theme, pwa); sin tests de features, e2e, services, hooks, lib ni páginas.
- `src/apps/main-app.tsx`: el de `reach-web-app` con el ruteo de los mocks y la ruta `/dev/mock/app-shell` activa. Es solo referencia: importa auth, páginas y servicios que no están aquí, así que no compila ni se ejecuta.
- `src/pages/dev/mock/`: pantallas mock, registradas en `mock-pages.ts`.
- Soporte mínimo para que los mocks funcionen: `lib/{utils,regex,i18n,app}.ts`, `hooks/{use-mobile,use-password-strength}.ts`, `types/`, `features/auth/lib/permissions.ts`, `styles/global.css`, `public/{locales,icon.svg}`.
- Entrada propia para ejecutarlo (no existe en `reach-web-app`): `src/{main,app,routes}.tsx`; `routes.tsx` monta los mocks con `import.meta.glob` y marca con `nest` los que usan rutas internas (`NESTED_PATHS`, hoy `app-shell`).

## Alcance de las verificaciones

Como `components/` está completo pero el resto de la app no, `tsc` y ESLint se limitan a la clausura de UI (ver `exclude` en `tsconfig.app.json` y `globalIgnores` en `eslint.config.js`). Lo excluido (`components/{sidebar,help,pwa,routing,shared,announcements,TwilioTemplatePreview}`, `theme/mode-toggle.tsx`, `apps/`) depende de código ausente y no se verifica. `tsc -b` tampoco compila `src/test`; vitest corre todo `src/test/components`.

## Origen (copia puntual, sin sync)

Copiado el 2026-11-17 desde `reach-web-app` (rama `feature/RW-775`, `HEAD` 1e9999c5; working tree con los mocks, que allí están en `.gitignore`).

`AppShell` (`ui/layout/app-shell*`, `ui/hooks/use-app-shell`, `ui/lib/app-shell`), `sidebar/{app-shell-controller,hooks/*,lib/app-nav}`, `theme/theme-menu`, la versión de `ui/overlays/menu.tsx` con `inset`/`collisionPadding`, las claves `sidebar.*` de `public/locales` y sus tests salen del `stash@{0}` «app shell» de esa rama, que aún no está commiteado. Si cambia allí, hay que recopiarlo a mano.
