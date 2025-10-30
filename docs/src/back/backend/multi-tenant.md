---
outline: deep
---

# SaaS多租户【字段隔离】

本章节，将介绍多租户的基础知识、以及怎样使用多租户的功能。

## 1. 多租户是什么？

多租户，简单来说是指**一个**业务系统，可以为**多个**组织服务，并且组织之间的数据是**隔离**的。

例如说，在服务上部署了一个系统，可以支持多个不同的公司使用。这里的**一个公司就是一个租户**，每个用户必然属于某个租户。因此，用户也只能看见自己租户下面的内容，其它租户的内容对他是不可见的。

## 2. 数据隔离方案

多租户的数据隔离方案，可以分成分成三种：

1.  DATASOURCE 模式：独立数据库

2.  SCHEMA 模式：共享数据库，独立 Schema

3.  COLUMN 模式：共享数据库，共享 Schema，共享数据表

### 2.1 DATASOURCE 模式

一个租户一个数据库，这种方案的用户数据隔离级别最高，安全性最好，但成本也高。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/580534c0-697f-4455-aab9-1438e4924ab0.png)

- 优点：为不同的租户提供独立的数据库，有助于简化数据模型的扩展设计，满足不同租户的独特需求；如果出现故障，恢复数据比较简单。

- 缺点：增大了数据库的安装数量，随之带来维护成本和购置成本的增加。

### 2.2 SCHEMA 模式

多个或所有租户共享数据库，但一个租户一个表。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/077ce239-c732-4736-b0c0-0d1b3275a8c7.png)

- 优点：为安全性要求较高的租户提供了一定程度的逻辑数据隔离，并不是完全隔离；每个数据库可以支持更多的租户数量。

- 缺点：如果出现故障，数据恢复比较困难，因为恢复数据库将牵扯到其他租户的数据； 如果需要跨租户统计数据，存在一定困难。

### 2.3 COLUMN 模式

共享数据库，共享数据架构。租户共享同一个数据库、同一个表，但在表中通过 `tenant_id` 字段区分租户的数据。这是共享程度最高、隔离级别最低的模式。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/22033122-2dac-46f2-be18-5f546fbb9526.png)

- 优点：维护和购置成本最低，允许每个数据库支持的租户数量最多。

- 缺点：隔离级别最低，安全性最低，需要在设计开发时加大对安全的开发量；数据备份和恢复最困难，需要逐表逐条备份和还原。

### 2.4 方案选择

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/7f7d406e-23fe-4d3a-9457-f86505b3c132.png)

- 一般情况下，可以考虑采用 COLUMN 模式，开发、运维简单，以最少的服务器为最多的租户提供服务。

- 租户规模比较大，或者一些租户对安全性要求较高，可以考虑采用 DATASOURCE 模式，当然它也相对复杂的多。

- 不推荐采用 SCHEMA 模式，因为它的优点并不明显，而且它的缺点也很明显，同时对复杂 SQL 支持一般。

## 4. 多租户的开关

系统有两个配置项，设置为 `true` 时开启多租户，设置为 `false` 时关闭多租户。

注意，两者需要保持一致，否则会报错！

| 配置项 | 说明 | 配置文件 |
| --- | --- | --- |
| `bpp.server.tenant` | 后端开关 | ![image](http://rsim.portsgmt.com:9001/bgbpp-vben/5e77449c-b799-493e-9137-cb789e0045f7.png) |
| `VUE_APP_TENANT_ENABLE` | 前端开关 | ![image](http://rsim.portsgmt.com:9001/bgbpp-vben/60d1705e-0d89-4f22-b438-22e042b98d3c.png) |

## 4. 多租户的业务功能

多租户主要有两个业务功能：

| 业务功能 | 说明 | 界面 |
| --- | --- | --- |
| 租户管理 | 配置系统租户，创建对应的租户管理员 | ![image](http://rsim.portsgmt.com:9001/bgbpp-vben/31aa9b72-17b5-4577-9f39-19d86d3d13e6.png) |
| 租户套餐 | 配置租户套餐，自定每个租户的菜单、操作、按钮的权限 | ![image](http://rsim.portsgmt.com:9001/bgbpp-vben/eefe202b-50d0-4d97-a249-7873205fcab6.png) |

**下面，我们来新增一个租户，它使用 COLUMN 模式。**

① 点击 \[租户管理\] 菜单，点击 \[新增\] 按钮，填写租户的信息。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/8926e4f3-0dc0-46a5-bd6e-54a3cd82ed76.png)

② 点击 \[确认\] 按钮，完成租户的创建，它会自动创建对应的租户管理员、角色等信息。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/c8cb29fa-6bb4-4e13-b170-dac69cd80cf6.png)

③ 退出系统，登录刚创建的租户。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/c1cbb74e-6919-4c94-bb2f-3dbde28c76f5.png)

## 5. 多租户的技术组件

技术组件 `bpp-spring-boot-starter-biz-tenant`，实现透明化的多租户能力，针对 Web、Security、DB、Redis、AOP、Job、MQ、Async 等多个层面进行封装。

### 5.1 租户上下文

`TenantContextHolder`是租户上下文，通过 ThreadLocal 实现租户编号的共享与传递。

通过调用 TenantContextHolder 的 `#getTenantId()` **静态**方法，获得当前的租户编号。绝绝绝大多数情况下，并不需要。

### 5.2 Web 层【重要】

默认情况下，前端的每个请求 Header **必须**带上 `tenant-id`，值为租户编号，即 `system_tenant` 表的主键编号。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/b977603e-9c98-410c-b81f-dd4ee2665f60.png)

