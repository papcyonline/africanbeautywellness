import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";

const env = await readFile(".env.local", "utf8");
const get = (k) =>
  env.split("\n").find((l) => l.startsWith(k + "="))?.slice(k.length + 1).trim();

const sb = createClient(get("SUPABASE_URL"), get("SUPABASE_SERVICE_ROLE_KEY"), {
  auth: { persistSession: false },
});

// 1) Does the table exist / does the key work?
const sel = await sb.from("registrations").select("ref").limit(1);
if (sel.error) {
  console.log("SELECT error:", sel.error.message);
  process.exit(0);
}
console.log("table OK — existing sample rows:", sel.data.length);

// 2) Insert a test row.
const ins = await sb
  .from("registrations")
  .insert({
    company: "__CONNECTION TEST__",
    country: "Cameroon",
    contact: "Test",
    email: "test@example.com",
    phone: "+237000000000",
    business_type: "Skincare",
    tier: "free",
  })
  .select("id, ref")
  .single();
if (ins.error) {
  console.log("INSERT error:", ins.error.message);
  process.exit(0);
}
console.log("inserted:", ins.data.ref);

// 3) Read it back, then clean it up.
const back = await sb
  .from("registrations")
  .select("company, status")
  .eq("id", ins.data.id)
  .single();
console.log("read back:", back.data);

await sb.from("registrations").delete().eq("id", ins.data.id);
console.log("test row deleted — all good");

// 4) Storage bucket present?
const buckets = await sb.storage.listBuckets();
console.log(
  "buckets:",
  (buckets.data || []).map((b) => b.name).join(", ") || "(none)"
);
