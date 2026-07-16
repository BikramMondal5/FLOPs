import { expect } from 'vitest';

export function assertNumberInRange(value: number, min: number, max: number) {
  expect(value).toBeGreaterThanOrEqual(min);
  expect(value).toBeLessThanOrEqual(max);
}

export function isValidISODate(dateStr: string): boolean {
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}
