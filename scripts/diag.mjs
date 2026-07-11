import puppeteer from "puppeteer-core";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox"],
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
await page.goto("http://localhost:3100/", { waitUntil: "networkidle0" });
await page.evaluate(async () => {
  await new Promise((res) => {
    let y = 0;
    const t = setInterval(() => {
      window.scrollBy(0, 500);
      y += 500;
      if (y >= document.body.scrollHeight) { clearInterval(t); res(); }
    }, 50);
  });
});
await new Promise((r) => setTimeout(r, 1000));
const info = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll("img")].map((im) => {
    const r = im.getBoundingClientRect();
    const cs = getComputedStyle(im);
    return {
      src: im.currentSrc || im.src,
      sizesAttr: im.getAttribute("sizes"),
      srcset: (im.getAttribute("srcset") || "").slice(0, 120),
      complete: im.complete,
      naturalW: im.naturalWidth,
      w: Math.round(r.width),
      h: Math.round(r.height),
      opacity: cs.opacity,
      visibility: cs.visibility,
      display: cs.display,
      objectFit: cs.objectFit,
    };
  });
  return imgs.filter((i) => i.src.includes("people") || i.src.includes("vision"));
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
