# Coddify frontend conventions

Angular 22 (standalone, zoneless, signals) + SSR + Tailwind CSS 3. Tests run on Vitest through `ng test`.

## Commands

| Task                                            | Command                                          |
| ----------------------------------------------- | ------------------------------------------------ |
| Dev server (SSR in dev)                         | `npm start`                                      |
| Production build (browser + server + prerender) | `npm run build`                                  |
| Run the built SSR server                        | `npm run serve:ssr:coddify-frontend` (port 4000) |
| Unit tests once                                 | `npx ng test --watch=false`                      |
| Format                                          | `npx prettier --write "src/**/*.{ts,html,scss}"` |

## Folders

```
src/app/
  core/              app-wide singletons, no UI
    api/             endpoint paths, ApiError, mock DB shared by mock APIs
    auth/            AuthApi contract, Http/Mock implementations, AuthService, token storage, Google sign-in
    onboarding/      OnboardingApi contract + implementations, DTOs
    learning/        LearningApi (journey, lessons, run code), TutorApi, mock course + mini runner
    gamification/    GamificationApi (stats, missions, leaderboard, store, profile), ProgressStore
    practice/        PracticeApi (interview problem bank, progress)
    config/          environment (apiBaseUrl, useMockApi, googleClientId)
    guards/          authGuard, guestGuard, onboardingGuard, onboardingPendingGuard
    interceptors/    errorInterceptor (outermost), authInterceptor
    theme/           ThemeService (dark / light / system)
    providers.ts     provideApis(): binds every API contract to mock or HTTP
  shared/
    ui/              reusable components (one folder each): code-editor (Monaco), tech-logo,
                     nav-art, mascot, avatar, search-dialog, rich-text, difficulty-badge, ...
    data/            static data shared across features (languages, tech catalog, search index)
    forms/           form helpers (fieldError)
  layouts/
    public-layout/   navbar (catalog + resources mega menus), mobile drawer, footer
    minimal-layout/  logo only (auth, onboarding)
    app-layout/      signed-in shell: sidebar, bottom bar, page-shell (main + rail), rail/ widgets
  features/
    landing/         sections/, components/ (globe canvas, code window), landing-content.ts
    auth/            components/<page>/ + shared auth pieces, utils/
    onboarding/      page, store, steps config, recommendation rules, components/
    journey/         /app/journey: syllabus header, hexagon path nodes, popovers
    lesson/          /learn/:lessonId (full screen): lesson panel, Monaco, tests, tutor, modals
    practice/ interview/ missions/ leaderboard/ store/ profile/   one page each under /app
    coming-soon/     placeholder for screens planned in later sprints
```

Every component lives in its own folder as `<name>.ts`, `<name>.html` and `<name>.scss`
(the `.scss` may be empty). Do not put templates or styles inline in the `.ts`.

Rules of thumb:

- Standalone components, `ChangeDetectionStrategy.OnPush`, `inject()`, signal `input()`/`output()`/`model()`, `@if`/`@for`.
- Always `templateUrl` + `styleUrl`. Keep components under ~200 lines; split into `components/` when bigger.
- Copy and mock data live in typed constants (`landing-content.ts`, `onboarding-steps.ts`), not in templates.
- Never touch `window`, `document`, `localStorage` or `sessionStorage` without `isPlatformBrowser` (or code that only runs from user events or `afterNextRender`). `/` and the info pages are prerendered; everything else renders client-side (`app.routes.server.ts`).
- Strict TypeScript and strict templates are on. No `any`.

## Theme tokens

Tokens are CSS variables holding RGB channels in `src/styles/_tokens.scss`: dark values on `:root`, light values on `[data-theme='light']`. `tailwind.config.js` maps them, so opacity modifiers work (`bg-primary/10`).

| Tailwind name                                     | Use                                         |
| ------------------------------------------------- | ------------------------------------------- |
| `bg`, `surface`, `surface-2`, `border`            | page, cards, raised areas, hairlines        |
| `text`, `muted`                                   | primary and secondary text                  |
| `primary`, `primary-press`, `primary-contrast`    | brand teal, its pressed shade, text on teal |
| `xp`, `streak`, `ai`, `success`, `danger`, `info` | gamification and status colours             |

Other scales: radius `rounded-input` (10px), `rounded-btn` (12px), `rounded-card` (16px), `rounded-modal` (20px), `rounded-full` for pills; `max-w-content` (1200px); `shadow-press` (button lip, uses `--press-color`), `shadow-modal`; durations `duration-hover` (150ms), `duration-panel` (250ms). Fonts: `font-brand` (Audiowide, hero and page titles), `font-display` (Plus Jakarta Sans), `font-sans` (Inter), `font-mono` (JetBrains Mono).

