import Dinero, { type Currency } from 'dinero.js';
import type { components } from './events-v1';

export function formatMoney(money: components['schemas']['Money']): string {
  return Dinero({
    amount: money.amount,
    currency: money.currency as Currency,
  }).toFormat();
}
