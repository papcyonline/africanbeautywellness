import crypto from "node:crypto";
import { appendFileSync, readFileSync } from "node:fs";

const existing = readFileSync(".env.local", "utf8");
if (existing.includes("ADMIN_PASSWORD=")) {
  console.log("ADMIN_PASSWORD already set — leaving as is.");
  process.exit(0);
}

const pw = "Abw-" + crypto.randomBytes(6).toString("base64url");
const secret = crypto.randomBytes(32).toString("hex");
appendFileSync(
  ".env.local",
  `\n# Admin portal login\nADMIN_PASSWORD=${pw}\nADMIN_SESSION_SECRET=${secret}\n`
);
console.log("GENERATED ADMIN PASSWORD: " + pw);
