---
outline: deep
---

# 宝塔部署

本小节，讲解如何将前端 + 后端项目，**使用** [**宝塔 (opens new window)**](https://www.bt.cn/u/Nm1mHQ)，部署到 dev 开发环境下的一台 Linux 服务器上。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/b8a546d1-4776-4727-81f2-43d9474b2e80.png)

**友情提示：**

本文的部署过程，本质和 Linux 部署 一样，只是使用了宝塔面板，简化了一些操作。

## 1. 环境准备

需要安装如下环境：

- 宝塔：运维面板

- MySQL：数据库

- Redis：缓存

- JDK：后端运行环境

- Nginx：负载均衡

- Nacos：注册/配置中心

### 1.0 安装宝塔

① 访问 [宝塔 (opens new window)](https://www.bt.cn/u/Nm1mHQ)官网，注册账号。因为登录后，需要绑定宝塔账号。

② 访问 [https://www.bt.cn/new/download.html (opens new window)](https://www.bt.cn/new/download.html)地址，选择你的系统版本，下载对应的安装包。

这里，我们使用 Centos 9，所以只需要执行如下命令：

```bash
url=https://download.bt.cn/install/install_lts.sh;if [ -f /usr/bin/curl ];then curl -sSO $url;else wget -O install_lts.sh $url;fi;bash install_lts.sh ed8484bec

```

整个安装过程预计需要 5 分钟左右，成功后可见如下日志：

```bash
========================面板账户登录信息==========================

 【云服务器】请在安全组放行 23471 端口
 外网面板地址: https://8.149.143.162:23471/06777072
 内网面板地址: https://172.26.126.181:23471/06777072
 username: pru5q1ad
 password: 6fc718b8

```

③ 访问面板地址，使用上面的 `username`、`password` 登录。注意，第一次登录，需要绑定宝塔账号。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/6e26dcfd-8bb0-48fd-8997-3548fc14c7c8.png)

### 1.1 安装 MySQL

需要安装 MySQL，并导入 SQL 脚本。

#### 第一步，安装 MySQL

**友情提示：安装 MySQL 是可选步骤，也可以购买 MySQL 云服务。**

在宝塔首页，点击左侧的 \[数据库\] 菜单，选择 \[MySQL\] 选项，之后点击 \[安装mysql环境\] 选项。

再之后，选择 \[mysql 8.4.0\] 版本，点击 \[极速安装\] 按钮。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/d35d8767-2cd3-49ae-a10b-54688d1c6998.png)

#### 第二步，导入 SQL 脚本

① 点击 \[添加数据库\] 按钮，创建一个名字为 `ruoyi-vue-pro` 数据库，。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/b22d3d57-6c9e-4600-a6b6-a124458e9d6a.png)

② 点击 \[导入\] 按钮，再点击 \[从本地上传\] 按钮，执行数据库对应的 [`sql` (opens new window)](https://github.com/YunaiV/ruoyi-vue-pro/tree/master/sql)目录下的 SQL 文件，进行初始化。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/7dd67b6e-11ad-4c2d-8e31-005f34be4b4a.png)

**疑问：如何使用本地 Navicat 连接该 MySQL？**

参考 [https://www.bt.cn/bbs/thread-179-1-1.html (opens new window)](https://www.bt.cn/bbs/thread-179-1-1.html)文档。

当然，如果使用阿里云等云服务，相关的 3306 端口也需要放行。

### 1.2 安装 Redis

**友情提示：安装 Redis 是可选步骤，也可以购买 Redis 云服务。**

在宝塔首页，点击左侧的 \[数据库\] 菜单，选择 \[Redis\] 选项，之后点击 \[安装Redis环境\] 选项。

再之后，选择 \[redis 7.2.4\] 版本，点击 \[立即安装\] 按钮。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/72de4711-ce6d-48ac-a3dc-f37fe284a8b6.png)

### 1.3 安装 JDK

在宝塔首页，点击左侧的 \[网站\] 菜单，之后选择 \[Java 项目\] 选项。

再之后，点击 \[Java环境管理\] 按钮，选择 \[jdk1.8.0_371\] 版本，点击 \[安装\] 按钮。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/2b86c0d8-37d6-4008-8ff7-3e83c54671f6.png)

