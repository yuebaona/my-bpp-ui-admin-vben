---
outline: deep
---

# 工具类Util

本小节，介绍项目中使用到的工具类，避免大家重复造轮子。

## 1. Hutool

项目使用 [Hutool](https://www.bookstack.cn/read/hutool/a6819f05207359bb.md)作为主工具库。Hutool 是国产的一个 Java 工具包，它可以帮助我们简化每一行代码，减少每一个方法，让 Java 语言也可以“甜甜的”。

`bpp-common`模块的 `util`包作为辅工具库，以 Utils 结尾，补充 Hutool 缺少的工具能力。

**友情提示：常用的工具类，使用 ⭐ 标记，需要的时候可以找找有没对应的工具方法。**

| 作用 | Hutool | yudao Utils |
| --- | --- | --- |
| 数组工具 | [ArrayUtil](https://www.bookstack.cn/read/hutool/50db4cabc87b5968.md) | [ArrayUtils](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/util/collection/ArrayUtils.java) |
| ⭐ 集合工具 | [CollUtil](https://www.bookstack.cn/read/hutool/85a7389837bd401f.md) | [CollectionUtils](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/util/collection/CollectionUtils.java) |
| ⭐ Map 工具 | [MapUtil](https://www.bookstack.cn/read/hutool/fa3d273651700cb0.md) | [MapUtils](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/util/collection/MapUtils.java) |
| Set 工具 |  | [SetUtils](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/util/collection/SetUtils.java) |
| List 工具 | [ListUtil](https://plus.hutool.cn/apidocs/cn/hutool/core/collection/ListUtil.html) |  |
| 文件工具 | [FileUtil](https://www.bookstack.cn/read/hutool/d116bcb301965bd7.md)<br>[FileTypeUtil](https://www.bookstack.cn/read/hutool/cc05a1607f263f94.md) | [FileUtils](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/util/io/FileUtils.java) |
| 压缩工具 | [ZipUtil](https://www.bookstack.cn/read/hutool/bfd2d43bcada297e.md) | [IoUtils](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/util/io/IoUtils.java) |
| IO 工具 | [ZipUtil](https://www.bookstack.cn/read/hutool/d648ca4612bf8941.md) |  |
| Resource 工具 | [ResourceUtil](https://plus.hutool.cn/apidocs/cn/hutool/core/io/resource/ResourceUtil.html) |  |
| JSON 工具 |  | [JsonUtils](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/util/json/JsonUtils.java) |
| 数字工具 | [NumberUtil](https://www.bookstack.cn/read/hutool/1ac79ebaf52a0372.md) | [NumberUtils](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/util/number/NumberUtils.java) |
| 对象工具 | [ObjectUtil](https://www.bookstack.cn/read/hutool/f63b669ba259e4f6.md) | [ObjectUtils](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/util/object/ObjectUtils.java) |
| 唯一 ID 工具 | [IdUtil](https://www.bookstack.cn/read/hutool/bfd2d43bcada297e.md) |  |
| ⭐ 字符串工具 | [StrUtil](https://www.bookstack.cn/read/hutool/093507f34fe0715d.md) | [StrUtils](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/util/string/StrUtils.java) |
| 时间工具 | [DateUtil](https://www.bookstack.cn/read/hutool/8168b022b2c31abe.md) | [DateUtils](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/util/date/DateUtils.java) |
| 反射工具 | [ReflectUtil](https://www.bookstack.cn/read/hutool/2ef7c87c2912181e.md) |  |
| 异常工具 | [ExceptionUtil](https://www.bookstack.cn/read/hutool/5ad2b6504b1cbdde.md) |  |
| 随机工具 | [RandomUtil](https://www.bookstack.cn/read/hutool/377f64112be7197a.md) | [RandomUtils](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-spring-boot-starter-test/src/main/java/cn/iocoder/yudao/framework/test/core/util/RandomUtils.java) |
| URL 工具 | [URLUtil](https://www.bookstack.cn/read/hutool/5122006c1ce039fe.md) | [HttpUtils](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/util/http/HttpUtils.java) |
| Servlet 工具 |  | [ServletUtils](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/util/servlet/ServletUtils.java) |
| Spring 工具 | [SpringUtil](https://plus.hutool.cn/apidocs/cn/hutool/extra/spring/SpringUtil.html) | [SpringExpressionUtils](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/util/spring/SpringExpressionUtils.java) |
| 分页工具 |  | [PageUtils](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/util/object/PageUtils.java) |
| 校验工具 | [ValidationUtil](https://plus.hutool.cn/apidocs/cn/hutool/extra/validation/ValidationUtil.html) | [ValidationUtils](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/util/validation/ValidationUtils.java) |
| 断言工具 | [Assert](https://www.bookstack.cn/read/hutool/cf382b4542d5861e.md) | [AssertUtils](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-spring-boot-starter-test/src/main/java/cn/iocoder/yudao/framework/test/core/util/AssertUtils.java) |

## 2. Lombok

[Lombok](https://github.com/projectlombok/lombok)是一个 Java 工具，通过使用其定义的注解，自动生成常见的冗余代码，提升开发效率。

在项目的根目录有 `lombok.config`全局配置文件，开启链式调用、生成的 toString/hashcode/equals 方法需要调用父方法。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/a1781b49-b007-4f4c-8afd-9656cef37d71.png)

## 3.  宏港业务通用工具

项目中自研的业务校验工具类，位于 validate 包下，以 Util 结尾，用于补充 Hutool 缺少的业务校验能力。

所有 isXxx 方法对 null 输入返回 false，validateXxx 方法不合法时抛出业务异常。

| 工具类 | 作用 | 说明 |
| --- | --- | --- |
| PhoneUtil | 电话号码校验 | 11位纯数字手机号 或 区号-固话格式（如 010-12345678） |
| ContainerUtil | 集装箱号校验 | 11位 ISO 6346 标准集装箱编号（含校验码验证） |
| TruckUtil | 车辆信息校验 | 行驶证编号（12位纯数字）及年检日期有效期 |

### 3.1 PhoneUtil

电话号码格式校验工具类。

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| isValidPhone(String phone) | boolean | 电话格式校验，合法返回 true。支持 11 位纯数字手机号（如 13812345678）和区号-固话格式（如 010-12345678、0755-1234567） |
| validatePhone(String phone) | void | 校验电话格式，不合法时抛出 PHONE_FORMAT_CHECK_FAIL 异常 |

### 3.2 ContainerUtil

集装箱号校验工具类（ISO 6346 标准）。

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| isContainerNo(String containerNo) | boolean | 判断集装箱号是否合法（11位，4位字母+6位数字+1位校验码） |
| validateContainerNo(String containerNo) | void | 校验集装箱号，不合法时抛出 CNTR_FORMAT_CHECK_FAIL 异常 |

### 3.3 TruckUtil

车辆相关信息校验工具类。

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| isValidDrivingLicenseNo(String drivingLicenseNo) | boolean | 判断行驶证编号是否为规范格式（12位纯数字） |
| isTruckleInspectionValid(LocalDateTime inspectionDate, LocalDateTime inspectionExpireDate) | boolean | 判断年检是否在有效期内，当前时间在年检日期与到期日期之间返回 true |
