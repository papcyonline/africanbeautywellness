import puppeteer from "puppeteer-core";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const out = process.argv[2];
const PW = process.argv[3];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox"],
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
});
const page = await browser.newPage();

// 1) /admin should redirect to the login page.
await page.goto("http://localhost:3100/admin", { waitUntil: "networkidle0" });
console.log("after /admin, url:", page.url());

// 2) wrong password -> error.
await page.type("#password", "wrong-password");
await page.click('button[type="submit"]');
await new Promise((r) => setTimeout(r, 800));
const err = await page.$$eval("*", (els) =>
  els.some((e) => e.textContent?.trim() === "Incorrect password.")
);
console.log("wrong password error shown:", err);

// 3) correct password -> dashboard.
await page.$eval("#password", (el) => (el.value = ""));
await page.type("#password", PW);
await Promise.all([
  page.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {}),
  page.click('button[type="submit"]'),
]);
await new Promise((r) => setTimeout(r, 800));
console.log("after login, url:", page.url());
const onDash = await page.$$eval("h1", (els) =>
  els.some((e) => e.textContent.includes("Registrations"))
);
console.log("dashboard reached:", onDash);
await page.screenshot({ path: out });

// 4) sign out -> back to login.
await page.evaluate(() => {
  const b = [...document.querySelectorAll("button")].find(
    (x) => x.textContent.trim() === "Sign out"
  );
  b?.click();
});
await new Promise((r) => setTimeout(r, 1000));
console.log("after sign out, url:", page.url());

await browser.close();
