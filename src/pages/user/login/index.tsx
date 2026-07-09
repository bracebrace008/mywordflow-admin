import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { Helmet, history, useModel } from '@umijs/max';
import { Alert, App } from 'antd';
import { createStyles } from 'antd-style';
import React, { startTransition, useState } from 'react';
import { Footer } from '@/components';
import {
  clearToken,
  getProfile,
  login,
  setToken,
} from '@/services/mywordflow/auth';
import type { UserProfile } from '@/services/mywordflow/types';
import Settings from '../../../../config/defaultSettings';

const getSafeRedirectUrl = (redirect: string | null): string => {
  if (!redirect?.startsWith('/')) return '/welcome';
  if (redirect.startsWith('//')) return '/welcome';
  try {
    const parsed = new URL(redirect, window.location.origin);
    if (parsed.origin !== window.location.origin) return '/welcome';
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return '/welcome';
  }
};

const useStyles = createStyles(({ token }) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'auto',
    backgroundImage:
      "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
    backgroundSize: '100% 100%',
  },
  lang: {
    width: 42,
    height: 42,
    lineHeight: '42px',
    position: 'fixed',
    right: 16,
    borderRadius: token.borderRadius,
  },
}));

function mapProfileToCurrentUser(profile: UserProfile): API.CurrentUser {
  return {
    name: profile.displayName,
    avatar: profile.avatarUrl ?? undefined,
    userid: profile.userId,
    access: profile.role === 'admin' ? 'admin' : 'user',
  };
}

const Login: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const { message } = App.useApp();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setErrorMessage('');
    try {
      const response = await login(values.email, values.password);
      setToken(response.data.token);

      const profileResponse = await getProfile();
      const profile = profileResponse.data;
      if (profile.role !== 'admin') {
        clearToken();
        setErrorMessage('当前账号无后台管理权限');
        return;
      }

      const currentUser = mapProfileToCurrentUser(profile);
      startTransition(() => {
        setInitialState((s) => ({
          ...s,
          currentUser,
        }));
      });

      message.success('登录成功');
      const urlParams = new URL(window.location.href).searchParams;
      const redirectUrl = getSafeRedirectUrl(urlParams.get('redirect'));
      history.push(redirectUrl);
    } catch (error: any) {
      clearToken();
      setErrorMessage(error?.message || '登录失败，请重试');
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>{`登录 - ${Settings.title}`}</title>
      </Helmet>
      <div style={{ flex: 1, padding: '32px 0' }}>
        <LoginForm
          contentStyle={{ minWidth: 280, maxWidth: '75vw' }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="MyWordFlow"
          subTitle="后台管理系统"
          onFinish={handleSubmit}
        >
          {errorMessage ? (
            <Alert
              style={{ marginBottom: 24 }}
              title={errorMessage}
              type="error"
              showIcon
            />
          ) : null}
          <ProFormText
            name="email"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder="管理员邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '邮箱格式不正确' },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          />
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
