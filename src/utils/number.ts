// utils/formatNumber.ts
export function formatNumber(value: number | string, locale = 'en-US') {
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  // Preferred: Intl
  try {
    return new Intl.NumberFormat(locale).format(n);
  } catch {
    // Fallback if Intl isn't available
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
