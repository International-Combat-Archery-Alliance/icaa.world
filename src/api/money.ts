import type { components } from './events-v1';
import { Money } from 'ts-money';

export function formatCurrencyAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat(navigator.language || 'en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatMoney(money: components['schemas']['Money']): string {
  // Use ts-money to handle minor-to-major unit conversion correctly
  const m = new Money(money.amount, money.currency);
  // Convert to major units (dollars, euros, etc.)
  const majorUnits = m.toDecimal();
  return formatCurrencyAmount(majorUnits, money.currency);
}
