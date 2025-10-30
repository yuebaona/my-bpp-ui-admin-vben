---
outline: deep
---

# Redis缓存

`bpp-spring-boot-starter-redis`技术组件，使用 Redis 实现缓存的功能，它有 2 种使用方式：

- 编程式缓存：基于 Spring Data Redis 框架的 RedisTemplate 操作模板

- 声明式缓存：基于 Spring Cache 框架的 `@Cacheable` 等等注解

## 1. 编程式缓存

```xml
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson-spring-boot-starter</artifactId>
</dependency>

```

由于 Redisson 提供了分布式锁、队列、限流等特性，所以使用它作为 Spring Data Redis 的客户端。

### 1.1 Spring Data Redis 配置

① 在 `application-local.yaml`配置文件中，通过 `spring.redis` 配置项，设置 Redis 的配置。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/0e980559-af15-4dfd-a151-20f19ff4d352.png)

② 在 `YudaoRedisAutoConfiguration`配置类，设置使用 JSON 序列化 value 值。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/d2112d15-9714-4d78-9f08-d7b18d44de28.png)

### 1.2 实战案例

以访问令牌 Access Token 的缓存来举例子，讲解项目中是如何使用 Spring Data Redis 框架的。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/c1b08378-379e-4c9b-a931-a15dd231228a.png)

#### 1.2.1 引入依赖

在 `bpp-module-system-server` 模块中，引入 `bpp-spring-boot-starter-redis` 技术组件。如下所示：

```xml
<dependency>
    <groupId>cn.iocoder.cloud</groupId>
    <artifactId>bpp-spring-boot-starter-redis</artifactId>
</dependency>

```

#### 1.2.2 OAuth2AccessTokenDO

新建 `OAuth2AccessTokenDO`类，访问令牌 Access Token 类。代码如下：

::: info 图片纠错：最新版本将 bpp-module-system-biz 子模块，重命名为 bpp-module-system-server 子模块，更好表达它是一个服务 :::

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/55003353-24c2-4970-9c4b-c2acbee81c04.png)

::: info 友情提示：

- ① 如果值是【简单】的 String 或者 Integer 等类型，无需创建数据实体。

- ② 如果值是【复杂对象】时，建议在 `dal/dataobject` 包下，创建对应的数据实体。

:::

#### 1.2.3 RedisKeyConstants

在 `bpp-module-system` 模块的 `RedisKeyConstants`类中，新建 OAuth2AccessTokenDO 对应的 Redis Key 定义 `OAUTH2_ACCESS_TOKEN`。如下图所示：

::: info 图片纠错：

最新版本将 bpp-module-system-biz 子模块，重命名为 bpp-module-system-server 子模块，更好表达它是一个服务 

:::

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/4e7c0c67-8db3-44bb-8ca4-17f9a71a5d79.png)

#### 1.2.4 OAuth2AccessTokenRedisDAO

新建 `OAuth2AccessTokenRedisDAO`类，是 OAuth2AccessTokenDO 的 RedisDAO 实现。代码如下：

::: info 图片纠错：

最新版本将 bpp-module-system-biz 子模块，重命名为 bpp-module-system-server 子模块，更好表达它是一个服务 

:::

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/eb4f49fd-747d-40ea-acdb-b2ab3dcf6652.png)

#### 1.2.5 OAuth2TokenServiceImpl

在 `OAuth2TokenServiceImpl`中，只要注入 OAuth2AccessTokenRedisDAO Bean，非常简洁干净的进行 OAuth2AccessTokenDO 的缓存操作，无需关心具体的实现。代码如下：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/d38a556e-f25d-4201-be8f-ddc5ff3fa6f4.png)

## 2. 声明式缓存

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>

```

相比来说 Spring Data Redis 编程式缓存，Spring Cache 声明式缓存的使用更加便利，一个 `@Cacheable` 注解即可实现缓存的功能。示例如下：

```java
@Cacheable(value = "users", key = "#id")
UserDO getUserById(Integer id);

```

### 2.1 Spring Cache 配置

① 在 `application.yaml`配置文件中，通过 `spring.redis` 配置项，设置 Redis 的配置。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/2c90a62a-2621-40df-9e39-f25e46c2dc12.png)

② 在 `YudaoCacheAutoConfiguration`配置类，设置使用 JSON 序列化 value 值。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/e4c7e6ce-1c7c-4aca-892e-7614d41a67ea.png)

### 2.2 常见注解

#### 2.2.1 @Cacheable 注解

[`@Cacheable`](https://github.com/spring-projects/spring-framework/blob/main/spring-context/src/main/java/org/springframework/cache/annotation/Cacheable.java)注解：添加在方法上，缓存方法的执行结果。执行过程如下：

- 1）首先，判断方法执行结果的缓存。如果有，则直接返回该缓存结果。

- 2）然后，执行方法，获得方法结果。

- 3）之后，根据是否满足缓存的条件。如果满足，则缓存方法结果到缓存。

- 4）最后，返回方法结果。

#### 2.2.2 @CachePut 注解

[`@CachePut`](https://github.com/spring-projects/spring-framework/blob/main/spring-context/src/main/java/org/springframework/cache/annotation/CachePut.java)注解，添加在方法上，缓存方法的执行结果。不同于 `@Cacheable` 注解，它的执行过程如下：

- 1）首先，执行方法，获得方法结果。也就是说，无论是否有缓存，都会执行方法。

- 2）然后，根据是否满足缓存的条件。如果满足，则缓存方法结果到缓存。

- 3）最后，返回方法结果。

#### 2.2.3 @CacheEvict 注解

[`@CacheEvict`](https://github.com/spring-projects/spring-framework/blob/master/spring-context/src/main/java/org/springframework/cache/annotation/CacheEvict.java)注解，添加在方法上，删除缓存。

### 2.3 实战案例

在 `RoleServiceImpl`中，使用 Spring Cache 实现了 Role 角色缓存，采用【被动读】的方案。原因是：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/de4740f0-fc3a-4125-8fd5-a0eea0f91182.png)

- 【被动读】相对能够保证 Redis 与 MySQL 的一致性

- 绝大数数据不需要放到 Redis 缓存中，采用【主动写】会将非必要的数据进行缓存

① 执行 `#getRoleFromCache(...)` 方法，从 MySQL 读取数据后，向 Redis 写入缓存。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/308bfe05-d34b-489c-af8d-64edc32625eb.png)

② 执行 `#updateRole(...)` 或 `#deleteRole(...)` 方法，在更新或者删除 MySQL 数据后，从 Redis 删除缓存。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/b02edf96-8737-4008-bfc0-64d661815bde.png)

### 2.4 过期时间

Spring Cache 默认使用 `spring.cache.redis.time-to-live` 配置项，设置缓存的过期时间，项目默认为 1 小时。

如果你想自定义过期时间，可以在 `@Cacheable` 注解中的 `cacheNames` 属性中，添加 `#{过期时间}` 后缀，单位是秒。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/013d8499-0789-4e8e-b564-b08fa4e34be6.png)

## 3. Redis 监控

`bpp-module-infra` 的 `redis`模块，提供了 Redis 监控的功能。

点击 \[基础设施 -> 监控中心 -> Redis 监控\] 菜单，可以查看到 Redis 的基础信息、命令统计、内存信息。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/04b3718c-a46b-45d8-864c-5c418f21da0e.png)
