---
outline: deep
---

# 服务网关Spring Cloud Gateway

[`yudao-gateway`](https://github.com/YunaiV/yudao-cloud/tree/master/yudao-gateway)模块，基于 Spring Cloud Gateway 构建 API 服务网关，提供用户认证、服务路由、灰度发布、访问日志、异常处理等功能。

## 1. 服务路由

新建服务后，在 [`application.yaml`](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-gateway/src/main/resources/application.yaml)配置文件中，需要添加该服务的路由配置。示例如下图：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/e3e4ab9d-5a21-4565-bbcb-dd67d27aa2b8.png)

## 2. 用户认证

由 [`filter/security`](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-gateway/src/main/java/cn/iocoder/yudao/gateway/filter/security/)包实现，无需配置。

TokenAuthenticationFilter 会获得请求头中的 `Authorization` 字段，调用 `system-server` 服务，进行用户认证。

- 如果认证成功，会将用户信息放到 `login-user` 请求头，转发到后续服务。后续服务可以从 `login-user` 请求头，[解析](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-spring-boot-starter-security/src/main/java/cn/iocoder/yudao/framework/security/core/filter/TokenAuthenticationFilter.java#L77-L95)到用户信息。

- 如果认证失败，依然会转发到后续服务，由该服务决定是否需要登录，是否需要校验权限。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/eab98a49-010a-4822-a036-40813436105f.png)

考虑到性能，API 网关会[本地缓存](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-gateway/src/main/java/cn/iocoder/yudao/gateway/filter/security/TokenAuthenticationFilter.java#L56-L71)Token 与用户信息，每次收到 HTTP 请求时，异步从 `system-server` 刷新本地缓存。

## 3. 灰度发布

由 [`filter/grey`](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-gateway/src/main/java/cn/iocoder/yudao/gateway/filter/grey/)包实现，实现原理如下：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/79fe2acd-b744-4d6f-a7ab-a1cacc7021de.png)

所以在使用灰度时，如要如下配置：

① 第一步，【网关】配置服务的路由配置使用 `grayLb://` 协议，指向灰度服务。例如说：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/63459926-c1fe-4d00-8d19-7d028063f767.png)

② 第二步，【服务】配置服务的版本 `version` 配置。例如说：

**图片纠错：最新版本将 yudao-module-system-biz 子模块，重命名为 yudao-module-system-server 子模块，更好表达它是一个服务**

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/69bb43dd-420e-4abf-aa53-cfc3cc9fa851.png)

③ 第三步，请求 API 网关时，请求头带上想要 `version` 版本。

可能想让用户的请求带上 `version` 请求头比较难，可以通过 Spring Cloud Gateway 修改请求头，通过 User Agent、Cookie、登录用户等信息，来判断用户想要的版本。

## 4. 访问日志

由 [`filter/logging`](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-gateway/src/main/java/cn/iocoder/yudao/gateway/filter/logging/)包实现，无需配置。

每次收到 HTTP 请求时，会打印访问日志，包括 Request、Response、用户等信息。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/b93249bd-6376-4236-bcb1-2dc12f5708bb.png)

## 5. 异常处理

由 [GlobalExceptionHandler](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-gateway/src/main/java/cn/iocoder/yudao/gateway/handler/GlobalExceptionHandler.java)累实现，无需配置。

请求发生异常时，会翻译异常信息，返回给用户。例如说：

```json
{
  "code": 500,
  "data": null,
  "msg": "系统异常"
}
```

## 6. 动态路由

在 Nacos 配置发生变化时，Spring Cloud Alibaba Nacos Config 内置的监听器，会监听到配置刷新，最终触发 Gateway 的路由信息刷新。

使用方式：在 Nacos 新增 DataId 为 `gateway-server.yaml` 的配置，修改 `spring.cloud.gateway.routes` 配置项。

## 7. Swagger 接口文档

基于 Knife4j 实现 Swagger 接口文档的 [网关聚合](https://doc.xiaominfo.com/docs/middleware-sources/spring-cloud-gateway/spring-gateway-introduction)。需要路由配置如下：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/846e26a6-a041-40ad-b908-38f3da5b13fa.png)

**友情提示：图中的 /v2/ 都改成 /v3/，或者以下面的文字为准！！！**

- 管理后台的接口：`- RewritePath=/admin-api/{服务的基础路由}/v3/api-docs, /v3/api-docs`

- 用户 App 的接口：`- RewritePath=/app-api/{服务的基础路由}/v3/api-docs, /v3/api-docs`

- Knife4j 配置：`knife4j.gateway.routes` 添加

浏览器访问 [http://127.0.0.1:48080/doc.html](http://127.0.0.1:48080/doc.html)地址，可以看到所有接口的信息。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/31ec3bc5-6b91-45a5-8ddd-9343540025fb.png)

### 7.1 如何调用

〇 点击左边「文档管理 - 全局参数设置」菜单，设置 `header-id` 和 `Authorization` 请求头。如下图所示：

```yaml
tenant-id：1
Authorization: Bearer test1

```

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/2cf2c9f3-b055-46c8-b498-2613d5d6cf0e.png)

添加完后，需要 F5 刷新下网页，否则全局参数不生效。

① 点击任意一个接口，进行接口的调用测试。这里，使用「管理后台 - 用户个中心」的“获得登录用户信息”举例子。

② 点击左侧「调试」按钮，并将请求头部的 `header-id` 和 `Authorization` 勾选上。

其中，`header-id` 为租户编号，`Authorization` 的 `"Bearer test"` 后面为用户编号（模拟哪个用户操作）。

③ 点击「发送」按钮，即可发起一次 API 的调用。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/dc6c8378-e2f4-4809-a97e-fc53c0d44bbc.png)

### 7.2 如何关闭

如果想要禁用 Swagger 功能，可通过 `knife4j.gateway.enabled` 配置项为 `false`。一般情况下，建议 prod 生产环境进行禁用，避免发生安全问题。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/207dd90d-fcf0-4a59-ab0c-144ff75f45f3.png)

## 8. Cors 跨域处理

由 [`filter/cors`](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-gateway/src/main/java/cn/iocoder/yudao/gateway/filter/cors/)包实现，无需配置。
