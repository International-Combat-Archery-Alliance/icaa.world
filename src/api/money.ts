import type { Money } from './events';
import { Money as MoneyValue } from 'ts-money';

export function formatCurrencyAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat(navigator.language || 'en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatMoney(money: Money): string {
  // Use ts-money to handle minor-to-major unit conversion correctly
  const m = new MoneyValue(money.amount, money.currency);
  // Convert to major units (dollars, euros, etc.)
  const majorUnits = m.toDecimal();
  return formatCurrencyAmount(majorUnits, money.currency);
}
