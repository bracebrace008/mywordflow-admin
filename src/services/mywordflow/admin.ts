import { request } from '@umijs/max';

import type { Envelope } from './types';

export interface AdminUser {
  id: number;
  email: string | null;
  displayName: string | null;
  role: 'user' | 'admin';
  totalXp: number;
  streakDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserList {
  items: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AdminUserDetail extends AdminUser {
  wordListCount: number;
  lastListId: string | null;
  lastLevelIndex: number | null;
  authProvider: string;
}

export interface AdminCollection {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  wordCount: number;
}

export interface AdminCollectionDetail extends AdminCollection {
  words: string[];
}

export async function listUsers(params: {
  page?: number;
  pageSize?: number;
  email?: string;
}): Promise<Envelope<AdminUserList>> {
  return request<Envelope<AdminUserList>>('/api/admin/users', {
    method: 'GET',
    params,
  });
}

export async function getUser(id: number): Promise<Envelope<AdminUserDetail>> {
  return request<Envelope<AdminUserDetail>>(`/api/admin/users/${id}`, {
    method: 'GET',
  });
}

export async function updateUser(
  id: number,
  data: { displayName?: string; role?: 'user' | 'admin' },
): Promise<Envelope<AdminUser>> {
  return request<Envelope<AdminUser>>(`/api/admin/users/${id}`, {
    method: 'PATCH',
    data,
  });
}

export async function getCollection(
  id: string,
): Promise<Envelope<AdminCollectionDetail>> {
  return request<Envelope<AdminCollectionDetail>>(
    `/api/admin/collections/${id}`,
    {
      method: 'GET',
    },
  );
}

export async function listCollections(): Promise<Envelope<AdminCollection[]>> {
  return request<Envelope<AdminCollection[]>>('/api/admin/collections', {
    method: 'GET',
  });
}

export async function createCollection(data: {
  title: string;
  description?: string;
  coverUrl?: string;
  words: string[];
}): Promise<Envelope<AdminCollectionDetail>> {
  return request<Envelope<AdminCollectionDetail>>('/api/admin/collections', {
    method: 'POST',
    data,
  });
}

export async function updateCollection(
  id: string,
  data: {
    title: string;
    description?: string;
    coverUrl?: string;
    words: string[];
  },
): Promise<Envelope<AdminCollectionDetail>> {
  return request<Envelope<AdminCollectionDetail>>(
    `/api/admin/collections/${id}`,
    {
      method: 'PUT',
      data,
    },
  );
}

export async function deleteCollection(
  id: string,
): Promise<Envelope<{ id: string }>> {
  return request<Envelope<{ id: string }>>(`/api/admin/collections/${id}`, {
    method: 'DELETE',
  });
}