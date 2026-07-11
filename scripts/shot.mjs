// Precise screenshots via puppeteer-core driving the installed Chrome.
// Usage: node scripts/shot.mjs <url> <outfile> <width> [height] [full]
import puppeteer from "puppeteer-core";

const [url, outfile, wArg, hArg, full, selector, hoverSel] =
  process.argv.slice(2);
const width = Number(wArg) || 1440;
const height = Number(hArg) || 900;

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--hide-scrollbars"],
  defaultViewport: { width, height, deviceScaleFactor: 2 },
});
const page = await browser.newPage();
await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

// Scroll through the page to trigger lazy-loaded images, then return to top.
await page.evaluate(async () => {
  await new Promise((resolve) => {
    let y = 0;
    const step = 400;
    const timer = setInterval(() => {
      window.scrollBy(0, step);
      y += step;
      if (y >= document.body.scrollHeight) {
        clearInterval(timer);
        window.scrollTo(0, 0);
        resolve();
      }
    }, 60);
  });
});
await new Promise((r) => setTimeout(r, 800));

if (selector) {
  await page.evaluate((sel) => {
    document.querySelector(sel)?.scrollIntoView({ block: "start" });
  }, selector);
  await new Promise((r) => setTimeout(r, 1800));
}

if (hoverSel) {
  await page.hover(hoverSel);
  await new Promise((r) => setTimeout(r, 550));
}

await page.screenshot({ path: outfile, fullPage: full === "full" });

// Report the real layout viewport + whether the doc overflows horizontally.
const metrics = await page.evaluate(() => ({
  innerWidth: window.innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
}));
console.log(JSON.stringify(metrics));

await browser.close();