**友情提示：如果已经安装 JDK，可不安装。建议使用的 JDK 版本为 8、11、17 这三个。**

### 1.4 安装 Nginx

在宝塔首页，点击左侧的 \[网站\] 菜单，之后选择 \[反向代理\] 选项。

再之后，点击 \[安装Nginx\] 按钮，选择 \[nginx 1.24.0\] 版本，点击 \[极速安装\] 按钮。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/8485733d-db55-4673-80b0-3675caa3271c.png)

### 1.5 安装 Nacos

#### 第一步，安装 Nacos

① 在宝塔首页，点击左侧的 \[软件商店\] 菜单，之后在“应用搜索”输入“nacos”进行搜索。

搜索后，点击 \[安装\] 按钮，选择 \[1.1 Stable\] 版本，点击 \[立即安装\] 按钮。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/30b5c443-9a8a-4082-8731-76e25270be36.png)

② 安装完成后，点击 \[设置\] 按钮，选择 \[服务状态\] 选项，点上 \[允许外部访问\] 按钮。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/b7beba2e-bf44-458a-8dea-c954cb39865e.png)

#### 第二步，配置 Nacos

① 在宝塔的 MySQL 数据库，创建一个名字为 `nacos` 数据库，之后把 [`conf/mysql-schema.sql` (opens new window)](https://github.com/alibaba/nacos/blob/master/distribution/conf/mysql-schema.sql)导入到该数据库中。

② 继续点击 Nacos 的 \[设置\] 按钮，选择 \[配置信息\] 选项，填写 MySQL 的连接信息。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/984fac54-7a94-4e6e-8792-0454e60f22ee.png)

```properties
### 数据库配置（需要检索到对应的配置项，进行修改）
# spring.datasource.platform=mysql
spring.sql.init.platform=mysql

### Count of DB:
db.num=1

### Connect URL of DB:
db.url.0=jdbc:mysql://127.0.0.1:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
db.user.0=nacos
db.password.0=yAFKWbACp8bSHGXy

```

---

③ 继续点击 Nacos 的 \[设置\] 按钮，选择 \[配置信息\] 选项，认证相关的配置。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/a666cd6f-6409-4258-9fc9-a5c81e212562.png)

```properties
### 认证配置（需要检索到对应的配置项，进行修改）
nacos.core.auth.enabled=true
# 自定义用于生成 JWT 令牌的密钥，注意：原始密钥长度不得低于 32 字符，且一定要进行 Base64 编码，否则无法启动节点
nacos.core.auth.plugin.nacos.token.secret.key=RTF0SE41WFRDbEQybXN0SXBibmhQQjZ5bWpUWG9Bc1Y=
# 配置自定义身份识别的 key 和 value，这两个属性是 auth 的白名单，用于标识来自其它服务器的请求。具体实现见 com.alibaba.nacos.core.auth.AuthFilter
nacos.core.auth.server.identity.key=admin
nacos.core.auth.server.identity.value=admin

```

- `nacos.core.auth.server.identity.key` 和 `nacos.core.auth.server.identity.key` 可以使用随机的字符串。

- `nacos.core.auth.plugin.nacos.token.secret.key` 可以随机一个 32 位的字符串，然后使用 [Base64 (opens new window)](https://tool.oschina.net/encrypt?type=3)编码。

#### 第三步，启动 Nacos

① 点击 \[服务状态\] 选项，点击 \[重启\] 按钮，进行 Nacos 的重启，使配置生效。

② 如果启动失败，可以点击 \[日志\] 选项，选择 \[状态变化日志\] 选项，查看具体的错误信息。

**如果出现数据库表缺少 \`config_info_aggr\` 会报错，可参考球友 //t.zsxq.com/fPJB4> 。**

#### 第四步，新建 dev 空间

① 访问 Nacos 控制台，地址是 `http://${服务器 IP}:8848/nacos`。默认账号密码都是 nacos，即可登录。

② 在 \[命名空间\] 菜单下，新建一个名字为 `dev` 的命名空间。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/d7953296-47ad-43de-915b-c6d4042a2715.png)

## 2. 部署后端服务

本小节，我们来部署后端相关的服务，最小化的部署包括：

- `gateway-server` 网关

- `system-server` 服务

- `infra-server` 服务

