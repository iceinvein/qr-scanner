import type { ContentParser, ParsedContent, TextData } from "../types/parsers";

/**
 * Text Parser
 * Parses plain text content
 */
export class TextParser implements ContentParser<TextData> {
	parse(rawData: string): ParsedContent<TextData> {
		try {
			const content = rawData.trim();
			const lines = content.split("\n");
			const words = content.split(/\s+/).filter((w) => w.length > 0);

			// Detect language (basic detection)
			const language = this.detectLanguage(content);

			const data: TextData = {
				content,
				language,
				wordCount: words.length,
				lineCount: lines.length,
			};

			return { success: true, data };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Failed to parse text",
			};
		}
	}

	private detectLanguage(text: string): string {
		// Basic language detection based on character sets
		if (/[\u4e00-\u9fa5]/.test(text)) return "Chinese";
		if (/[\u0400-\u04FF]/.test(text)) return "Cyrillic";
		if (/[\u0600-\u06FF]/.test(text)) return "Arabic";
		if (/[\u0590-\u05FF]/.test(text)) return "Hebrew";
		if (/[\u0E00-\u0E7F]/.test(text)) return "Thai";
		if (/[\u3040-\u309F]/.test(text)) return "Japanese (Hiragana)";
		if (/[\u30A0-\u30FF]/.test(text)) return "Japanese (Katakana)";
		if (/[\uAC00-\uD7AF]/.test(text)) return "Korean";

		// Default to English/Latin
		return "Latin";
	}
}
