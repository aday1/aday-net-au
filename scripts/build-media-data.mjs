import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(root, "..");
const blogRoot = path.resolve(repoRoot, "..", "blog.aday.net.au");
const blogScripts = path.join(blogRoot, "scripts");
const dataDir = path.join(repoRoot, "public", "data");

fs.mkdirSync(dataDir, { recursive: true });

const wbOut = path.join(dataDir, "weeklybeats_tracks.json");
const ytOut = path.join(dataDir, "youtube-catalog.json");
const blogDataDir = path.join(blogRoot, "public", "data");

const { writeWeeklybeatsCatalog } = await import(path.join(blogScripts, "weeklybeats-catalog.mjs"));
const { writeYoutubeCatalog } = await import(path.join(blogScripts, "youtube-catalog.mjs"));

await writeWeeklybeatsCatalog(wbOut, { seedPath: wbOut, enrich: process.env.WB_SKIP_ENRICH !== "1" });
writeYoutubeCatalog(ytOut);

fs.mkdirSync(blogDataDir, { recursive: true });
fs.copyFileSync(wbOut, path.join(blogDataDir, "weeklybeats_tracks.json"));
fs.copyFileSync(ytOut, path.join(blogDataDir, "youtube-catalog.json"));

console.log("build-media-data: done");
