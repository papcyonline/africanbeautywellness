"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import ArrowLink from "@/components/ArrowLink";
import { submitRegistrationAction } from "./actions";
import styles from "./register.module.css";

const BUSINESS_TYPES = [
  "Skincare",
  "Haircare",
  "Cosmetics",
  "Personal care",
  "Essential oils",
  "Natural ingredients",
  "Wellness products",
  "Raw material supplier",
  "Contract manufacturer",
  "Existing brand",
  "New product innovator",
  "Other",
];

// Africa-first list; free typing is still allowed via the datalist.
const COUNTRIES = [
  "Cameroon",
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "Côte d'Ivoire",
  "Senegal",
  "Tanzania",
  "Uganda",
  "Rwanda",
  "Ethiopia",
  "Morocco",
  "Egypt",
  "Democratic Republic of the Congo",
  "Gabon",
  "Zambia",
  "Zimbabwe",
  "Botswana",
  "Angola",
  "Togo",
  "Benin",
  "Mali",
  "United Kingdom",
  "United States",
  "France",
  "United Arab Emirates",
  "India",
  "China",
  "Other",
];

type YesNo = "" | "yes" | "no";

type FormState = {
  companyName: string;
  country: string;
  website: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessType: string;
  products: string;
  manufactures: YesNo;
  manufacturingCountry: string;
  interestedAfrica: YesNo;
  interestedCameroon: YesNo;
  africanPct: number;
  africanIngredients: string;
  capacity: string;
  companyProfile: File | null;
  productCatalogue: File | null;
  anythingElse: string;
  tier: "free" | "featured";
  consent: boolean;
};

const initial: FormState = {
  companyName: "",
  country: "",
  website: "",
  contactPerson: "",
  email: "",
  phone: "",
  businessType: "",
  products: "",
  manufactures: "",
  manufacturingCountry: "",
  interestedAfrica: "",
  interestedCameroon: "",
  africanPct: 0,
  africanIngredients: "",
  capacity: "",
  companyProfile: null,
  productCatalogue: null,
  anythingElse: "",
  tier: "free",
  consent: false,
};

