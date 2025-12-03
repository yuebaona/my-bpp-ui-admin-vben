import type { RouteRecordRaw } from 'vue-router';

// 受理审批路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/bpp',
    name: 'bpp',
    meta: {
      title: '受理审批',
      hideInMenu: true,
    },
    children: [
      {
        path: 'flowacceptanceplanovropr/flow/create',
        name: 'FlowacceptanceplanovroprCreate',
        component: () =>
          import('#/views/bpp/flow/acceptance/plan/over/operation/workflow/create.vue'),
        meta: {
          title: '创建受理审批',
          activePath: '/bpp/flowacceptanceplanovropr/flow',
        },
      },
      {
        path: 'flowacceptanceplanovropr/flow/detail',
        name: 'FlowacceptanceplanovroprCreateDetail',
        component: () =>
          import('#/views/bpp/flow/acceptance/plan/over/operation/workflow/detail.vue'),
        meta: {
          title: '受理审批详情',
          activePath: '/bpp/flowacceptanceplanovropr/flow',
        },
      },
    ],
  },
];

export default routes;
