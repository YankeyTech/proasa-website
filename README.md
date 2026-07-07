# ProASA Website

Official website for the **Professional Administrative Students Association (ProASA)**,
Koforidua Technical University.

Built with Node.js + Express + EJS, MySQL (hosted free on **Aiven**), media storage on
**Cloudinary** (free), and deployed on **Render** (free).

## What's included

- **Home** — hero, the 3 departmental heads, latest news, gallery preview
- **About** — editable department description + Judicial Committee + Executive Committee
- **Constitution** — full editable constitution page
- **Gallery** — photo & video grid with a lightbox
- **News** — listing + single article pages
- **Contact**
- **Admin dashboard** (`/admin/login`) — the only place changes can be made:
  - Post/edit/delete news articles (with cover image upload)
  - Upload/delete gallery photos & videos
  - Add/edit/delete department heads
  - Add/edit/delete committee members
  - Edit the About and Constitution page text

Everything an admin uploads (photos, videos, news cover images) is stored on
Cloudinary, not on Render's disk — this matters because Render's free web
service disk is **not persistent** (it's wiped on every redeploy/restart).

---

## 1. Local setup

```bash
git clone <your-repo-url>
cd proasa-website
npm install
cp .env.example .env
```

Now fill in `.env` — see the next two sections for where to get each value.

### Create the database tables

Once your `.env` has valid Aiven credentials:

```bash
npm run migrate
```

This runs `sql/schema.sql` against your database and creates all tables, plus
placeholder About/Constitution text.

### Create your admin login

Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env`, then:

```bash
npm run create-admin
```

This is the only login the site has — there's no public sign-up, by design.
Run this script again any time to reset that admin's password.

### Run it

```bash
npm run dev      # with auto-reload (nodemon)
# or
npm start
```

Visit `http://localhost:3000`. Admin panel: `http://localhost:3000/admin/login`.

---

## 2. Database — Aiven MySQL (free forever)

1. Go to [aiven.io](https://aiven.io) and create a free account (no card needed).
2. Create a new service → **MySQL** → choose the **Free** plan → pick a region close to you.
3. Wait a minute or two for the service to go "Running".
4. Open the service → **Overview** tab → **Connection information**. Copy:
   - Host → `DB_HOST`
   - Port → `DB_PORT`
   - User (usually `avnadmin`) → `DB_USER`
   - Password → `DB_PASSWORD`
   - Database name (usually `defaultdb`) → `DB_NAME`
5. Leave `DB_SSL=true` — Aiven requires SSL and this app is already set up for it.

Notes on the free plan: it's free indefinitely (no trial, no card), with 1GB
RAM/1 CPU/1GB storage on a single node — plenty for a department site. Aiven
may power off a free service after a long period of no use; you'll get an
email first, and you just click "resume" in the console.

---

## 3. Media storage — Cloudinary (free)

Render's free tier has no persistent disk, so photos/videos your admin
uploads need to live somewhere else. Cloudinary is the standard choice for
exactly this (images + video, with a CDN, free forever).

1. Go to [cloudinary.com](https://cloudinary.com) → sign up free (no card).
2. Your **Dashboard** homepage shows: Cloud name, API Key, API Secret.
3. Put those into `.env`:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

Free tier: 25 credits/month, where 1 credit ≈ 1GB storage or 1GB bandwidth or
1,000 image transformations — generous for a departmental site's photos and
short videos. If you ever outgrow it, Cloudinary just pauses new uploads
until next month or you upgrade; nothing breaks silently.

---

## 4. Push to GitHub

If you don't have a repo yet:

1. On GitHub, click **New repository** → name it e.g. `proasa-website` →
   **do not** initialize with a README (you already have one) → Create.
2. In your project folder:

```bash
git init
git add .
git commit -m "Initial commit: ProASA website"
git branch -M main
git remote add origin https://github.com/<your-username>/proasa-website.git
git push -u origin main
```

Your `.env` file is already excluded via `.gitignore` — never commit it,
since it contains passwords and API keys.

---

## 5. Deploy — Render (free)

1. Go to [render.com](https://render.com) → sign up → **New +** → **Web Service**.
2. Connect your GitHub account and pick the `proasa-website` repo.
3. Render should auto-detect Node. Set:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
4. Under **Environment**, add every variable from your `.env` file
   (`SESSION_SECRET`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`,
   `DB_NAME`, `DB_SSL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
   `CLOUDINARY_API_SECRET`). Do **not** add a real `.env` file — Render
   reads these from its dashboard instead.
5. Deploy. Render will build and start the app and give you a URL like
   `https://proasa-website.onrender.com`.
6. Run the one-time setup against your **live** database (only needed once,
   and only if you didn't already run it locally against the same Aiven DB):
   `npm run migrate` and `npm run create-admin` can be run locally — they
   connect straight to Aiven, so running them from your own machine also sets
   up the database Render will use. You don't need Render's shell for this.

**Free-tier note:** Render's free web services spin down after ~15 minutes
of no traffic and take 30–60 seconds to wake back up on the next visit.
That's normal and fine for a department site — no code changes needed for it.

There's also a `render.yaml` in this repo if you prefer Render's "Blueprint"
one-click setup instead of the manual steps above.

---

## 6. Day-to-day use

Once deployed, whoever needs to post news or update photos just visits
`https://your-site.onrender.com/admin/login` and logs in with the
admin account you created. No coding needed for any of that — the whole
point of the admin dashboard is that content changes don't require touching
this codebase again.

## Project structure

```
proasa-website/
├── server.js              # app entry point
├── config/                # DB + Cloudinary connections
├── middleware/             # auth guard, file upload handling
├── models/                 # one file per database table
├── routes/                 # public.js (visitors), auth.js (login), admin.js (dashboard)
├── views/                  # EJS templates (+ views/admin for the dashboard)
├── public/css, public/js   # styling and small client-side scripts
├── sql/schema.sql          # database structure
└── scripts/                # one-off setup scripts (migrate, create-admin)
```
