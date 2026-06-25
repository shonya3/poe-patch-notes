import { describe, it, expect } from "vitest";
import { parseForumDate } from "./parser";

describe("parseForumDate", () => {
  describe("en", () => {
    it("parses standard format", () => {
      expect(parseForumDate("en", "Jun 1, 2026, 12:47:06 PM")).toBe("2026-06-01T12:47:06.000Z");
    });

    it("parses with leading comma-space prefix", () => {
      expect(parseForumDate("en", ", May 8, 2024, 4:37:26 PM")).toBe("2024-05-08T16:37:26.000Z");
    });

    it("parses midnight AM", () => {
      expect(parseForumDate("en", "Jan 1, 2025, 12:00:00 AM")).toBe("2025-01-01T00:00:00.000Z");
    });

    it("parses noon PM", () => {
      expect(parseForumDate("en", "Dec 31, 2024, 12:00:00 PM")).toBe("2024-12-31T12:00:00.000Z");
    });

    it("parses single-digit day and hour", () => {
      expect(parseForumDate("en", "Mar 5, 2023, 9:05:03 AM")).toBe("2023-03-05T09:05:03.000Z");
    });

    it("parses February in non-leap year", () => {
      expect(parseForumDate("en", "Feb 28, 2023, 1:00:00 PM")).toBe("2023-02-28T13:00:00.000Z");
    });

    it("parses February 29 in leap year", () => {
      expect(parseForumDate("en", "Feb 29, 2024, 1:00:00 PM")).toBe("2024-02-29T13:00:00.000Z");
    });

    it("returns empty for invalid month", () => {
      expect(parseForumDate("en", "Xxx 1, 2024, 1:00:00 PM")).toBe("");
    });

    it("returns empty for garbage string", () => {
      expect(parseForumDate("en", "not a date")).toBe("");
    });
  });

  describe("ru", () => {
    it("parses standard format with мая", () => {
      expect(parseForumDate("ru", "31 мая 2026 г., 10:22:41")).toBe("2026-05-31T10:22:41.000Z");
    });

    it("parses with марта (мар. abbreviated)", () => {
      expect(parseForumDate("ru", "26 мар. 2024 г., 5:10:44")).toBe("2024-03-26T05:10:44.000Z");
    });

    it("parses with leading comma-space prefix", () => {
      expect(parseForumDate("ru", ", 31 мая 2026 г., 10:22:41")).toBe("2026-05-31T10:22:41.000Z");
    });

    it("parses single-digit day and hour", () => {
      expect(parseForumDate("ru", "1 янв. 2025 г., 9:05:03")).toBe("2025-01-01T09:05:03.000Z");
    });

    it("parses all months", () => {
      const months = [
        "янв.",
        "февр.",
        "мар.",
        "апр.",
        "мая",
        "июн.",
        "июл.",
        "авг.",
        "сент.",
        "окт.",
        "нояб.",
        "дек.",
      ];
      for (let i = 0; i < months.length; i++) {
        const got = parseForumDate("ru", `15 ${months[i]} 2025 г., 0:00:00`);
        expect(got).toBe(`2025-${String(i + 1).padStart(2, "0")}-15T00:00:00.000Z`);
      }
    });

    it("returns empty for garbage string", () => {
      expect(parseForumDate("ru", "не дата")).toBe("");
    });
  });
});
