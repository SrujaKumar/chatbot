
/**
 * Normalize text by converting to lowercase and removing punctuation.
 * @param text - Input text to normalize
 * @returns Normalized text
 */
const normalize = (text: string): string =>
  text.toLowerCase().replace(/[!?.,']/g, "").trim();

/**
 * Check if normalized text matches any of the provided patterns.
 * Patterns can match as exact words, at the start, or within the text.
 * @param normalizedText - Normalized text to check
 * @param patterns - Array of patterns to match against
 * @returns True if any pattern matches
 */
const matchesAnyPattern = (normalizedText: string, patterns: string[]): boolean =>
  patterns.some(pattern => 
    normalizedText === pattern || 
    normalizedText.startsWith(pattern + " ") || 
    normalizedText.includes(" " + pattern)
  );

/**
 * Generate a bot reply based on user input.
 * Uses pattern matching to detect common greetings and phrases.
 * Falls back to echoing the user's message if no pattern matches.
 * @param text - User's input text
 * @returns Bot's reply text
 */
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
