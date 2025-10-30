---
outline: deep
---

# 异常处理（错误码）

本章节，将讲解异常相关的统一响应、异常处理、业务异常、错误码这 4 块的内容。

## 1. 统一响应

后端提供 RESTful API 给前端时，需要响应前端 API 调用是否成功：

- 如果成功，成功的数据是什么。后续，前端会将数据渲染到页面上

- 如果失败，失败的原因是什么。一般，前端会将原因弹出提示给用户

因此，需要有**统一响应**，而不能是每个接口定义自己的风格。一般来说，统一响应返回信息如下：

- 成功时，返回成功的状态码 + 数据

- 失败时，返回失败的状态码 + 错误提示

在标准的 RESTful API 的定义，是推荐使用 [HTTP 响应状态码](https://zh.wikipedia.org/wiki/HTTP%E7%8A%B6%E6%80%81%E7%A0%81)作为状态码。一般来说，我们实践很少这么去做，主要原因如下：

- 业务返回的错误状态码很多，HTTP 响应状态码无法很好的映射。例如说，活动还未开始、订单已取消等等

- 学习成本高，开发者对 HTTP 响应状态码不是很了解。例如说，可能只知道 200、403、404、500 几种常见的

### 1.1 CommonResult

项目在实践时，将状态码放在 Response Body 响应内容中返回。一共有 3 个字段，通过`CommonResult`定义如下：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/1f6cab16-08f4-417f-a671-42eddbbec4d2.png)

```json
// 成功响应
{
    code: 0,
    data: {
        id: 1,
        username: "shenggangmatou"
    }
}

// 失败响应
{
    code: 233666,
    message: "错误"
}

```

① 在 RESTful API 成功时，定义 Controller 对应方法的返回类型为 CommonResult，并调用 `#success(T data)`方法来返回。代码如下图：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/e998a610-7e18-40c5-a32c-ab922852e17b.png)

CommonResult 的 `data` 字段是**泛型**，建议定义对应的 VO 类，而不是使用 Map 类。

② 在 RESTful API 失败时，通过抛出 Exception 异常，具体在`「2. 异常处理」`小节。

### 1.2 使用 `**@ControllerAdvice**` ？

在 Spring MVC 中，可以使用 `@ControllerAdvice` 注解，通过 Spring AOP 拦截修改 Controller 方法的返回结果，从而实现全局的统一返回。

为什么项目不采用这种方式呢？主要原因是，这样的方式“破坏”了方法的定义，导致一些隐性的问题。例如说，Swagger 接口定义错误，展示的响应结果不是 CommonResult。

还有个原因，部分 RESTful API 不需要自动包装 CommonResult 结果。例如说，第三方支付回调只需要返回 `"success"` 字符串。

## 2. 异常处理

RESTful API 发生异常时，需要拦截 Exception 异常，转换成**统一响应**的格式，否则前端无法处理。

### 2.1 Spring MVC 的异常

在 Spring MVC 中，通过 `@ControllerAdvice` + `@ExceptionHandler` 注解，声明将指定类型的异常，转换成对应的 CommonResult 响应。实现的代码，可见`GlobalExceptionHandler`类，代码如下：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/6d80d86f-19d5-4ebd-9867-a0aa0e39de6e.png)

### 2.2 Filter 的异常

在请求被 Spring MVC 处理之前，是先经过 Filter 处理的，此时发生异常时，是无法通过 `@ExceptionHandler` 注解来处理的。只能通过 `try catch` 的方式来实现，代码如下：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/da0e7d69-51b9-4be6-8c75-a10116a0fe5a.png)

## 3. 业务异常

在 Service 发生业务异常时，如果进行返回呢？例如说，用户名已经存在，商品库存不足等。常用的方案选择，主要有两种：

- 方案一，使用 CommonResult 统一响应结果，里面有错误码和错误提示，然后进行 `return` 返回

- 方案二，使用 ServiceException 统一业务异常，里面有错误码和错误提示，然后进行 `throw` 抛出

选择方案一 CommonResult 会存在两个问题：

- 因为 Spring `@Transactional` 声明式事务，是基于异常进行回滚的，如果使用 CommonResult 返回，则事务回滚会非常麻烦

- 当调用别的方法时，如果别人返回的是 CommonResult 对象，还需要不断的进行判断，写起来挺麻烦的

因此，项目采用方案二 ServiceException 异常。

### 3.1 ServiceException

定义`ServiceException`异常类，继承 RuntimeException 异常类（非受检），用于定义业务异常。代码如下：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/341e38fe-68e5-49db-b4b3-4ec9bbce94b0.png)

### 3.2 ServiceExceptionUtil

在 Service 需抛出业务异常时，通过调用`ServiceExceptionUtil`的 `#exception(ErrorCode errorCode, Object... params)` 方法来构建 ServiceException 异常，然后使用 `throw` 进行抛出。代码如下：

```java
// ServiceExceptionUtil.java

public static ServiceException exception(ErrorCode errorCode) { /** 省略参数 */ }
public static ServiceException exception(ErrorCode errorCode, Object... params) { /** 省略参数 */ }

```

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/cb35ad67-f21a-45f4-8e19-3d224c08ae6f.png)

## 4. 错误码

错误码，对应 `ErrorCode`类，枚举项目中的错误，**全局唯一**，方便定位是谁的错、错在哪。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/c60dd5f7-7a39-4e62-808e-38022d17a9a2.png)

### 4.1 错误码分类

错误码分成两类：全局的系统错误码、模块的业务错误码。

#### 4.1.1 系统错误码

全局的系统错误码，使用 0-999 错误码段，和`HTTP 响应状态码`对应。虽然说，HTTP 响应状态码作为业务使用表达能力偏弱，但是使用在系统层面还是非常不错的。

系统错误码定义在`GlobalErrorCodeConstants`类，代码如下：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/75a45e8a-f816-4984-bb2f-486d874ba4c3.png)

#### 4.1.2 业务错误码

模块的业务错误码，按照模块分配错误码的**区间**，避免模块之间的错误码冲突。

① 业务错误码一共 10 位，分成 4 段，在`ServiceErrorCodeRange`分配，规则与代码如下图：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/86fbf925-1058-4195-8678-6d0bcb1d67b0.png)

② 每个业务模块，定义自己的 ErrorCodeConstants 错误码枚举类。以 `sgmt-module-system` 模块举例子，代码如下：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/5e7a36de-9a22-4414-a5fa-f6347ad8a12c.png)
