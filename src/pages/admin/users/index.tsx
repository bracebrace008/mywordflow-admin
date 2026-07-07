import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { App, Button } from 'antd';
import React, { useRef, useState } from 'react';
import {
  type AdminUser,
  listUsers,
  updateUser,
} from '@/services/mywordflow/admin';

const UsersPage: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const { message } = App.useApp();

  const columns: ProColumns<AdminUser>[] = [
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
      title: '角色',
      dataIndex: 'role',
      valueEnum: {
        user: { text: '用户' },
        admin: { text: '管理员', status: 'Success' },
      },
      search: false,
    },
    {
      title: '总 XP',
      dataIndex: 'totalXp',
      search: false,
    },
    {
      title: '连续天数',
      dataIndex: 'streakDays',
      search: false,
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <Button key="edit" type="link" onClick={() => setEditingUser(record)}>
          编辑
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<AdminUser>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const response = await listUsers({
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
        title="编辑用户"
        open={!!editingUser}
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => setEditingUser(null),
        }}
        initialValues={editingUser ?? undefined}
        onFinish={async (values) => {
          if (!editingUser) return false;
          await updateUser(editingUser.id, values);
          message.success('用户已更新');
          setEditingUser(null);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormText name="displayName" label="显示名" />
        <ProFormSelect
          name="role"
          label="角色"
          options={[
            { label: '用户', value: 'user' },
            { label: '管理员', value: 'admin' },
          ]}
          rules={[{ required: true, message: '请选择角色' }]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default UsersPage;
