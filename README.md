# BCO Courses

**Learn. Prepare. Take Your Next Opportunity.**

BCO Courses is a standalone course discovery and affiliate platform within the
[Bridge Collective Opportunities](https://www.bridgecollectiveopport.org/) (BCO) ecosystem.

> **BCO Opportunities** → find the opportunity
> **BCO Courses** → build the skills
> **You** → take action

The platform is fully independent from the main BCO website — the only connection is links
between the two. Suggested production URL:
`https://courses.bridgecollectiveopport.org/` (changeable via one env var).

---

## Features

- **Homepage** — hero, search, categories, featured courses, opportunity sections, free courses,
  learning topics
- **Course catalogue** `/courses` — search + filters (category, level, price, certificate,
  duration, format, provider) with pagination
- **Individual course pages** `/courses/[slug]` — dynamic, SEO-optimized, with info panel,
  What You'll Learn, Who It's For, Why BCO Recommends It, related courses
- **Category SEO pages** `/courses/category/[slug]`
- **Free courses** `/courses/free`
- **Learning paths** `/learning-paths`
- **Affiliate system** — `/go/[slug]` tracked redirect (course, timestamp, referrer, user-agent),
  affiliate URLs stored only in the database, disclosure near every CTA
- **Analytics** — course views, affiliate clicks, CTR, top courses/categories/providers
  (clicks ≠ confirmed sales, and it never claims otherwise)
- **Admin dashboard** `/admin` — course CRUD, publish/feature toggles, categories, providers
  (with private commission notes), analytics, env-based settings
- **SEO** — metadata, canonical URLs, Open Graph, JSON-LD Course structured data, sitemap.xml,
  robots.txt, breadcrumbs, internal linking
- **Honesty rules baked in** — no fake ratings (field optional, never invented), popular section
  falls back to "recently updated" until real engagement data exists, unknown fields are hidden
  rather than fabricated

## Tech Stack

| Layer      | Choice                                   |
| ---------- | ---------------------------------------- |
| Framework  | Next.js 15 (App Router) + React 19       |
| Language   | TypeScript (strict)                      |
| Styling    | Tailwind CSS v4 with BCO brand tokens    |
| Database   | PostgreSQL via Prisma ORM                |
| Auth       | Env-based admin + HMAC-signed session    |
| Validation | Zod (all admin writes)                   |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#    then set DATABASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD, AUTH_SECRET

# 3. Create the database schema
npx prisma migrate dev --name init
#    (or: npm run db:push for a quick start without migration files)

# 4. Seed sample courses (optional — recommended for previewing)
npm run db:seed

# 5. Run
npm run dev      # development
npm run build && npm start   # production
```

Open http://localhost:3000 for the site and http://localhost:3000/admin for the dashboard.

## Environment Variables

| Variable              | Purpose                                                    |
| --------------------- | ---------------------------------------------------------- |
| `DATABASE_URL`        | PostgreSQL connection string                               |
| `ADMIN_USERNAME`      | Admin login username                                       |
| `ADMIN_PASSWORD`      | Admin login password (or `ADMIN_PASSWORD_HASH` for bcrypt) |
| `AUTH_SECRET`         | Long random string used to sign admin sessions             |
| `NEXT_PUBLIC_SITE_URL`| Public base URL for canonicals/sitemap (optional)          |

## Deployment Checklist

1. Provision PostgreSQL (Neon, Supabase, RDS…) and set `DATABASE_URL`
2. `npx prisma migrate deploy` — then optionally `npm run db:seed`
3. Set strong `ADMIN_USERNAME` / `ADMIN_PASSWORD` / `AUTH_SECRET`
4. Set `NEXT_PUBLIC_SITE_URL` to the final domain
5. Replace seeded sample courses with real courses + verified affiliate URLs in `/admin`
6. Add the **Courses** button on the main BCO website linking to this platform

## Key Routes

| Route                     | Purpose                              |
| ------------------------- | ------------------------------------ |
| `/`                       | Homepage                             |
| `/courses`                | Catalogue with search + filters      |
| `/courses/[slug]`         | Course landing page                  |
| `/courses/category/[slug]`| Category SEO page                    |
| `/courses/free`           | Free courses                         |
| `/learning-paths`         | Guided course paths                  |
| `/go/[slug]`              | Tracked affiliate redirect           |
| `/admin`                  | Dashboard (protected)                |
| `/api/track/view`         | View tracking endpoint               |

## Brand Notes

- Deep blue → primary/navigation/headings · Teal → secondary/categories · Gold → CTAs only
- Course info shown only when known — "Last Verified" dates keep listings honest
- Affiliate disclosure appears near every CTA and in the footer
