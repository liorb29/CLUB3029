import { describe, expect, it } from "vitest";
import { diffTaskFields } from "@/lib/activity/diff";

describe("diffTaskFields", () => {
  it("detects a single changed field", () => {
    const entries = diffTaskFields(
      { title: "ישן", description: null, priority: 4 },
      { title: "חדש" },
    );
    expect(entries).toEqual([
      { action: "title_changed", field: "title", oldValue: "ישן", newValue: "חדש" },
    ]);
  });

  it("detects multiple simultaneous changes", () => {
    const entries = diffTaskFields(
      { title: "ישן", description: null, priority: 4 },
      { title: "חדש", priority: 1 },
    );
    expect(entries).toHaveLength(2);
    expect(entries).toContainEqual({
      action: "title_changed",
      field: "title",
      oldValue: "ישן",
      newValue: "חדש",
    });
    expect(entries).toContainEqual({
      action: "priority_changed",
      field: "priority",
      oldValue: 4,
      newValue: 1,
    });
  });

  it("ignores fields absent from `after` (untouched, not cleared)", () => {
    const entries = diffTaskFields(
      { title: "כותרת", description: "תיאור קיים", priority: 4 },
      { title: "כותרת" },
    );
    expect(entries).toEqual([]);
  });

  it("treats an explicit null as a real change when the previous value was set", () => {
    const entries = diffTaskFields(
      { title: "כותרת", description: "תיאור קיים", priority: 4 },
      { description: null },
    );
    expect(entries).toEqual([
      {
        action: "note_changed",
        field: "description",
        oldValue: "תיאור קיים",
        newValue: null,
      },
    ]);
  });

  it("returns an empty array when nothing changed", () => {
    const entries = diffTaskFields(
      { title: "כותרת", description: null, priority: 4 },
      { title: "כותרת", priority: 4 },
    );
    expect(entries).toEqual([]);
  });
});
