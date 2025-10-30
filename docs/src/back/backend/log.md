---
outline: deep
---

# 操作日志、访问日志、异常日志

项目提供 2 类 4 种系统日志：

- 审计日志：用户的操作日志、登录日志

- API 日志：RESTful API 的访问日志、错误日志

## 1. 操作日志

操作日志，记录「谁」在「什么时间」对「什么对象」做了「什么事情」。

打开 \[系统管理 -> 审计日志 -> 操作日志\] 菜单，可以看到对应的列表，如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/280f63d4-7453-4ba4-b449-883f924e008c.png)

### 1.1 操作日志组件

① 操作日志的记录，由`bpp-spring-boot-starter-security`技术组件的 `operatelog` 包提供，基于我老友开源的`https://github.com/mouzt/mzt-biz-log`实现，只需要添加 `@LogRecord` 注解，即可实现操作日志的记录。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/089fd710-7cb4-4ae4-ba40-d0bcc70e1fa6.png)

- 【新增】2021-09-16 10:00 订单创建，订单号：NO.11089999，其中涉及变量订单号 “NO.11089999”

- 【修改】2021-09-16 10:00 用户小明修改了订单的配送地址：从 “金灿灿小区” 修改到 “银盏盏小区”

② 操作日志的存储，由 `bpp-module-system` 的`OperateLog`模块实现，记录到数据库的`system_operate_log`表。

---

### 1.2 场景一：创建用户

① 在 `LogRecordConstants`类中，定义 `SYSTEM_USER_CREATE_SUB_TYPE`、`SYSTEM_USER_CREATE_SUCCESS` 变量。如下图所示：

**图片纠错：最新版本将 bpp-module-system-biz 子模块，重命名为 bpp-module-system-server 子模块，更好表达它是一个服务**

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/60d6a38f-d8ee-4c33-8a55-271df173de5c.png)

② 在 Service 方法上，添加 `@LogRecord` 注解，如下图所示：

::: info 图片纠错：最新版本将 bpp-module-system-biz 子模块，重命名为 bpp-module-system-server 子模块，更好表达它是一个服务

:::

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/84c88f09-bae1-47a9-96ad-45da95ad3fd7.png)

最终，我们记录操作日志的内容，如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/3b9618d5-bb0f-4052-b416-2c72492bd2e5.png)

### 1.3 场景二：修改用户信息

① 在 `LogRecordConstants`类中，定义 `SYSTEM_USER_UPDATE_SUB_TYPE`、`SYSTEM_USER_UPDATE_SUCCESS` 变量。如下图所示：

::: info 图片纠错：最新版本将 bpp-module-system-biz 子模块，重命名为 bpp-module-system-server 子模块，更好表达它是一个服务

:::

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/f4eb584a-3d4a-46a5-a89e-bc13e3cf4615.png)

这里我们使用了 `_DIFF` 函数，实现对象 diff 功能，即“【备注】从【132】修改为【1324】”。因此，我们需要在 `UserSaveReqVO`类上添加 `@DiffLogField` 注解，如下图所示：

::: info 图片纠错：最新版本将 bpp-module-system-biz 子模块，重命名为 bpp-module-system-server 子模块，更好表达它是一个服务

:::

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/cc1f3d69-eaf7-4d46-bcab-2ee1521c77725.png)

- 注解的 `name` 字段：字段的中文名，例如说：“【备注】”

- 注解的 `function` 字段：自定义函数，用于字段的值翻译，例如说：`PostParseFunction`岗位名、`DeptParseFunction`部门名、`SexParseFunction`性别等等

② 在 Service 方法上，添加 `@LogRecord` 注解，如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/93c4d239-c8fb-4b88-9f58-21c612676183.png)

最终，我们记录操作日志的内容，如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/fc131ca9-aa52-4988-be6e-c2f4583cecad.png)

## 2. 登录日志

登录日志，记录用户的登录、登出行为，包括成功的、失败的。

打开 \[系统管理 -> 审计日志 -> 登录日志\] 菜单，可以看对应的列表，如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/d5af3790-6df7-4ff2-a9ad-6b0a7847feec.png)

登录日志的存储，由 `bpp-module-system` 的 `LoginLog`模块实现，记录到数据库的 `system_login_log`表。

