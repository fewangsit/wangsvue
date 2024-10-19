import currencies from 'lib/assets/json/currencies.json';
import { CurrencyFormat } from '../InputCurrency.vue.d';

const getCurrency = (code?: string = 'IDR'): CurrencyFormat => {
  return currencies.find((curr) => curr.currency === code);
};

const formatCurrency = (
  value?: number | string | null,
  currency?: string,
  prefix = true,
): string => {
  const { locale, currency: code } = getCurrency(currency);

  if (value == null) return '-';

  return Number(value)
    .toLocaleString(locale, {
      style: prefix ? 'currency' : undefined,
      currency: code,
    })
    .replace('Rp ', 'Rp'); // Remove U+00a0 (Non-Breaking space character) after 'Rp'
};

export { getCurrency, formatCurrency };
