import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/bpp/changeorder/acceptance/plan/update/',
    component: () =>
      import('#/views/bpp/changeorder/acceptance/plan/update/index.vue'),
    name: 'acceptancePlanUpdate',
    meta: {
      title: '受理计划修改',
      icon: 'ant-design:history-outlined',
      activePath: '/bpp/changeorder/acceptance/plan/info',
      keepAlive: false,
      hideInMenu: true,
    },
  },
];

export default routes;
