FROM swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/nginx:stable-alpine AS production



# 复制构建好的文件到Nginx的静态文件目录
COPY /apps/web-antd/dist /usr/share/nginx/html

# 复制Nginx配置文件
COPY /scripts/deploy/nginx.conf  /etc/nginx/nginx.conf

RUN cat  /etc/nginx/nginx.conf

# 暴露80端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]
