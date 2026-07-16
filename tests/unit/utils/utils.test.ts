import { describe, test, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('Utility Helpers', () => {
  describe('cn', () => {
    test('joins class names successfully', () => {
      expect(cn('class-a', 'class-b')).toBe('class-a class-b');
      expect(cn('class-a', false && 'class-b')).toBe('class-a');
      expect(cn('p-4', 'p-2')).toBe('p-2'); // Tailwind merges padding classes
    });

    test('handles edge cases: null, undefined, empty, and duplicate inputs', () => {
      // Arrange & Act & Assert
      expect(cn(null)).toBe('');
      expect(cn(undefined)).toBe('');
      expect(cn('')).toBe('');
      expect(cn([])).toBe('');
      expect(cn('class-a', null, undefined, 'class-b')).toBe('class-a class-b');
      expect(cn(['class-a', 'class-b'], ['class-c'])).toBe('class-a class-b class-c');
      expect(cn('class-a', 'class-a')).toBe('class-a class-a'); // simple duplicates are not stripped unless they are Tailwind overrides
      expect(cn({ 'class-a': true, 'class-b': false })).toBe('class-a');
    });
  });
});

