// Applies supabase/schema.sql to the database and ensures the storage bucket
// exists. Idempotent-friendly: ignores "already exists" errors.
import { readFile } from "node:fs/promises";
import pg from "pg";

const env = await readFile(".env.local", "utf8");
const DATABASE_URL = env
  .split("\n")
  .find((l) => l.startsWith("DATABASE_URL="))
  ?.slice("DATABASE_URL=".length)
  .trim();

if (!DATABASE_URL) {
  console.error("DATABASE_URL not set in .env.local");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
await client.connect();
console.log("connected");

const schema = await readFile("supabase/schema.sql", "utf8");

// Run statement-by-statement so one "already exists" doesn't abort the rest.
const statements = schema
  .split(/;\s*(?:\r?\n|$)/)
  .map((s) => s.trim())
  .filter((s) => s && !s.startsWith("--"));

for (const stmt of statements) {
  try {
    await client.query(stmt);
  } catch (e) {
    if (/already exists|duplicate/i.test(e.message)) {
      // fine — idempotent
    } else {
      console.error("FAILED:", stmt.slice(0, 60), "->", e.message);
    }
  }
}

// Private storage bucket for uploaded documents.
await client.query(
  `insert into storage.buckets (id, name, public)
   values ('company-docs', 'company-docs', false)
   on conflict (id) do nothing`
);

const { rows } = await client.query(
  `select count(*)::int as n from registrations`
);
console.log("registrations table ready, rows:", rows[0].n);

const buckets = await client.query(
  `select id from storage.buckets where id = 'company-docs'`
);
console.log("bucket company-docs:", buckets.rowCount ? "exists" : "MISSING");

await client.end();
console.log("done");
