---
outline: deep
---
# 多源数据（读写分离）、事务

[`yudao-spring-boot-starter-mybatis`](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-spring-boot-starter-mybatis/)技术组件，除了提供 MyBatis 数据库操作，还提供了如下 2 种功能：

- 数据连接池：基于 [Alibaba Druid](https://github.com/alibaba/druid)实现，额外提供监控的能力。

- 多数据源（读写分离）：基于 [Dynamic Datasource](https://github.com/baomidou/dynamic-datasource-spring-boot-starter)实现，支持 Druid 连接池，可集成 [Seata](https://www.iocoder.cn/Seata/install/?yudao)实现分布式事务。

## 1. 数据连接池

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
</dependency>

```

### 1.1 Druid监控配置

**友情提示：以 yudao-module-system 服务为例子。**

在 [`application-local.yaml`](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-system/yudao-module-system-server/src/main/resources/application-local.yaml#L7-L25)配置文件中，通过 `spring.datasource.druid` 配置项，仅仅设置了 Druid **监控**相关的配置项目，具体数据库的设置需要使用 Dynamic Datasource 的配置项。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/fead648a-ebcf-4dcc-ba28-5abf764309ae.png)

### 1.2 Druid监控界面

① 访问后端的 `/druid/index.html` 路径，例如说本地的 `http://127.0.0.1:48080/druid/index.html` 地址，可以查看到 Druid 监控界面。如下图所示：

**友情提示：48080 需要换成服务的端口！！！**

例如说：`system-server` 是 48081 端口！！！

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/c301365c-0118-4b1b-bf18-79f0797401d5.png)

② 访问前端的 \[基础设施 -> 监控中心 -> MySQL 监控\] 菜单，也可以查看到 Druid 监控界面。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/a3a81212-94cf-4af0-9acc-ff9699ea36c4.png)

**补充说明：**

前端 \[基础设施 -> MySQL 监控\] 菜单，通过 iframe 内嵌后端的 `/druid/index.html` 路径。

如果你想自定义地址，可以前往 \[基础设置 -> 配置管理\] 菜单，设置 key 为 `url.druid` 配置项。

### 1.3 如何开启登录？

生产环境下，建议 Druid 监控界面开启“安全认证”的功能，避免出现安全事故。

只需要在 `spring.datasource.druid.stat-view-servlet` 配置项中，设置 `login-username` 和 `login-password` 即可。开启后，登录界面如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/2e88742f-2d37-4c42-af39-40c2b934bf70.png)

## 2. 多数据源

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>dynamic-datasource-spring-boot-starter</artifactId>
</dependency>

```

### 2.1 多数据源配置

**友情提示：以 yudao-module-system 服务为例子。**

在 [`application-local.yaml`](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-system/yudao-module-system-server/src/main/resources/application-local.yaml#L40-L62)配置文件中，通过 `spring.datasource.dynamic` 配置项，配置了 Master-Slave 主从两个数据源。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/c396b957-7491-44a2-b14e-1eb911f9cfb3.png)

### 2.2 数据源切换

#### 2.2.1 @Master注解

在方法上添加 [`@Master`](https://github.com/baomidou/dynamic-datasource/blob/master/dynamic-datasource-spring/src/main/java/com/baomidou/dynamic/datasource/annotation/Master.java)注解，使用名字为 `master` 的数据源，即使用【主】库，一般适合【写】场景。示例如下图：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/34b6449b-fc1f-4991-9074-647ff54e6fec.png)

由于项目的 `spring.datasource.dynamic.primary` 为 `master`，默认使用【主】库，所以无需手动添加 `@Master` 注解。

#### 2.2.2 @Slave注解

在方法上添加 [`@Slave`](https://github.com/baomidou/dynamic-datasource/blob/master/dynamic-datasource-spring/src/main/java/com/baomidou/dynamic/datasource/annotation/Slave.java)注解，使用名字为 `slave` 的数据源，即使用【从】库，一般适合【读】场景。示例如下图：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/bd22ece5-0c4f-414f-b6eb-60456db0570f.png)

#### 2.2.3 @DS注解

在方法上添加 [`@DS`](https://github.com/baomidou/dynamic-datasource/blob/master/dynamic-datasource-spring/src/main/java/com/baomidou/dynamic/datasource/annotation/DS.java)注解，使用指定名字的数据源，适合多数据源的情况。示例如下图：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/0242123e-da76-4274-8c31-d15545a07004.png)

### 2.3 分布式事务

在使用 Spring `@Transactional` 声明的事务中，无法进行数据源的切换，此时有 3 种解决方案：

① 拆分成多个 Spring 事务，每个事务对应一个数据源。如果是【写】场景，可能会存在多数据源的事务不一致的问题。

② 引入 Seata 框架，提供完整的分布式事务的解决方案。

③ 使用 Dynamic Datasource 提供的 [`@DSTransactional`](https://github.com/baomidou/dynamic-datasource/blob/master/dynamic-datasource-spring/src/main/java/com/baomidou/dynamic/datasource/annotation/DSTransactional.java)注解，支持多数据源的切换，不提供绝对可靠的多数据源的事务一致性（强于 ① 弱于 ②），可学习 [《DSTransactional 实现源码分析 》](https://www.yinxiang.com/everhub/note/ac0175c8-35f5-4d66-8cd3-c662d7a16441)文章。

## 3. 事务相关

事务一共有 3 种解决方案，分别是：

- 单机 + 单数据源：`@Transactional` 注解

- 单机 + 多数据源：`@DSTransactional` 注解

- 多机 + 单/多数据源：Seata 分布式事务

### 3.1 @Transactional 注解

大多数情况下，是单机 + 单个数据源的操作，只需要在方法上添加 Spring `@Transactional` 注解，声明事务即可。

具体的使用，可以项目里搜 `@Transactional` 关键字，就可以看到非常多的使用示例。

### 3.2 @DSTransactional 注解

如果单机 + 多个数据源的操作，使用 `@Transactional` 声明的事务中，无法进行数据源的切换。此时，可以使用 Dynamic Datasource 提供的 [`@DSTransactional`](https://github.com/baomidou/dynamic-datasource/blob/master/dynamic-datasource-spring/src/main/java/com/baomidou/dynamic/datasource/annotation/DSTransactional.java)注解，支持多数据源的切换。

使用的示例，AService 调用 BService、CService，并且分别对应 a、b、c 各自的数据源，代码如下所示：

```java
public class AService {

    @Resource
    private BService bService;
    @Resource
    private CService cService;

    @DS("a") // 注意：如果 a 是默认数据源时，则不需要 @DS 注解
    @DSTransactional
    public void create() {
        bService.createB();
        CService.createC();
    }

}

    public class BService {

        @DS("b")
        public void createB() {
            // 调用 bMapper 逻辑
        }

    }

    public class CService {

        @DS("c")
        public void createC() {
            // 调用 cMapper 逻辑
        }

    }

```

### 3.3 分布式事务

在多机分布式场景下，无论是单数据源、多数据源，本质上都是分布式事务，建议引入 Seata 框架，提供完整的分布式事务的解决方案。

## 4. 分库分表

建议采用 ShardingSphere 的子项目 Sharding-JDBC 完成分库分表的功能。
