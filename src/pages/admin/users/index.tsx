import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { App, Button, Drawer, Popconfirm, Space, Table } from 'antd';
import React, { useRef, useState } from 'react';
import {
  type AdminUser,
  type AdminUserWordList,
  createUserWordList,
  deleteUserWordList,
  getUserWordList,
  listUsers,
  listUserWordLists,
  updateUser,
  updateUserWordList,
} from '@/services/mywordflow/admin';
import { textToWords, wordsToText } from '../word-list-form-utils';

type WordListFormValues = {
  title: string;
  wordsText: string;
};

const UsersPage: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [wordListsUser, setWordListsUser] = useState<AdminUser | null>(null);
  const [wordLists, setWordLists] = useState<AdminUserWordList[]>([]);
  const [wordListsLoading, setWordListsLoading] = useState(false);
  const [createWordListOpen, setCreateWordListOpen] = useState(false);
  const [editingWordListId, setEditingWordListId] = useState<string | null>(
    null,
  );
  const { message } = App.useApp();

  const reloadWordLists = async (userId: number) => {
    setWordListsLoading(true);
    try {
      const response = await listUserWordLists(userId);
      setWordLists(response.data);
    } finally {
      setWordListsLoading(false);
    }
  };

  const openWordLists = async (user: AdminUser) => {
    setWordListsUser(user);
    await reloadWordLists(user.id);
  };

  const submitWordList = async (
    values: WordListFormValues,
    listId?: string,
  ) => {
    if (!wordListsUser) return false;

    const payload = {
      title: values.title,
      words: textToWords(values.wordsText),
    };

    if (listId) {
      await updateUserWordList(wordListsUser.id, listId, payload);
      message.success('词表已更新');
    } else {
      await createUserWordList(wordListsUser.id, payload);
      message.success('词表已创建');
    }

    await reloadWordLists(wordListsUser.id);
    return true;
  };

  const wordListFormFields = (
    <>
      <ProFormText
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      />
      <ProFormTextArea
        name="wordsText"
        label="单词列表"
        placeholder="每行一个单词，或用逗号分隔"
        fieldProps={{ rows: 8 }}
        rules={[{ required: true, message: '请输入至少一个单词' }]}
      />
    </>
  );

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
        width={640}
        open={!!wordListsUser}
        onClose={() => {
          setWordListsUser(null);
          setCreateWordListOpen(false);
          setEditingWordListId(null);
        }}
        destroyOnHidden
        extra={
          <Button type="primary" onClick={() => setCreateWordListOpen(true)}>
            新建词表
          </Button>
        }
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
              width: 170,
              render: (value: string) => new Date(value).toLocaleString(),
            },
            {
              title: '操作',
              key: 'actions',
              width: 120,
              render: (_, record) => (
                <Space>
                  <Button
                    type="link"
                    onClick={() => setEditingWordListId(record.id)}
                  >
                    编辑
                  </Button>
                  <Popconfirm
                    title="确认删除该词表？"
                    onConfirm={async () => {
                      if (!wordListsUser) return;
                      await deleteUserWordList(wordListsUser.id, record.id);
                      message.success('词表已删除');
                      await reloadWordLists(wordListsUser.id);
                    }}
                  >
                    <Button type="link" danger>
                      删除
                    </Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </Drawer>

      <ModalForm
        title="新建词表"
        open={createWordListOpen}
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => setCreateWordListOpen(false),
        }}
        onFinish={async (values) => {
          const ok = await submitWordList(values as WordListFormValues);
          if (ok) setCreateWordListOpen(false);
          return ok;
        }}
      >
        {wordListFormFields}
      </ModalForm>

      <ModalForm
        title="编辑词表"
        open={!!editingWordListId}
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => setEditingWordListId(null),
        }}
        params={{ id: editingWordListId, userId: wordListsUser?.id }}
        request={async () => {
          if (!editingWordListId || !wordListsUser) return {};
          const response = await getUserWordList(
            wordListsUser.id,
            editingWordListId,
          );
          const detail = response.data;
          return {
            title: detail.title,
            wordsText: wordsToText(detail.words),
          };
        }}
        onFinish={async (values) => {
          if (!editingWordListId) return false;
          const ok = await submitWordList(
            values as WordListFormValues,
            editingWordListId,
          );
          if (ok) setEditingWordListId(null);
          return ok;
        }}
      >
        {wordListFormFields}
      </ModalForm>
    </PageContainer>
  );
};

export default UsersPage;
