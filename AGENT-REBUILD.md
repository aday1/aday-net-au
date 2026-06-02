# AGENT-REBUILD — aday.net.au

Rebuild this project from scratch. Read this file before writing code. Preserve all Non-negotiables.

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
| Style | CRT / retro web aesthetic per redesign note (do not genericize without ask) |
| Deploy | Cloudflare Pages on push `main` |
| URL | https://aday.net.au |

## Build and run

Follow repo README and any `package.json` scripts. Validate key routes locally before push.

Sibling checkout: deploy workflow may reference other Pages repos — see homelab deploy log for CF sibling checkout fixes.

## Deploy

Push `main` -> GitHub Actions (Cloudflare deploy workflow) -> verify https://aday.net.au

DNS automation: `sync-cloudflare-dns.yml` may need `CLOUDFLARE_DNS_API_TOKEN` (vault homelab notes).

## File map

Anchor paths vary by redesign branch; after rebuild document:

- Entry HTML / JS bundle
- Media deck assets
- Links to blog, keys, Macroverse, ArtBastard

## Smoke gates

- Home 200
- Top nav links to blog.aday.net.au, keys.aday.net.au, major projects
- No broken relative media paths

## Future planning (vault)

- Hosting consolidation to new Linode (`PROJECT-Hosting-Consolidation.md`)
- Poster / timeline cross-links from Website-Wishlist-TODO

## Anti-patterns

- No emoji in source
- Do not remove high-priority property links without redesign sign-off
