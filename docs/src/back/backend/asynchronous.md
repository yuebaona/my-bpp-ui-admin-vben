---
outline: deep
---

# 异步任务

`bpp-spring-boot-starter-job`技术组件，除了提供定时任务的功能，还提供了 Async 异步任务的能力。系统使用异步任务，提升执行效率。例如说：


## 1.Async配置

### 安装依赖

在 `YudaoAsyncAutoConfiguration`配置类，设置使用`TransmittableThreadLocal`，解决异步执行时上下文传递的问题。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/a98ca1c4-b854-4daa-a3ae-32f2cfbc2af1.png)

## 2.引入依赖

以访问日志模块为例，讲解它如何使用异步任务，实现异步记录【访问日志】的功能。

### 2.1引入依赖

在 `bpp-module-system-infra` 模块中，引入 `bpp-spring-boot-starter-job` 技术组件。如下所示：

```xml
<dependency>
    <groupId>cn.iocoder.cloud</groupId>
    <artifactId>bpp-spring-boot-starter-job</artifactId>
</dependency>

```

### 2.2 添加 @Async 注解

在`ApiAccessLogServiceImpl`的 `#createApiAccessLogAsync(...)` 方法上，添加 `@Async` 注解，声明它要异步执行。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/307a6922-1d6b-4996-9a15-daef67618095.png)

### 2.3 测试调用

随便请求一个 RESTful API 接口，可以看到在异步任务的线程池中，进行了访问日志的记录。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/a212217a-b929-47e7-99c7-5df84595e3f2.png)
