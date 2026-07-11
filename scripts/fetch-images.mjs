// One-off image fetcher. Pulls curated, on-brand imagery from Pexels into
// /public/images and records attribution. Run with: node scripts/fetch-images.mjs
// The API key is read from .env.local and never shipped to the browser.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

// Load PEXELS_API_KEY from .env.local without extra deps.
const env = await readFile(path.join(root, ".env.local"), "utf8");
const KEY = env
  .split("\n")
  .find((l) => l.startsWith("PEXELS_API_KEY="))
  ?.split("=")[1]
  ?.trim();

if (!KEY) {
  console.error("PEXELS_API_KEY not found in .env.local");
  process.exit(1);
}

// name -> Pexels search. Landscape, restrained, on-brand for an African
// beauty & wellness manufacturing platform.
const WANTED = [
  { name: "hero", query: "black woman beauty skin portrait", orientation: "landscape" },
  { name: "vision", query: "cosmetics factory production line", orientation: "portrait" },
  { name: "who", query: "natural skincare ingredients herbs", orientation: "portrait" },
  { name: "why", query: "confident african businesswoman smiling", orientation: "portrait" },
  { name: "options", query: "cosmetic serum bottle dark background", orientation: "portrait" },
  { name: "botanical", query: "green botanical leaves nature", orientation: "landscape" },
];

const outDir = path.join(root, "public", "images");
await mkdir(outDir, { recursive: true });

const attribution = [];

for (const item of WANTED) {
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", item.query);
  url.searchParams.set("orientation", item.orientation);
  url.searchParams.set("per_page", "10");
  url.searchParams.set("size", "large");

  const res = await fetch(url, { headers: { Authorization: KEY } });
  if (!res.ok) {
    console.error(`  ${item.name}: API error ${res.status}`);
    continue;
  }
  const data = await res.json();
  const photo = (data.photos || []).find((p) => p.width >= 1200);
  if (!photo) {
    console.error(`  ${item.name}: no suitable photo`);
    continue;
  }

  const dl = item.orientation === "portrait" ? photo.src.portrait : photo.src.large2x;
  const imgRes = await fetch(dl);
  const dest = path.join(outDir, `${item.name}.jpg`);
  await pipeline(Readable.fromWeb(imgRes.body), createWriteStream(dest));

  attribution.push({
    file: `images/${item.name}.jpg`,
    photographer: photo.photographer,
    photographer_url: photo.photographer_url,
    source: photo.url,
  });
  console.log(`  ${item.name}: ${photo.photographer} -> public/images/${item.name}.jpg`);
}

await writeFile(
  path.join(outDir, "attribution.json"),
  JSON.stringify(attribution, null, 2) + "\n"
);
console.log("Done. Attribution written to public/images/attribution.json");
