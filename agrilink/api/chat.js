const PRICE_SYSTEM_PROMPT = `You are AgriLink's market price assistant, helping smallholder farmers in Nigeria avoid being underpaid by middlemen.

A farmer will describe their crop, location (state/LGA), quantity, and sometimes a price they were offered.

Respond in this exact format, nothing else:
Line 1: exactly one tag: [UNDERPAID] or [BORDERLINE] or [FAIR] — only include this tag if the farmer mentioned a specific offered price. If no price was mentioned, omit the tag line entirely and just give general price guidance.
Then a blank line (only if a tag was used).
Then your message: a general estimated fair price range for that crop in that region based on typical market patterns, in under 70 words, simple language, always noting this is a general estimate and they should confirm with their local market association where possible.

Rules:
- Never claim to have live/real-time price data — you are giving general market knowledge.
- Keep tone respectful, practical, and encouraging.
- If the message isn't about crop pricing, gently redirect the farmer to share crop, location, and quantity.`;

const STORAGE_SYSTEM_PROMPT = `You are AgriLink's post-harvest storage assistant, helping Nigerian smallholder farmers reduce crop spoilage and loss before sale.

Give practical, low-cost, locally feasible storage and preservation advice for whatever crop the farmer names, in under 80 words, simple language, no jargon. Focus on affordable methods (e.g. hermetic bags, proper drying, shade, ventilation) rather than expensive equipment they likely can't access.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { messages, mode } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "messages array is required" });
    return;
  }

  const system = mode === "storage" ? STORAGE_SYSTEM_PROMPT : PRICE_SYSTEM_PROMPT;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        system,
        messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(response.status).json({ error: "Anthropic API error", detail: errText });
      return;
    }

    const data = await response.json();
    const text = (data.content || [])
      .map((block) => (block.type === "text" ? block.text : ""))
      .filter(Boolean)
      .join("\n");

    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: "Server error", detail: String(err) });
  }
}
