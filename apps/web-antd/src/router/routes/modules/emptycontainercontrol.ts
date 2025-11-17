import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/emptycontainercontrol',
    component: () => import('#/views/bpp/emptycontainercontrol/index.vue'),
    name: 'emptycontainercontrol',
    meta: {
      title: '空箱控箱',
      icon: 'ant-design:history-outlined',
      hideInMenu: true,
    },
  },
];

export default routes;
