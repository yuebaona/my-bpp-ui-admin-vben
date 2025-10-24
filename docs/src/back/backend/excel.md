---
outline: deep
---

# Excel导入导出

项目的 [`yudao-spring-boot-starter-excel` (opens new window)](https://github.com/YunaiV/ruoyi-vue-pro/tree/master/yudao-framework/yudao-spring-boot-starter-excel)技术组件，基于 FastExcel 实现 Excel 的读写操作，可用于实现最常见的 Excel 导入导出等功能。

::: info FastExcel 的介绍？

FastExcel 是原 EasyExcel 作者开源的 Excel 工具库，具有简单易用、低内存、高性能的特点。

在尽可用节约内存的情况下，支持百万行的 Excel 读写操作。例如说，仅使用 64M 内存，20 秒完成 75M（46 万行 25 列）Excel 的读取。并且，还有极速模式能更快，但是内存占用会在100M 多一点。

:::

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/a89ab1d2-ddac-40a8-9322-84a396cbd48d.png)

## 1. Excel 导出

以 \[系统管理 -> 岗位管理\] 菜单为例子，讲解它 Excel 导出的实现。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/8627b8e2-22ad-4074-9787-2178678a176b.png)

### 1.1 后端导入实现

在 [PostController (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-system/yudao-module-system-server/src/main/java/cn/iocoder/yudao/module/system/controller/admin/dept/PostController.java#L88-L97)类中，定义 `/admin-api/system/post/export` 导出接口。代码如下：

```java
    @GetMapping("/export")
    @Operation(summary = "岗位管理")
    @PreAuthorize("@ss.hasPermission('system:post:export')")
    @ApiAccessLog(operateType = EXPORT)
    public void export(HttpServletResponse response, @Validated PostPageReqVO reqVO) throws IOException {
         // ① 查询数据
        reqVO.setPageSize(PageParam.PAGE_SIZE_NONE);
        List<PostDO> list = postService.getPostPage(reqVO).getList();
        // ② 导出 Excel
        ExcelUtils.write(response, "岗位数据.xls", "岗位列表", PostRespVO.class,
                BeanUtils.toBean(list, PostRespVO.class));
    }

```

- ① 将从数据库中查询出来的列表，一般可以复用分页接口，需要设置 `.setPageSize(PageParam.PAGE_SIZE_NONE)` 不过滤分页。

- ② 将 PostDO 列表，转换成 PostRespVO 列表，之后通过 ExcelUtils 转换成 Excel 文件，返回给前端。

#### 1.1.1 PostExcelVO 类

复用 [PostRespVO (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-system/yudao-module-system-server/src/main/java/cn/iocoder/yudao/module/system/controller/admin/dept/vo/post/PostRespVO.java)类，实现 岗位 Excel 导出的 VO 类。代码如下：

```java
@Schema(description = "管理后台 - 岗位信息 Response VO")
@Data
@ExcelIgnoreUnannotated // ③
public class PostRespVO {

    @Schema(description = "岗位序号", requiredMode = Schema.RequiredMode.REQUIRED, example = "1024")
    @ExcelProperty("岗位序号") // ①
    private Long id;

    @Schema(description = "岗位名称", requiredMode = Schema.RequiredMode.REQUIRED, example = "小土豆")
    @ExcelProperty("岗位名称")
    private String name;

    @Schema(description = "岗位编码", requiredMode = Schema.RequiredMode.REQUIRED, example = "yudao")
    @ExcelProperty("岗位编码")
    private String code;

    @Schema(description = "显示顺序不能为空", requiredMode = Schema.RequiredMode.REQUIRED, example = "1024")
    @ExcelProperty("岗位排序")
    private Integer sort;

    @Schema(description = "状态，参见 CommonStatusEnum 枚举类", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    // ②
    @ExcelProperty(value = "状态", converter = DictConvert.class)
    @DictFormat(DictTypeConstants.COMMON_STATUS)
    private Integer status;

    @Schema(description = "备注", example = "快乐的备注")
    private String remark;

    @Schema(description = "创建时间", requiredMode = Schema.RequiredMode.REQUIRED)
    private LocalDateTime createTime;

}

```

- ① 每个字段上，添加 [`@ExcelProperty` (opens new window)](https://github.com/alibaba/easyexcel/blob/master/easyexcel-core/src/main/java/com/alibaba/excel/annotation/ExcelProperty.java)注解，声明 Excel Head 头部的名字。每个字段的**值**，就是它对应的 Excel Row 行的数据值。

- ② 如果字段的的注解 `converter` 属性是 DictConvert 转换器，用于字典的转换。例如说，通过 `status` 字段，将 `status = 1` 转换成“开启”列，`status = 0` 转换成”禁用”列。稍后，我们会在 [「3. 字段转换器」](https://cloud.iocoder.cn/excel-import-and-export/#_3-%E5%AD%97%E6%AE%B5%E8%BD%AC%E6%8D%A2%E5%99%A8) 小节来详细讲讲。

- ③ 在类上，添加 [`@ExcelIgnoreUnannotated` (opens new window)](https://github.com/alibaba/easyexcel/blob/master/easyexcel-core/src/main/java/com/alibaba/excel/annotation/ExcelIgnoreUnannotated.java)注解，表示未添加 `@ExcelProperty` 的字段，不进行导出。

因此，最终 Excel 导出的效果如下：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/80ef0cce-087b-406b-bec8-ee872de4b8ac.png)

#### 1.1.2 ExcelUtils 写入

ExcelUtils 的 [`#write(...)` (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-spring-boot-starter-excel/src/main/java/cn/iocoder/yudao/framework/excel/core/util/ExcelUtils.java#L19-L40)方法，将列表以 Excel 响应给前端。代码如下图：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/804fa725-69c2-4c4d-940f-c8baf5fdcaab.png)

### 1.2 前端导入实现

在 [`post/index.vue` (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vue2/blob/master/src/views/system/post/index.vue#L232-L243)界面，定义 `#handleExport()` 操作，代码如下图：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/3283ded1-28d6-4f93-9be5-33de65886528.png)

## 2. Excel 导入

以 \[系统管理 -> 用户管理\] 菜单为例子，讲解它 Excel 导出的实现。

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/635b78e5-c3e3-476b-955c-a5d91fd9b720.png)

### 2.1 后端导入实现

在 [UserController (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-system/yudao-module-system-server/src/main/java/cn/iocoder/yudao/module/system/controller/admin/user/UserController.java#L176-L187)类中，定义 `/admin-api/system/user/import` 导入接口。代码如下：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/90ab85b7-df3f-4dd5-9e2c-dd1391233cac.png)

将前端上传的 Excel 文件，读取成 UserImportExcelVO 列表。

#### 2.1.1 UserImportExcelVO 类

创建 [UserImportExcelVO (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-system/yudao-module-system-server/src/main/java/cn/iocoder/yudao/module/system/controller/admin/user/vo/user/UserImportExcelVO.java)类，用户 Excel 导入的 VO 类。它的作用和 Excel 导入是一样的，代码如下：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/98aba6b7-b498-4240-8d8c-1587062a8cac.png)

对应使用的 Excel 导入文件如下：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/9055ab3a-0531-495d-b467-fa5e6169991f.png)

#### 2.1.2 ExcelUtils 读取

ExcelUtils 的 [`#read(...)` (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-spring-boot-starter-excel/src/main/java/cn/iocoder/yudao/framework/excel/core/util/ExcelUtils.java#L42-L46)方法，读取 Excel 文件成列表。代码如下图：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/fb8c36d5-dbd4-456b-bc65-26cff6e6c799.png)

### 2.2 前端导入实现

在 [`user/index.vue` (opens new window)](https://github.com/yudaocode/yudao-ui-admin-vue2/blob/master/src/views/system/user/index.vue#L174-L193)界面，定义 Excel 导入的功能，代码如下图：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/9dd0bdf5-4756-4d46-a65b-8464a49ec220.png)

## 3. 字段转换器

EasyExcel 定义了 [Converter (opens new window)](https://github.com/alibaba/easyexcel/blob/master/easyexcel-core/src/main/java/com/alibaba/excel/converters/Converter.java)接口，用于实现字段的转换。它有两个核心方法：

① `#convertToJavaData(...)` 方法：将 Excel Row 对应表格的值，转换成 Java 内存中的值。例如说，Excel 的“状态”列，将“状态”列转换成 `status = 1`，”禁用”列转换成 `status = 0`。

② `#convertToExcelData(...)` 方法：恰好相反，将 Java 内存中的值，转换成 Excel Row 对应表格的值。例如说，Excel 的“状态”列，将 `status = 1` 转换成“开启”列，`status = 0` 转换成”禁用”列。

### 3.1 DictConvert 实现

以项目中提供的 [DictConvert (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-spring-boot-starter-excel/src/main/java/cn/iocoder/yudao/framework/excel/core/convert/DictConvert.java)举例子，它实现 Converter 接口，提供字典数据的转换。代码如下：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/b03b1a01-f662-4635-86d6-bbcd79685d66.png)

实现的代码比较简单，自己看看就可以明白。

### 3.1 DictConvert 使用示例

在需要转换的字段上，声明注解 `@ExcelProperty` 的 `converter` 属性是 DictConvert 转换器，注解 [`@DictFormat` (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-framework/yudao-spring-boot-starter-excel/src/main/java/cn/iocoder/yudao/framework/excel/core/annotations/DictFormat.java)为对应的字典数据的类型。示例如下：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/8b6b4824-6a29-4f23-a8ea-eb7c6940abac.png)

## 4. 更多 EasyExcel 注解

### 4.1 `**@ExcelProperty**`

这是最常用的一个注解，注解中有三个参数 `value`、`index`、`converter` 分别代表列明、列序号、数据转换方式。`value` 和 `index` 只能二选一，通常不用设置 `converter`。

**最佳实践**

```java
public class ImeiEncrypt {

    @ExcelProperty(value = "imei")
    private String imei;
}

```

### 4.2 `**@ColumnWidth**`

用于设置列宽度的注解，注解中只有一个参数 `value`。`value` 的单位是字符长度，最大可以设置 255 个字符，因为一个 Excel 单元格最大可以写入的字符个数，就是 255 个字符。

**最佳实践**

```java
public class ImeiEncrypt {

    @ColumnWidth(value = 18)
    private String imei;
}

```

### 4.3 `**@ContentFontStyle**`

用于设置单元格内容字体格式的注解。参数如下：

| 参数                 | 含义               |
| -------------------- | ------------------ |
| `fontName`           | 字体名称           |
| `fontHeightInPoints` | 字体高度           |
| `italic`             | 是否斜体           |
| `strikeout`          | 是否设置删除水平线 |
| `color`              | 字体颜色           |
| `typeOffset`         | 偏移量             |
| `underline`          | 下划线             |
| `bold`               | 是否加粗           |
| `charset`            | 编码格式           |

### 4.4 `**@ContentLoopMerge**`

用于设置合并单元格的注解。参数如下：

| 参数           | 含义 |
| -------------- | ---- |
| `eachRow`      |      |
| `columnExtend` |      |

### 4.5 `**@ContentRowHeight**`

用于设置行高。参数如下：

| 参数  | 含义                   |
| ----- | ---------------------- |
| value | 行高，`-1`代表自动行高 |

### 4.6 `**@ContentStyle**`

设置内容格式注解。参数如下：

| 参数 | 含义 |
| --- | --- |
| `dataFormat` | 日期格式 |
| `hidden` | 设置单元格使用此样式隐藏 |
| `locked` | 设置单元格使用此样式锁定 |
| `quotePrefix` | 在单元格前面增加\`符号，数字或公式将以字符串形式展示 |
| `horizontalAlignment` | 设置是否水平居中 |
| `wrapped` | 设置文本是否应换行。将此标志设置为`true`通过在多行上显示使单元格中的所有内容可见 |
| `verticalAlignment` | 设置是否垂直居中 |
| `rotation` | 设置单元格中文本旋转角度。03版本的Excel旋转角度区间为-90°~90°，07版本的Excel旋转角度区间为0°~180° |
| `indent` | 设置单元格中缩进文本的空格数 |
| `borderLeft` | 设置左边框的样式 |
| `borderRight` | 设置右边框样式 |
| `borderTop` | 设置上边框样式 |
| `borderBottom` | 设置下边框样式 |
| `leftBorderColor` | 设置左边框颜色 |
| `rightBorderColor` | 设置右边框颜色 |
| `topBorderColor` | 设置上边框颜色 |
| `bottomBorderColor` | 设置下边框颜色 |
| `fillPatternType` | 设置填充类型 |
| `fillBackgroundColor` | 设置背景色 |
| `fillForegroundColor` | 设置前景色 |
| `shrinkToFit` | 设置自动单元格自动大小 |

### 4.7 `**@HeadFontStyle**`

用于定制标题字体格式。参数如下：

| 参数                 | 含义             |
| -------------------- | ---------------- |
| `fontName`           | 设置字体名称     |
| `fontHeightInPoints` | 设置字体高度     |
| `italic`             | 设置字体是否斜体 |
| `strikeout`          | 是否设置删除线   |
| `color`              | 设置字体颜色     |
| `typeOffset`         | 设置偏移量       |
| `underline`          | 设置下划线       |
| `charset`            | 设置字体编码     |
| `bold`               | 设置字体是否家畜 |

### 4.8 `**@HeadRowHeight**`

设置标题行行高。参数如下：

| 参数    | 含义                     |
| ------- | ------------------------ |
| `value` | 设置行高，-1代表自动行高 |

### 4.9 `**@HeadStyle**`

设置标题样式。参数如下：

| 参数 | 含义 |
| --- | --- |
| `dataFormat` | 日期格式 |
| `hidden` | 设置单元格使用此样式隐藏 |
| `locked` | 设置单元格使用此样式锁定 |
| `quotePrefix` | 在单元格前面增加\`符号，数字或公式将以字符串形式展示 |
| `horizontalAlignment` | 设置是否水平居中 |
| `wrapped` | 设置文本是否应换行。将此标志设置为`true`通过在多行上显示使单元格中的所有内容可见 |
| `verticalAlignment` | 设置是否垂直居中 |
| `rotation` | 设置单元格中文本旋转角度。03版本的Excel旋转角度区间为-90°~90°，07版本的Excel旋转角度区间为0°~180° |
| `indent` | 设置单元格中缩进文本的空格数 |
| `borderLeft` | 设置左边框的样式 |
| `borderRight` | 设置右边框样式 |
| `borderTop` | 设置上边框样式 |
| `borderBottom` | 设置下边框样式 |
| `leftBorderColor` | 设置左边框颜色 |
| `rightBorderColor` | 设置右边框颜色 |
| `topBorderColor` | 设置上边框颜色 |
| `bottomBorderColor` | 设置下边框颜色 |
| `fillPatternType` | 设置填充类型 |
| `fillBackgroundColor` | 设置背景色 |
| `fillForegroundColor` | 设置前景色 |
| `shrinkToFit` | 设置自动单元格自动大小 |

#### 4.10 `**@ExcelIgnore**`

不将该字段转换成 Excel。

### 4.11 `**@ExcelIgnoreUnannotated**`

没有注解的字段都不转换
