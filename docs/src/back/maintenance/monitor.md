---
outline: deep
---

# 服务监控

系统使用 Spring Boot Admin 和 SkyWalking 实现后端服务的监控。

## 1. Spring Boot Admin

注意，Spring Boot Admin 是内嵌在 `yudao-infra-server` 服务中，无需单独启动。

### 1.1 如何配置？

① 【开启 Spring Boot Admin Client 客户端】修改 `yudao-spring-boot-starter-monitor` 模块的 `pom.xml` 依赖，将如下依赖打开（去掉 `<optional>true</optional>` 部分）：

```xml
        <dependency>
            <groupId>de.codecentric</groupId>
            <artifactId>spring-boot-admin-starter-client</artifactId> <!-- 实现 Spring Boot Admin Client 客户端 -->
        </dependency>

```

② 【开启 Spring Boot Admin Server 服务端】修改 `yudao-module-infra-server` 服务的 `pom.xml` 依赖，将如下依赖打开（去掉注释）：

```xml
        <dependency>
            <groupId>de.codecentric</groupId>
            <artifactId>spring-boot-admin-starter-server</artifactId> <!-- 实现 Spring Boot Admin Server 服务端 -->
        </dependency>

```

③ 将 AdminServerConfiguration 类上的 `@EnableAdminServer` 注解。

之后，使用 IDEA 刷新下 Maven 依赖！！！

### 1.2 如何使用？

① 访问 [http://127.0.0.1:48080/admin/applications](http://127.0.0.1:48080/admin/applications)地址，可以在 Spring Boot Admin 中，查看到应用与实例的列表。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/456bfc58-1a2f-4ab0-91bc-c71ca16990af.png)

② 点击 `yudao-server` 应用，再点击实例，可以查看到该实例的细节信息。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/650869a5-3e7b-48e3-8eaa-f9f95a279fb7.png)

③ 点击 \[日志 -> 日志文件\] 菜单，查看该示例的日志内容。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/788cf63d-586a-406b-8f6f-550d14b8cbd7.png)

点击 \[日志 -> 日志文件\] 菜单，可动态修改 Logger 的日志级别，方便排查线上的某些 BUG。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/53c8287d-3f9c-4aa9-8d11-2642fffd186b.png)

**补充说明：也可以通过前端的 \[基础设施 -> 监控中心 -> Java 监控\] 菜单。**

前端 \[基础设施 -> 监控中心 -> Java 监控\] 菜单，通过 iframe 内嵌后端 `/admin/applications` 路径。

如果你想自定义地址，可以前往 \[基础设置 -> 配置管理\] 菜单，设置 key 为 `url.spring-boot-admin` 配置项。

### 1.3 常见问题？

#### 1.3.1 如何开启登录？

生产环境下，建议 Spring Boot Admin 开启“安全认证”的功能，避免出现安全事故。

#### 1.3.2 prod 生产环境下，后端部署多个 JVM 进程时，spring.boot.admin.client.url 填写哪个 IP？

