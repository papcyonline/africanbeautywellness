// Fetch several candidate images per section from Pexels and build a contact
// sheet (montage) for each so we can pick the most on-theme one.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import sharp from "sharp";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const scratch =
  "C:/Users/papcy/AppData/Local/Temp/claude/C--Users-papcy/952709e4-3f12-4420-bbc0-b34b814370b6/scratchpad";

const env = await readFile(path.join(root, ".env.local"), "utf8");
const KEY = env
  .split("\n")
  .find((l) => l.startsWith("PEXELS_API_KEY="))
  ?.split("=")[1]
  ?.trim();

const SLOTS = [
  { name: "hero", query: "african woman beauty glowing skin", orientation: "landscape" },
  { name: "vision", query: "cosmetics cream production laboratory", orientation: "" },
  { name: "who", query: "skincare cosmetic products collection", orientation: "" },
  { name: "why", query: "african entrepreneurs business team", orientation: "" },
  { name: "options", query: "luxury skincare products display", orientation: "" },
];

await mkdir(path.join(scratch, "cands"), { recursive: true });
const manifest = {};

for (const slot of SLOTS) {
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", slot.query);
  if (slot.orientation) url.searchParams.set("orientation", slot.orientation);
  url.searchParams.set("per_page", "6");
  url.searchParams.set("size", "large");
  const res = await fetch(url, { headers: { Authorization: KEY } });
  const data = await res.json();
  const photos = (data.photos || []).slice(0, 6);

  const thumbs = [];
  manifest[slot.name] = [];
  for (const p of photos) {
    const imgRes = await fetch(p.src.medium || p.src.large);
    const buf = Buffer.from(await imgRes.arrayBuffer());
    const thumb = await sharp(buf).resize(340, 250, { fit: "cover" }).jpeg().toBuffer();
    thumbs.push(thumb);
    manifest[slot.name].push({
      dl: p.src.large2x,
      photographer: p.photographer,
      source: p.url,
    });
  }

  const gap = 6;
  const W = thumbs.length * 340 + (thumbs.length - 1) * gap;
  await sharp({
    create: { width: W, height: 250, channels: 3, background: { r: 245, g: 245, b: 243 } },
  })
    .composite(thumbs.map((input, i) => ({ input, left: i * (340 + gap), top: 0 })))
    .png()
    .toFile(path.join(scratch, `cands/${slot.name}.png`));
  console.log(`${slot.name}: ${thumbs.length} candidates`);
}

await writeFile(
  path.join(scratch, "cands/manifest.json"),
  JSON.stringify(manifest, null, 2)
);
console.log("done");
