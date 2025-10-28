---
outline: deep
---

# VO对象转换、数据翻译

本小节，我们来讲解 VO 的对象转换、数据翻译的功能。注意，这里的 VO 是泛指 Java POJO 对象，也可以是 DTO、BO 等等。

## 1. 对象转换

对象转换，指的是 A 类型对象，转换成 B 类型对象。例如说，我们有一个 UserDO 类型对象，需要转换成 UserVO 或者 UserDTO 类型对象。

市面上有很多的对象转换工具，例如说 MapStruct、Dozer、各种 BeanUtils、BeanCopier 等等。目前我们提供了 MapStruct、BeanUtils 两种解决方案。

相比来说，MapStruct 性能会略好于 BeanUtils，但是相比数据库操作带来的耗时来说，基本可以忽略不计。因此，一般情况下，建议使用 BeanUtils 即可。

### 1.1 MapStruct

项目使用`MapStruct`实现 VO、DO、DTO 等对象之间的转换。

在每个 `yudao-module-xxx-server` 模块的 `convert` 包下，可以看到各个业务的 Convert 接口，如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/3b8ebaf9-d3e0-4f02-bd45-484fec5f8233.png)

### 1.2 BeanUtils

项目提供了`BeanUtils`类，它是基于 Hutool 的 BeanUtil 封装一层。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/3c88e1fe-6f1b-4f4d-b36c-d7c4a26d9132.png)

1、在简单场景，直接使用 BeanUtils 的 `#toBean(...)` 方法，如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/a1874b06-c8fe-4d09-95c6-4517c87733ba.png)

2、在复杂场景，可以通过 Consumer 进一步拼接，如下图所示：

::: info 图片纠错：最新版本将 yudao-module-erp-biz 子模块，重命名为 yudao-module-erp-server 子模块，更好表达它是一个服务 

:::

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/91227c7a-6d06-4045-840c-d428ce7cb9a4.png)

当然，如果 Consumer 的逻辑比较复杂，又希望 Controller 代码精简一点，可以放到对应的 Convert 类里，如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/3e2097f0-0cc3-4e6d-bdd6-4ac2979aa900.png)

## 2. 数据翻译

数据翻译，指的是将 A 类型对象的某个字段，“翻译”成 B 类型对象的某个字段。例如说，我们有一个 UserVO 的 `deptId` 字段，读取对应 DeptDO 的 `name` 字段，最终设置到 UserVO 的 `deptName` 字段。

一般来说，目前有两种方案：

- 方案一：数据库 SQL 联表查询

- 方案二：数据库多次单表查询，然后在 Java 代码中进行数据拼接（翻译）。其实就是「1.2 BeanUtils」的“复杂场景”。如下图所示：

::: info 图片纠错：最新版本将 yudao-module-erp-biz 子模块，重命名为 yudao-module-erp-server 子模块，更好表达它是一个服务 

:::

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/284da3d6-410f-4131-9c69-bba362b37573.png)

项目里，大多数采用“方案二”，因为这样可以减少数据库的压力，避免 SQL 过于复杂，也方便后续维护。

不过如果觉得“方案二”比较麻烦，也集成了`easy-trans`框架，一个注解，搞定数据翻译。

下面，来分场景，看看具体如何使用！

### 2.1 场景一：模块内翻译

模块内翻译，指的是在同一个模块内，进行数据翻译。例如说，OperateLogRespVO 属于 `yudao-module-system` 模块，需要读取模块内的 AdminUserDO 数据。

① 第一步，给 OperateLogRespVO 实现 `com.fhs.core.trans.vo.VO` 接口。

② 第二步，给 OperateLogRespVO 的 `deptId` 字段，添加 `@Trans` 注解，如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/d428ef1a-262c-4cbe-b28f-b2bcee63d108.png)

- `type` 属性：使用 `TransType.SIMPLE` 简单翻译，使用 MyBatis Plus

- `target` 属性：目标 DO 实体的类，例如说 `AdminUserDO.class`

- `fields` 属性：读取 DO 实体的字段，例如说 `nickname`。如果是多个字段，它也是个数组

