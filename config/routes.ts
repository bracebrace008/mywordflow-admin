export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: '登录',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/welcome',
    name: '概览',
    icon: 'dashboard',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: '系统管理',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/users',
      },
      {
        path: '/admin/users',
        name: '用户管理',
        component: './admin/users',
      },
      {
        path: '/admin/admins',
        name: '管理员管理',
        component: './admin/admins',
      },
      {
        path: '/admin/collections',
        name: '精选词库',
        component: './admin/collections',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './exception/403',
    layout: false,
    path: '/403',
  },
  {
    component: './exception/404',
    layout: false,
    path: './*',
  },
];
