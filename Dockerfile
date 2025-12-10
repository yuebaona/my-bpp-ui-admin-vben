FROM swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/node:22-slim AS builder

# --max-old-space-size
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_OPTIONS=--max-old-space-size=8192
ENV TZ=Asia/Shanghai

RUN npm config set registry https://registry.npmmirror.com

RUN npm i -g corepack

WORKDIR /app

# copy package.json and pnpm-lock.yaml to workspace
COPY . /app

# 安装依赖
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build --filter='!./docs'
RUN echo "Builder Success 🎉"


# 第二阶段：运行环境
FROM swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/nginx:stable-alpine

# 复制构建好的文件到Nginx的静态文件目录
COPY --from=builder /app/apps/web-antd/dist /usr/share/nginx/html

# 复制Nginx配置文件
COPY scripts/deploy/nginx.conf  /etc/nginx/nginx.conf

# 暴露80端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]
