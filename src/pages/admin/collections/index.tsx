import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import {
  type AdminCollection,
  createCollection,
  deleteCollection,
  getCollection,
  listCollections,
  updateCollection,
} from '@/services/mywordflow/admin';

type CollectionFormValues = {
  title: string;
  description?: string;
  coverUrl?: string;
  wordsText: string;
};

function wordsToText(words: string[]): string {
  return words.join('\n');
}

function textToWords(text: string): string[] {
  return text
    .split(/[\n,，]/)
    .map((word) => word.trim())
    .filter(Boolean);
}

const CollectionsPage: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { message } = App.useApp();

  const columns: ProColumns<AdminCollection>[] = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
      search: false,
    },
    {
      title: '单词数',
      dataIndex: 'wordCount',
      search: false,
    },
    {
      title: '封面',
      dataIndex: 'coverUrl',
      ellipsis: true,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <Button key="edit" type="link" onClick={() => setEditingId(record.id)}>
          编辑
        </Button>,
        <Popconfirm
          key="delete"
          title="确认删除该精选词库？"
          onConfirm={async () => {
            await deleteCollection(record.id);
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

  const submitCollection = async (
    values: CollectionFormValues,
    id?: string,
  ) => {
    const payload = {
      title: values.title,
      description: values.description,
      coverUrl: values.coverUrl,
      words: textToWords(values.wordsText),
    };

    if (id) {
      await updateCollection(id, payload);
      message.success('词库已更新');
    } else {
      await createCollection(payload);
      message.success('词库已创建');
    }
    actionRef.current?.reload();
    return true;
  };

  const formFields = (
    <>
      <ProFormText
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      />
      <ProFormTextArea name="description" label="描述" />
      <ProFormText name="coverUrl" label="封面 URL" />
      <ProFormTextArea
        name="wordsText"
        label="单词列表"
        placeholder="每行一个单词，或用逗号分隔"
        fieldProps={{ rows: 8 }}
        rules={[{ required: true, message: '请输入至少一个单词' }]}
      />
    </>
  );

  return (
    <PageContainer>
      <ProTable<AdminCollection>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            onClick={() => setCreateOpen(true)}
          >
            新建词库
          </Button>,
        ]}
        request={async (params) => {
          const response = await listCollections({
            page: params.current,
            pageSize: params.pageSize,
          });
          return {
            data: response.data.items,
            total: response.data.total,
            success: true,
          };
        }}
        search={false}
        pagination={{ pageSize: 20 }}
      />

      <ModalForm
        title="新建精选词库"
        open={createOpen}
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => setCreateOpen(false),
        }}
        onFinish={async (values) => {
          const ok = await submitCollection(values as CollectionFormValues);
          if (ok) setCreateOpen(false);
          return ok;
        }}
      >
        {formFields}
      </ModalForm>

      <ModalForm
        title="编辑精选词库"
        open={!!editingId}
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => setEditingId(null),
        }}
        params={{ id: editingId }}
        request={async () => {
          if (!editingId) return {};
          const response = await getCollection(editingId);
          const detail = response.data;
          return {
            title: detail.title,
            description: detail.description ?? undefined,
            coverUrl: detail.coverUrl ?? undefined,
            wordsText: wordsToText(detail.words),
          };
        }}
        onFinish={async (values) => {
          if (!editingId) return false;
          const ok = await submitCollection(
            values as CollectionFormValues,
            editingId,
          );
          if (ok) setEditingId(null);
          return ok;
        }}
      >
        {formFields}
      </ModalForm>
    </PageContainer>
  );
};

export default CollectionsPage;