Theme switching: `ThemeService` stores `dark | light | system` (default `dark`) in `localStorage['coddify.theme']` and sets `data-theme` on `<html>`. An inline script in `index.html` applies the same logic before first paint, so there is no flash. The `dark:` variant targets `[data-theme="dark"]`.

Mock app windows on the landing page stay dark in both themes (`.mock-window`, `--mock-*` variables).

## Onboarding flow

`/onboarding` is open to guests. Landing "Get started" and navbar "Start learning" go there. Answers
live in sessionStorage; on the last step a guest gets "Create free account" / "Log in" with
`returnUrl=/onboarding`, comes back after logging in and saves the plan, then lands on `/app/journey`.
Signed-in users with unfinished onboarding are always sent to `/onboarding` before any app page.

## Code editor (Monaco)

`angular.json` copies `node_modules/monaco-editor/min/vs` to `assets/monaco/vs`. `MonacoLoader`
(`shared/ui/code-editor`) injects the AMD `loader.js` on first use, so Monaco never enters the main
bundle. Use `<app-code-editor [(value)]="code" language="python" (run)="run()" />`; it follows the app
theme (`coddify-dark` / `coddify-light`) and resizes with its container. Until the backend sandbox
exists, `MockLearningApi.run()` executes lesson code with `core/learning/mock/mini-runner.ts`
(print / console.log, variables, f-strings, arithmetic; no `eval`).

## Mock API vs real backend

Everything works without a backend. To switch:

1. Open `src/app/core/config/environment.ts`.
2. Set `useMockApi: false` and `apiBaseUrl` to the .NET API (no trailing slash).
3. If the backend routes differ, edit only `src/app/core/api/api-endpoints.ts`.

Expected API behaviour: JSON in camelCase; errors as ASP.NET ProblemDetails (`title`/`detail`/`errors`) optionally with a `code` from `ApiErrorCode` (for example `email_taken`, `invalid_credentials`, `email_not_verified`, `invalid_token`). `errorInterceptor` turns every HTTP failure into a typed `ApiError`; `authInterceptor` adds `Authorization: Bearer` and retries once after `POST /api/auth/refresh-token` on a 401.

Mock accounts (password `Coddify123`):

| Email                    | State                                        |
| ------------------------ | -------------------------------------------- |
| `demo@coddify.dev`       | verified, onboarding pending → `/onboarding` then `/app` |
| `done@coddify.dev`       | verified, onboarding done → `/app`           |
| `new@coddify.dev`        | verified, onboarding pending → `/onboarding` |
| `unverified@coddify.dev` | login fails with "Email not verified"        |

The mock stores persist to `localStorage['coddify.mock-db.v2']` (accounts) and `localStorage['coddify.mock-progress']` (XP, streak, gems, completed lessons, store items); clear them to reset. In mock mode the register and forgot-password screens show a "Demo mode: open the email link" shortcut, because the mock returns `debugVerificationToken` / `debugResetToken`. The real backend never sends these, so the link does not appear.

Google sign-in: set `googleClientId` in the environment. With an empty id the button shows a "Google sign-in not configured" toast.

## Adding a shared component

1. Create `src/app/shared/ui/<name>/<name>.ts` (kebab-case folder and file, class name without suffix, selector `app-<name>`).
2. Make it standalone with `ChangeDetectionStrategy.OnPush`, signal inputs, and Tailwind classes built from the tokens above (no hex colours unless they are fixed brand art such as the mascot).
3. Accessibility: a visible focus ring (`focus-visible:outline-primary`), labels or `aria-label` for icon-only controls, keyboard support for anything interactive, and `aria-hidden="true"` on decorative SVG.
4. If it wraps a form control, implement `ControlValueAccessor` (see `input.ts`, `checkbox.ts`) and let the parent pass `error`.
5. For variants, use a typed union plus a `Record<Variant, string>` of classes (see `button.ts`, `chip.ts`).
6. Icons: add path data to `shared/ui/icon/icons.ts` and use `<app-icon name="..." />`. There is no icon library.
7. Check it in both themes and at 360px.

## Adding a new API

1. Define DTOs and an abstract contract class in `core/<feature>/`.
2. Implement `Http<Feature>Api` (uses `HttpClient` + `API_ENDPOINTS`) and `Mock<Feature>Api` (uses `MockDb.respond()` for latency and throws `ApiError`).
3. Register both in `provideApis()` in `core/providers.ts`.
