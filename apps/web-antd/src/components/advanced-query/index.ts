import type { App } from 'vue';

import AdvancedQuery from './advanced-query.vue';

// 导出组件
export { AdvancedQuery };

// 导出类型
export * from './types';

// 默认导出
export default {
  install(app: App) {
    app.component('AdvancedQuery', AdvancedQuery);
  },
};

// 组件注册
export const install = (app: App) => {
  app.component('AdvancedQuery', AdvancedQuery);
};
