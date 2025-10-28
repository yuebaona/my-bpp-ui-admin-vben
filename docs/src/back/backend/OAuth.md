---
outline: deep
---

# OAuth 2.0（SSO 单点登录)

## OAuth 2.0 授权模式的选择？

授权模式的选择，其实非常简单，总结起来就是一张图：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/30f05e44-eb38-487a-8278-67ce196c59e3.png)

## OAuth 2.0 技术选型？

实现 OAuth 2.0 的功能，一般采用 [Spring Security OAuth](https://docs.spring.io/spring-security/reference/servlet/oauth2/index.html)或[Spring Authorization Server](https://spring.io/projects/spring-authorization-server)(SAS) 框架，前者已废弃，被后者所替代。但是使用它们，会面临三大问题：

- 学习成本大：SAS 是新出的框架，入门容易精通难，引入项目中需要花费 1-2 周深入学习

- 排查问题难：使用碰到问题时，往往需要调试到源码层面，团队只有个别人具备这种能力

- 定制成本高：根据业务需要，想要在 SAS 上定制功能，对源码要有不错的掌控力，难度可能过大

因此，项目参考多个 OAuth 2.0 框架，**自研**实现 OAuth 2.0 的功能，具备学习成本小、排查问题容易、定制成本低的优点，支持多种授权模式，并内置 SSO 单点登录的功能。


最终实现的整体架构，如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/eaae0a95-0bce-47dd-a436-8ee12c9ef76b.png)

## 如何实现 SSO 单点登录？

### 实战一：基于授权码模式，实现 SSO 单点登录

