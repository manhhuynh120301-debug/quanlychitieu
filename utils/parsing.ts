
export const formatVND = (val: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(val);
};

export const parseAmount = (input: string): number | null => {
  const cleaned = input.trim().toLowerCase().replace(/,/g, '');
  if (!cleaned) return null;

  const match = cleaned.match(/^(\d+(?:\.\d+)?)\s*(k|tr|m)?$/);
  if (!match) return null;

  const value = parseFloat(match[1]);
  const suffix = match[2];

  if (isNaN(value)) return null;

  switch (suffix) {
    case 'k': return value * 1000;
    case 'tr':
    case 'm': return value * 1000000;
    default: return value;
  }
};

export const getTodayISO = () => new Date().toISOString().split('T')[0];
