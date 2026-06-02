# AGENT-REBUILD — aday.net.au

Rebuild this project from scratch. Read this file before writing code. Preserve all Non-negotiables.

This is a **from-scratch rebuild runbook** for the portfolio site (Cloudflare Pages).

## Rebuild from scratch

### Prerequisites

- Node.js 20+ for `scripts/build-media-data.mjs` and asset pipelines
- Static hosting via Cloudflare Pages (`wrangler.toml` present)
- Vault note for design intent: `PROJECT-aday-net-au-redesign-sources-and-reasoning.md`

### Path A (recommended): clone

    git clone https://github.com/aday1/aday-net-au.git
    cd aday-net-au

### Path B: empty directory

Create:

    aday-net-au/
      public/
        index.html
        style.css
        crt-microbee.css
        crt-microbee.js
        app.js
        about.html
        projects.html
        media.html
        data/                 # JSON catalogs
      src/index.js            # optional build entry
      scripts/build-media-data.mjs
      wrangler.toml
      .github/workflows/deploy.yml

### Phased rebuild

| Phase | What to build | Done when |
| --- | --- | --- |
| 0 | `public/index.html` shell + `style.css` CRT palette | Home renders locally |
| 1 | `public/app.js` nav + section routing between pages | Links open about/projects/media |
| 2 | `crt-microbee.js` + `crt-cuton.css` effects per redesign | CRT aesthetic visible (not generic template) |
| 3 | `scripts/build-media-data.mjs` -> `public/data/*.json` | Media archive loads from JSON |
| 4 | `public/data/weeklybeats_tracks.json` for blog sibling | Blog build can copy weeklybeats file |
| 5 | Top nav links: blog, keys, Macroverse, ArtBastard URLs | All hrefs resolve to live hosts |
| 6 | `deploy.yml` + `wrangler.toml`; push `main` | https://aday.net.au returns 200 |

**MVP:** phases 0-2 (home + CRT identity).

### Local preview

    npx serve public -l 8080

Or run any build script from `package.json` / README before serve.

## Canonical paths

| Field | Value |
| --- | --- |
| GitHub | https://github.com/aday1/aday-net-au |
| Local | `YomikosPapers/temp_/cloudflare_pages_repos/aday-net-au` |
| Vault | `09-network-homelab/PROJECT-aday-net-au-redesign-sources-and-reasoning.md` |

## Non-negotiables

| Item | Requirement |
| --- | --- |
| Role | Portfolio / ops hub for aday.net.au properties |
| Style | CRT / retro web aesthetic (do not genericize without ask) |
| Deploy | Cloudflare Pages on push `main` |
| URL | https://aday.net.au |

## Deploy

Push `main` -> GitHub Actions -> verify https://aday.net.au

DNS: `sync-cloudflare-dns.yml` may need `CLOUDFLARE_DNS_API_TOKEN`.

## Smoke gates

- Home 200
- Nav links to blog, keys, major projects work
- No broken relative media paths

## Anti-patterns

- No emoji in source
- Do not remove high-priority property links without redesign sign-off