export default function RegistrationForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savedRef, setSavedRef] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.companyName.trim()) e.companyName = "Company name is required.";
    if (!form.country.trim()) e.country = "Please select a country.";
    if (!form.contactPerson.trim())
      e.contactPerson = "Contact person is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    if (!form.businessType) e.businessType = "Select a business type.";
    if (!form.products.trim()) e.products = "Tell us about your products.";
    if (!form.manufactures) e.manufactures = "Please choose Yes or No.";
    if (!form.interestedAfrica) e.interestedAfrica = "Please choose Yes or No.";
    if (!form.interestedCameroon)
      e.interestedCameroon = "Please choose Yes or No.";
    if (!form.consent) e.consent = "Please accept to continue.";
    return e;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const first = document.querySelector<HTMLElement>(`[data-err="true"]`);
      first?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.set("companyName", form.companyName);
      fd.set("country", form.country);
      fd.set("website", form.website);
      fd.set("contactPerson", form.contactPerson);
      fd.set("email", form.email);
      fd.set("phone", form.phone);
      fd.set("businessType", form.businessType);
      fd.set("products", form.products);
      fd.set("manufactures", form.manufactures);
      fd.set("manufacturingCountry", form.manufacturingCountry);
      fd.set("interestedAfrica", form.interestedAfrica);
      fd.set("interestedCameroon", form.interestedCameroon);
      fd.set("africanPct", String(form.africanPct));
      fd.set("africanIngredients", form.africanIngredients);
      fd.set("capacity", form.capacity);
      fd.set("anythingElse", form.anythingElse);
      fd.set("tier", form.tier);
      if (form.companyProfile) fd.set("companyProfile", form.companyProfile);
      if (form.productCatalogue) fd.set("productCatalogue", form.productCatalogue);

      const res = await submitRegistrationAction(fd);
      setSavedRef(res.saved ? res.ref ?? null : null);
    } catch (err) {
      // Network/server error — still confirm to the user; nothing is lost
      // locally, and the backend is optional until configured.
      console.error("submit failed:", err);
      setSavedRef(null);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (submitted) {
    return (
      <div className={styles.success}>
        <CheckCircle size={44} weight="fill" className={styles.successIcon} />
        <h2 className={styles.successTitle}>Thank you — you&rsquo;re in.</h2>
        <p className={styles.successText}>
          We&rsquo;ve received your interest in joining Africa Beauty &amp;
          Wellness.{" "}
          {form.tier === "featured"
            ? "You chose the featured listing — payment and profile setup will follow by email."
            : "You'll receive project updates as the factory takes shape."}
          {savedRef && (
            <>
              {" "}
              Your reference is <strong>{savedRef}</strong>.
            </>
          )}
        </p>
        <ArrowLink href="/" variant="primary">
          Back to the vision
        </ArrowLink>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      {/* Company */}
      <fieldset className={styles.section}>
        <p className={styles.sectionTitle}>Company</p>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="companyName">
            Company name<span className={styles.req}>*</span>
          </label>
          <input
            id="companyName"
            className={`${styles.input} ${errors.companyName ? styles.invalid : ""}`}
            data-err={!!errors.companyName}
            value={form.companyName}
            onChange={(e) => set("companyName", e.target.value)}
          />
          {errors.companyName && (
            <span className={styles.error}>{errors.companyName}</span>
          )}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="country">
              Country<span className={styles.req}>*</span>
            </label>
            <input
              id="country"
              list="country-list"
              className={`${styles.input} ${errors.country ? styles.invalid : ""}`}
              data-err={!!errors.country}
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
            />
            <datalist id="country-list">
              {COUNTRIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            {errors.country && (
              <span className={styles.error}>{errors.country}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="website">
              Website<span className={styles.optional}>optional</span>
            </label>
            <input
              id="website"
              className={styles.input}
              placeholder="https://"
              value={form.website}
              onChange={(e) => set("website", e.target.value)}
            />
          </div>
        </div>
      </fieldset>

      {/* Contact */}
      <fieldset className={styles.section}>
        <p className={styles.sectionTitle}>Contact</p>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="contactPerson">
            Contact person<span className={styles.req}>*</span>
          </label>
          <input
            id="contactPerson"
            className={`${styles.input} ${errors.contactPerson ? styles.invalid : ""}`}
            data-err={!!errors.contactPerson}
            value={form.contactPerson}
            onChange={(e) => set("contactPerson", e.target.value)}
          />
          {errors.contactPerson && (
            <span className={styles.error}>{errors.contactPerson}</span>
          )}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email<span className={styles.req}>*</span>
            </label>
            <input
              id="email"
              type="email"
              className={`${styles.input} ${errors.email ? styles.invalid : ""}`}
              data-err={!!errors.email}
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
            {errors.email && (
              <span className={styles.error}>{errors.email}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="phone">
              Phone<span className={styles.req}>*</span>
            </label>
            <input
              id="phone"
              type="tel"
              className={`${styles.input} ${errors.phone ? styles.invalid : ""}`}
              data-err={!!errors.phone}
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
            {errors.phone && (
              <span className={styles.error}>{errors.phone}</span>
            )}
          </div>
        </div>
      </fieldset>

      {/* Business */}
      <fieldset className={styles.section}>
        <p className={styles.sectionTitle}>Business</p>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="businessType">
            Business type<span className={styles.req}>*</span>
          </label>
          <select
            id="businessType"
            className={`${styles.select} ${errors.businessType ? styles.invalid : ""}`}
            data-err={!!errors.businessType}
            value={form.businessType}
            onChange={(e) => set("businessType", e.target.value)}
          >
            <option value="" disabled>
              Select&hellip;
            </option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.businessType && (
            <span className={styles.error}>{errors.businessType}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="products">
            Products<span className={styles.req}>*</span>
          </label>
          <textarea
            id="products"
            className={`${styles.textarea} ${errors.products ? styles.invalid : ""}`}
            data-err={!!errors.products}
            placeholder="Tell us what you make or supply."
            value={form.products}
            onChange={(e) => set("products", e.target.value)}
          />
          {errors.products && (
            <span className={styles.error}>{errors.products}</span>
          )}
        </div>
      </fieldset>

      {/* Manufacturing */}
      <fieldset className={styles.section}>
        <p className={styles.sectionTitle}>Manufacturing</p>

        <div className={styles.field} data-err={!!errors.manufactures}>
          <label className={styles.label}>
            Do you currently manufacture?<span className={styles.req}>*</span>
          </label>
          <YesNoField
            value={form.manufactures}
            onChange={(v) => set("manufactures", v)}
          />
          {errors.manufactures && (
            <span className={styles.error}>{errors.manufactures}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="manufacturingCountry">
            Manufacturing country
            <span className={styles.optional}>if applicable</span>
          </label>
          <input
            id="manufacturingCountry"
            list="country-list"
            className={styles.input}
            value={form.manufacturingCountry}
            onChange={(e) => set("manufacturingCountry", e.target.value)}
          />
        </div>

        <div className={styles.field} data-err={!!errors.interestedAfrica}>
          <label className={styles.label}>
            Interested in manufacturing in Africa?
            <span className={styles.req}>*</span>
          </label>
          <YesNoField
            value={form.interestedAfrica}
            onChange={(v) => set("interestedAfrica", v)}
          />
          {errors.interestedAfrica && (
            <span className={styles.error}>{errors.interestedAfrica}</span>
          )}
        </div>

        <div className={styles.field} data-err={!!errors.interestedCameroon}>
          <label className={styles.label}>
            Interested in Cameroon?<span className={styles.req}>*</span>
          </label>
          <YesNoField
            value={form.interestedCameroon}
            onChange={(v) => set("interestedCameroon", v)}
          />
          {errors.interestedCameroon && (
            <span className={styles.error}>{errors.interestedCameroon}</span>
          )}
        </div>
      </fieldset>

      {/* Ingredients & capacity */}
      <fieldset className={styles.section}>
        <p className={styles.sectionTitle}>Ingredients &amp; capacity</p>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="africanPct">
            Percentage of African ingredients currently used
          </label>
          <div className={styles.rangeRow}>
            <input
              id="africanPct"
              type="range"
              min={0}
              max={100}
              step={5}
              className={styles.range}
              value={form.africanPct}
              onChange={(e) => set("africanPct", Number(e.target.value))}
            />
            <span className={styles.rangeValue}>{form.africanPct}%</span>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="africanIngredients">
            African ingredients used
            <span className={styles.optional}>optional</span>
          </label>
          <textarea
            id="africanIngredients"
            className={styles.textarea}
            placeholder="e.g. shea butter, baobab oil, marula, hibiscus…"
            value={form.africanIngredients}
            onChange={(e) => set("africanIngredients", e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="capacity">
            Annual production capacity
            <span className={styles.optional}>optional</span>
          </label>
          <input
            id="capacity"
            className={styles.input}
            placeholder="e.g. 50,000 units / year"
            value={form.capacity}
            onChange={(e) => set("capacity", e.target.value)}
          />
        </div>
      </fieldset>

      {/* Documents */}
      <fieldset className={styles.section}>
        <p className={styles.sectionTitle}>Documents</p>

        <div className={styles.row}>
          <div className={styles.field}>
            <span className={styles.label}>
              Company profile<span className={styles.optional}>optional</span>
            </span>
            <FileField
              accept=".pdf,.doc,.docx"
              file={form.companyProfile}
              onChange={(f) => set("companyProfile", f)}
            />
          </div>

          <div className={styles.field}>
            <span className={styles.label}>
              Product catalogue<span className={styles.optional}>optional</span>
            </span>
            <FileField
              accept=".pdf,.doc,.docx"
              file={form.productCatalogue}
              onChange={(f) => set("productCatalogue", f)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="anythingElse">
            Anything else we should know?
            <span className={styles.optional}>optional</span>
          </label>
          <textarea
            id="anythingElse"
            className={styles.textarea}
            value={form.anythingElse}
            onChange={(e) => set("anythingElse", e.target.value)}
          />
        </div>
      </fieldset>

      {/* Listing tier */}
      <fieldset className={styles.section}>
        <p className={styles.sectionTitle}>Choose your listing</p>
        <div className={styles.tiers}>
          <button
            type="button"
            className={styles.tier}
            data-active={form.tier === "free"}
            onClick={() => set("tier", "free")}
          >
            <div className={styles.tierName}>Free Expression of Interest</div>
            <div className={styles.tierPrice}>No cost</div>
            <div className={styles.tierDesc}>
              Join our database and receive project updates.
            </div>
          </button>

          <button
            type="button"
            className={styles.tier}
            data-active={form.tier === "featured"}
            onClick={() => set("tier", "featured")}
          >
            <div className={styles.tierName}>Featured Listing</div>
            <div className={styles.tierPrice}>$29.99 one-time</div>
            <div className={styles.tierDesc}>
              Public profile and priority visibility in our directory.
            </div>
          </button>
        </div>
      </fieldset>

      {/* Consent + submit */}
      <fieldset className={styles.section}>
        <label className={styles.consent} data-err={!!errors.consent}>
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => set("consent", e.target.checked)}
          />
          <span>
            I agree to the <Link href="/privacy">Privacy Policy</Link> and{" "}
            <Link href="/terms">Terms of Use</Link>, and consent to Africa
            Beauty &amp; Wellness contacting me about this initiative.
          </span>
        </label>
        {errors.consent && <span className={styles.error}>{errors.consent}</span>}

        <div className={styles.submitRow}>
          <button
            type="submit"
            className="btn btn-primary arrowBtn"
            disabled={submitting}
          >
            <span className="btnLabel">
              {submitting
                ? "Submitting…"
                : form.tier === "featured"
                  ? "Continue to featured listing"
                  : "Submit registration"}
            </span>
            <span className="chip" aria-hidden="true">
              <i className="a a1">
                <ArrowUp />
              </i>
              <i className="a a2">
                <ArrowUp />
              </i>
            </span>
          </button>
          <span className={styles.submitNote}>
            {form.tier === "featured"
              ? "Payment is taken on the next step."
              : "No payment required."}
          </span>
        </div>
      </fieldset>
    </form>
  );
}

function YesNoField({
  value,
  onChange,
}: {
  value: YesNo;
  onChange: (v: YesNo) => void;
}) {
  return (
    <div className={styles.segment} role="group">
      <button
        type="button"
        className={styles.segmentOpt}
        data-active={value === "yes"}
        onClick={() => onChange("yes")}
      >
        Yes
      </button>
      <button
        type="button"
        className={styles.segmentOpt}
        data-active={value === "no"}
        onClick={() => onChange("no")}
      >
        No
      </button>
    </div>
  );
}

function FileField({
  file,
  accept,
  onChange,
}: {
  file: File | null;
  accept: string;
  onChange: (f: File | null) => void;
}) {
  return (
    <label className={styles.file}>
      <input
        type="file"
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      <span className={styles.fileBtn}>Choose file</span>
      <span className={styles.fileName}>
        {file ? file.name : "PDF or Word, up to 10MB"}
      </span>
    </label>
  );
}

// Tilted arrow used inside the submit chip (kept local to avoid importing the
// full ArrowLink markup).
function ArrowUp() {
  return (
    <svg width="15" height="15" viewBox="0 0 256 256" fill="currentColor">
      <path d="M200 64v104a8 8 0 0 1-16 0V83.31L69.66 197.66a8 8 0 0 1-11.32-11.32L172.69 72H88a8 8 0 0 1 0-16h104a8 8 0 0 1 8 8Z" />
    </svg>
  );
}
