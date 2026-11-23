import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One Emoji, One Smile — exactly one emoji, nothing else, written to /output/entry.txt.
// The judge compares two emojis at a time and picks the warmer of the pair.
//
// Emoji choice, reconsidered: 😊 is the classic gentle smile, and 🤗 (hugging face)
// is warm and inviting — but 🥰 wins the pair: a smiling face whose hearts make the
// warmth explicit rather than implied, and it is a single code point (U+1F970), so
// there is no ZWJ/keycap ambiguity in what the judge receives. A stranger sees a
// smile with love in it — that is the warmest single character available.
const emoji = "🥰";

// Hard guard: fail loudly instead of submitting anything that is not exactly one emoji.
// Intl.Segmenter counts grapheme clusters, so a multi-code-point emoji (ZWJ, skin tone,
// variation selector) still counts as one — but anything else must fail.
const segments = [...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(emoji)];
if (segments.length !== 1) {
  throw new Error(`Entry must be exactly one emoji, got ${segments.length} grapheme(s).`);
}
if (!/\p{Extended_Pictographic}/u.test(emoji)) {
  throw new Error("Entry must be an emoji character.");
}
// No letters, digits, punctuation or whitespace may sneak in — a keycap like "1️⃣"
// is one grapheme but is not a pure emoji, and it must be rejected too.
if (/[\p{L}\p{N}\p{P}\s]/u.test(emoji)) {
  throw new Error("Entry must contain only the emoji, no other characters.");
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), emoji + "\n", "utf8");
console.log("Wrote entry.txt, emoji:", emoji);
