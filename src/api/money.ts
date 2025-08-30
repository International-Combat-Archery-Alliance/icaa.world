import type { components } from './events-v1';
import { Money } from 'ts-money';

export function formatMoney(money: components['schemas']['Money']): string {
  const m = new Money(money.amount, money.currency);
  // TODO: this assumes currency symbol is alwasy first which doesn't work for all currencies
  return `${m.getCurrencyInfo().symbol}${m.toString()}`;
}
