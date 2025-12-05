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
          import(
            '#/views/bpp/flow/acceptance/plan/over/operation/workflow/create.vue'
          ),
        meta: {
          title: '创建受理审批',
          activePath: '/bpp/flowacceptanceplanovropr/flow',
        },
      },
      {
        path: 'flowacceptanceplanovropr/flow/detail',
        name: 'FlowacceptanceplanovroprCreateDetail',
        component: () =>
          import(
            '#/views/bpp/flow/acceptance/plan/over/operation/workflow/detail.vue'
          ),
        meta: {
          title: '受理审批详情',
          activePath: '/bpp/flowacceptanceplanovropr/flow',
        },
      },
      {
        path: 'flowacceptanceplanovropr/spreader/flow/create',
        name: 'FlowacceptanceplanovroprSpreaderCreate',
        component: () =>
          import(
            '#/views/bpp/flow/acceptance/plan/over/operation/workflow/spreader/create.vue'
          ),
        meta: {
          title: '创建吊具变更审批',
          activePath: '/bpp/flowacceptanceplanovropr/spreader/flow/create',
        },
      },
      {
        path: 'flowacceptanceplanovropr/spreader/flow/detail',
        name: 'FlowacceptanceplanovroprSpreaderDetail',
        component: () =>
          import(
            '#/views/bpp/flow/acceptance/plan/over/operation/workflow/spreader/detail.vue'
          ),
        meta: {
          title: '吊具变更审批详情',
          activePath: '/bpp/flowacceptanceplanovropr/spreader/flow/create',
        },
      },
    ],
  },
];

export default routes;
