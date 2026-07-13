import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as adminApi from '@/services/mywordflow/admin';

vi.mock('@ant-design/pro-components', () => ({
  PageContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-container">{children}</div>
  ),
  ProTable: ({
    columns,
    request,
  }: {
    columns?: Array<{
      dataIndex?: string;
      title?: string;
      render?: (
        value: unknown,
        record: { id: number; email: string },
      ) => React.ReactNode;
    }>;
    request?: (params: {
      current?: number;
      pageSize?: number;
    }) => Promise<unknown>;
  }) => {
    request?.({ current: 1, pageSize: 20 });
    const record = { id: 1, email: 'demo@mywordflow.app' };
    return (
      <div data-testid="pro-table">
        {columns
          ?.filter((col) => col.dataIndex === 'email' || col.title === '操作')
          .map((col) => (
            <div
              key={col.dataIndex ?? col.title}
              data-testid={`col-${col.title}`}
            >
              {col.title === '操作' ? col.render?.(null, record) : col.title}
            </div>
          ))}
      </div>
    );
  },
  ModalForm: ({ open, title }: { open?: boolean; title?: string }) =>
    open ? <div data-testid="modal-form">{title}</div> : null,
  ProFormText: () => null,
  ProFormTextArea: () => null,
}));

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');
  return {
    ...actual,
    App: {
      useApp: () => ({
        message: { success: vi.fn(), error: vi.fn() },
      }),
    },
    Button: ({
      children,
      onClick,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
    }) => (
      <button type="button" onClick={onClick}>
        {children}
      </button>
    ),
    Drawer: ({
      children,
      open,
      extra,
    }: {
      children: React.ReactNode;
      open?: boolean;
      extra?: React.ReactNode;
    }) =>
      open ? (
        <div data-testid="word-list-drawer">
          {extra}
          {children}
        </div>
      ) : null,
    Table: ({
      dataSource,
      columns,
    }: {
      dataSource?: Array<{ id: string; title: string }>;
      columns?: Array<{
        title?: string;
        dataIndex?: string;
        render?: (
          value: unknown,
          record: { id: string; title: string },
        ) => React.ReactNode;
      }>;
    }) => (
      <div data-testid="word-list-table">
        {dataSource?.map((row) => (
          <div key={row.id} data-testid={`word-list-row-${row.id}`}>
            {row.title}
            {columns?.find((col) => col.title === '操作')?.render?.(null, row)}
          </div>
        ))}
      </div>
    ),
    Popconfirm: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
    Space: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

vi.mock('@/services/mywordflow/admin', () => ({
  listUsers: vi.fn(),
  listUserWordLists: vi.fn(),
  getUserWordList: vi.fn(),
  createUserWordList: vi.fn(),
  updateUserWordList: vi.fn(),
  deleteUserWordList: vi.fn(),
  updateUser: vi.fn(),
}));

import UsersPage from './index';

describe('UsersPage word lists', () => {
  beforeEach(() => {
    vi.mocked(adminApi.listUsers).mockResolvedValue({
      success: true,
      code: 200,
      message: 'OK',
      data: {
        items: [
          {
            id: 1,
            email: 'demo@mywordflow.app',
            displayName: 'Demo',
            totalXp: 0,
            streakDays: 0,
            isDisabled: false,
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
          },
        ],
        total: 1,
        page: 1,
        pageSize: 20,
      },
    });
    vi.mocked(adminApi.listUserWordLists).mockResolvedValue({
      success: true,
      code: 200,
      message: 'OK',
      data: [
        {
          id: 'list-1',
          title: 'Demo List',
          wordCount: 2,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ],
    });
  });

  it('opens word list drawer and shows list rows', async () => {
    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('词表')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('词表'));

    await waitFor(() => {
      expect(screen.getByTestId('word-list-drawer')).toBeInTheDocument();
    });

    expect(screen.getByText('新建词表')).toBeInTheDocument();
    expect(screen.getByTestId('word-list-row-list-1')).toHaveTextContent(
      'Demo List',
    );
    expect(adminApi.listUserWordLists).toHaveBeenCalledWith(1);
  });
});
