import { describe, expect, it } from "vitest";
import { normalizeSyncMinutes, resolveInitialTheme } from "./preferences";

describe("dashboard preferences", () => {
  it("uses a stored theme when valid and otherwise follows the system", () => {
    expect(resolveInitialTheme("light", true)).toBe("light");
    expect(resolveInitialTheme(null, true)).toBe("dark");
    expect(resolveInitialTheme("invalid", false)).toBe("light");
  });

  it("accepts only supported automatic sync intervals", () => {
    expect(normalizeSyncMinutes("15")).toBe(15);
    expect(normalizeSyncMinutes("2")).toBe(5);
    expect(normalizeSyncMinutes(null)).toBe(5);
  });
});
