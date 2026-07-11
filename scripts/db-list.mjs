import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";

const env = await readFile(".env.local", "utf8");
const get = (k) =>
  env.split("\n").find((l) => l.startsWith(k + "="))?.slice(k.length + 1).trim();
const sb = createClient(get("SUPABASE_URL"), get("SUPABASE_SERVICE_ROLE_KEY"), {
  auth: { persistSession: false },
});

const mode = process.argv[2];

if (mode === "clean") {
  const { error } = await sb
    .from("registrations")
    .delete()
    .in("company", ["Baobab Naturals Ltd", "__CONNECTION TEST__"]);
  console.log(error ? "clean error: " + error.message : "test rows cleaned");
} else {
  const { data, error } = await sb
    .from("registrations")
    .select("ref, company, country, business_type, tier, status, created_at")
    .order("created_at", { ascending: false });
  if (error) console.log("error:", error.message);
  else {
    console.log("rows:", data.length);
    for (const r of data)
      console.log(` ${r.ref}  ${r.company}  (${r.country}, ${r.business_type}, ${r.tier}, ${r.status})`);
  }
}
