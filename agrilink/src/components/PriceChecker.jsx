import React, { useState, useRef, useEffect } from "react";
import { Send, Gauge } from "lucide-react";

const FAIRNESS = {
  UNDERPAID: { label: "You're being underpaid", color: "var(--red)", bg: "var(--red-bg)" },
  BORDERLINE: { label: "Borderline — you can negotiate", color: "var(--amber)", bg: "var(--amber-bg)" },
  FAIR: { label: "That's a fair offer", color: "var(--green-ok)", bg: "var(--green-ok-bg)" },
};

function FairnessBadge({ level }) {
  const s = FAIRNESS[level];
  if (!s) return null;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: s.bg, color: s.color, padding: "5px 12px", borderRadius: 999, fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
      <Gauge size={13} /> {s.label}
    </div>
  );
}

export default function PriceChecker() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Tell me your crop, your state, and roughly how much you're selling. If someone already offered you a price, tell me that too and I'll check if it's fair.", level: null },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const parseReply = (text) => {
    const match = text.match(/^\[(UNDERPAID|BORDERLINE|FAIR)\]\s*/i);
    if (match) return { level: match[1].toUpperCase(), text: text.slice(match[0].length).trim() };
    return { level: null, text: text.trim() };
  };

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    const nextMessages = [...messages, { role: "user", text: trimmed, level: null }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    try {
      const apiMessages = nextMessages
        .filter((m) => !(m.role === "assistant" && m.text.startsWith("Tell me your crop")))
        .map((m) => ({ role: m.role, content: m.text }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, mode: "price" }),
      });
      const data = await res.json();
      const parsed = parseReply(data.text || "Sorry, I couldn't check that just now. Please try again.");
      setMessages((prev) => [...prev, { role: "assistant", text: parsed.text, level: parsed.level }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", text: "I couldn't connect just now. Please try again in a moment.", level: null }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 150px)", padding: "0 4px" }}>
      <div style={{ padding: "18px 16px 10px" }}>
        <h2 className="display" style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "var(--green-dark)" }}>Price Checker</h2>
        <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4 }}>AI market guidance — a second opinion before you sell</p>
      </div>
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "0 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "82%", background: m.role === "user" ? "var(--green)" : "var(--card)",
              color: m.role === "user" ? "#fff" : "var(--ink)", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              padding: "12px 14px", border: m.role === "user" ? "none" : "1px solid var(--border)"
            }}>
              {m.level && <FairnessBadge level={m.level} />}
              <div style={{ fontSize: 14, lineHeight: 1.55, display: "block" }}>{m.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px 16px 16px 4px", padding: "14px 16px", color: "var(--ink-soft)", fontSize: 13 }}>
              Checking market data...
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: 14, borderTop: "1px solid var(--border)", background: "var(--card)", display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="e.g. Maize in Kaduna, 50 bags, offered ₦18,000/bag"
          style={{ flex: 1, border: "1px solid var(--border)", borderRadius: 12, padding: "12px 14px", fontSize: 14, outline: "none" }}
        />
        <button onClick={send} disabled={loading} style={{
          background: "var(--green)", color: "#fff", border: "none", borderRadius: 12, width: 46,
          display: "flex", alignItems: "center", justifyContent: "center", cursor: loading ? "default" : "pointer", opacity: loading ? 0.6 : 1
        }}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