如果不带该请求头，会报“租户的请求未传递，请进行排查”错误提示。

😜 方式一：通过 `bpp.tenant.ignore-urls` 配置项，可以设置哪些 URL 无需带该请求头。例如说：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/e9ab2cc5-d5b6-47fc-b48b-e4df08a63592.png)

😆 方式二：【推荐】在 Controller 方法上，使用 `@TenantIgnore` 注解，忽略该方法的租户校验。例如说：

```java
// TenantController.java

@GetMapping("/get-id-by-name")
@TenantIgnore // <--- 重要！！！
public CommonResult<Long> getTenantIdByName(@RequestParam("name") String name) {
    // ...
}

```

### 5.3 Security 层

主要是校验登录的用户，校验是否有权限访问该租户，避免越权问题。

### 5.4 DB 层【重要】

COLUMN 模式，基于 MyBatis Plus 自带的**多租户**功能实现。

核心：每次对数据库操作时，它会**自动**拼接 `WHERE tenant_id = ?` 条件来进行租户的过滤，并且基本支持所有的 SQL 场景。

如下是具体方式：

① **需要**开启多租户的表，必须添加 `tenant_id` 字段。例如说 `system_users`、`system_role` 等表。

```sql
CREATE TABLE `system_role` (
   `id` bigint NOT NULL AUTO_INCREMENT COMMENT '角色ID',
   `name` varchar(30) CHARACTER NOT NULL COMMENT '角色名称',
   `tenant_id` bigint NOT NULL DEFAULT '0' COMMENT '租户编号',
   PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 COMMENT='角色信息表';

```

并且该表对应的 DO 需要使用到 `tenantId` 属性时，建议继承`TenantBaseDO`类。

② **无需**开启多租户的表，需要添加表名到 `bpp.tenant.ignore-tables` 配置项目。例如说：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/242be41f-469b-4f0a-ae09-9367822f65f5.png)

如果不配置的话，MyBatis Plus 会自动拼接 `WHERE tenant_id = ?` 条件，导致报 `tenant_id` 字段不存在的错误。

::: info 友情提示：MyBatis Plus 的多租户方案，在我们在 MyBatis XML 手写 SQL 时，是不生效的，即不会拼接 \`tenant_id\` 字段！！！

:::

解决方案：需要手动自己拼接，可见 `ErpPurchaseStatisticsMapper.xml` 案例，如下所示：

```sql
tenant_id = ${@cn.sgmt.bpp.framework.tenant.core.context.TenantContextHolder@getRequiredTenantId()}

```

- 其中，后面 `${@...}` 一串，是 MyBatis 调用静态方法的方式，即使用 TenantContextHolder 的 `#getRequiredTenantId()` 方法，获得当前的租户编号。

```java
@TableName("system_dict_data")
@TenantIgnore // <--- 重要！！！
public class DictDataDO extends BaseDO {

    // ... 省略属性

}

```

### 5.5 Redis 层【重要】

由于 Redis 不同于 DB 有 `tenant_id` 字段，无法通过类似 `WHERE tenant_id` = ? 的方式过滤，所以需要通过在 Redis Key 上增加 `:t{tenantId}` 后缀的方式，进行租户之间的隔离。

例如说，假设 Redis Key 是 `user:%d`，示例是 `user:1024`；对应到多租户 1 的 Redis Key 是 `user:t1:1024`。

#### 使用方式一：基于 Spring Cache + Redis【推荐】

只需要一步，在方法上添加 Spring Cache 注解，例如说 `@Cachable`、`@CachePut`、`@CacheEvict`。

具体的实现原理，可见 `TenantRedisCacheManager`的源码。

注意！！！默认配置下，Spring Cache 都开启 Redis Key 的多租户隔离。如果不需要，可以将 Key 添加到 `bpp.tenant.ignore-caches` 配置项中。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/498dcf7d-7e84-483a-bb25-69e01e0129d8.png)

