export function wordsToText(words: string[]): string {
  return words.join('\n');
}

export function textToWords(text: string): string[] {
  return text
    .split(/[\n,，]/)
    .map((word) => word.trim())
    .filter(Boolean);
}
