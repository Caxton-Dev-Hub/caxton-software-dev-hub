import { describe, expect, it } from "vitest";

import { formatKobo, instalmentKobo, koboToNaira, nairaToKobo } from "@/lib/money";

describe("formatKobo", () => {
  it("formats whole naira without decimals", () => {
    expect(formatKobo(500_000)).toBe("₦5,000");
  });

  it("formats a fractional amount with two decimal places", () => {
    expect(formatKobo(500_050)).toBe("₦5,000.50");
  });

  it("formats zero as a whole amount", () => {
    expect(formatKobo(0)).toBe("₦0");
  });
});

describe("nairaToKobo / koboToNaira", () => {
  it("round-trips a whole naira amount", () => {
    expect(nairaToKobo(5000)).toBe(500_000);
    expect(koboToNaira(500_000)).toBe(5000);
  });

  it("rounds naira input to the nearest kobo", () => {
    expect(nairaToKobo(19.999)).toBe(2000);
  });
});

describe("instalmentKobo", () => {
  it("halves an even amount exactly", () => {
    expect(instalmentKobo(1_000_000)).toBe(500_000);
  });

  it("rounds the first instalment up on an odd amount", () => {
    expect(instalmentKobo(1_000_001)).toBe(500_100);
  });
});
