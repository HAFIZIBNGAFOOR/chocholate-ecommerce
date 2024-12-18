import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import { REGEXP_PASSWORD, REGEXP_PASSWORD_WEAK } from '../src/constants/regexp';
import { generatePassword } from '../src/utils/randomId';

describe('Server.ts tests', () => {
  test('Math test', () => {
    expect(2 + 2).toBe(4);
  });
  test('Password functionality weak case', () => {
    for (let index = 0; index < 1000; index++) {
      const password = generatePassword(REGEXP_PASSWORD_WEAK);
      console.log('\x1b[32mPassword\x1b[0m', password, ' ', REGEXP_PASSWORD_WEAK.test(password));
      expect(REGEXP_PASSWORD_WEAK.test(password)).toBe(true);
    }
  });
  test('Password functionality strong case', () => {
    for (let index = 0; index < 1000; index++) {
      const password = generatePassword(REGEXP_PASSWORD);
      console.log('\x1b[32mPassword\x1b[0m', password, ' ', REGEXP_PASSWORD.test(password));
      expect(REGEXP_PASSWORD.test(password)).toBe(true);
    }
  });
});
