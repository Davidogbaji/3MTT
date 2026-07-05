import React from "react";
import { TrendingUp, Store, PackageSearch, ArrowRight, Gauge } from "lucide-react";

const CARDS = [
  { key: "price", icon: TrendingUp, title: "Check a fair price", desc: "Know what your crop is really worth before you sell", color: "var(--green)" },
  { key: "market", icon: Store, title: "Post to the marketplace", desc: "Reach buyers directly — skip the middleman", color: "var(--gold-dark)" },
  { key: "storage", icon: PackageSearch, title: "Storage & loss prevention", desc: "Simple tips to stop produce spoiling before sale", color: "var(--green-dark)" },
];

export default function Home({ go }) {
  return (
    <div>
      <section style={{ padding: "36px 20px 28px", background: `linear-gradient(135deg, var(--green), var(--green-dark))`, color: "#fff", borderRadius: "0 0 28px 28px" }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.14)", padding: "5px 12px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, marginBottom: 14 }}>
            <Gauge size={14} /> Fair-price tools for farmers
          </div>
          <h1 className="display" style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 700, lineHeight: 1.25, margin: 0 }}>
            Sell what you grow for what it's actually worth.
          </h1>
          <p style={{ fontSize: 15, color: "#DCE9D9", marginTop: 12, lineHeight: 1.6 }}>
            Nigeria has 35 million people facing food insecurity, yet farmers are routinely underpaid by
            middlemen who control price information. AgriLink closes that gap with AI-backed price
            guidance and direct buyer connections.
          </p>
        </div>
      </section>

      <section style={{ padding: "24px 20px", display: "grid", gap: 14, gridTemplateColumns: "1fr" }}>
        <style>{`
          @media (min-width: 640px) {
            .card-grid { grid-template-columns: repeat(3, 1fr) !important; }
          }
        `}</style>
        <div className="card-grid" style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr" }}>
          {CARDS.map((c) => (
            <button key={c.key} onClick={() => go(c.key)} style={{
              textAlign: "left", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16,
              padding: 18, cursor: "pointer", display: "flex", flexDirection: "column", gap: 10
            }}>
              <div style={{ background: "var(--green-light)", color: c.color, width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <c.icon size={20} />
              </div>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 16 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.5 }}>{c.desc}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: c.color, fontSize: 13, fontWeight: 600, marginTop: 4 }}>
                Open <ArrowRight size={14} />
              </div>
            </button>
          ))}
        </div>
      </section>

      <section style={{ padding: "0 20px 32px" }}>
        <div style={{ background: "var(--green-light)", borderRadius: 16, padding: "18px 20px", fontSize: 13, color: "var(--green-dark)", lineHeight: 1.6 }}>
          AI price guidance gives general market estimates, not live exchange data. Always confirm with
          your local market association where possible — use AgriLink as a second opinion, not the final word.
        </div>
      </section>
    </div>
  );
}
