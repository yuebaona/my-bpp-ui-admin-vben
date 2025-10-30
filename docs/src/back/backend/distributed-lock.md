---
outline: deep
---

# 分布式锁

`sgmt-spring-boot-starter-protection`技术组件，使用 Redis 实现分布式锁的功能，它有 2 种使用方式：

- 编程式锁：基于 [Redisson](https://github.com/redisson/redisson)框架提供的[各种](https://github.com/redisson/redisson/wiki/8.-%E5%88%86%E5%B8%83%E5%BC%8F%E9%94%81%E5%92%8C%E5%90%8C%E6%AD%A5%E5%99%A8)分布式锁

- 声明式锁：基于 [Lock4j](https://github.com/baomidou/lock4j)框架的 `@Lock4j` 注解

## 1. 编程式锁

```xml
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson-spring-boot-starter</artifactId>
</dependency>

```

### 1.1 Redisson 配置

无需配置。因为在 Redis 缓存 中，进行了 Spring Data Redis + Redisson 的配置。

### 1.2 实战案例

`sgmt-module-pay` 模块的 `notify`功能，使用到分布式锁，确保**每个**支付通知任务有且仅有一个在执行。下面，来看看这个案例是如何实现的。

① 在 `RedisKeyConstants`类中，定义通知任务使用的分布式锁的 Redis Key。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/06f92656-7495-4966-a640-3e0d82201064.png)

② 创建 `PayNotifyLockRedisDAO`类，使用 RedisClient 实现分布式锁的加锁与解锁。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/86eb65c2-6956-4a38-b89b-0b861354aabf.png)

③ 在 `PayNotifyServiceImpl`执行指定的支付通知任务时，通过 PayNotifyLockRedisDAO 获得分布式锁。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/4f5f545b-5021-4024-86ed-a7e93ade1211.png)

## 2. 声明式锁

考虑到不是所有人都会使用 Lock4j 组件，所以默认项目未引入 `lock4j-redisson-spring-boot-starter`。如果你想要实用，可按照下图进行引入：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/25055c61-978e-4945-a565-208d4ab2f541.png)

### 2.1 Lock4j 配置

**友情提示：以 sgmt-module-system 服务为例子。**

在 `application-local.yaml`配置文件中，通过 `lock4j` 配置项，添加 Lock4j 全局默认的分布式锁配置。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/d6436783-6fcf-496c-bbc0-347eb7d5d606.png)

### 2.2 使用案例

在需要使用到分布式锁的方法上，添加 `@Lock4j` 注解，非常方便。示例代码如下：

```java
@Service
public class DemoService {

    // 默认使用 lock4j 配置项
    @Lock4j
    public void simple() {
        //do something
    }

    // 完全配置，支持 Spring EL 表达式
    @Lock4j(keys = {"#user.id", "#user.name"}, expire = 60000, acquireTimeout = 1000)
    public User customMethod(User user) {
        return user;
    }

}

```
