import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormDateTimePicker,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import {
  type AdminNotice,
  createNotice,
  deleteNotice,
  getNotice,
  listNotices,
  updateNotice,
} from '@/services/mywordflow/admin';

type NoticeFormValues = {
  title: string;
  content: string;
  minVersion?: string;
  validFrom?: string;
  validTo?: string;
  isActive?: boolean;
};

const NoticesPage: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { message } = App.useApp();

  const columns: ProColumns<AdminNotice>[] = [
    { title: 'ID', dataIndex: 'id', width: 70, search: false },
    { title: '标题', dataIndex: 'title' },
    {
      title: '状态',
      dataIndex: 'isActive',
      search: false,
      render: (_, record) => (record.isActive ? '启用' : '停用'),
    },
    {
      title: '有效期',
      search: false,
      render: (_, record) => {
        const from = record.validFrom
          ? new Date(record.validFrom).toLocaleString()
          : '不限';
        const to = record.validTo
          ? new Date(record.validTo).toLocaleString()
          : '不限';
        return `${from} ~ ${to}`;
      },
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
          title="确认删除该公告？"
          onConfirm={async () => {
            await deleteNotice(record.id);
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

  const submitNotice = async (values: NoticeFormValues, id?: number) => {
    const payload = {
      title: values.title,
      content: values.content,
      minVersion: values.minVersion,
      validFrom: values.validFrom,
      validTo: values.validTo,
      isActive: values.isActive ?? true,
    };

    if (id) {
      await updateNotice(id, payload);
      message.success('公告已更新');
    } else {
      await createNotice(payload);
      message.success('公告已创建');
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
      <ProFormTextArea
        name="content"
        label="内容"
        fieldProps={{ rows: 6 }}
        rules={[{ required: true, message: '请输入内容' }]}
      />
      <ProFormText name="minVersion" label="最低 App 版本" />
      <ProFormDateTimePicker name="validFrom" label="生效时间" />
      <ProFormDateTimePicker name="validTo" label="失效时间" />
      <ProFormSwitch name="isActive" label="启用" initialValue />
    </>
  );

  return (
    <PageContainer>
      <ProTable<AdminNotice>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        search={false}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            onClick={() => setCreateOpen(true)}
          >
            新建公告
          </Button>,
        ]}
        request={async (params) => {
          const response = await listNotices({
            page: params.current,
            pageSize: params.pageSize,
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
        title="新建公告"
        open={createOpen}
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => setCreateOpen(false),
        }}
        onFinish={async (values) => {
          const ok = await submitNotice(values as NoticeFormValues);
          if (ok) setCreateOpen(false);
          return ok;
        }}
      >
        {formFields}
      </ModalForm>

      <ModalForm
        title="编辑公告"
        open={editingId !== null}
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => setEditingId(null),
        }}
        params={{ id: editingId }}
        request={async () => {
          if (!editingId) return {};
          const response = await getNotice(editingId);
          const detail = response.data;
          return {
            title: detail.title,
            content: detail.content,
            minVersion: detail.minVersion ?? undefined,
            validFrom: detail.validFrom ?? undefined,
            validTo: detail.validTo ?? undefined,
            isActive: detail.isActive,
          };
        }}
        onFinish={async (values) => {
          if (!editingId) return false;
          const ok = await submitNotice(values as NoticeFormValues, editingId);
          if (ok) setEditingId(null);
          return ok;
        }}
      >
        {formFields}
      </ModalForm>
    </PageContainer>
  );
};

export default NoticesPage;