登录类型通过 `LoginLogTypeEnum`枚举，登录结果通过 `LoginResultEnum`枚举，都可以自定义。代码如下：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/d9878557-374d-444c-bd22-d3a3c8f69a8b.png)

### 3.1 数据库记录

API 访问日志，记录 API 的每次调用，包括 HTTP 请求、用户、开始时间、时长等等信息。

打开 \[基础设施 -> API 日志 -> 访问日志\] 菜单，可以看对应的列表，如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/ccf3f711-09ac-4470-bdc8-61e31b037ea1.png)

① 访问日志的记录，由 `bpp-spring-boot-starter-web`技术组件实现，通过 `ApiAccessLogFilter`过滤 RESTful API 请求，**异步**记录日志。

② 访问日志的存储，由 `bpp-module-infra` 的 `AccessLog`模块实现，记录到数据库的 `infra_api_access_log`表。

③ 可以通过 `@ApiAccessLog`注解，自定义 API 访问日志的记录。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/8c83d9ee-a507-49f4-b7d8-94cc7c5bca43.png)

- `enable` 字段：是否记录日志，默认为 `true` 记录日志。如果你想某个接口不记录日志，可以设置为 `false`，例如说 NotifyMessageController 的 `#getUnreadNotifyMessageCount()` 接口

- `requestEnable` 字段：默认为 `true` 记录请求参数，主要考虑请求参数一般不大。如果你想某个接口不记录请求参数，可以设置为 `false`

- `sanitizeKeys` 字段：脱敏字段，例如说：密码、访问令牌等等。如果你想某个接口脱敏某个字段，可以设置为 `password`、`mobile` 等等。另外，ApiAccessLogFilter 默认有 `SANITIZE_KEYS`全局配置，包括 `password`、`accessToken`、`refreshToken` 等，避免大家忘记~

- `responseEnable` 字段：默认为 `false` 不记录响应参数，主要考虑响应参数一般比较大，特别是 `GET` 列表请求。如果你想某个接口记录响应参数，可以设置为 `true`

- `operateModule` 字段：操作模块，例如说：用户、岗位、部门等等。为空时，默认会读取类上的 Swagger `@Tag` 注解的 `name` 属性

- `operateName` 字段：操作名，例如说：新增用户、修改用户等等。为空时，默认会读取方法的 Swagger `@Operation` 注解的 `summary` 属性

- `operateType` 字段：操作类型，操作类型，在 `OperateTypeEnum`枚举。目前有 `GET` 查询、`CREATE` 新增、`UPDATE` 修改、`DELETE` 删除、`EXPORT` 导出、`IMPORT` 导入、`OTHER` 其它，可进行自定义

④ 在 `local` 本地环境下，一般做一些日常开发，使用不到“访问日志”，所以默认在 `application-local.yaml` 配置文件里，我们设置 `bpp.access-log.enable` 为 `false` 默认不记录，大家如果有需要，可以设置为 `true` 打开进行记录。

### 3.2 文件记录

项目还提供了 `ApiAccessLogInterceptor`拦截器，打印 HTTP 请求、参数、耗时到文件（IDEA 控制台）中，方便大家进行调试。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/1a53bc03-3059-4fec-a4a3-3b67d9827680.png)

每次请求有两条：一条 `request` 【开始请求】包括请求 URL、请求参数；一条 `response` 【结束请求】只包括耗时。

另外，考虑到 ApiAccessLogInterceptor 的定位是开发调试，所以 `prod` 生产环境默认不开启噢，当然你也可以按照自己需要修改。

## 4. API 错误日志

API 错误日志，记录每次 API 的异常调用，包括 HTTP 请求、用户、异常的堆栈等等信息。

打开 \[基础设施 -> API 日志 -> 错误日志\] 菜单，可以看对应的列表，如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/4479849d-7226-479a-bf8b-18b58be23396.png)

错误日志的记录，由 `bpp-spring-boot-starter-web`技术组件实现，通过 `GlobalExceptionHandler`拦截每次 RESTful API 的系统异常，**异步**记录日志。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/1e51c283-7dd7-43c2-a516-5f4c2e2fd882.png)

错误日志的存储，由 `bpp-module-infra` 的 `ErrorLog`模块实现，记录到数据库的 `infra_api_error_log`表。