- 第一步，在 Nginx 中配置 `/admin` 路径，转发到多个 JVM 的 IP 上，使用 [`backup`](https://blog.csdn.net/bolg_hero/article/details/73382117)参数实现主备。注意，该转发只允许内网访问，避免安全问题！！！

- 第二步，设置 `spring.boot.admin.client.url` 配置项，为 Nginx 的 `内置 IP/admin` 地址。

#### 1.3.3 Spring Boot Admin Server 是否可以独立？

确实，也是非常推荐 Spring Boot Admin Server 的。可以单独搭建 Spring Boot Admin Server 服务端。

然后，参考「1.3.2」问题，将 `spring.boot.admin.client.url` 配置项，为 Spring Boot Admin Server 的地址即可。

当然，原本项目只需要引入 `spring-boot-admin-starter-client` 依赖，不用引入 `spring-boot-admin-starter-server` 依赖！！！

#### 1.3.4 Spring Boot Admin 存在 CORS 跨域问题！

如果使用 [http://127.0.0.1:48080/admin/applications](http://127.0.0.1:48080/admin/applications)访问时，它会存在跨域问题，类似 [https://wx.zsxq.com/dweb2/index/topic_detail/1522481281485252](https://wx.zsxq.com/dweb2/index/topic_detail/1522481281485252)反馈。

目前的解决方案，使用 [http://127.0.0.1:48082/admin/applications](http://127.0.0.1:48082/admin/applications)替代，不经过 Spring Cloud Gateway 转发。

未来的解决方案，可能会考虑把 Spring Boot Admin 从 `infra` 服务独立出去，作为一个纯粹的监控服务。

---

产生的原因是，在访问 `infra` 服务的 `admin/instances/6af44c477baf/actuator/metrics` 时，会返回多个 `Access-Control-Allow-Origin` 头，导致浏览器报 `has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header contains multiple values` 错误。

进一步分析，因为 Spring Boot Admin 在 `infra` 服务中，它自己有跨域处理，然后请求别的 `system` 等服务获取监控数据的时候，又做了一次跨域处理，导致重复了！！！

## 2. SkyWalking

注意，SkyWalking 需要单独启动，预计需要 4 核 8G 的硬件资源。

### 2.1 如何配置？

① 修改 `yudao-spring-boot-starter-monitor` 模块的 `pom.xml` 依赖，将如下依赖打开（去掉 `<optional>true</optional>` 部分）：

```xml
        <!-- 监控相关 -->
        <dependency>
            <groupId>io.opentracing</groupId>
            <artifactId>opentracing-util</artifactId>
        </dependency>
        <dependency>
            <groupId>org.apache.skywalking</groupId>
            <artifactId>apm-toolkit-trace</artifactId>
        </dependency>
        <dependency>
            <groupId>org.apache.skywalking</groupId>
            <artifactId>apm-toolkit-logback-1.x</artifactId>
        </dependency>
        <dependency>
            <groupId>org.apache.skywalking</groupId>
            <artifactId>apm-toolkit-opentracing</artifactId>
        </dependency>

```

② 修改所有 `logback-spring.xml` 日志配置中，添加 SkyWalking 收集日志的 appender 配置。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/160ead3c-9c2c-4035-9bac-d91670dff348.png)

**【可选】补充说明：**

默认情况下，控制台 `STDOUT` 和 `FILE` 的 Appender 日志输出，是不带 `tid` 链路追踪编号。

可以参考 `SKYWALKING` Appender 的 `encoder` 部分的配置，添加上 LayoutWrappingEncoder、TraceIdPatternLogbackLayout 部分，就是如下：

```xml
        <encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
            <layout class="org.apache.skywalking.apm.toolkit.log.logback.v1.x.TraceIdPatternLogbackLayout">
                <pattern>[%tid] ${FILE_LOG_PATTERN}</pattern>
            </layout>
        </encoder>

```

- `<pattern>` 里面的重点是 `[%tid]` 部分，并且要写对 `CONSOLE_LOG_PATTERN` 或 `FILE_LOG_PATTERN` 噢！！！

③ 修改 SkyWalking 在前端项目的 \[基础设施 -> 监控中心 -> 链路追踪\] 对应的 [`skywaling/index.vue`](https://github.com/yudaocode/yudao-ui-admin-vue2/blob/master/src/views/infra/skywalking/index.vue#L11)文件，调整为你 SkyWalking 的访问地址。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/c7cda297-b3d7-422f-b788-f7923f793630.png)

### 2.2 如何使用？

① 点击 \[基础设施 -> 监控中心 -> 链路追踪\] 菜单，可以看到 SkyWalking 提供的链路追踪。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/43f353be-f7ec-40e2-9cca-569e5b179bcf.png)

② 点击 `yudao-server` 服务，查看该服务的监控信息。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/121502bf-5daf-40ab-94e8-168f9c0e6941.png)

**补充说明：**

前端 \[基础设施 -> 监控中心 -> 链路追踪\] 菜单，通过 iframe 内嵌 `http://skywalking.iocoder.cn` 路径。

如果你想自定义地址，可以前往 \[基础设置 -> 配置管理\] 菜单，设置 key 为 `url.skywalking` 配置项。

## 3. 更多监控系统

### 3.1 Prometheus

注意，修改项目的 `yudao-spring-boot-starter-monitor` 模块的 `pom.xml` 依赖，将如下依赖打开（去掉 `<optional>true</optional>` 部分）：

```xml
        <!-- Micrometer 对 Prometheus 的支持 -->
        <dependency>
            <groupId>io.micrometer</groupId>
            <artifactId>micrometer-registry-prometheus</artifactId>
            <optional>true</optional>
        </dependency>

```
