import { PageContainer } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Card, Col, Row, Spin, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import { type AdminStats, getStats } from '@/services/mywordflow/admin';

const Welcome: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then((response) => setStats(response.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageContainer title="MyWordFlow 后台概览">
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card>
              <Statistic title="当前管理员" value={currentUser?.name || '-'} />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Statistic title="注册用户" value={stats?.totalUsers ?? 0} />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title="今日新增用户"
                value={stats?.usersCreatedToday ?? 0}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title="精选词库"
                value={stats?.totalCollections ?? 0}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title="过关记录总数"
                value={stats?.totalCompletions ?? 0}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Statistic title="活跃公告" value={stats?.activeNotices ?? 0} />
            </Card>
          </Col>
        </Row>
      </Spin>
      <Card style={{ marginTop: 16 }} title="快捷入口">
        <p>
          通过左侧菜单管理用户、精选词库与公告，所有变更会同步到 App
          端公开接口。
        </p>
        <p>
          后端状态：
          {stats?.health.status === 'ok' ? ' 正常' : ' 未知'}
        </p>
        <p>
          <a onClick={() => history.push('/admin/users')}>用户管理</a>
          {' · '}
          <a onClick={() => history.push('/admin/collections')}>精选词库</a>
          {' · '}
          <a onClick={() => history.push('/admin/notices')}>公告管理</a>
          {' · '}
          <a onClick={() => history.push('/admin/analytics')}>数据分析</a>
        </p>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
