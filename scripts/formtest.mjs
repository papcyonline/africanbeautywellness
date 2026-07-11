import puppeteer from "puppeteer-core";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const out = process.argv[2];
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox"],
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
await page.goto("http://localhost:3100/register", { waitUntil: "networkidle0" });

// 1) Submit empty -> expect validation errors.
await page.click('button[type="submit"]');
await new Promise((r) => setTimeout(r, 500));
const errorCount = await page.$$eval("[class*='error']", (els) =>
  els.filter((e) => e.textContent && e.textContent.trim().length > 0).length
);
console.log("validation errors shown:", errorCount);

// 2) Fill required fields and submit -> expect success panel.
await page.type("#companyName", "Baobab Naturals Ltd");
await page.type("#country", "Cameroon");
await page.type("#contactPerson", "Amara Nkeng");
await page.type("#email", "amara@baobab.example");
await page.type("#phone", "+237 6 00 00 00 00");
await page.select("#businessType", "Skincare");
await page.type("#products", "Shea-based skincare and body butters.");
// Yes/No + consent are custom buttons/checkbox
await page.evaluate(() => {
  const yesButtons = [...document.querySelectorAll("button")].filter(
    (b) => b.textContent.trim() === "Yes"
  );
  yesButtons.forEach((b) => b.click());
  document.querySelector('input[type="checkbox"]').click();
});
await new Promise((r) => setTimeout(r, 200));
await page.click('button[type="submit"]');
await new Promise((r) => setTimeout(r, 700));
const success = await page.$$eval("h2", (els) =>
  els.some((e) => e.textContent.includes("you"))
);
console.log("success panel shown:", success);
await page.screenshot({ path: out, fullPage: false });
await browser.close();