其它的 `xxx-server` 服务的部署，和 `system-server`、`infra-server` 服务的部署类似，这里不再赘述。

#### 第一步，修改配置

① `gateway-server` 网关，dev 开发环境对应的是 [`application-dev.yaml` (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-gateway/src/main/resources/application-dev.yaml#L3-L14)配置文件，主要是修改 Nacos 为你的地址。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/07ff156f-d624-4df4-86c5-75b3fba7b731.png)

② `system-server` 服务，dev 开发环境对应的是 [`application-dev.yaml` (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-system/yudao-module-system-biz/src/main/resources/application-dev.yaml#L57-L73)配置文件，主要是修改 Nacos、MySQL、Redis 为你的地址。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/14b26db8-2374-4c63-807f-75374ac27c49.png)

③ `infra-server` 服务，操作同 `system-server` 服务，不重复赘述。

#### 第二步，编译后端

在项目的根目录下，执行 `mvn clean package -Dmaven.test.skip=true` 命令，编译后端项目，构建出它的 Jar 包。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/317e47f9-a7ae-4183-a885-733c57166d90.png)

#### 第三步，上传 Jar 包

① 在宝塔首页，点击左侧的 \[文件\] 菜单， 在 `/www/wwwroot` 目录下，创建一个名字为 `gateway-server`、`system-server`、`infra-server` 的目录。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/13d90444-f60d-4e10-8e8a-c2db6fa3e699.png)

② 将 `yudao-gateway.jar` 上传到 `gateway-server` 目录下，并重名为 `gateway-server.jar`。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/a2b49913-2299-42a9-89bc-65d2aab19374.png)

③ 将 `yudao-module-system-biz.jar` 上传到 `system-server` 目录下，并重名为 `system-server.jar`。

④ 将 `yudao-module-infra-biz.jar` 上传到 `infra-server` 目录下，并重名为 `infra-server.jar`。

#### 第四步，启动后端

① 在宝塔首页，点击左侧的 \[网站\] 菜单，之后选择 \[Java项目\] 选项。

再之后，点击 \[添加Java项目\] 按钮，选择该上传的 `gateway-server` 包，并在“项目启动命令”补充 `--spring.profiles.active=dev` 参数。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/04691c24-bb4d-4b7d-951f-290c5ef32d92.png)

② 后续，可以点击该项目的 \[设置\] 按钮，进行日志管理、性能监控、负载状态、配置文件等等。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/a710ff76-be76-436e-91a4-e88f8c2a7e42.png)

③ 然后，打开 Nacos 控制台，查看服务是否注册成功。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/de3e27a6-6633-4a21-98a9-67a5805445ef.png)

---

④ 后续，可以重复上面的步骤，部署 `system-server`、`infra-server` 服务。

## 3. 部署前端

项目的管理后台有 3 个版本（只需要看你的版本即可）：

- `yudao-ui-admin-vue3`：基于 Vue3 + element-plus

- `yudao-ui-admin-vben`：基于 Vue3 + vben5.0(ant-design-vue)

- `yudao-ui-admin-vue2`：基于 Vue2 + element-ui

注意，前端无法直接启动，而是需要通过 Nginx 转发读取前端构建出来的静态文件，最终都放在服务器上的 `/www/wwwroot/yudao-ui-admin` 目录下。

### 3.1 yudao-ui-admin-vue3

基于 Vue3 + element-plus

#### 第一步，修改配置

