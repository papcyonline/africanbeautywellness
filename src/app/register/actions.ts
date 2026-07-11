"use server";

import { insertRegistration, uploadDoc } from "@/lib/registrations";

// Receives the registration as FormData (so file uploads come through), stores
// any documents, and inserts the row. Returns { saved:false } until Supabase
// is configured, so the form still confirms to the user in the meantime.
export async function submitRegistrationAction(
  formData: FormData
): Promise<{ saved: boolean; ref?: string }> {
  const s = (key: string) => ((formData.get(key) as string) ?? "").trim();
  const file = (key: string) => {
    const f = formData.get(key);
    return f instanceof File ? f : null;
  };

  const [companyProfileUrl, productCatalogueUrl] = await Promise.all([
    uploadDoc(file("companyProfile"), "profiles"),
    uploadDoc(file("productCatalogue"), "catalogues"),
  ]);

  return insertRegistration({
    company: s("companyName"),
    country: s("country"),
    website: s("website"),
    contact: s("contactPerson"),
    email: s("email"),
    phone: s("phone"),
    businessType: s("businessType"),
    products: s("products"),
    manufactures: s("manufactures") === "yes",
    manufacturingCountry: s("manufacturingCountry"),
    interestedAfrica: s("interestedAfrica") === "yes",
    interestedCameroon: s("interestedCameroon") === "yes",
    africanPct: Number(s("africanPct")) || 0,
    ingredients: s("africanIngredients"),
    capacity: s("capacity"),
    anythingElse: s("anythingElse"),
    tier: s("tier") === "featured" ? "featured" : "free",
    companyProfileUrl,
    productCatalogueUrl,
  });
}
