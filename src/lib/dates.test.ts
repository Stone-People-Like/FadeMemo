import { describe, expect, it } from "vitest";
import { calendarDayDistance } from "./dates";

describe("calendarDayDistance", () => {
  it("labels activity from the previous calendar date as yesterday even when less than 24 hours ago", () => {
    const previousNight = new Date(2026, 7, 11, 23, 30).toISOString();
    expect(calendarDayDistance(previousNight, new Date(2026, 7, 12, 0, 30))).toBe(1);
  });
});