前端 dev 开发环境对应的是 [`.env.dev` (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vue3/blob/master/.env.dev#L6-L7)配置文件，主要是修改 `VITE_BASE_URL` 为你的后端项目的访问地址。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/aae30a50-9c48-4460-b024-bd843c34eff6.png)

#### 第二步，编译前端

在前端项目的根目录下，执行 `npm run build:dev` 命令，编译前端项目，构建出它的 `dist` 文件，里面是 HTML、CSS、JavaScript 等静态文件。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/8e80b007-ddb6-4037-872d-96f045318272.png)

如下想要打包其它环境，可使用如下命令：

```bash
npm run build:prod ## 打包 prod 生产环境
npm run build:stage ## 打包 stage 预发布环境

```

如果是在服务器上构建，并且出现卡死的情况，可以参考 [https://t.zsxq.com/Quq1U (opens new window)](https://t.zsxq.com/Quq1U)或 [https://gitee.com/yudaocode/yudao-ui-admin-vue3/issues/IAU0T3 (opens new window)](https://gitee.com/yudaocode/yudao-ui-admin-vue3/issues/IAU0T3)解决

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

具体操作，可参考文章的 [《Vue 项目使用七牛云 CDN 存放静态资源》 (opens new window)](https://blog.csdn.net/weixin_71403100/article/details/132037721)的「二、实现方式 」部分，只是最终的“修改 index.html 中静态资源引用”，变成 `PUBLIC_PATH` 修改即可。

#### 第三步，上传 `**dist**` 文件

① 选中本地的 `dist` 内的所有文件，进行压缩。（注意，不是压缩 `dist` 文件夹，而是选中它里面所有的内容！！！）

② 在宝塔首页，点击左侧的 \[文件\] 菜单， 在 `/www/wwwroot` 目录下，创建一个名字为 `yudao-ui-admin` 的目录。

之后，上传 `dist.zip` 到该目录下，并进行解压。最终如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/cecc5f1a-f4d4-4915-893c-fae918845b64.png)

### 3.2 yudao-ui-admin-vben

基于 Vue3 + vben5.0(ant-design-vue)

#### 第一步，修改配置

前端 production 开发环境对应的是 [`.env.production` (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vben/blob/master/.env.production#L15-L21)配置文件，主要是修改 `VITE_GLOB_BASE_URL`、`VITE_GLOB_API_URL` 为你的后端项目的访问地址。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/28695547-791e-4bd7-a4c7-02c9a4dfd789.png)

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

具体操作，可参考文章的 [《Vue 项目使用七牛云 CDN 存放静态资源》 (opens new window)](https://blog.csdn.net/weixin_71403100/article/details/132037721)的「二、实现方式 」部分，只是最终的“修改 index.html 中静态资源引用”，变成 `PUBLIC_PATH` 修改即可。

#### 第二步，编译前端

在前端项目的根目录下，执行 `npm run build` 命令，编译前端项目，构建出它的 `dist` 文件，里面是 HTML、CSS、JavaScript 等静态文件。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/6c544df2-617f-4647-8d3f-1748bef0fbd0.png)

#### 第三步，上传 `**dist**` 文件

① 选中本地的 `dist` 内的所有文件，进行压缩。（注意，不是压缩 `dist` 文件夹，而是选中它里面所有的内容！！！）

② 在宝塔首页，点击左侧的 \[文件\] 菜单， 在 `/www/wwwroot` 目录下，创建一个名字为 `yudao-ui-admin` 的目录。

之后，上传 `dist.zip` 到该目录下，并进行解压。最终如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/a20d1e42-2124-4954-8093-448df6ae2772.png)

### 3.3 yudao-ui-admin-vue2

基于 Vue2 + element-ui

#### 第一步，修改配置

前端 dev 开发环境对应的是 [`.env.dev` (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vue2/blob/master/.env.dev)配置文件，主要是修改 `VUE_APP_BASE_API` 为你的后端项目的访问地址。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/11471f5d-f394-4357-a5d4-5961f4814093.png)

#### 第二步，编译前端

在前端项目的根目录下，执行 `npm run build:dev` 命令，编译前端项目，构建出它的 `dist` 文件，里面是 HTML、CSS、JavaScript 等静态文件。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/1c22f3b6-74fd-481e-abd8-f57992883504.png)

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

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/392fc513-e163-4aaf-8554-a1769a3310be.png)

#### 第三步，上传 `**dist**` 文件

① 选中本地的 `dist` 内的所有文件，进行压缩。（注意，不是压缩 `dist` 文件夹，而是选中它里面所有的内容！！！）

② 在宝塔首页，点击左侧的 \[文件\] 菜单， 在 `/www/wwwroot` 目录下，创建一个名字为 `yudao-ui-admin` 的目录。

之后，上传 `dist.zip` 到该目录下，并进行解压。最终如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/b0218c82-013c-4a60-a089-36e1e4a2d80b.png)

## 4. 部署 Nginx 转发

两种 Nginx 的配置，分别满足服务器 IP、独立域名的不同场景。

### 4.1 服务器 IP 场景

#### 第一步，配置前端转发

在宝塔首页，点击左侧的 \[网站\] 菜单，之后选择 \[HTML项目\] 选项。

