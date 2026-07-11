import { readFile, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const scratch =
  "C:/Users/papcy/AppData/Local/Temp/claude/C--Users-papcy/952709e4-3f12-4420-bbc0-b34b814370b6/scratchpad";

const manifest = JSON.parse(
  await readFile(path.join(scratch, "cands/manifest.json"), "utf8")
);

// Chosen candidate index per section.
const PICKS = { hero: 2, vision: 0, who: 2, why: 2, options: 4 };

const attribution = [];
for (const [name, idx] of Object.entries(PICKS)) {
  const pick = manifest[name][idx];
  const res = await fetch(pick.dl);
  const dest = path.join(root, "public", "images", `${name}.jpg`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  attribution.push({
    file: `images/${name}.jpg`,
    photographer: pick.photographer,
    source: pick.source,
  });
  console.log(`${name}: ${pick.photographer} -> public/images/${name}.jpg`);
}

await writeFile(
  path.join(root, "public", "images", "attribution.json"),
  JSON.stringify(attribution, null, 2) + "\n"
);
console.log("done");
