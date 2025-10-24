---
outline: deep
---

# Linux 部署

本小节，讲解如何将前端 + 后端项目，**使用 Shell 脚本**，部署到 dev 开发环境下的一台 Linux 服务器上。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/dc5f673b-52a3-4eab-aa12-a44093e9938a.png)

## 1. 环境准备

需要安装如下环境：

- MySQL：数据库

- Redis：缓存

- JDK：后端运行环境

- Nginx：负载均衡

- Nacos：注册/配置中心

### 1.1 安装 MySQL

需要安装 MySQL，并导入 SQL 脚本。

#### 第一步，安装 MySQL（可选）

**友情提示：安装 MySQL 是可选步骤，也可以购买 MySQL 云服务。**

① 执行如下命令，进行 MySQL 的安装。

```bash
## ① 在 CentOS 9 下，安装 MySQL 8.4 版本的软件源 https://dev.mysql.com/downloads/repo/yum/
rpm -Uvh https://repo.mysql.com//mysql84-community-release-el9-1.noarch.rpm

## ② 安装 MySQL Server 8.4 版本
yum install mysql-server --nogpgcheck

## ③ 查看 MySQL 的安装版本。结果是 /usr/sbin/mysqld  Ver 8.4.2 for Linux on x86_64 (MySQL Community Server - GPL)
mysqld --version

```

② 修改 `/etc/my.cnf` 文件，在文末加上 `lower_case_table_names=1` 配置，执行 `systemctl restart mysqld` 命令重启。

**踩坑提示：**

为什么 MySQL 启动后，后续无法修改 `lower_case_table_names=1` 呢？

