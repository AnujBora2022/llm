function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found");
  return match[0];
}

export function literalMention(text, brand) {
  return text.toLowerCase().includes(brand.toLowerCase());
}


