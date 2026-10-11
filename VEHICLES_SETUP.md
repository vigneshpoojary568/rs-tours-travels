# Vehicle uploads — setup

Vehicles (name, seats, photo, …) are saved on the server, so every visitor sees them and
they survive refreshes, restarts and redeploys. Photos are uploaded from the Admin Panel —
nothing needs to be added to `src/` or `public/`.

## 1. Create free persistent storage (Supabase, ~5 minutes)

1. Create a project at https://supabase.com.
2. **SQL Editor → run:**

   ```sql
   create table public.vehicles (
     id         text primary key,
     data       jsonb  not null,
     sort_order bigint not null
   );
   alter table public.vehicles enable row level security;  -- no policies: only the server key can access it
   ```
3. **Storage → New bucket** named `vehicle-photos`, tick **Public bucket**.
4. **Project Settings → API:** copy the project URL and the **service_role / secret** key.
   The key stays on the server (never in the browser).

## 2. Set environment variables on your host (and in `.env.local` for local runs)

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | project URL |
| `SUPABASE_SERVICE_KEY` | service_role / secret key |
| `ADMIN_PASSWORD` | the password you sign in to the Admin Panel with |
| `ADMIN_SESSION_SECRET` | any long random string (keeps admins signed in across redeploys) |

Optional: `ADMIN_USERNAMES` (comma-separated, defaults to the existing ones), `SUPABASE_BUCKET`, `SUPABASE_TABLE`.

> If you change the admin password inside the Admin Panel, also update `ADMIN_PASSWORD` —
> the server uses it to authorise vehicle changes. If `ADMIN_PASSWORD` is unset it accepts the
> same default password as the current login.

## 3. Run

```
npm install
npm run dev                 # local development (http://localhost:3000)
npm run build && npm start  # production
```

The app now runs through a small Express server (`server.ts`) that also serves the website.
Host it anywhere that runs Node (Cloud Run, Render, Railway, a VPS, …).

Without the Supabase variables, development falls back to the local `./data` folder, and
**production refuses to save** (so nothing is silently lost on hosts that wipe their disk).
Set `ALLOW_LOCAL_STORAGE=true` only if your server has a persistent disk.
