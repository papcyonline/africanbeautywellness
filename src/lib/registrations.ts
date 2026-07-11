import { getServiceClient } from "./supabase";
import { SAMPLE, type Registration } from "@/app/admin/sample-data";

// Shape of a row in the `registrations` table (snake_case).
type DbRow = {
  id: string;
  ref: string;
  created_at: string;
  company: string;
  country: string;
  website: string | null;
  contact: string;
  email: string;
  phone: string;
  business_type: string;
  products: string | null;
  manufactures: boolean;
  manufacturing_country: string | null;
  interested_africa: boolean;
  interested_cameroon: boolean;
  african_pct: number;
  ingredients: string | null;
  capacity: string | null;
  company_profile_url: string | null;
  product_catalogue_url: string | null;
  anything_else: string | null;
  tier: Registration["tier"];
  payment: Registration["payment"];
  status: Registration["status"];
};

function fromDb(r: DbRow): Registration {
  return {
    id: r.ref,
    uid: r.id,
    company: r.company,
    country: r.country,
    website: r.website ?? "",
    contact: r.contact,
    email: r.email,
    phone: r.phone,
    businessType: r.business_type,
    products: r.products ?? "",
    manufactures: r.manufactures,
    manufacturingCountry: r.manufacturing_country ?? "",
    interestedAfrica: r.interested_africa,
    interestedCameroon: r.interested_cameroon,
    africanPct: r.african_pct,
    ingredients: r.ingredients ?? "",
    capacity: r.capacity ?? "",
    tier: r.tier,
    payment: r.payment,
    status: r.status,
    submittedAt: (r.created_at ?? "").slice(0, 10),
  };
}

export type NewRegistration = {
  company: string;
  country: string;
  website: string;
  contact: string;
  email: string;
  phone: string;
  businessType: string;
  products: string;
  manufactures: boolean;
  manufacturingCountry: string;
  interestedAfrica: boolean;
  interestedCameroon: boolean;
  africanPct: number;
  ingredients: string;
  capacity: string;
  anythingElse: string;
  tier: Registration["tier"];
  companyProfileUrl: string | null;
  productCatalogueUrl: string | null;
};

/** All registrations, newest first. Falls back to sample data when unconfigured. */
export async function getRegistrations(): Promise<Registration[]> {
  const sb = getServiceClient();
  if (!sb) return SAMPLE;
  const { data, error } = await sb
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) {
    console.error("getRegistrations:", error?.message);
    return SAMPLE;
  }
  return (data as DbRow[]).map(fromDb);
}

/** Insert a new registration. Returns { saved:false } when unconfigured. */
export async function insertRegistration(
  input: NewRegistration
): Promise<{ saved: boolean; ref?: string }> {
  const sb = getServiceClient();
  if (!sb) return { saved: false };
  const { data, error } = await sb
    .from("registrations")
    .insert({
      company: input.company,
      country: input.country,
      website: input.website || null,
      contact: input.contact,
      email: input.email,
      phone: input.phone,
      business_type: input.businessType,
      products: input.products || null,
      manufactures: input.manufactures,
      manufacturing_country: input.manufacturingCountry || null,
      interested_africa: input.interestedAfrica,
      interested_cameroon: input.interestedCameroon,
      african_pct: input.africanPct,
      ingredients: input.ingredients || null,
      capacity: input.capacity || null,
      company_profile_url: input.companyProfileUrl,
      product_catalogue_url: input.productCatalogueUrl,
      anything_else: input.anythingElse || null,
      tier: input.tier,
      payment: input.tier === "featured" ? "pending" : "none",
      status: "pending",
    })
    .select("ref")
    .single();
  if (error || !data) {
    console.error("insertRegistration:", error?.message);
    return { saved: false };
  }
  return { saved: true, ref: data.ref as string };
}

type RegistrationPatch = Partial<
  Pick<
    Registration,
    "company" | "country" | "businessType" | "email" | "tier" | "payment" | "status"
  >
>;

/** Update a registration by its uuid. No-op (false) when unconfigured. */
export async function updateRegistration(
  uid: string | undefined,
  patch: RegistrationPatch
): Promise<boolean> {
  const sb = getServiceClient();
  if (!sb || !uid) return false;
  const { error } = await sb
    .from("registrations")
    .update({
      company: patch.company,
      country: patch.country,
      business_type: patch.businessType,
      email: patch.email,
      tier: patch.tier,
      payment: patch.payment,
      status: patch.status,
    })
    .eq("id", uid);
  if (error) {
    console.error("updateRegistration:", error.message);
    return false;
  }
  return true;
}

/** Upload a document to the private company-docs bucket. Returns its path or null. */
export async function uploadDoc(
  file: File | null,
  prefix: string
): Promise<string | null> {
  const sb = getServiceClient();
  if (!sb || !file || file.size === 0) return null;
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${prefix}/${Date.now()}-${safe}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await sb.storage
    .from("company-docs")
    .upload(path, buffer, { contentType: file.type || undefined, upsert: false });
  if (error) {
    console.error("uploadDoc:", error.message);
    return null;
  }
  return path;
}
