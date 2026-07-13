import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Card, Col, Row, Spin, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  type AdminAuditLog,
  type AdminStats,
  getStats,
  listAuditLogs,
} from '@/services/mywordflow/admin';

const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then((response) => setStats(response.data))
      .finally(() => setLoading(false));
  }, []);

  const auditColumns: ProColumns<AdminAuditLog>[] = [
    {
      title: '时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 180,
    },
    { title: '管理员', dataIndex: 'adminEmail', width: 200 },
    { title: '操作', dataIndex: 'action', width: 120 },
    { title: '资源', dataIndex: 'resource', width: 120 },
    { title: '资源 ID', dataIndex: 'resourceId', ellipsis: true },
  ];

  return (
    <PageContainer title="数据分析">
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic title="注册用户" value={stats?.totalUsers ?? 0} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="今日新增"
                value={stats?.usersCreatedToday ?? 0}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="过关记录"
                value={stats?.totalCompletions ?? 0}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="精选词库"
                value={stats?.totalCollections ?? 0}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic title="活跃公告" value={stats?.activeNotices ?? 0} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="后端状态"
                value={stats?.health.status === 'ok' ? '正常' : '未知'}
              />
            </Card>
          </Col>
        </Row>
      </Spin>

      <Card title="操作审计日志" style={{ marginTop: 16 }}>
        <ProTable<AdminAuditLog>
          rowKey="id"
          search={false}
          columns={auditColumns}
          request={async (params) => {
            const response = await listAuditLogs({
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
      </Card>
    </PageContainer>
  );
};

export default AnalyticsPage;
