import { describe, expect, it } from 'vitest';
import {
  LOCAL_ADMIN_EMAIL,
  LOCAL_ADMIN_PASSWORD,
  resolveLocalLoginPrefill,
} from './loginPrefill';

describe('resolveLocalLoginPrefill', () => {
  it('returns admin credentials when local', () => {
    expect(resolveLocalLoginPrefill(true)).toEqual({
      email: LOCAL_ADMIN_EMAIL,
      password: LOCAL_ADMIN_PASSWORD,
    });
  });

  it('returns undefined when not local', () => {
    expect(resolveLocalLoginPrefill(false)).toBeUndefined();
  });
});
