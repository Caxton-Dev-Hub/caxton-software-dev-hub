/**
 * All money is handled in kobo (integer minor units). 1 NGN = 100 kobo.
 * Never store or arithmetic on naira as a floating point number.
 */

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const nairaWithKobo = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
});

export function formatKobo(kobo: number): string {
  return kobo % 100 === 0
    ? nairaFormatter.format(kobo / 100)
    : nairaWithKobo.format(kobo / 100);
}

export function nairaToKobo(naira: number): number {
  return Math.round(naira * 100);
}

export function koboToNaira(kobo: number): number {
  return kobo / 100;
}

/** Half now, half before week five. Rounds the first instalment up. */
export function instalmentKobo(totalKobo: number): number {
  return Math.ceil(totalKobo / 200) * 100;
}
