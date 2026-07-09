import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { App, Button, Drawer, Table } from 'antd';
import React, { useRef, useState } from 'react';
import {
  type AdminUser,
  type AdminUserWordList,
  listUsers,
  listUserWordLists,
  updateUser,
} from '@/services/mywordflow/admin';

const UsersPage: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [wordListsUser, setWordListsUser] = useState<AdminUser | null>(null);
  const [wordLists, setWordLists] = useState<AdminUserWordList[]>([]);
  const [wordListsLoading, setWordListsLoading] = useState(false);
  const { message } = App.useApp();

  const openWordLists = async (user: AdminUser) => {
    setWordListsUser(user);
    setWordListsLoading(true);
    try {
      const response = await listUserWordLists(user.id);
      setWordLists(response.data);
    } finally {
      setWordListsLoading(false);
    }
  };

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
        <Button
          key="word-lists"
          type="link"
          onClick={() => openWordLists(record)}
        >
          词表
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
      </ModalForm>

      <Drawer
        title={`${wordListsUser?.email ?? '用户'} 的词表`}
        width={520}
        open={!!wordListsUser}
        onClose={() => setWordListsUser(null)}
        destroyOnHidden
      >
        <Table<AdminUserWordList>
          rowKey="id"
          loading={wordListsLoading}
          dataSource={wordLists}
          pagination={false}
          columns={[
            { title: '标题', dataIndex: 'title' },
            { title: '单词数', dataIndex: 'wordCount', width: 90 },
            {
              title: '创建时间',
              dataIndex: 'createdAt',
              width: 190,
              render: (value: string) => new Date(value).toLocaleString(),
            },
          ]}
        />
      </Drawer>
    </PageContainer>
  );
};

export default UsersPage;
