import { describe, expect, it } from "vitest";
import { encodeActivityValue } from "@/lib/activity/log";

describe("encodeActivityValue", () => {
  it("encodes undefined as null", () => {
    expect(encodeActivityValue(undefined)).toBeNull();
  });

  it("encodes null as null", () => {
    expect(encodeActivityValue(null)).toBeNull();
  });

  it("encodes a string as a JSON-quoted string", () => {
    expect(encodeActivityValue("שלום")).toBe('"שלום"');
  });

  it("encodes a number via JSON.stringify", () => {
    expect(encodeActivityValue(4)).toBe("4");
  });

  it("encodes an object via JSON.stringify", () => {
    expect(encodeActivityValue({ a: 1 })).toBe(JSON.stringify({ a: 1 }));
  });
});
