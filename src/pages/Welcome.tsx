import { PageContainer } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Card, Col, Row, Statistic } from 'antd';
import React from 'react';

const Welcome: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  return (
    <PageContainer title="MyWordFlow 后台概览">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="当前管理员" value={currentUser?.name || '-'} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="系统" value="MyWordFlow Admin" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="后端 API" value="NestJS" />
          </Card>
        </Col>
      </Row>
      <Card style={{ marginTop: 16 }} title="快捷入口">
        <p>通过左侧菜单管理用户与精选词库，所有变更会同步到 App 端公开接口。</p>
        <p>
          <a onClick={() => history.push('/admin/users')}>用户管理</a>
          {' · '}
          <a onClick={() => history.push('/admin/collections')}>精选词库管理</a>
        </p>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
