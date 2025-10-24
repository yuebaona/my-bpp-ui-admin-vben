---
outline: deep
---

# 技术选型

## 技术架构图

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/e7aed39a-7401-4a3c-898b-1500728cf011.png)

## 👻 后端

### 系统环境

| 框架  | 说明                | 版本             |
| ----- | ------------------- | ---------------- |
| JDK   | Java 开发工具包     | JDK 17 或者 JDK8 |
| Maven | Java 管理与构建工具 | `>=` 3.5.4       |
| Nginx | 高性能 Web 服务器   | \-               |

### 主框架

| 框架 | 说明 | 版本 |
| --- | --- | --- |
| [Spring Cloud Alibaba(opens new window)](https://github.com/alibaba/spring-cloud-alibaba) | 微服务框架 | 2023.0.1 |
| [Spring MVC(opens new window)](https://github.com/spring-projects/spring-framework/tree/master/spring-webmvc) | MVC 框架 | 6.1.10 |
| [Spring Security(opens new window)](https://github.com/spring-projects/spring-security) | Spring 安全框架 | 6.3.1 |
| [Hibernate Validator(opens new window)](https://github.com/hibernate/hibernate-validator) | 参数校验组件 | 8.0.1 |

### 存储层

| 框架 | 说明 | 版本 |
| --- | --- | --- |
| [MySQL(opens new window)](https://www.mysql.com/cn/) | 数据库服务器 | `>=` 5.7 |
| [Druid(opens new window)](https://github.com/alibaba/druid) | JDBC 连接池、监控组件 | 1.2.23 |
| [MyBatis Plus(opens new window)](https://mp.baomidou.com/) | MyBatis 增强工具包 | 3.5.7 |
| [Dynamic Datasource(opens new window)](https://dynamic-datasource.com/) | 动态数据源 | 4.3.1 |
| [Redis(opens new window)](https://redis.io/) | key-value 数据库 | `>=` 5.0 |
| [Redisson(opens new window)](https://github.com/redisson/redisson) | Redis 客户端 | 3.32.0 |

### 中间件

| 框架 | 说明 | 版本 |
| --- | --- | --- |
| [Nacos(opens new window)](https://github.com/alibaba/nacos) | 配置中心 & 注册中心 | 2.3.2 |
| [RocketMQ(opens new window)](https://github.com/apache/rocketmq) | 消息队列 | 5.2.0 |
| [Sentinel(opens new window)](https://github.com/alibaba/sentinel) | 服务保障 | 1.8.6 |
| [XXL Job(opens new window)](https://github.com/xuxueli/xxl-job) | 定时任务 | 2.4.0 |
| [Spring Cloud Gateway(opens new window)](https://github.com/spring-cloud/spring-cloud-gateway) | 服务网关 | 4.1.0 |
| [Seata(opens new window)](https://github.com/seata/seata) | 分布式事务 | 1.6.1 |
| [Flowable(opens new window)](https://github.com/flowable/flowable-engine) | 工作流引擎 | 7.0.0 |

### 系统监控

| 框架 | 说明 | 版本 |
| --- | --- | --- |
| [Spring Boot Admin(opens new window)](https://github.com/codecentric/spring-boot-admin) | Spring Boot 监控平台 | 3.6.1 |
| [SkyWalking(opens new window)](https://skywalking.apache.org/) | 分布式应用追踪系统 | 9.0.0 |

### 单元测试

| 框架 | 说明 | 版本 |
| --- | --- | --- |
| [JUnit(opens new window)](https://junit.org/junit5/) | Java 单元测试框架 | 5.10.1 |
| [Mockito(opens new window)](https://github.com/mockito/mockito) | Java Mock 框架 | 5.7.0 |

### 其它工具

| 框架 | 说明 | 版本 |
| --- | --- | --- |
| [Springdoc(opens new window)](https://springdoc.org/) | Swagger 文档 | 2.3.0 |
| [Jackson(opens new window)](https://github.com/FasterXML/jackson) | JSON 工具库 | 2.17.1 |
| [MapStruct(opens new window)](https://mapstruct.org/) | Java Bean 转换 | 1.5.5.Final |
| [Lombok(opens new window)](https://projectlombok.org/) | 消除冗长的 Java 代码 | 1.18.34 |

## 👾 前端

### 管理后台（Vue3 + ElementPlus）

| 框架 | 说明 | 版本 |
| --- | --- | --- |
| [Vue(opens new window)](https://staging-cn.vuejs.org/) | vue 框架 | 3.2.45 |
| [Vite(opens new window)](https://cn.vitejs.dev//) | 开发与构建工具 | 4.0.1 |
| [Element Plus(opens new window)](https://element-plus.org/zh-CN/) | Element Plus | 2.2.26 |
| [TypeScript(opens new window)](https://www.typescriptlang.org/docs/) | JavaScript 的超集 | 4.9.4 |
| [pinia(opens new window)](https://pinia.vuejs.org/) | Vue 存储库 替代 vuex5 | 2.0.28 |
| [vueuse(opens new window)](https://vueuse.org/) | 常用工具集 | 9.6.0 |
| [vxe-table(opens new window)](https://vxetable.cn/) | vue 最强表单 | 4.3.7 |
| [vue-i18n(opens new window)](https://kazupon.github.io/vue-i18n/zh/introduction.html/) | 国际化 | 9.2.2 |
| [vue-router(opens new window)](https://router.vuejs.org/) | vue 路由 | 4.1.6 |
| [UnoCSS(opens new window)](https://unocss.dev/) | 下一代工具优先的 CSS 框架 | 0.58.9 |
| [iconify(opens new window)](https://icon-sets.iconify.design/) | 在线图标库 | 3.0.0 |
| [wangeditor(opens new window)](https://www.wangeditor.com/) | 富文本编辑器 | 5.1.23 |

### 管理后台（Vue3 + Vben + Ant-Design-Vue）

| 框架 | 说明 | 版本 |
| --- | --- | --- |
| [Vue(opens new window)](https://staging-cn.vuejs.org/) | Vue 框架 | 3.2.47 |
| [Vite(opens new window)](https://cn.vitejs.dev//) | 开发与构建工具 | 4.3.0 |
| [ant-design-vue(opens new window)](https://antdv.com/) | ant-design-vue | 3.2.17 |
| [TypeScript(opens new window)](https://www.typescriptlang.org/docs/) | JavaScript 的超集 | 5.0.4 |
| [pinia(opens new window)](https://pinia.vuejs.org/) | Vue 存储库 替代 vuex5 | 2.0.34 |
| [vueuse(opens new window)](https://vueuse.org/) | 常用工具集 | 9.13.0 |
| [vue-i18n(opens new window)](https://kazupon.github.io/vue-i18n/zh/introduction.html/) | 国际化 | 9.2.2 |
| [vue-router(opens new window)](https://router.vuejs.org/) | Vue 路由 | 4.1.6 |
| [UnoCSS(opens new window)](https://unocss.dev/) | 下一代工具优先的 CSS 框架 | 0.58.9 |
| [iconify(opens new window)](https://icon-sets.iconify.design/) | 在线图标库 | 3.1.0 |

### 管理后台（Vue2）

| 框架 | 说明 | 版本 |
| --- | --- | --- |
| [Node(opens new window)](https://nodejs.org/zh-cn/) | JavaScript 运行时环境 | \>= 12 |
| [Vue(opens new window)](https://cn.vuejs.org/index.html) | JavaScript 框架 | 2.7.14 |
| [Vue Element Admin(opens new window)](https://panjiachen.github.io/vue-element-admin-site/zh/guide/) | 后台前端解决方案 | 2.5.10 |

### 管理后台（uni-app）

| 框架 | 说明 | 版本 |
| --- | --- | --- |
| [uni-app(opens new window)](https://github.com/dcloudio/uni-app) | 跨平台框架 | 2.0.0 |
| [uni-ui(opens new window)](https://github.com/dcloudio/uni-ui) | 基于 uni-app 的 UI 框架 | 1.4.20 |

### 用户 App

| 框架 | 说明 | 版本 |
| --- | --- | --- |
| [Vue(opens new window)](https://cn.vuejs.org/index.html) | JavaScript 框架 | 2.6.12 |
| [UniApp(opens new window)](https://github.com/dcloudio/uni-app) | 小程序、H5、App 的统一框架 | \- |
