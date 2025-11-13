---
outline: deep
---

# 注册中心Nacos

项目使用 Nacos 作为配置中心，实现服务的注册发现。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/736c3384-b3e8-408f-8ea5-ce67572b750a.png)

## 1. 搭建 Nacos Server

 点击 Nacos 控制台的 \[命名空间\] 菜单，创建一个 ID 和名字都为 `dev` 的命名空间，稍后会使用到。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/1737bda2-430f-49b7-8b51-1607fc4ca585.png)

注意！新建命名空间时，它的“命名空间ID”、“命名空间名”都要是 `dev` 噢！！！

## 2. 项目接入 Nacos

**友情提示：以 bpp-module-system 服务为例子。**

### 2.1 引入依赖

在 `bpp-module-system-server` 模块的 `pom.xml`中，引入 Nacos 对应的依赖。如下所示：

```xml
<!-- Registry 注册中心相关 -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>

```

### 2.2 添加配置

在 `application-local.yaml`中，添加 `nacos.config` 配置。如下所示：

```yaml
--- #################### 注册中心相关配置 ####################

spring:
  cloud:
    nacos:
      server-addr: 127.0.0.1:8848 # Nacos 服务器地址
      username: # Nacos 账号
      password: # Nacos 密码
      discovery: # 【配置中心】配置项
        namespace: dev # 命名空间。这里使用 dev 开发环境
        group: DEFAULT_GROUP # 使用的 Nacos 配置分组，默认为 DEFAULT_GROUP
        metadata:
          version: 1.0.0 # 服务实例的版本号，可用于灰度发布
```

- `spring.cloud.nacos.discovery.namespace` 配置项：设置为 `dev`，就是刚创建的命名空间

### 2.3 启动项目

运行 SystemServerApplication 类，将 `system-server` 服务启动。

然后，在 Nacos 控制台的 \[服务管理 -> 服务列表\] 菜单，就可以看到该服务实例。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/8c740b3f-200f-4871-99bc-c3a6ee8c4762.png)
