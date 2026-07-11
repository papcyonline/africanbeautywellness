import sharp from "sharp";
import potrace from "potrace";
import { writeFile } from "node:fs/promises";

const SRC = "C:/Users/papcy/Downloads/logo.png";
const scratch =
  "C:/Users/papcy/AppData/Local/Temp/claude/C--Users-papcy/952709e4-3f12-4420-bbc0-b34b814370b6/scratchpad";

// 1) Crop to just the emblem (Africa + mortar + leaf), excluding the text,
//    then threshold to clean black/white and upscale for a smoother trace.
const meta = await sharp(SRC).metadata();
console.log("source:", meta.width, "x", meta.height);

const crop = {
  left: Math.round(meta.width * 0.26),
  top: Math.round(meta.height * 0.14),
  width: Math.round(meta.width * 0.5),
  height: Math.round(meta.height * 0.42),
};

const bw = await sharp(SRC)
  .extract(crop)
  .greyscale()
  .threshold(95)
  .resize({ width: 1200 })
  .png()
  .toBuffer();
await writeFile(`${scratch}/emblem-bw.png`, bw);

// 2) Trace the black silhouette (white outlines become negative-space holes).
const svg = await new Promise((resolve, reject) => {
  potrace.trace(
    bw,
    { threshold: 128, turdSize: 40, optCurve: true, alphaMax: 1, color: "#000" },
    (err, out) => (err ? reject(err) : resolve(out))
  );
});

// Pull the viewBox/size and path data out of potrace's SVG.
const wh = svg.match(/width="(\d+)" height="(\d+)"/);
const vbW = wh ? wh[1] : 1200;
const vbH = wh ? wh[2] : 1200;
const paths = [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]);
console.log("traced paths:", paths.length, "viewBox", vbW, vbH);

const emblem = (fill) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbW} ${vbH}" fill="${fill}">` +
  paths.map((d) => `<path d="${d}"/>`).join("") +
  `</svg>`;

// currentColor version for the app; explicit-colour versions for preview.
await writeFile("public/emblem.svg", emblem("currentColor"));
await writeFile(`${scratch}/emblem-dark.svg`, emblem("#1a1a1a"));
await writeFile(`${scratch}/emblem-light.svg`, emblem("#f2f2f0"));

// 3) Rasterise previews on white and burgundy.
async function preview(svgPath, bg, out) {
  const logo = await sharp(svgPath).resize({ width: 320 }).toBuffer();
  await sharp({
    create: { width: 760, height: 520, channels: 4, background: bg },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(out);
}
await preview(
  `${scratch}/emblem-dark.svg`,
  { r: 255, g: 255, b: 255, alpha: 1 },
  `${scratch}/emblem-on-white.png`
);
await preview(
  `${scratch}/emblem-light.svg`,
  { r: 68, g: 2, b: 32, alpha: 1 },
  `${scratch}/emblem-on-dark.png`
);
console.log("done");
