import { request } from '@umijs/max';

import type { Envelope } from './types';

export interface AdminUser {
  id: number;
  email: string | null;
  displayName: string | null;
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

export interface AdminUserWordList {
  id: string;
  title: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserWordListDetail extends AdminUserWordList {
  words: string[];
}

export interface AdminStaff {
  id: number;
  email: string;
  displayName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStaffList {
  items: AdminStaff[];
  total: number;
  page: number;
  pageSize: number;
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

export interface AdminCollectionList {
  items: AdminCollection[];
  total: number;
  page: number;
  pageSize: number;
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
  data: { displayName?: string },
): Promise<Envelope<AdminUser>> {
  return request<Envelope<AdminUser>>(`/api/admin/users/${id}`, {
    method: 'PATCH',
    data,
  });
}

export async function listUserWordLists(
  id: number,
): Promise<Envelope<AdminUserWordList[]>> {
  return request<Envelope<AdminUserWordList[]>>(
    `/api/admin/users/${id}/word-lists`,
    {
      method: 'GET',
    },
  );
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

export async function listCollections(params?: {
  page?: number;
  pageSize?: number;
}): Promise<Envelope<AdminCollectionList>> {
  return request<Envelope<AdminCollectionList>>('/api/admin/collections', {
    method: 'GET',
    params,
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

export async function getUserWordList(
  userId: number,
  listId: string,
): Promise<Envelope<AdminUserWordListDetail>> {
  return request<Envelope<AdminUserWordListDetail>>(
    `/api/admin/users/${userId}/word-lists/${listId}`,
    { method: 'GET' },
  );
}

export async function createUserWordList(
  userId: number,
  data: { title: string; words: string[] },
): Promise<Envelope<AdminUserWordListDetail>> {
  return request<Envelope<AdminUserWordListDetail>>(
    `/api/admin/users/${userId}/word-lists`,
    { method: 'POST', data },
  );
}

export async function updateUserWordList(
  userId: number,
  listId: string,
  data: { title?: string; words?: string[] },
): Promise<Envelope<AdminUserWordListDetail>> {
  return request<Envelope<AdminUserWordListDetail>>(
    `/api/admin/users/${userId}/word-lists/${listId}`,
    { method: 'PUT', data },
  );
}

export async function deleteUserWordList(
  userId: number,
  listId: string,
): Promise<Envelope<{ id: string }>> {
  return request<Envelope<{ id: string }>>(
    `/api/admin/users/${userId}/word-lists/${listId}`,
    { method: 'DELETE' },
  );
}

export async function listAdmins(params?: {
  page?: number;
  pageSize?: number;
  email?: string;
}): Promise<Envelope<AdminStaffList>> {
  return request<Envelope<AdminStaffList>>('/api/admin/admins', {
    method: 'GET',
    params,
  });
}

export async function createAdmin(data: {
  email: string;
  password: string;
  displayName?: string;
}): Promise<Envelope<AdminStaff>> {
  return request<Envelope<AdminStaff>>('/api/admin/admins', {
    method: 'POST',
    data,
  });
}

export async function updateAdmin(
  id: number,
  data: { displayName?: string; password?: string },
): Promise<Envelope<AdminStaff>> {
  return request<Envelope<AdminStaff>>(`/api/admin/admins/${id}`, {
    method: 'PATCH',
    data,
  });
}

export async function deleteAdmin(
  id: number,
): Promise<Envelope<{ id: number }>> {
  return request<Envelope<{ id: number }>>(`/api/admin/admins/${id}`, {
    method: 'DELETE',
  });
}