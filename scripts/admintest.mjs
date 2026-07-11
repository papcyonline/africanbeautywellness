import puppeteer from "puppeteer-core";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const out = process.argv[2];
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox"],
  defaultViewport: { width: 1440, height: 1000, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
let pageError = null;
page.on("pageerror", (e) => (pageError = e.message));

// Capture CSV downloads to a temp dir.
const dlDir = process.argv[3];
const client = await page.target().createCDPSession();
await client.send("Page.setDownloadBehavior", {
  behavior: "allow",
  downloadPath: dlDir,
});

await page.goto("http://localhost:3100/admin", { waitUntil: "networkidle0" });

// Filter to featured tier via the native setter so React sees it.
await page.evaluate(() => {
  const sel = [...document.querySelectorAll("select")].find((s) =>
    [...s.options].some((o) => o.value === "featured")
  );
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLSelectElement.prototype,
    "value"
  ).set;
  setter.call(sel, "featured");
  sel.dispatchEvent(new Event("change", { bubbles: true }));
});
await new Promise((r) => setTimeout(r, 300));
const shownText = await page.$$eval("*", (els) => {
  const el = els.find((e) => /^\d+ of \d+ shown$/.test(e.textContent?.trim()));
  return el ? el.textContent.trim() : "not found";
});
console.log("after tier=featured filter:", shownText);

// Trigger CSV export.
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) =>
    b.textContent.includes("Export CSV")
  );
  btn.click();
});
await new Promise((r) => setTimeout(r, 600));

// Open the edit drawer on the first row.
await page.click('[title="Edit"]');
await new Promise((r) => setTimeout(r, 400));
const drawerOpen = await page.$$eval("h2", (els) =>
  els.some((e) => e.textContent.includes("Edit registration"))
);
console.log("edit drawer open:", drawerOpen);
console.log("pageError:", pageError ?? "none");

await page.screenshot({ path: out, fullPage: false });
await browser.close();
