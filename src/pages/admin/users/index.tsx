import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import {
  App,
  Button,
  Descriptions,
  Drawer,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
} from 'antd';
import React, { useRef, useState } from 'react';
import {
  type AdminUser,
  type AdminUserAchievement,
  type AdminUserDetail,
  type AdminUserProgress,
  type AdminUserWordList,
  banUser,
  createUserWordList,
  deleteUserWordList,
  getUser,
  getUserAchievements,
  getUserProgress,
  getUserWordList,
  listUsers,
  listUserWordLists,
  resetUserPassword,
  updateUser,
  updateUserWordList,
} from '@/services/mywordflow/admin';
import { textToWords, wordsToText } from '../word-list-form-utils';

type WordListFormValues = {
  title: string;
  wordsText: string;
};

const authProviderLabels: Record<string, string> = {
  local: '邮箱密码',
  google: 'Google',
  apple: 'Apple',
};

const UsersPage: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [detailUserId, setDetailUserId] = useState<number | null>(null);
  const [detailUser, setDetailUser] = useState<AdminUserDetail | null>(null);
  const [detailProgress, setDetailProgress] =
    useState<AdminUserProgress | null>(null);
  const [detailAchievements, setDetailAchievements] = useState<
    AdminUserAchievement[]
  >([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [wordListsUser, setWordListsUser] = useState<AdminUser | null>(null);
  const [wordLists, setWordLists] = useState<AdminUserWordList[]>([]);
  const [wordListsLoading, setWordListsLoading] = useState(false);
  const [createWordListOpen, setCreateWordListOpen] = useState(false);
  const [editingWordListId, setEditingWordListId] = useState<string | null>(
    null,
  );
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
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

  const loadUserDetail = async (userId: number) => {
    setDetailLoading(true);
    try {
      const [userRes, progressRes, achievementsRes] = await Promise.all([
        getUser(userId),
        getUserProgress(userId),
        getUserAchievements(userId),
      ]);
      setDetailUser(userRes.data);
      setDetailProgress(progressRes.data);
      setDetailAchievements(achievementsRes.data);
    } finally {
      setDetailLoading(false);
    }
  };

  const openUserDetail = async (user: AdminUser) => {
    setDetailUserId(user.id);
    await loadUserDetail(user.id);
  };

  const closeUserDetail = () => {
    setDetailUserId(null);
    setDetailUser(null);
    setDetailProgress(null);
    setDetailAchievements([]);
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
      title: '状态',
      dataIndex: 'isDisabled',
      search: false,
      render: (_, record) =>
        record.isDisabled ? (
          <Tag color="error">已封禁</Tag>
        ) : (
          <Tag color="success">正常</Tag>
        ),
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
        <Button key="detail" type="link" onClick={() => openUserDetail(record)}>
          详情
        </Button>,
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

  const detailTabItems = [
    {
      key: 'profile',
      label: '基本信息',
      children: detailUser ? (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="ID">{detailUser.id}</Descriptions.Item>
          <Descriptions.Item label="邮箱">
            {detailUser.email ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="显示名">
            {detailUser.displayName ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="登录方式">
            {authProviderLabels[detailUser.authProvider] ??
              detailUser.authProvider}
          </Descriptions.Item>
          <Descriptions.Item label="词表数">
            {detailUser.wordListCount}
          </Descriptions.Item>
          <Descriptions.Item label="最近词表 ID">
            {detailUser.lastListId ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="总 XP">
            {detailUser.totalXp}
          </Descriptions.Item>
          <Descriptions.Item label="连续天数">
            {detailUser.streakDays}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            {detailUser.isDisabled ? (
              <Tag color="error">已封禁</Tag>
            ) : (
              <Tag color="success">正常</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="注册时间">
            {new Date(detailUser.createdAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      ) : null,
    },
    {
      key: 'progress',
      label: '学习进度',
      children: detailProgress ? (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="已过关单词数">
              {detailProgress.completedWordCount}
            </Descriptions.Item>
            <Descriptions.Item label="Continue 词表">
              {detailProgress.continue?.listTitle ?? '无'}
            </Descriptions.Item>
            {detailProgress.continue ? (
              <>
                <Descriptions.Item label="整体进度">
                  {detailProgress.continue.overallPercent}%
                </Descriptions.Item>
                <Descriptions.Item label="关卡进度">
                  {detailProgress.continue.completedLevels} /{' '}
                  {detailProgress.continue.totalLevels}
                </Descriptions.Item>
              </>
            ) : null}
          </Descriptions>
          <Table
            size="small"
            rowKey="listId"
            pagination={false}
            dataSource={detailProgress.listProgress}
            columns={[
              { title: '词表', dataIndex: 'title' },
              { title: '单词数', dataIndex: 'wordCount', width: 80 },
              { title: '已完成', dataIndex: 'completedCount', width: 80 },
              {
                title: '进度',
                dataIndex: 'percent',
                width: 80,
                render: (value: number) => `${value}%`,
              },
            ]}
          />
          <Table
            size="small"
            rowKey={(row) => `${row.listId}-${row.completedAt}`}
            pagination={false}
            dataSource={detailProgress.recentCompletions}
            columns={[
              { title: '词表', dataIndex: 'listTitle' },
              { title: '单词', dataIndex: 'wordText' },
              { title: 'XP', dataIndex: 'xpGain', width: 60 },
              {
                title: '一次过关',
                dataIndex: 'firstTry',
                width: 90,
                render: (value: boolean) => (value ? '是' : '否'),
              },
              {
                title: '完成时间',
                dataIndex: 'completedAt',
                render: (value: string) => new Date(value).toLocaleString(),
              },
            ]}
          />
        </Space>
      ) : null,
    },
    {
      key: 'achievements',
      label: '成就',
      children: (
        <Table
          size="small"
          rowKey="id"
          pagination={false}
          dataSource={detailAchievements}
          locale={{ emptyText: '暂无已解锁成就' }}
          columns={[
            {
              title: '成就',
              render: (_, record) => `${record.emoji} ${record.titleKey}`,
            },
            {
              title: '解锁时间',
              dataIndex: 'unlockedAt',
              render: (value: string) => new Date(value).toLocaleString(),
            },
          ]}
        />
      ),
    },
    {
      key: 'ops',
      label: '账号操作',
      children: detailUser ? (
        <Space direction="vertical">
          <Space>
            <span>封禁账号</span>
            <Switch
              checked={detailUser.isDisabled}
              onChange={async (checked) => {
                await banUser(detailUser.id, checked);
                message.success(checked ? '用户已封禁' : '用户已解封');
                await loadUserDetail(detailUser.id);
                actionRef.current?.reload();
              }}
            />
          </Space>
          {detailUser.authProvider === 'local' ? (
            <Button type="primary" onClick={() => setResetPasswordOpen(true)}>
              重置密码
            </Button>
          ) : (
            <span>社交账号不支持后台重置密码</span>
          )}
        </Space>
      ) : null,
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

      <Drawer
        title={detailUser?.email ?? '用户详情'}
        width={720}
        open={detailUserId !== null}
        onClose={closeUserDetail}
        destroyOnHidden
        loading={detailLoading}
      >
        <Tabs items={detailTabItems} />
      </Drawer>

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

      <ModalForm
        title="重置密码"
        open={resetPasswordOpen}
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => setResetPasswordOpen(false),
        }}
        onFinish={async (values) => {
          if (!detailUser) return false;
          await resetUserPassword(detailUser.id, values.password);
          message.success('密码已重置');
          setResetPasswordOpen(false);
          return true;
        }}
      >
        <ProFormText.Password
          name="password"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 8, message: '密码至少 8 位' },
          ]}
        />
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
