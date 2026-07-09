import { request } from '@umijs/max';

import type { Envelope, LoginResult, UserProfile } from './types';

const TOKEN_KEY = 'mwf_admin_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(
  email: string,
  password: string,
): Promise<Envelope<LoginResult>> {
  return request<Envelope<LoginResult>>('/api/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { email, password },
  });
}

export async function getProfile(): Promise<Envelope<UserProfile>> {
  return request<Envelope<UserProfile>>('/api/admin/me', {
    method: 'GET',
  });
}

export async function outLogin(): Promise<void> {
  return Promise.resolve();
}