之后，点击 \[添加HTML项目\] 按钮，填写备注为 `yudao-ui-admin`，并在“根目录”选择 `/www/wwwroot/yudao-ui-admin` 目录。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/1bf05507-26d3-4985-a105-38a15f244ad6.png)

#### 第二步，配置后端转发

点击该项目的 \[设置\] 按钮，选中 \[伪静态\] 选项，进行后端的转发配置。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/44c0d883-f69e-49f0-8dd9-f9e15da81148.png)

```bash
# 请将伪静态规则或自定义NGINX配置填写到此处
location / {
  try_files $uri $uri/ /index.html; ## 重要！！！解决前端刷新 404 问题
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

```

#### 第三步，简单测试

① 请求 [http://192.168.225.2/admin-api/ (opens new window)](http://192.168.225.2/admin-api/)地址，成功访问后端项目，返回结果如下：

```json
{ "code": 401, "data": null, "msg": "账号未登录" }
```

② 请求 [http://192.168.225.2 (opens new window)](http://192.168.225.2/)地址，成功访问前端项目，返回前端界面如下：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/52b2b135-25c7-4465-b8d1-0ac9be8c2abf.png)

③ 如果你使用到 WebSocket 的话，需要额外对 `/infra/ws` 路径进行配置，具体可见 [https://t.zsxq.com/LQEfC (opens new window)](https://t.zsxq.com/LQEfC)链接。

### 4.2 独立域名场景

**友情提示：在前端项目的编译时，需要把 \`VUE_APP_BASE_API\` 修改为后端项目对应的域名。**

例如说，这里使用的是 `http://api.iocoder.cn`

#### 第一步，配置前端转发

① 在宝塔首页，点击左侧的 \[网站\] 菜单，之后选择 \[HTML项目\] 选项。

之后，点击 \[添加HTML项目\] 按钮，填写备注为 `yudao-ui-admin`，并在“根目录”选择 `/www/wwwroot/yudao-ui-admin` 目录。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/c2a9164c-21f7-4728-b394-ba9a7d0826b7.png)

② 点击该项目的 \[设置\] 按钮，选中 \[伪静态\] 选项，进行 `try_files` 的转发配置。如下图所示：

```text
# 请将伪静态规则或自定义NGINX配置填写到此处
location / {
  try_files $uri $uri/ /index.html; ## 重要！！！解决前端刷新 404 问题
}

```

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/9e44ae7d-9fbe-4d82-8ead-9a1537c15c03.png)

#### 第二步，配置后端转发

① 点击 Java 项目的 \[设置\] 按钮，选中 \[域名管理\] 选项，在“域名”输入后端的域名，如 `api.iocoder.cn`。如下图所示：

**友情提示：这里操作的是 \`gateway-server\` 项目！！！**

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/9970c455-0cb0-4aa3-9eac-834665ac816d.png)

② 选中 \[外网访问\] 选项，把“外网映射”选上。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/ea254fd4-ec10-4d3c-9ac3-a6a3b9bc4fb8.png)

③ 选中 \[配置文件\] 选项，选择 \[伪静态配置文件\] 选项，进行后端的转发配置。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/21480722-0ef0-490d-9219-b9c6f8b78dcc.png)

```bash
# 请将伪静态规则或自定义NGINX配置填写到此处
location /admin-api/ { ## 后端项目 - 管理后台
    proxy_pass http://127.0.0.1:48080/admin-api/; ## 重要！！！proxy_pass 需要设置为后端项目所在服务器的 IP
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

location /app-api/ { ## 后端项目 - 用户 App
    proxy_pass http://127.0.0.1:48080/app-api/; ## 重要！！！proxy_pass 需要设置为后端项目所在服务器的 IP
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

```

#### 第三步，简单测试

① 请求 [http://api.iocoder.cn/admin-api/ (opens new window)](http://api.iocoder.cn/admin-api/)地址，成功访问后端项目，返回结果如下：

```json
{ "code": 401, "data": null, "msg": "账号未登录" }
```

② 请求 [http://admin.iocoder.cn (opens new window)](http://admin.iocoder.cn/)地址，成功访问前端项目，返回前端界面如下：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/65548e36-e37c-485b-81ec-ee745873da03.png)
