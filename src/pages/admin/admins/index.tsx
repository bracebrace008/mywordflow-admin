import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import {
  type AdminStaff,
  createAdmin,
  deleteAdmin,
  listAdmins,
  updateAdmin,
} from '@/services/mywordflow/admin';

const AdminsPage: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminStaff | null>(null);
  const { message } = App.useApp();

  const columns: ProColumns<AdminStaff>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      search: false,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      copyable: true,
    },
    {
      title: '显示名',
      dataIndex: 'displayName',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <Button key="edit" type="link" onClick={() => setEditingAdmin(record)}>
          编辑
        </Button>,
        <Popconfirm
          key="delete"
          title="确认删除该管理员？"
          onConfirm={async () => {
            await deleteAdmin(record.id);
            message.success('已删除');
            actionRef.current?.reload();
          }}
        >
          <Button type="link" danger>
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<AdminStaff>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            onClick={() => setCreateOpen(true)}
          >
            新建管理员
          </Button>,
        ]}
        request={async (params) => {
          const response = await listAdmins({
            page: params.current,
            pageSize: params.pageSize,
            email: params.email as string | undefined,
          });
          return {
            data: response.data.items,
            total: response.data.total,
            success: true,
          };
        }}
        pagination={{ pageSize: 20 }}
      />

      <ModalForm
        title="新建管理员"
        open={createOpen}
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => setCreateOpen(false),
        }}
        onFinish={async (values) => {
          await createAdmin(
            values as {
              email: string;
              password: string;
              displayName?: string;
            },
          );
          message.success('管理员已创建');
          setCreateOpen(false);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormText
          name="email"
          label="邮箱"
          rules={[{ required: true, message: '请输入邮箱' }]}
        />
        <ProFormText.Password
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码' }]}
        />
        <ProFormText name="displayName" label="显示名" />
      </ModalForm>

      <ModalForm
        title="编辑管理员"
        open={!!editingAdmin}
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => setEditingAdmin(null),
        }}
        initialValues={editingAdmin ?? undefined}
        onFinish={async (values) => {
          if (!editingAdmin) return false;
          await updateAdmin(editingAdmin.id, values);
          message.success('管理员已更新');
          setEditingAdmin(null);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormText name="displayName" label="显示名" />
        <ProFormText.Password
          name="password"
          label="新密码"
          placeholder="留空则不修改"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default AdminsPage;
