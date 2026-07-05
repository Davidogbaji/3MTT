import React, { useState, useEffect } from "react";
import { Plus, Trash2, MapPin, Phone, Wheat } from "lucide-react";

const STORAGE_KEY = "agrilink-listings";

export default function Marketplace() {
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState({ crop: "", quantity: "", location: "", contact: "" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setListings(raw ? JSON.parse(raw) : []);
    } catch (e) {
      setListings([]);
    }
  }, []);

  const persist = (list) => {
    setListings(list);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {}
  };

  const addListing = () => {
    if (!form.crop.trim() || !form.location.trim() || !form.contact.trim()) return;
    const list = [{ id: Date.now(), ...form }, ...listings];
    persist(list);
    setForm({ crop: "", quantity: "", location: "", contact: "" });
  };

  const removeListing = (id) => persist(listings.filter((l) => l.id !== id));

  return (
    <div style={{ padding: "18px 16px 40px" }}>
      <h2 className="display" style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "var(--green-dark)" }}>Marketplace</h2>
      <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4, marginBottom: 18 }}>Post your produce — reach buyers directly, no middleman</p>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <input placeholder="Crop (e.g. Maize)" value={form.crop}
            onChange={(e) => setForm({ ...form, crop: e.target.value })}
            style={inputStyle} />
          <input placeholder="Quantity (e.g. 50 bags)" value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            style={inputStyle} />
        </div>
        <input placeholder="Location (e.g. Kaduna, Igabi LGA)" value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          style={inputStyle} />
        <input placeholder="Contact (phone number)" value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          style={inputStyle} />
        <button onClick={addListing} style={{
          background: "var(--gold-dark)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 14px",
          fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 14, display: "flex",
          alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer"
        }}>
          <Plus size={17} /> Post listing
        </button>
      </div>

      {listings.length === 0 && (
        <p style={{ textAlign: "center", color: "var(--ink-soft)", fontSize: 13.5, marginTop: 30 }}>No listings yet. Post your first one above.</p>
      )}

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr" }}>
        <style>{`@media (min-width: 640px) { .listing-grid { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>
        <div className="listing-grid" style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr" }}>
          {listings.map((l) => (
            <div key={l.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ background: "var(--green-light)", color: "var(--green-dark)", borderRadius: 10, padding: 8 }}>
                    <Wheat size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "Space Grotesk, sans-serif" }}>{l.crop}</div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{l.quantity}</div>
                  </div>
                </div>
                <button onClick={() => removeListing(l.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)", padding: 4 }}>
                  <Trash2 size={16} />
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, color: "var(--ink-soft)", fontSize: 12.5 }}>
                <MapPin size={13} /> {l.location}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, color: "var(--ink-soft)", fontSize: 12.5 }}>
                <Phone size={13} /> {l.contact}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const inputStyle = { border: "1px solid var(--border)", borderRadius: 10, padding: "11px 13px", fontSize: 14, outline: "none", width: "100%" };
