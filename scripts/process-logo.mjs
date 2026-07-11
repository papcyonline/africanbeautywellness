import sharp from "sharp";

const SRC = "C:/Users/papcy/Downloads/logo.png";
const CLEAN = "public/images/logo-clean.png";
const scratch =
  "C:/Users/papcy/AppData/Local/Temp/claude/C--Users-papcy/952709e4-3f12-4420-bbc0-b34b814370b6/scratchpad";

// 1) Key out the grey gradient background. The artwork is black + white
// line-art, so keep very dark and very light pixels, drop the mid-grey.
const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height } = info;
for (let i = 0; i < data.length; i += 4) {
  const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  const darkA =
    lum <= 55 ? 255 : lum >= 95 ? 0 : Math.round((255 * (95 - lum)) / 40);
  const lightA =
    lum >= 230 ? 255 : lum <= 198 ? 0 : Math.round((255 * (lum - 198)) / 32);
  data[i + 3] = Math.max(darkA, lightA);
}

await sharp(data, { raw: { width, height, channels: 4 } })
  .png()
  .trim()
  .toFile(CLEAN);
console.log("wrote", CLEAN);

// 2) Preview on white and on burgundy.
async function preview(bg, outPath) {
  const logo = await sharp(CLEAN).resize({ width: 460 }).toBuffer();
  await sharp({
    create: { width: 1100, height: 620, channels: 4, background: bg },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(outPath);
  console.log("wrote", outPath);
}
await preview({ r: 255, g: 255, b: 255, alpha: 1 }, `${scratch}/logo-on-white.png`);
await preview({ r: 68, g: 2, b: 32, alpha: 1 }, `${scratch}/logo-on-dark.png`);
