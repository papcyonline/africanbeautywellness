"use client";

import { useMemo, useState } from "react";
import {
  Check,
  X,
  PencilSimple,
  DownloadSimple,
  MagnifyingGlass,
} from "@phosphor-icons/react/dist/ssr";
import { type Registration, type Status } from "./sample-data";
import { updateRegistrationAction } from "./actions";
import { logoutAction } from "./login/actions";
import styles from "./admin.module.css";

const uniq = (arr: string[]) => Array.from(new Set(arr)).sort();

export default function AdminDashboard({
  initial,
  live = false,
}: {
  initial: Registration[];
  live?: boolean;
}) {
  const [rows, setRows] = useState<Registration[]>(initial);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [type, setType] = useState("all");
  const [mfg, setMfg] = useState("all");
  const [tier, setTier] = useState("all");
  const [status, setStatus] = useState("all");
  const [ingredient, setIngredient] = useState("");
  const [editing, setEditing] = useState<Registration | null>(null);

  const countries = useMemo(() => uniq(rows.map((r) => r.country)), [rows]);
  const types = useMemo(() => uniq(rows.map((r) => r.businessType)), [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const ing = ingredient.trim().toLowerCase();
    return rows.filter((r) => {
      if (
        q &&
        !(
          r.company.toLowerCase().includes(q) ||
          r.contact.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
        )
      )
        return false;
      if (country !== "all" && r.country !== country) return false;
      if (type !== "all" && r.businessType !== type) return false;
      if (mfg !== "all" && r.manufactures !== (mfg === "yes")) return false;
      if (tier !== "all" && r.tier !== tier) return false;
      if (status !== "all" && r.status !== status) return false;
      if (ing && !r.ingredients.toLowerCase().includes(ing)) return false;
      return true;
    });
  }, [rows, search, country, type, mfg, tier, status, ingredient]);

  const stats = useMemo(() => {
    return {
      total: rows.length,
      pending: rows.filter((r) => r.status === "pending").length,
      approved: rows.filter((r) => r.status === "approved").length,
      featured: rows.filter((r) => r.tier === "featured").length,
      paid: rows.filter((r) => r.payment === "paid").length,
    };
  }, [rows]);

  const setRowStatus = (id: string, s: Status) => {
    const row = rows.find((r) => r.id === id);
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: s } : r)));
    void updateRegistrationAction(row?.uid, { status: s });
  };

  const saveEdit = (updated: Registration) => {
    setRows((rs) => rs.map((r) => (r.id === updated.id ? updated : r)));
    setEditing(null);
    void updateRegistrationAction(updated.uid, {
      company: updated.company,
      country: updated.country,
      businessType: updated.businessType,
      email: updated.email,
      tier: updated.tier,
      payment: updated.payment,
      status: updated.status,
    });
  };

  const resetFilters = () => {
    setSearch("");
    setCountry("all");
    setType("all");
    setMfg("all");
    setTier("all");
    setStatus("all");
    setIngredient("");
  };

  const exportCsv = () => {
    const cols: [keyof Registration, string][] = [
      ["id", "ID"],
      ["company", "Company"],
      ["country", "Country"],
      ["website", "Website"],
      ["contact", "Contact"],
      ["email", "Email"],
      ["phone", "Phone"],
      ["businessType", "Business type"],
      ["products", "Products"],
      ["manufactures", "Manufactures"],
      ["manufacturingCountry", "Manufacturing country"],
      ["interestedAfrica", "Interested in Africa"],
      ["interestedCameroon", "Interested in Cameroon"],
      ["africanPct", "African ingredients %"],
      ["ingredients", "African ingredients"],
      ["capacity", "Annual capacity"],
      ["tier", "Tier"],
      ["payment", "Payment"],
      ["status", "Status"],
      ["submittedAt", "Submitted"],
    ];
    const cell = (v: unknown) => {
      let s: string;
      if (typeof v === "boolean") s = v ? "Yes" : "No";
      else s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [
      cols.map((c) => c[1]).join(","),
      ...filtered.map((r) => cols.map((c) => cell(r[c[0]])).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "africa-bw-registrations.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.page}>
      <header className={styles.bar}>
        <div className={styles.barInner}>
          <span className={styles.brand}>
            <span className={styles.emblem} aria-hidden="true" />
            Africa Beauty &amp; Wellness{" "}
            <span className={styles.barTag}>Admin</span>
          </span>
          <div className={styles.barRight}>
            <span className={styles.barNote}>
              {live
                ? "Live — connected to the database"
                : "Preview — sample data, not yet connected to the database"}
            </span>
            <form action={logoutAction}>
              <button type="submit" className={styles.signout}>
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.head}>
          <div>
            <h1 className={styles.title}>Registrations</h1>
            <p className={styles.sub}>
              {filtered.length} of {rows.length} shown
            </p>
          </div>
          <button className={styles.export} onClick={exportCsv}>
            <DownloadSimple size={17} weight="bold" />
            Export CSV
          </button>
        </div>

        <div className={styles.stats}>
          <Stat label="Total" value={stats.total} />
          <Stat label="Pending" value={stats.pending} />
          <Stat label="Approved" value={stats.approved} />
          <Stat label="Featured" value={stats.featured} />
          <Stat label="Paid" value={stats.paid} />
        </div>

        <div className={styles.filters}>
          <div className={styles.searchWrap}>
            <MagnifyingGlass size={16} className={styles.searchIcon} />
            <input
              className={styles.search}
              placeholder="Search company, contact, email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className={styles.filter}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="all">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className={styles.filter}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="all">All business types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            className={styles.filter}
            value={mfg}
            onChange={(e) => setMfg(e.target.value)}
          >
            <option value="all">Manufacturing: any</option>
            <option value="yes">Manufactures</option>
            <option value="no">Does not</option>
          </select>
          <select
            className={styles.filter}
            value={tier}
            onChange={(e) => setTier(e.target.value)}
          >
            <option value="all">All tiers</option>
            <option value="featured">Featured</option>
            <option value="free">Free</option>
          </select>
          <select
            className={styles.filter}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <input
            className={styles.filterInput}
            placeholder="Ingredient…"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
          />
          <button className={styles.reset} onClick={resetFilters}>
            Reset
          </button>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Company</th>
                <th>Country</th>
                <th>Type</th>
                <th>Mfg</th>
                <th>African</th>
                <th>Tier</th>
                <th>Payment</th>
                <th>Status</th>
                <th className={styles.actionsHead}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className={styles.company}>{r.company}</div>
                    <div className={styles.meta}>
                      {r.id} · {r.contact}
                    </div>
                  </td>
                  <td>{r.country}</td>
                  <td>{r.businessType}</td>
                  <td>{r.manufactures ? "Yes" : "No"}</td>
                  <td>{r.africanPct}%</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        r.tier === "featured" ? styles.tierFeatured : styles.tierFree
                      }`}
                    >
                      {r.tier === "featured" ? "Featured" : "Free"}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles["pay_" + r.payment]}`}>
                      {r.payment === "none" ? "—" : r.payment}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles["st_" + r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.iconBtn}
                        title="Approve"
                        data-on={r.status === "approved"}
                        data-kind="approve"
                        onClick={() => setRowStatus(r.id, "approved")}
                      >
                        <Check size={16} weight="bold" />
                      </button>
                      <button
                        className={styles.iconBtn}
                        title="Reject"
                        data-on={r.status === "rejected"}
                        data-kind="reject"
                        onClick={() => setRowStatus(r.id, "rejected")}
                      >
                        <X size={16} weight="bold" />
                      </button>
                      <button
                        className={styles.iconBtn}
                        title="Edit"
                        onClick={() => setEditing(r)}
                      >
                        <PencilSimple size={16} weight="bold" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className={styles.empty}>
                    No registrations match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {editing && (
        <EditDrawer
          record={editing}
          onClose={() => setEditing(null)}
          onSave={saveEdit}
        />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.stat}>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

function EditDrawer({
  record,
  onClose,
  onSave,
}: {
  record: Registration;
  onClose: () => void;
  onSave: (r: Registration) => void;
}) {
  const [draft, setDraft] = useState<Registration>(record);
  const set = <K extends keyof Registration>(k: K, v: Registration[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.drawerHead}>
          <h2 className={styles.drawerTitle}>Edit registration</h2>
          <button className={styles.iconBtn} onClick={onClose} title="Close">
            <X size={18} weight="bold" />
          </button>
        </div>
        <p className={styles.drawerId}>{draft.id}</p>

        <label className={styles.dLabel}>Company</label>
        <input
          className={styles.dInput}
          value={draft.company}
          onChange={(e) => set("company", e.target.value)}
        />

        <div className={styles.dRow}>
          <div>
            <label className={styles.dLabel}>Country</label>
            <input
              className={styles.dInput}
              value={draft.country}
              onChange={(e) => set("country", e.target.value)}
            />
          </div>
          <div>
            <label className={styles.dLabel}>Business type</label>
            <input
              className={styles.dInput}
              value={draft.businessType}
              onChange={(e) => set("businessType", e.target.value)}
            />
          </div>
        </div>

        <label className={styles.dLabel}>Contact email</label>
        <input
          className={styles.dInput}
          value={draft.email}
          onChange={(e) => set("email", e.target.value)}
        />

        <div className={styles.dRow}>
          <div>
            <label className={styles.dLabel}>Tier</label>
            <select
              className={styles.dInput}
              value={draft.tier}
              onChange={(e) =>
                set("tier", e.target.value as Registration["tier"])
              }
            >
              <option value="free">Free</option>
              <option value="featured">Featured</option>
            </select>
          </div>
          <div>
            <label className={styles.dLabel}>Payment</label>
            <select
              className={styles.dInput}
              value={draft.payment}
              onChange={(e) =>
                set("payment", e.target.value as Registration["payment"])
              }
            >
              <option value="none">None</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        <label className={styles.dLabel}>Status</label>
        <select
          className={styles.dInput}
          value={draft.status}
          onChange={(e) =>
            set("status", e.target.value as Registration["status"])
          }
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <div className={styles.drawerActions}>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={() => onSave(draft)}>
            Save changes
          </button>
        </div>
      </aside>
    </div>
  );
}