- `ref` 属性：设置 VO 类的字段，例如说 `userNickname`。如果是多个字段，可以使用 `refs`

③ 第三步，给需要翻译的 Controller 接口，添加 `@@TransMethodResult` 注解，代码如下所示：

```java
@Tag(name = "管理后台 - 操作日志")
@RestController
@RequestMapping("/system/operate-log")
@Validated
public class OperateLogController {

    @GetMapping("/page")
    @Operation(summary = "查看操作日志分页列表")
    @PreAuthorize("@ss.hasPermission('system:operate-log:query')")
    @TransMethodResult // 【重要】这里是关键！！！
    public CommonResult<PageResult<OperateLogRespVO>> pageOperateLog(@Valid OperateLogPageReqVO pageReqVO) {
        PageResult<OperateLogDO> pageResult = operateLogService.getOperateLogPage(pageReqVO);
        return success(BeanUtils.toBean(pageResult, OperateLogRespVO.class));
    }

}

```

### 2.2 场景二：跨服务翻译

跨服务翻译，指的是在不同服务，通过 RPC 进行数据翻译。例如说，CrmProductRespVO 属于 `yudao-module-crm` 服务，需要读取 `yudao-module-system` 服务的 AdminUserRespDTO 数据。

使用上，会分成两块：

- 【自定义翻译器】在 `yudao-module-system` 服务中，自定义一个 AutoTransable 数据翻译器的实现，提供 AdminUserRespDTO 的查询方法

- 【使用翻译器】在 `yudao-module-crm` 服务中，使用刚定义的 AutoTransable 数据翻译器，实现数据翻译

#### 2.2.1 自定义翻译器

① 第一步，给 AdminUserRespDTO 实现 `com.fhs.core.trans.vo.VO` 接口。

② 第二步，给 AdminUserApi 实现 `com.fhs.trans.service.AutoTransable` 接口，并实现对应的 `#selectByIds(...)` 和 `#selectById(...)` 方法，还要添加 `@AutoTrans` 注解，如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/29b8ad8c-e446-4531-b7dc-4a08edcc0305.png)

其中 `@AutoTrans` 注解，主要是两个属性：

- `namespace` 属性：指定数据翻译器的命名空间，需要全局唯一，这里可以直接使用 AdminUserApi 的 `PREFIX`

- `fields` 属性：哪些属性可以被翻译，例如说 `nickname` 昵称可以被翻译

::: info 友情提示：

如果你使用的是 jdk8 版本，没有 `@FeignIgnore` 注解，可以分别添加 `@GetMapping("select")` 和 `@GetMapping("select-list")` 注解，不然 Feign 会启动检测，导致项目启动失败。

:::

#### 2.2.2 使用翻译器

① 第一步，给 CrmProductRespVO 实现 `com.fhs.core.trans.vo.VO` 接口。

② 第二步，给 CrmProductRespVO 的 `ownerUserId` 字段，添加 `@Trans` 注解，如下图所示：

::: info 图片纠错：最新版本将 yudao-module-crm-biz 子模块，重命名为 yudao-module-crm-server 子模块，更好表达它是一个服务 

:::

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/da9832af-ba8a-4517-b5d3-f1f490325880.png)

- `type` 属性：使用 `TransType.AUTO_TRANS` 自定义翻译器（注意！不是图中的 RPC！！！）

- `key` 属性：使用自定义翻译器的 `namespace` 属性，这里就是 AdminUserApi 的 `PREFIX`

- `fields` 和 `ref` 属性：同上，不重复解释

③ 第三步，给需要翻译的 Controller 接口，添加 `@TransMethodResult` 注解，和上面是一样的。

### 2.3 场景三：Excel 导出翻译

在 Excel 导出时，如果也有数据翻译的需求，需要调用`TranslateUtils`的 `#translate(...)` 方法，如下图所示：

**图片纠错：最新版本将 yudao-module-crm-biz 子模块，重命名为 yudao-module-crm-server 子模块，更好表达它是一个服务**

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/29af7c69-9539-4984-80eb-c36ecdab675d.png)

本质上，它就是 `easy-trans` 的手动翻译
