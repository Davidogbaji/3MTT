import React, { useState } from "react";
import { PackageSearch, Send } from "lucide-react";

const TIPS = {
  Maize: "Dry to below 13% moisture before storage. Use hermetic (airtight) bags like PICS bags to block weevils without chemicals. Store off the ground on pallets, away from walls.",
  Tomatoes: "Highly perishable — sell within 2-3 days of harvest where possible. Store in a cool, shaded, ventilated space, not sealed plastic. Avoid stacking too high to prevent bruising.",
  Yam: "Cure yams in a shaded, ventilated area for a few days after harvest to heal cuts. Store in a barn with good airflow, off the ground, away from direct sunlight and moisture.",
  Beans: "Dry thoroughly before storage. Use hermetic bags or airtight containers to prevent weevil infestation. Keep in a cool, dry place away from direct sunlight.",
  Rice: "Dry paddy to about 14% moisture. Store in clean, dry, pest-proof bags off the ground. Avoid storing near strong-smelling substances, rice absorbs odors easily.",
  "Peppers": "Sell quickly — very perishable. If storing briefly, keep cool and ventilated, avoid moisture buildup which causes rot within days.",
};

export default function StorageTips() {
  const [selected, setSelected] = useState("Maize");
  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    const trimmed = question.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setAiAnswer("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: trimmed }], mode: "storage" }),
      });
      const data = await res.json();
      setAiAnswer(data.text || "Sorry, I couldn't answer that right now.");
    } catch (e) {
      setAiAnswer("I couldn't connect just now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "18px 16px 40px" }}>
      <h2 className="display" style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "var(--green-dark)" }}>Storage & Loss Prevention</h2>
      <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4, marginBottom: 18 }}>Reduce spoilage before your produce reaches the buyer</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {Object.keys(TIPS).map((crop) => (
          <button key={crop} onClick={() => setSelected(crop)} style={{
            padding: "8px 14px", borderRadius: 999, border: "1px solid var(--border)", cursor: "pointer",
            background: selected === crop ? "var(--green)" : "var(--card)",
            color: selected === crop ? "#fff" : "var(--ink)", fontSize: 13, fontWeight: 600
          }}>
            {crop}
          </button>
        ))}
      </div>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 18, display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 22 }}>
        <div style={{ background: "var(--green-light)", color: "var(--green-dark)", borderRadius: 12, padding: 10 }}>
          <PackageSearch size={20} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontFamily: "Space Grotesk, sans-serif", marginBottom: 6 }}>{selected}</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-soft)" }}>{TIPS[selected]}</div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Have a different crop or a specific question?</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askAI()}
            placeholder="e.g. How do I store cassava after harvest?"
            style={{ flex: 1, border: "1px solid var(--border)", borderRadius: 12, padding: "12px 14px", fontSize: 14, outline: "none" }}
          />
          <button onClick={askAI} disabled={loading} style={{
            background: "var(--gold-dark)", color: "#fff", border: "none", borderRadius: 12, width: 46,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: loading ? "default" : "pointer", opacity: loading ? 0.6 : 1
          }}>
            <Send size={18} />
          </button>
        </div>
        {loading && <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 10 }}>Thinking...</p>}
        {aiAnswer && (
          <div style={{ background: "var(--green-light)", borderRadius: 12, padding: 14, marginTop: 12, fontSize: 13.5, lineHeight: 1.6, color: "var(--green-dark)" }}>
            {aiAnswer}
          </div>
        )}
      </div>
    </div>
  );
}
