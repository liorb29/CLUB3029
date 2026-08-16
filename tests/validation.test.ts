import { describe, expect, it } from "vitest";
import { createTaskInputSchema, updateTaskInputSchema } from "@/lib/validation";

describe("createTaskInputSchema", () => {
  it("rejects an empty title", () => {
    const result = createTaskInputSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a whitespace-only title", () => {
    const result = createTaskInputSchema.safeParse({ title: "   " });
    expect(result.success).toBe(false);
  });

  it("trims the title", () => {
    const result = createTaskInputSchema.safeParse({ title: "  לקנות חלב  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("לקנות חלב");
    }
  });

  it("accepts a missing priority (defaults handled by the caller)", () => {
    const result = createTaskInputSchema.safeParse({ title: "משימה" });
    expect(result.success).toBe(true);
  });

  it("rejects a priority outside 1-4", () => {
    const result = createTaskInputSchema.safeParse({ title: "משימה", priority: 5 });
    expect(result.success).toBe(false);
  });
});

describe("updateTaskInputSchema", () => {
  it("rejects an empty patch object", () => {
    const result = updateTaskInputSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("accepts a title-only patch", () => {
    const result = updateTaskInputSchema.safeParse({ title: "כותרת חדשה" });
    expect(result.success).toBe(true);
  });

  it("accepts description explicitly set to null", () => {
    const result = updateTaskInputSchema.safeParse({ description: null });
    expect(result.success).toBe(true);
  });

  it("rejects a priority outside 1-4", () => {
    const result = updateTaskInputSchema.safeParse({ priority: 0 });
    expect(result.success).toBe(false);
  });
});
