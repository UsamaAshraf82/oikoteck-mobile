// utils/formatNumber.ts
export function thoasandseprator(
  value: number | string,
  { locale, digits }: { locale?: string; digits?: number } = {
    locale: 'en-US',
  }
) {
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);

  try {
    // ✅ Use Intl.NumberFormat with 2 decimal places
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(n);
  } catch {
    // ✅ Fallback (no Intl)
    return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

export const numberminify = (input: string | number | null | undefined) => {
  if (input === null) {
    return null;
  }
  if (input === undefined) {
    return undefined;
  }
  if (typeof input === 'string') {
    input = parseInt(input);
  }
  return input.toLocaleString('en-US', {
    // numberingSystem: m,
    notation: 'compact',
    compactDisplay: 'short',
    useGrouping: true,
  });
};
