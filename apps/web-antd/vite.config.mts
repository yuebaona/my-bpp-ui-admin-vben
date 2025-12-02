import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/admin-api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/admin-api/, ''),
            // mock代理目标地址
            target: 'http://10.15.28.82:32554/admin-api',
            //网关地址
            // target: 'http://10.19.23.118:48080/admin-api',
            ws: false,
          },
        },
      },
    },
  };
});
