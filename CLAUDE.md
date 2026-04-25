# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run start:dev                        # dev server, port 3000 (NODE_ENV=development)
bun run build                            # nest build + tsc-alias (both required)
bun run lint                             # eslint --fix
bun run prisma:migrate:dev -- <name>     # create + apply migration
bun run prisma:seed:static               # seed UserTypes + default users
bun run test:api                         # Newman against port 3000 → reports/api-test-report.html
```

No unit test runner is configured. All API testing uses Newman (`test:api`).

## Architecture

### Module layout

Each domain: `src/modules/<name>/` with `*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.dto.ts`, `*.interface.ts`. Services hold all business logic; controllers are thin routers. Interface files define use-case input/output types (not HTTP DTOs).

Active modules: `auth`, `user`, `groups`, `photos`, `products`, `styles`, `events`, `schedule`, `classes`.

### Prisma

- Schema at `prisma/schema.prisma`; generated client at `src/generated/prisma/` (CJS, not ESM).
- `PrismaService` (`src/prisma/prisma.service.ts`) uses `@prisma/adapter-pg` — not the default engine.
- `PrismaService` reads `DATABASE_URL` directly from `process.env`, **not** from `ConfigService`'s `config.*` namespace.
- After schema changes: run `prisma migrate dev` then `prisma generate` (or restart dev server which re-generates).

### Auth & guards

- JWT stored in `HttpOnly` cookie named `access_token`.
- `AuthGuard` (`src/middleware/jwt.guard.ts`) — apply with `@UseGuards(AuthGuard)` at controller level.
- `SqlInjectionGuard` is a global `APP_GUARD` — do not add it to individual modules.
- Role enforcement: `@Roles('student' | 'professor' | 'admin')` decorator. Roles resolved by comparing `user.userTypeId` against UUID env vars (`ID_STUDENT`, `ID_PROFESSOR`, `ID_ADMIN`).
- Config accessed as `configService.get<string>('config.<key>')` (e.g. `config.jwtSecret`, `config.roles.student`).

### Identity model

`Credentials` and `Users` share the same UUID. `Credentials.uid` becomes `Users.uid` — linked by PK identity, not a foreign key. A user with `Credentials` but no `Users` row has `hasProfile: false`.

### Schedule & Classes

- `Schedule` = recurring weekly slot. Creating one auto-generates `Classes` rows from today's next occurrence until `SEMESTER_END_DATE` env var.
- `Classes.scheduleId` is nullable — null means a manually created class.
- `Attendance` has unique constraint `[classId, userId]`. P2002 → already attended (handled in `ClassesService.attend`).
- Schedule update/remove: deletes future unattended classes before regenerating. Classes with any attendance record are preserved.

### Events

- Status flow: `PENDING → APPROVED → COMPLETED` or `CANCELLED`.
- `COMPLETED` is lazy — set on read by `lazyComplete()` in `EventService` when `startDate < now`.
- Editing an event (or its products) resets status to `PENDING` and clears `feedback`.
- `EventPhoto` types: `HERO` (cover), `PROMO`, `MEMORY`. Adding a new `HERO` demotes the old one to `PROMO`.
- Group participation: coordinator's groups link via `GroupEvent` directly; other groups go through `EventInvitation` → accept → `GroupEvent`.

### Photos

- Stored as base64 in DB; written to `public/images/` as files.
- Served as static files at `/images/<filename>` via `ServeStaticModule`.
- Body parser limit: 6 MB (`bodyParser.json({ limit: '6mb' })`).

### Global pipes

`ValidationPipe` with `whitelist: true, forbidNonWhitelisted: true, transform: true` applies globally. All route params must use a DTO class with `@IsString()` (or appropriate validator) — bare `@Param('id') id: string` fails whitelist validation.

### Config namespace

`config/configuration-app.ts` registers under `'config'`. Keys: `databaseUrl`, `jwtSecret`, `corsOrigin`, `nodeEnv`, `semesterEndDate`, `roles.student`, `roles.professor`, `roles.admin`.

### Path aliases

TypeScript `src/` alias. After `nest build`, run `tsc-alias` to rewrite paths in `dist/`. Both steps are in the `build` script.
