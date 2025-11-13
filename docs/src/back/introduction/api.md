---
outline: deep
---

# 接口文档

项目使用 Swagger 实现 RESTful API 的接口文档，提供两种解决方案：

\*【推荐】 `Apifox`：强大的 API 工具，支持 API 文档、API 调试、API Mock、API 自动化测试

- Knife4j：简易的 API 工具，仅支持 API 文档、API 调试

**为什么选择 Swagger 呢？**

Swagger 通过 Java 注解实现 API 接口文档的编写。相比使用 Java 注释的方式，注解提供更加规范的接口定义方式，开发体验更好。

每个服务都会启动 Swagger 的接口文档，方便开发者进行 API 调试。下述的内容，使用 `system-server` 系统服务举例子，它的端口是 48081。

::: tip 注意！注意！注意！文章部分图中，看到的是 48080 端口，实际你都填写 48081。

:::

## 1. Apifox 使用

本小节，我们来将项目中的 API 接口，一键导入到 Apifox 中，并使用它发起一次 API 的调用。

### 1.1 下载工具

点击 `Apifox`首页，下载对应的 Apifox 桌面版。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/63f42124-3a69-4bd8-a0ef-afea964c6037.png)

解压后，双击进行安装即可。黑色界面，非常酷炫。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/19a3f5a0-ae6a-4959-ba56-e39b0523dd8b.png)

### 1.2 API 导入

① 先点击「示例项目」，再点击「+」按钮，选择「导入」选项。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/70a932bd-d1b8-43ac-b348-9ad095ae04dc.png)

② 先选择「URL 导入」按钮，填写 Swagger 数据 URL 为 `http://127.0.0.1:48081/v3/api-docs` 。如果失败，则可以尝试 `http://127.0.0.1:48080/v3/api-docs/all` 解决。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/7170715d-5f8d-4bd8-9e54-80c19b3a2408.png)

③ 先点击「提交」按钮，再点击「确认导入」按钮，完成 API 接口的导入。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/b2576f3c-c896-4400-a9fb-32514da602fb.png)

④ 导入完成后，点击「接口管理」按钮，可以查看到 API 列表。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/2f8d7c5a-832a-4a12-bb2b-3e04b5ee3c2e.png)

### 1.3 API 调试

① 先点击右上角「请选择环境」，再点击「管理环境」选项，填写测试环境的地址为 `http://127.0.0.1:48081`，并进行保存。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/cff77896-753d-4654-9236-863c33c36bd0.png)

② 点击「管理后台 —— 认证」的「使用账号密码登录」接口，查看该 API 接口的定义。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/52f59495-9b9f-4725-9ee4-21f4f36ed6c9.png)

③ 点击「运行」按钮，填写 Headers 的 `tenant-id` 为 1，再点击 Body 的「自动生成」按钮，最后点击「发送」按钮。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/44fdf257-4923-4440-a304-accf6bb87073.png)

### 1.4 常见问题

问题 ①：分页 GET 请求时，如果有 `createTime` 这种时间类型的数组参数，会报错。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/d1c876b8-b57a-4b5e-ab9f-ef3dfc36e6a0.png)

答：把 `createTime` 左右两边的 `[]` 去掉，即可解决。

## 2. Knife4j 使用

### 2.1 如何使用？

浏览器访问 [http://127.0.0.1:48081/doc.html](http://127.0.0.1:48081/doc.html)地址，使用 Knife4j 查看 API 接口文档。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/739b2a13-cd83-4b47-9144-cc107c671871.png)

① 点击任意一个接口，进行接口的调用测试。这里，使用「管理后台 - 用户个中心」的“获得登录用户信息”举例子。

② 点击左侧「调试」按钮，并将请求头部的 `header-id` 和 `Authorization` 勾选上。

其中，`header-id` 为租户编号，`Authorization` 的 `"Bearer test"` 后面为用户编号（模拟哪个用户操作）。

③ 点击「发送」按钮，即可发起一次 API 的调用。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/7b099850-944f-4981-9a36-d3e1c828d8dc.png)

### 2.2 如何开启登录？

生产环境下，建议 Knife4j 接口界面开启“安全认证”的功能，避免出现安全事故。

只需要在 `knife4j.basic` 配置项中，额外添加 Basic Auth 认证即可，如下所示：

```yaml
knife4j:
  basic:
    enable: true
    username: admin # Basic 认证用户名
    password: admin # Basic 认证密码
```

## 3. Swagger 技术组件

① 在 `bpp-spring-boot-starter-web`技术组件的 `swagger`包，实现了对 Swagger 的封装。

② 如果想要禁用 Swagger 功能，可通过 `springdoc.api-docs.enable` 配置项为 `false`。一般情况下，建议 prod 生产环境进行禁用，避免发生安全问题。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/1606dfe7-df16-4642-90f9-74fc01c624dc.png)
