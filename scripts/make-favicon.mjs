import { readFile, writeFile } from "node:fs/promises";

const svg = await readFile("public/emblem.svg", "utf8");
const vb = svg.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/);
const W = parseFloat(vb[1]);
const H = parseFloat(vb[2]);
const paths = [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]);

// Fit the emblem into a padded 100x100 burgundy tile.
const inner = 74;
const scale = inner / Math.max(W, H);
const offX = (100 - W * scale) / 2;
const offY = (100 - H * scale) / 2;

const icon =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
  `<rect width="100" height="100" rx="22" fill="#440220"/>` +
  `<g transform="translate(${offX.toFixed(2)} ${offY.toFixed(2)}) scale(${scale.toFixed(
    5
  )})" fill="#f2f2f0">` +
  paths.map((d) => `<path d="${d}"/>`).join("") +
  `</g></svg>`;

await writeFile("src/app/icon.svg", icon + "\n");
console.log("wrote src/app/icon.svg");