示例代码见 [https://gitee.com/yudaocode/yudao-demo/tree/master/yudao-sso-demo-by-code](https://gitee.com/yudaocode/yudao-demo/tree/master/yudao-sso-demo-by-code)地址，整体流程如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/1fe8ee1a-5097-4f7c-b215-4d35dc15e100.png)

具体的使用流程如下：

**① 第一步**，分别启动 `ruoyi-vue-pro` 项目的前端和后端。

**② 第二步**，访问 [系统管理 -> OAuth 2.0 -> 应用管理](http://127.0.0.1:1024/system/oauth2/oauth2/application)菜单，新增一个应用（客户端），信息如下图：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/01b3555c-06b6-4106-a8ae-5a45ea7eb5db.png)

- 客户端编号：`yudao-sso-demo-by-code`

- 客户端密钥：`test`

- 应用名：`基于授权码模式，如何实现 SSO 单点登录？`

- 授权类型：`authorization_code`、`refresh_token`

- 授权范围：`user.read`、`user.write`

- 可重定向的 URI 地址：`http://127.0.0.1:18080`

ps：如果已经有这个客户端，可以不用新增。

**③ 第三步**，运行 [SSODemoApplication](https://gitee.com/yudaocode/yudao-demo/blob/master/yudao-sso-demo-by-code/src/main/java/cn/iocoder/yudao/ssodemo/SSODemoApplication.java)类，启动接入方的项目，它已经包含前端和后端部分。启动成功的日志如下：

::: info 友情提示：如果你使用的是 Vue3 + element-plus 的前端项目，一定要操作！！！

:::

需要把 yudao-sso-demo-by-code 的 `index.html` 文件中的 `http://127.0.0.1:1024` 改成 `http://127.0.0.1:8080`！！！否则在后续的“授权回调”时，会跳转失败噢！！！

```bash
2022-10-01 21:24:35.572  INFO 60265 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 18080 (http) with context path ''

```

**④ 第四步**，浏览器访问 [http://127.0.0.1:18080/index.html](http://127.0.0.1:18080/index.html)地址，进入接入方的 index.html 首页。因为暂未登录，可以点击「跳转」按钮，跳转到 `ruoyi-vue-pro` 项目的 SSO 单点登录页。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/1a31dbe2-a3f6-4abe-a454-12e160a3171a.png)

**⑤ 第五步**，勾选 "访问你的个人信息" 和 "修改你的个人信息"，点击「同意授权」按钮，完成 code 授权码的申请。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/8d40db7b-620e-42d3-b2f4-cf9e48ea0255.png)

**⑥ 第六步**，完成授权后，会跳转到接入方的 callback.html 回调页，并在 URL 上可以看到 code 授权码。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/326326d0-b981-4dcb-9deb-c13d3cb1b821.png)

**⑦ 第七步**，点击「确认」按钮，接入方的前端会使用 code 授权码，向接入方的后端获取 accessToken 访问令牌。

而接入方的后端，使用接收到的 code 授权码，通过调用 `ruoyi-vue-pro` 项目的后端，获取到 accessToken 访问令牌，并最终返回给接入方的前端。

**⑧ 第八步**，在接入方的前端拿到 accessToken 访问令牌后，跳转回自己的 index.html 首页，并进一步从 `ruoyi-vue-pro` 项目获取到该用户的昵称等个人信息。后续，你可以执行「修改昵称」、「刷新令牌」、「退出登录」等操作。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/09a7467c-256a-47a6-8356-dbe2af1d3b98.png)

---

### 实战二：基于密码模式，实现 SSO 登录

示例代码见 [https://gitee.com/yudaocode/yudao-demo/tree/master/yudao-sso-demo-by-password ](https://gitee.com/yudaocode/yudao-demo/tree/master/yudao-sso-demo-by-password)地址，整体流程如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/ab973182-551e-4283-bc35-ee1ac9fe8b2e.png)

具体的使用流程如下：

**① 第一步**，分别启动 `ruoyi-vue-pro` 项目的前端和后端。

**② 第二步**，访问 [系统管理 -> OAuth 2.0 -> 应用管理 ](http://127.0.0.1:1024/system/oauth2/oauth2/application)菜单，新增一个应用（客户端），信息如下图：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/9fcb609a-fc5e-411a-bfad-531992d5aea5.png)

- 客户端编号：`yudao-sso-demo-by-password`

- 客户端密钥：`test`

- 应用名：`基于密码模式，如何实现 SSO 单点登录？`

- 授权类型：`password`、`refresh_token`

- 授权范围：`user.read`、`user.write`

- 可重定向的 URI 地址：`http://127.0.0.1:18080`

ps：如果已经有这个客户端，可以不用新增。

**③ 第三步**，运行 [SSODemoApplication](https://gitee.com/yudaocode/yudao-demo/blob/master/yudao-sso-demo-by-password/src/main/java/cn/iocoder/yudao/ssodemo/SSODemoApplication.java)类，启动接入方的项目，它已经包含前端和后端部分。启动成功的日志如下：

```bash
2022-10-04 21:24:35.572  INFO 60265 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 18080 (http) with context path ''

```

**④ 第四步**，浏览器访问 [http://127.0.0.1:18080/index.html](http://127.0.0.1:18080/index.html)地址，进入接入方的 index.html 首页。因为暂未登录，可以点击「跳转」按钮，跳转到 login.html 登录页。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/d5920c3f-91ed-4d44-aedc-8c4b0b252ac3.png)

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/6cca844b-f4d2-4904-997e-7cece3e74422.png)

**⑤ 第五步**，点击「登录」按钮，调用 `ruoyi-vue-pro` 项目的后端，获取到 accessToken 访问令牌，完成登录操作。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/eb9d855a-9e47-4cda-8e20-1496e4965ad2.png)

**⑥ 第六步**，登录完成后，跳转回自己的 index.html 首页，并进一步从 `ruoyi-vue-pro` 项目获取到该用户的昵称等个人信息。后续，你可以执行「修改昵称」、「刷新令牌」、「退出登录」等操作。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/59c390ac-4b0f-4a92-acff-eb18b2f2410a.png)

---

## OAuth 2.0 表结构

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/f871464d-26d0-4bcb-afc0-49c209b49e85.png)
