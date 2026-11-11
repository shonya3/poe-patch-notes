import { describe, it, expect } from "vitest";
import { cleanThreadHtml, parseForumDate } from "./parser";

describe("cleanThreadHtml", () => {
  function tocHrefs(html: string): Record<string, string> {
    const hrefs: Record<string, string> = {};
    for (const m of html.matchAll(/<a href="(#[^"]*)">([^<]*)<\/a>/g)) hrefs[m[2]] = m[1];
    return hrefs;
  }

  it("maps table of contents links by target instead of position", () => {
    const raw = `
      <table><tr class="newsPost"><td><div class="content"><div id="top" class="lbox-container">
        <div class="box-content">
          <h2>Content Update 3.30.0 — Path of Exile: Covens of Umbra</h2>
          <h3>Table of Contents</h3>
          <ul>
            <li><a href="#alphachanges">Alpha Changes</a></li>
            <li><a href="#betachanges">Beta Changes</a></li>
          </ul>
          <h3>Alpha Changes</h3>
          <p>Alpha body</p>
          <h3>Unlisted Subheading</h3>
          <p>Unlisted body</p>
          <h3>Beta Changes</h3>
          <p>Beta body</p>
        </div>
      </div></div></td></tr></table>`;
    const { html, toc } = cleanThreadHtml(raw);
    expect(toc.map((t) => t.id)).toEqual([
      "contentupdate3.30.0—pathofexile:covensofumbra",
      "alphachanges",
      "unlistedsubheading",
      "betachanges",
    ]);
    expect(tocHrefs(html)).toMatchObject({
      "Alpha Changes": "#alphachanges",
      "Beta Changes": "#betachanges",
    });
  });

  it("resolves table of contents links by their text when the fragment differs", () => {
    const raw = `
      <table><tr class="newsPost"><td><div class="content">
        <h3>Table of Contents</h3>
        <ul>
          <li><a href="#old-anchor">Skill Gem Changes</a></li>
        </ul>
        <h3>Skill Gem Changes</h3>
        <p>Body</p>
      </div></td></tr></table>`;
    const { html } = cleanThreadHtml(raw);
    expect(tocHrefs(html)["Skill Gem Changes"]).toBe("#skillgemchanges");
  });
});

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
