import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as adminApi from '@/services/mywordflow/admin';

vi.mock('@ant-design/pro-components', () => ({
  PageContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-container">{children}</div>
  ),
  ProTable: ({
    columns,
    toolBarRender,
    request,
  }: {
    columns?: Array<{ dataIndex?: string; title?: string }>;
    toolBarRender?: () => React.ReactNode;
    request?: (params: {
      current?: number;
      pageSize?: number;
    }) => Promise<unknown>;
  }) => {
    request?.({ current: 1, pageSize: 20 });
    return (
      <div data-testid="pro-table">
        {columns?.map((col) => (
          <div key={col.dataIndex} data-testid={`column-${col.dataIndex}`}>
            {col.title}
          </div>
        ))}
        {toolBarRender?.()}
      </div>
    );
  },
  ModalForm: ({ open, title }: { open?: boolean; title?: string }) =>
    open ? <div data-testid="modal-form">{title}</div> : null,
  ProFormText: () => null,
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
    Popconfirm: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

vi.mock('@/services/mywordflow/admin', () => ({
  listAdmins: vi.fn(),
  createAdmin: vi.fn(),
  updateAdmin: vi.fn(),
  deleteAdmin: vi.fn(),
}));

import AdminsPage from './index';

describe('AdminsPage', () => {
  beforeEach(() => {
    vi.mocked(adminApi.listAdmins).mockResolvedValue({
      success: true,
      code: 200,
      message: 'OK',
      data: {
        items: [
          {
            id: 1,
            email: 'admin@mywordflow.app',
            displayName: 'Admin',
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
          },
        ],
        total: 1,
        page: 1,
        pageSize: 20,
      },
    });
  });

  it('renders admin table columns and create button', async () => {
    render(<AdminsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('pro-table')).toBeInTheDocument();
    });

    expect(screen.getByTestId('column-email')).toHaveTextContent('邮箱');
    expect(screen.getByText('新建管理员')).toBeInTheDocument();
  });
});
