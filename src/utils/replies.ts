
const normalize = (text: string): string =>
  text.toLowerCase().replace(/[!?.,']/g, "").trim();

const matchesAnyPattern = (normalizedText: string, patterns: string[]): boolean =>
  patterns.some(pattern => 
    normalizedText === pattern || 
    normalizedText.startsWith(pattern + " ") || 
    normalizedText.includes(" " + pattern)
  );

export function getReplyForText(text: string): string {
  const normalized = normalize(text);

  if (matchesAnyPattern(normalized, ["hi", "hey", "hello", "sup", "what s up", "whats up"])) {
    return "Hello How are you doing?";
  }

  if (matchesAnyPattern(normalized, ["how are you", "how r u", "how are u", "how r you", "how you"])) {
    return "I'm a demo bot — I'm doing well. How can I help you today?";
  }

  if (matchesAnyPattern(normalized, ["thanks", "thank you", "thx", "ty"])) {
    return "You're welcome! Anything else I can do?";
  }

  if (matchesAnyPattern(normalized, ["bye", "goodbye", "see ya", "see you"])) {
    return "Goodbye — take care!";
  }

  // Fallback: Echo back the user's message
  return text;
}
