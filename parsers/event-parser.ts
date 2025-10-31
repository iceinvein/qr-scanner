import { parse, parseISO } from "date-fns";
import type { ContentParser, EventData, ParsedContent } from "../types";

export class EventParser implements ContentParser<EventData> {
	parse(rawData: string): ParsedContent<EventData> {
		try {
			
			// Handle BEGIN:VCALENDAR wrapper, BEGIN:VEVENT, and VEVENT: formats
			let content = rawData;
			if (content.startsWith("BEGIN:VCALENDAR") || content.startsWith("BEGIN:VEVENT")) {
				content = this.extractVEventContent(content);
			} else if (content.startsWith("VEVENT:")) {
				content = content.substring(7); // Remove 'VEVENT:' prefix
			} else {
				return {
					success: false,
					error:
						"Invalid event format: must start with BEGIN:VCALENDAR, BEGIN:VEVENT, or VEVENT:",
				};
			}

			const fields = this.parseICalFields(content);

			// Validate required fields
			if (!fields.SUMMARY && !fields.DESCRIPTION) {
				return {
					success: false,
					error: "Missing required field: SUMMARY or DESCRIPTION",
				};
			}

			if (!fields.DTSTART) {
				return {
					success: false,
					error: "Missing required field: DTSTART",
				};
			}

			const startDate = this.parseICalDate(fields.DTSTART);
			if (!startDate) {
				return {
					success: false,
					error: "Invalid start date format",
				};
			}

			let endDate: Date | undefined;
			if (fields.DTEND) {
				const parsedEndDate = this.parseICalDate(fields.DTEND);
				endDate = parsedEndDate || undefined;
			}
			const allDay = this.isAllDayEvent(fields.DTSTART);

			return {
				success: true,
				data: {
					title: fields.SUMMARY || fields.DESCRIPTION || "Untitled Event",
					startDate,
					endDate,
					location: fields.LOCATION,
					description: fields.DESCRIPTION,
					allDay,
				},
			};
		} catch (error) {
			return {
				success: false,
				error: `Failed to parse event data: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	private extractVEventContent(rawData: string): string {
		const lines = rawData.split(/\r?\n/);
		const eventLines: string[] = [];
		let inEvent = false;

		for (const line of lines) {
			// Skip VCALENDAR wrapper lines
			if (line === "BEGIN:VCALENDAR" || line === "END:VCALENDAR" || line.startsWith("VERSION:")) {
				continue;
			}
			
			if (line === "BEGIN:VEVENT") {
				inEvent = true;
				continue;
			}
			if (line === "END:VEVENT") {
				break;
			}
			if (inEvent) {
				eventLines.push(line);
			}
		}

		return eventLines.join("\n");
	}

	private parseICalFields(content: string): Record<string, string> {
		const fields: Record<string, string> = {};
		const lines = content.split(/\r?\n/);

		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];

			// Handle line folding (continuation lines start with space or tab)
			while (i + 1 < lines.length && /^[ \t]/.test(lines[i + 1])) {
				line += lines[i + 1].substring(1);
				i++;
			}

			const colonIndex = line.indexOf(":");
			if (colonIndex > 0) {
				const key = line.substring(0, colonIndex).split(";")[0]; // Remove parameters
				const value = line.substring(colonIndex + 1);
				fields[key] = value;
			}
		}

		return fields;
	}

	private parseICalDate(dateString: string): Date | null {
		try {
			// Remove timezone identifier if present (e.g., TZID=America/New_York:)
			const cleanDate = dateString.split(":").pop() || dateString;
			

			// iCalendar date formats:
			// YYYYMMDD (date only)
			// YYYYMMDDTHHmmss (local time)
			// YYYYMMDDTHHmmssZ (UTC time)

			if (cleanDate.includes("T")) {
				// Date with time
				const isUTC = cleanDate.endsWith("Z");
				const dateTimePart = cleanDate.replace("Z", "");

				if (dateTimePart.length === 15) {
					// YYYYMMDDTHHmmss or YYYYMMDDTHHmmssZ
					if (isUTC) {
						// Parse as UTC: convert to ISO format for proper UTC parsing
						// 20251031T124000Z -> 2025-10-31T12:40:00Z
						const isoFormat = `${dateTimePart.substring(0, 4)}-${dateTimePart.substring(4, 6)}-${dateTimePart.substring(6, 8)}T${dateTimePart.substring(9, 11)}:${dateTimePart.substring(11, 13)}:${dateTimePart.substring(13, 15)}Z`;
						return new Date(isoFormat);
					}
					// Parse as local time
					const parsed = parse(dateTimePart, "yyyyMMdd'T'HHmmss", new Date());
					return parsed;
				}
			} else {
				// Date only
				if (cleanDate.length === 8) {
					// YYYYMMDD
					const parsed = parse(cleanDate, "yyyyMMdd", new Date());
					return parsed;
				}
			}

			// Fallback to ISO parsing
			return parseISO(cleanDate);
		} catch (error) {
			console.error("[EventParser] Error parsing date:", error);
			return null;
		}
	}

	private isAllDayEvent(dateString: string): boolean {
		// All-day events don't have a time component (no 'T' in the date string)
		const cleanDate = dateString.split(":").pop() || dateString;
		return !cleanDate.includes("T");
	}
}