#### 使用方式二：基于 RedisTemplate + TenantRedisKeyDefine

暂时没有合适的封装，需要在自己 format Redis Key 的时候，手动将 `:t{tenantId}` 后缀拼接上。

这也是为什么，我推荐你使用 Spring Cache + Redis 的原因！

### 5.6 AOP【重要】

① 声明 `@TenantIgnore`注解在方法上，标记指定方法不进行租户的自动过滤，避免**自动**拼接 `WHERE tenant_id = ?` 条件等等。

例如说：`RoleServiceImpl`的 `#initLocalCache()`方法，加载**所有**租户的角色到内存进行缓存，如果不声明 `@TenantIgnore` 注解，会导致租户的自动过滤，只加载了某个租户的角色。

```java
// RoleServiceImpl.java
public class RoleServiceImpl implements RoleService {

    @Resource
    @Lazy // 注入自己，所以延迟加载
    private RoleService self;

    @Override
    @PostConstruct
    @TenantIgnore // 忽略自动多租户，全局初始化缓存
    public void initLocalCache() {
        // ... 从数据库中，加载角色
    }

    @Scheduled(fixedDelay = SCHEDULER_PERIOD, initialDelay = SCHEDULER_PERIOD)
    public void schedulePeriodicRefresh() {
        self.initLocalCache(); // <x> 通过 self 引用到 Spring 代理对象
    }
}

```

有一点要格外注意，由于 `@TenantIgnore` 注解是基于 Spring AOP 实现，如果是**方法内部的调用**，避免使用 `this` 导致不生效，可以采用上述示例的 `<x>` 处的 `self` 方式。

② 使用 `TenantUtils`的 `#execute(Long tenantId, Runnable runnable)` 方法，模拟指定租户( `tenantId` )，执行某段业务逻辑( `runnable` )。

例如说：在 `TenantServiceImpl`的 `#createTenant(...)` 方法，在创建完租户时，需要模拟该租户，进行用户和角色的创建。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/a0e81722-4fab-4d7c-8f3b-cd4fdf5cef0b.png)

### 5.7 Job【重要】

声明 `@TenantJob`注解在 Job 方法上，实现**并行**遍历每个租户，执行定时任务的逻辑。

### 5.8 MQ

通过租户对 MQ 层面的封装，实现租户上下文，可以继续传递到 MQ 消费的逻辑中，避免丢失的问题。实现原理是：

- 发送消息时，MQ 会将租户上下文的租户编号，记录到 Message 消息头 `tenant-id` 上。

- 消费消息时，MQ 会将 Message 消息头 `tenant-id`，设置到租户上下文的租户编号。

### 5.9 Async

通过使用阿里开源的 [TransmittableThreadLocal](https://github.com/alibaba/transmittable-thread-local)组件，实现 Spring Async 执行异步逻辑时，租户上下文可以继续传递，避免丢失的问题。

### 5.10 RPC

RPC 使用 Feign 调用时，会自动将租户上下文的租户编号，设置到 HTTP 请求头 `tenant-id` 上。

在 Provider 服务端，会自动将 HTTP 请求头 `tenant-id`，设置到租户上下文的租户编号。

## 6. 租户独立域名

在我们使用 SaaS 云产品的时候，每个租户会拥有 **独立的子域名**，例如说：租户 A 对应 `a.sgmt.cn`，租户 B 对应 `b.sgmt.cn`。

目前管理后台已经提供类似的能力，更多大家可以基于它去拓展。实现方式：

1.  在 `system_tenant` 表里，有个 `website` 字段为该租户的独立域名，你可以填写你希望分配给它的子域名。

2.  在 Nginx 上做 **泛域名解析** 到你的前端项目，例如说 Nginx 的 `server_name` `*.sgmt.cn` 解析到 Vue3 管理后台。

这样用户在访问管理后台的登录界面，会自动根据当前访问域名的 `host`，向后端获得对应的 `tenant-id` 编号，后续请求都带上它！

## 7. 租户切换

① 拥有 `system:tenant:visit` 权限的用户，支持切换租户，从而查看和操作其它租户的数据。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/6b5e105a-33db-48ff-9e57-5d8d7d7aae39.png)

`system:tenant:visit` 权限的分配，可以在角色管理时，分配 \[系统管理 -> 租户管理 -> 租户切换\] 权限。

② 注意：如果你的 HTTP 接口是查询个人相关的信息，不能进行租户的切换，例如说：登录用户的个人信息等。此时，`bpp.tenant.ignore-urls` 配置项进行添加。

```yaml
bpp:
  tenant:
    ignore-urls:
      - /admin-api/system/user/profile/**
      - /admin-api/system/auth/**
```