原因和解决，参考 [https://www.cnblogs.com/niceyoo/p/11545196.html (opens new window)](https://www.cnblogs.com/niceyoo/p/11545196.html)博客！

③ 执行 `grep password /var/log/mysqld.log` 命令，获得 MySQL 临时密码。

```bash
2024-09-26T01:51:44.277843Z 6 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: iLXXg3.tje;8

```

④ 执行如下命令，修改 MySQL 的密码，设置允许远程连接。

```bash
## ① 连接 MySQL Server 服务，并输入临时密码
mysql -uroot -p

## ② 修改密码，3WLiVUBEwTbvAfsh. 可改成你想要的密码
alter user 'root'@'localhost' identified by '3WLiVUBEwTbvAfsh.';

## ③ 设置允许远程连接
use mysql;
update user set host = '%' where user = 'root';
FLUSH PRIVILEGES;

```

#### 第二步，导入 SQL 脚本

创建一个名字为 `ruoyi-vue-pro` 数据库，执行数据库对应的 [`sql` (opens new window)](https://github.com/YunaiV/ruoyi-vue-pro/tree/master/sql)目录下的 SQL 文件，进行初始化。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/b78499a7-484c-4ef5-859a-09d70f2b1c0e.png)

### 1.2 安装 Redis

**友情提示：安装 Redis 是可选步骤，也可以购买 Redis 云服务。**

执行如下命令，进行 Redis 的安装。

```bash
## ① 安装 Redis
yum install redis

## ② 查看 Redis 的安装版本。结果是 Redis server v=6.2.7 sha=00000000:0 malloc=jemalloc-5.1.0 bits=64 build=ec192bdd77ecd321
redis-server --version

## ④ 启动 Redis 服务
systemctl restart redis

```

- 端口是 6379，密码未设置

### 1.3 安装 JDK

执行 `yum install -y java-1.8.0-openjdk` 命令，安装 OpenJDK **8**。

**友情提示：如果已经安装 JDK，可不安装。建议使用的 JDK 版本为 8、11、17 这三个。**

### 1.4 安装 Nginx

参考 [Nginx 官方文档 (opens new window)](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/)，安装 Nginx 服务。命令如下：

```bash
## 添加 yum 源
yum install epel-release
yum update
## 安装 nginx
yum install nginx
## 启动 nginx
nginx

```

Nginx 默认配置文件是 `/etc/nginx/nginx.conf`。

### 1.5 安装 Nacos

#### 第一步，下载编译后压缩包

① 新建 `/work` 目录，再从 [最新稳定版本 (opens new window)](https://github.com/alibaba/nacos/releases)下载 `nacos-server-$version.zip` 包。

② 执行 `unzip nacos-server-$version.zip` 解压缩，它最终在 `/work/nacos/` 目录如下

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/de93fa6d-5162-4569-ba41-ce83acfbb3c0.png)

#### 第二步，修改配置

修改 `conf/application.properties` 配置文件，主要是修改数据库、认证相关的配置。如下所示：

```properties
### 数据库配置（直接添加）
spring.datasource.platform=mysql
db.num=1
db.url.0=jdbc:mysql://8.149.143.162:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
db.user=root
db.password=3WLiVUBEwTbvAfsh.

### 认证配置（需要检索到对应的配置项，进行修改）
nacos.core.auth.enabled=true
# 自定义用于生成 JWT 令牌的密钥，注意：原始密钥长度不得低于 32 字符，且一定要进行 Base64 编码，否则无法启动节点
nacos.core.auth.plugin.nacos.token.secret.key=RTF0SE41WFRDbEQybXN0SXBibmhQQjZ5bWpUWG9Bc1Y=
# 配置自定义身份识别的 key 和 value，这两个属性是 auth 的白名单，用于标识来自其它服务器的请求。具体实现见 com.alibaba.nacos.core.auth.AuthFilter
nacos.core.auth.server.identity.key=admin
nacos.core.auth.server.identity.value=admin

```

① `db.url.0`、`db.user`、`db.password` 修改为你的 MySQL 数据库地址、用户名、密码。

同时，需要使用 Navicat 把 `conf/mysql-schema.sql` 导入到 MySQL 数据库中。

② `nacos.core.auth.server.identity.key` 和 `nacos.core.auth.server.identity.key` 可以使用随机的字符串。

`nacos.core.auth.plugin.nacos.token.secret.key` 可以随机一个 32 位的字符串，然后使用 [Base64 (opens new window)](https://tool.oschina.net/encrypt?type=3)编码。

#### 第三步，启动 Nacos

① 重要！需要设置下 `JAVA_HOME`，否则会出现类似 [《When using open jdk to log in to nacos it failed》 (opens new window)](https://github.com/alibaba/nacos/issues/711)！！！例如说：

```bash
## 补充提示：OpenJDK 安装在 /usr/lib/jvm/ 目录下
export JAVA_HOME=/usr/lib/jvm/jre-1.8.0

```

② 执行 `sh bin/startup.sh -m standalone` 命令，启动 Nacos 服务。可以通过 `logs/start.out` 查看启动成功日志。

```bash
2024-09-26 23:07:25,444 INFO Tomcat started on port(s): 8848 (http) with context path '/nacos'

```

#### 第四步，新建 dev 空间

① 访问 Nacos 控制台，地址是 `http://${服务器 IP}:8848/nacos`。默认账号密码都是 nacos，即可登录。

② 在 \[命名空间\] 菜单下，新建一个名字为 `dev` 的命名空间。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/73414cb9-ed22-40f5-a7b3-80a74cbcaa84.png)

## 2. 部署后端服务

本小节，我们来部署后端相关的服务，最小化的部署包括：

- `gateway-server` 网关

- `system-server` 服务

- `infra-server` 服务

其它的 `xxx-server` 服务的部署，和 `system-server`、`infra-server` 服务的部署类似，这里不再赘述。

#### 第一步，修改配置

① `gateway-server` 网关，dev 开发环境对应的是 [`application-dev.yaml` (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-gateway/src/main/resources/application-dev.yaml#L3-L14)配置文件，主要是修改 Nacos 为你的地址。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/56114025-4ffd-4c19-ae09-da756645f460.png)

② `system-server` 服务，dev 开发环境对应的是 [`application-dev.yaml` (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-system/yudao-module-system-biz/src/main/resources/application-dev.yaml#L57-L73)配置文件，主要是修改 Nacos、MySQL、Redis 为你的地址。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/71821bcc-25d0-4637-bb1a-c0a5e12ca436.png)

③ `infra-server` 服务，操作同 `system-server` 服务，不重复赘述。

#### 第二步，编译后端

在项目的根目录下，执行 `mvn clean package -Dmaven.test.skip=true` 命令，编译后端项目，构建出它的 Jar 包。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/80dd94e9-6edd-4d67-ae95-a4f99a746722.png)

**疑问：-Dmaven.test.skip=true 是什么意思？**

跳过单元测试的执行。如果你项目的单元测试写的不错，建议使用 `mvn clean package` 命令，执行单元测试，保证交付的质量。

#### 第三步，上传 Jar 包

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/469fc51e-5ca3-46ca-9dbe-31ef6ef3baf2.png)

① 在 Linux 服务器上创建 `/work/projects/gateway-server` 目录，使用 `scp` 命令或者 FTP 工具，将 `yudao-gateway.jar` 上传到该目录下，并重名为 `gateway-server.jar`。

② 在 Linux 服务器上创建 `/work/projects/system-server` 目录，使用 `scp` 命令或者 FTP 工具，将 `yudao-module-system-biz.jar` 上传到该目录下，并重名为 `system-server.jar`。

③ 在 Linux 服务器上创建 `/work/projects/infra-server` 目录，使用 `scp` 命令或者 FTP 工具，将 `yudao-module-infra-biz.jar` 上传到该目录下，并重名为 `infra-server.jar`。

#### 第四步，编写脚本

① 在 `/work/projects/gateway-server` 目录下，新建 Shell 脚本 `deploy.sh`，用于启动 `gateway-server` 网关。编写内容如下：

```bash
#!/bin/bash
set -e

DATE=$(date +%Y%m%d%H%M)
# 基础路径
BASE_PATH=/work/projects/gateway-server
# 服务名称。同时约定部署服务的 jar 包名字也为它。
SERVER_NAME=gateway-server
# 环境
PROFILES_ACTIVE=dev

# heapError 存放路径
HEAP_ERROR_PATH=$BASE_PATH/heapError
# JVM 参数
JAVA_OPS="-Xms512m -Xmx512m -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=$HEAP_ERROR_PATH"

# SkyWalking Agent 配置
#export SW_AGENT_NAME=$SERVER_NAME
#export SW_AGENT_COLLECTOR_BACKEND_SERVICES=192.168.0.84:11800
#export SW_GRPC_LOG_SERVER_HOST=192.168.0.84
#export SW_AGENT_TRACE_IGNORE_PATH="Redisson/PING,/actuator/**,/admin/**"
#export JAVA_AGENT=-javaagent:/work/skywalking/apache-skywalking-apm-bin/agent/skywalking-agent.jar

# 停止：优雅关闭之前已经启动的服务
function stop() {
    echo "[stop] 开始停止 $BASE_PATH/$SERVER_NAME"
    PID=$(ps -ef | grep $BASE_PATH/$SERVER_NAME | grep -v "grep" | awk '{print $2}')
    # 如果 Java 服务启动中，则进行关闭
    if [ -n "$PID" ]; then
        # 正常关闭
        echo "[stop] $BASE_PATH/$SERVER_NAME 运行中，开始 kill [$PID]"
        kill -15 $PID
        # 等待最大 120 秒，直到关闭完成。
        for ((i = 0; i < 120; i++))
            do
                sleep 1
                PID=$(ps -ef | grep $BASE_PATH/$SERVER_NAME | grep -v "grep" | awk '{print $2}')
                if [ -n "$PID" ]; then
                    echo -e ".\c"
                else
                    echo '[stop] 停止 $BASE_PATH/$SERVER_NAME 成功'
                    break
                fi
		    done

        # 如果正常关闭失败，那么进行强制 kill -9 进行关闭
        if [ -n "$PID" ]; then
            echo "[stop] $BASE_PATH/$SERVER_NAME 失败，强制 kill -9 $PID"
            kill -9 $PID
        fi
    # 如果 Java 服务未启动，则无需关闭
    else
        echo "[stop] $BASE_PATH/$SERVER_NAME 未启动，无需停止"
    fi
}

# 启动：启动后端项目
function start() {
    # 开启启动前，打印启动参数
    echo "[start] 开始启动 $BASE_PATH/$SERVER_NAME"
    echo "[start] JAVA_OPS: $JAVA_OPS"
    echo "[start] JAVA_AGENT: $JAVA_AGENT"
    echo "[start] PROFILES: $PROFILES_ACTIVE"

    # 开始启动
    nohup java -server $JAVA_OPS $JAVA_AGENT -jar $BASE_PATH/$SERVER_NAME.jar --spring.profiles.active=$PROFILES_ACTIVE > nohup.out 2>&1 &
    echo "[start] 启动 $BASE_PATH/$SERVER_NAME 完成"
}

# 部署
function deploy() {
    cd $BASE_PATH
    # 第一步：停止 Java 服务
    stop
    # 第二步：启动 Java 服务
    start
}

deploy

```

如果你想要修改脚本，主要关注 `BASE_PATH`、`PROFILES_ACTIVE`、`JAVA_OPS` 三个参数。如下图所示：

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/WgZOZA8wX715oqLX/img/aa1b6e0e-bb72-4b01-9362-e6b6ce5bff5b.png)

② 在 `/work/projects/system-server` 目录下，新建 Shell 脚本 `deploy.sh`，用于启动 `system-server` 服务。

只是把 `BASE_PATH` 和 `SERVER_NAME` 修改为 `system-server` 即可。

③ 在 `/work/projects/infra-server` 目录下，新建 Shell 脚本 `deploy.sh`，用于启动 `infra-server` 服务。

只是把 `BASE_PATH` 和 `SERVER_NAME` 修改为 `infra-server` 即可。

#### 第五步，启动后端

① 在 `/work/projects/gateway-server` 目录下，执行 `sh deploy.sh` 命令，启动 `gateway-server` 网关。日志如下：

```bash
[stop] 开始停止 /work/projects/gateway-server/gateway-server
[stop] /work/projects/gateway-server/gateway-server 未启动，无需停止
[start] 开始启动 /work/projects/gateway-server/gateway-server
[start] JAVA_OPS: -Xms512m -Xmx512m -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/work/projects/gateway-server/heapError
[start] JAVA_AGENT:
[start] PROFILES: dev
[start] 启动 /work/projects/gateway-server/gateway-server 完成

```

之后，执行 `tail -f nohup.out` 命令，查看启动日志。看到如下内容，说明启动完成：

```bash
2022-04-13 00:06:20.049  INFO 1395 --- [main] [TID: N/A] c.i.yudao.server.YudaoServerApplication  : Started YudaoServerApplication in 35.315 seconds (JVM running for 36.282)

```

然后，打开 Nacos 控制台，查看服务是否注册成功。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/725c2373-54a5-4eb6-a4d5-9605dc693b11.png)

② 在 `/work/projects/system-server` 目录下，执行 `sh deploy.sh` 命令，启动 `system-server` 服务。后续情况同 `gateway-server` 网关。

③ 在 `/work/projects/infra-server` 目录下，执行 `sh deploy.sh` 命令，启动 `infra-server` 服务。后续情况同 `gateway-server` 网关。

## 3. 部署前端

项目的管理后台有 3 个版本（只需要看你的版本即可）：

- `yudao-ui-admin-vue3`：基于 Vue3 + element-plus

- `yudao-ui-admin-vben`：基于 Vue3 + vben5.0(ant-design-vue)

- `yudao-ui-admin-vue2`：基于 Vue2 + element-ui

注意，前端无法直接启动，而是需要通过 Nginx 转发读取前端构建出来的静态文件，最终都放在服务器上的 `/work/projects/yudao-ui-admin` 目录下。

### 3.1 yudao-ui-admin-vue3

基于 Vue3 + element-plus

#### 第一步，修改配置

前端 dev 开发环境对应的是 [`.env.dev` (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vue3/blob/master/.env.dev#L6-L7)配置文件，主要是修改 `VITE_BASE_URL` 为你的后端项目的访问地址。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/b6aa5296-0ecf-47ce-abf6-376068906335.png)

#### 第二步，编译前端

在前端项目的根目录下，执行 `npm run build:dev` 命令，编译前端项目，构建出它的 `dist` 文件，里面是 HTML、CSS、JavaScript 等静态文件。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/a0a7e73d-03bf-4072-acfa-ec73b870c68d.png)

如下想要打包其它环境，可使用如下命令：

```bash
npm run build:prod ## 打包 prod 生产环境
npm run build:stage ## 打包 stage 预发布环境

```

**其它高级参数说明【可暂时不看】：**

① `VITE_PUBLIC_PATH`：前端打包的路径（静态资源的基础路径），一般默认为 `/` 即可。目前有两种用法：

第一种，可用于二级目录部署。例如说，`VITE_PUBLIC_PATH` 设置为 `/demo` 。然后 Nginx 配置时，需要特殊注意，如下所示：

```bash
        location /demo { # 注意点 1：不需要 / 结尾
            # 注意点 2：二级路由时需要使用别名 alias，不用 root
            alias   /work/projects/yudao-ui-admin/; # 注意点 3：需要 / 结尾
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

```

第二种，可用于七牛等 CDN 服务，读取前端的静态文件，提升访问速度，建议 prod 生产环境使用。例如说，我们演示环境的 `VITE_PUBLIC_PATH` 是 `http://static-vue3.yudao.iocoder.cn/` 。

#### 第三步，上传 `**dist**` 文件

在 Linux 服务器上创建 `/work/projects/yudao-ui-admin` 目录，使用 `scp` 命令或者 FTP 工具，将 `dist` 上传到该目录下。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/4d68dc4b-2878-47c1-b78a-46c8251fb9c9.png)

### 3.2 yudao-ui-admin-vben

基于 Vue3 + vben5.0(ant-design-vue)

#### 第一步，修改配置

前端 production 开发环境对应的是 [`.env.production` (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vben/blob/master/.env.production#L15-L21)配置文件，主要是修改 `VITE_GLOB_BASE_URL`、`VITE_GLOB_API_URL` 为你的后端项目的访问地址。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/a2264508-3f9a-4f6e-abe2-4c3494fc0ee6.png)

**其它高级参数说明【可暂时不看】：**

① `VITE_PUBLIC_PATH`：前端打包的路径（静态资源的基础路径），一般默认为 `/` 即可。目前有两种用法：

第一种，可用于二级目录部署。例如说，`VITE_PUBLIC_PATH` 设置为 `/demo` 。然后 Nginx 配置时，需要特殊注意，如下所示：

```bash
        location /demo { # 注意点 1：不需要 / 结尾
            # 注意点 2：二级路由时需要使用别名 alias，不用 root
            alias   /work/projects/yudao-ui-admin/; # 注意点 3：需要 / 结尾
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

```

第二种，可用于七牛等 CDN 服务，读取前端的静态文件，提升访问速度，建议 prod 生产环境使用。例如说，我们演示环境的 `VITE_PUBLIC_PATH` 是 `http://static-vue3.yudao.iocoder.cn/` 。

#### 第二步，编译前端

在前端项目的根目录下，执行 `npm run build` 命令，编译前端项目，构建出它的 `dist` 文件，里面是 HTML、CSS、JavaScript 等静态文件。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/ae144a9c-1fba-4179-b691-014d065b96e6.png)

#### 第三步，上传 `**dist**` 文件

在 Linux 服务器上创建 `/work/projects/yudao-ui-admin` 目录，使用 `scp` 命令或者 FTP 工具，将 `dist` 上传到该目录下。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/50b39fc3-9f9f-4b7a-9355-8ff69f655310.png)

### 3.3 yudao-ui-admin-vue2

基于 Vue2 + element-ui

#### 第一步，修改配置

前端 dev 开发环境对应的是 [`.env.dev` (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vue2/blob/master/.env.dev)配置文件，主要是修改 `VUE_APP_BASE_API` 为你的后端项目的访问地址。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/d3ff2795-4181-4ce5-ba45-6ba5d27838cb.png)

#### 第二步，编译前端

在前端项目的根目录下，执行 `npm run build:dev` 命令，编译前端项目，构建出它的 `dist` 文件，里面是 HTML、CSS、JavaScript 等静态文件。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/a6a51280-6cfc-4374-b315-89518acf39d5.png)

如下想要打包其它环境，可使用如下命令：

```bash
npm run build:prod ## 打包 prod 生产环境
npm run build:stage ## 打包 stage 预发布环境

```

**其它高级参数说明【可暂时不看】：**

① `PUBLIC_PATH`：可用于七牛等 CDN 服务，读取前端的静态文件，提升访问速度，建议 prod 生产环境使用。示例如下：

可参考文章的 [《Vue 项目使用七牛云 CDN 存放静态资源》 (opens new window)](https://blog.csdn.net/weixin_71403100/article/details/132037721)的「二、实现方式 」部分，只是最终的“修改 index.html 中静态资源引用”，变成 `PUBLIC_PATH` 修改即可。

② `VUE_APP_APP_NAME`：二级部署路径，默认为 `/` 根目录，一般不用修改。

③ `mode`：前端路由的模式，默认采用 `history` 路由，一般不用修改。可以通过修改 [`router/index.js` (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vue2/blob/master/src/router/index.js#L173-L178)来设置为 `hash` 路由，示例如下：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/ca737a3d-27eb-46fc-aed1-4fdb4175d3e3.png)

#### 第三步，上传 `**dist**` 文件

在 Linux 服务器上创建 `/work/projects/yudao-ui-admin` 目录，使用 `scp` 命令或者 FTP 工具，将 `dist` 上传到该目录下。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/09ec2024-e9c0-42a3-b14c-5c4fd0f1d432.png)

（图中的目录不太对，以文字为准！！！）

## 4. 配置 Nginx 转发

两种 Nginx 的配置，分别满足服务器 IP、独立域名的不同场景。

### 4.1 方式一：服务器 IP 访问

① 修改 Nginx 配置，内容如下：

```nginx
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    gzip on;
    gzip_min_length 1k;     # 设置允许压缩的页面最小字节数
    gzip_buffers 4 16k;     # 用来存储 gzip 的压缩结果
    gzip_http_version 1.1;  # 识别 HTTP 协议版本
    gzip_comp_level 2;      # 设置 gzip 的压缩比 1-9。1 压缩比最小但最快，而 9 相反
    gzip_types gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; # 指定压缩类型
    gzip_proxied any;       # 无论后端服务器的 headers 头返回什么信息，都无条件启用压缩

    server {
        listen       80;
        server_name  192.168.225.2; ## 重要！！！修改成你的外网 IP/域名

        location / { ## 前端项目
            root   /work/projects/yudao-ui-admin;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

        location /admin-api/ { ## 后端项目 - 管理后台
            proxy_pass http://localhost:48080/admin-api/; ## 重要！！！proxy_pass 需要设置为后端项目所在服务器的 IP
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location /app-api/ { ## 后端项目 - 用户 App
            proxy_pass http://localhost:48080/app-api/; ## 重要！！！proxy_pass 需要设置为后端项目所在服务器的 IP
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

    }

}

```

② 执行 `nginx -s reload` 命令，重新加载 Nginx 配置。

③ 请求 [http://192.168.225.2/admin-api/ (opens new window)](http://192.168.225.2/admin-api/)地址，成功访问后端项目，返回结果如下：

```json
{ "code": 401, "data": null, "msg": "账号未登录" }
```

④ 请求 [http://192.168.225.2 (opens new window)](http://192.168.225.2/)地址，成功访问前端项目，返回前端界面如下：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/b1e97fed-f0b4-45d4-ba49-feb5787ddf3b.png)

⑤ 如果你使用到 WebSocket 的话，需要额外对 `/infra/ws` 路径进行配置，具体可见 [https://t.zsxq.com/LQEfC (opens new window)](https://t.zsxq.com/LQEfC)链接。

### 4.2 方式二：独立域名访问

**友情提示：在前端项目的编译时，需要把 \`VUE_APP_BASE_API\` 修改为后端项目对应的域名。**

例如说，这里使用的是 `http://api.iocoder.cn`

① 修改 Nginx 配置，内容如下：

```bash
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    gzip on;
    gzip_min_length 1k;     # 设置允许压缩的页面最小字节数
    gzip_buffers 4 16k;     # 用来存储 gzip 的压缩结果
    gzip_http_version 1.1;  # 识别 HTTP 协议版本
    gzip_comp_level 2;      # 设置 gzip 的压缩比 1-9。1 压缩比最小但最快，而 9 相反
    gzip_types text/plain application/x-javascript text/css application/xml application/javascript; # 指定压缩类型
    gzip_proxied any;       # 无论后端服务器的 headers 头返回什么信息，都无条件启用压缩

    server { ## 前端项目
        listen       80;
        server_name  admin.iocoder.cn; ## 重要！！！修改成你的前端域名

        location / { ## 前端项目
            root   /work/projects/yudao-ui-admin;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

    }

    server { ## 后端项目
        listen       80;
        server_name  api.iocoder.cn; ## 重要！！！修改成你的外网 IP/域名

        ## 不要使用 location / 转发到后端项目，因为 druid、admin 等监控，不需要外网可访问。或者增加 Nginx IP 白名单限制也可以。

        location /admin-api/ { ## 后端项目 - 管理后台
            proxy_pass http://localhost:48080/admin-api/; ## 重要！！！proxy_pass 需要设置为后端项目所在服务器的 IP
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location /app-api/ { ## 后端项目 - 用户 App
            proxy_pass http://localhost:48080/app-api/; ## 重要！！！proxy_pass 需要设置为后端项目所在服务器的 IP
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

    }
}

```

② 执行 `nginx -s reload` 命令，重新加载 Nginx 配置。

③ 请求 [http://api.iocoder.cn/admin-api/ (opens new window)](http://api.iocoder.cn/admin-api/)地址，成功访问后端项目，返回结果如下：

```json
{ "code": 401, "data": null, "msg": "账号未登录" }
```

④ 请求 [http://admin.iocoder.cn (opens new window)](http://admin.iocoder.cn/)地址，成功访问前端项目，返回前端界面如下：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/7c0d87ff-2f28-4548-8b3c-a33d448126d6.png)
