---
outline: deep
---

# 站内信配置

本章节，介绍项目的站内信功能。它在管理后台有三个菜单，分别是：

**① 站内信模版：管理站内信的内容模版**

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/743aa675-f795-4f70-9aa5-91013ba2ba51.png)

**② 站内信管理：查看站内信的发送记录**

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/3fb359e5-c19b-4120-b911-da4e194c80ce.png)

**③ 我的站内信：查看发送给我的站内信**

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/5953a0d4-011d-4cb7-b847-390606d0665a.png)

## 1. 表结构

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/981e612e-fbba-4564-a57f-42e8e591d0b8.png)

## 2. 实现代码

- 前端代码：[views/system/notify(opens new window)](https://github.com/yudaocode/yudao-ui-admin-vue2/blob/master/src/views/system/notify/)

- 后端代码：[controller/admin/notify(opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-system/yudao-module-system-server/src/main/java/cn/iocoder/yudao/module/system/controller/admin/notify/)

## 3. 站内信配置

本小节，讲解如何配置站内信功能，整个过程如下：

1.  新建一个站内信【模版】，配置站内信的内容模版

2.  测试该站内信模板，查看对应的站内信【记录】，确认是否发送成功

### 3.1 新建站内信模版

① 点击 \[系统管理 -> 消息中心 -> 站内信管理 -> 模板管理\] 菜单，查看站内信模板的列表。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/85e3b0fc-1ee8-4c05-9ea4-003a340afc2e.png)

② 点击 \[新增\] 按钮，填写信息如下图：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/4b0dba01-9159-4957-a2d1-a63c29e0658d.png)

- 模版编号：站内信模板的唯一标识，使用站内信 API 时，通过它标识使用的站内信模板

- 发件人名称：发送站内信显示的发件人名字

- 模板内容：站内信模板的内容，使用 `{var}` 作为占位符，例如说 `{name}`、`{code}` 等

- 模版类型：站内信的分类，可使用 `system_notify_template_type` 字典进行自定义

- 开启状态：站内信模板被禁用时，该站内信模板将不发送站内信，只打印 logger 日志

### 3.2 测试站内信模版

① 点击 \[测试\] 按钮，选择接收人为「芋道源码」，进行该站内信模板的模拟发送。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/3f2210b7-12b2-46ea-bd07-14780405d2b1.png)

② 点击 \[系统管理 -> 消息中心 -> 站内信管理 -> 消息记录\] 菜单，可以查看到刚发送的站内信。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/21443c29-dbff-4eaf-aecd-690293bdc43a.png)

③ 点击右上角的 \[消息\] 图标，也可以查看到刚发送的站内信。如下图所示：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/e410306c-cc8e-492e-8ff5-534018a3f5e7.png)

## 4. 站内信发送

### 4.1 NotifyMessageSendApi

[站内信配置](https://cloud.iocoder.cn/#_3-%E7%AB%99%E5%86%85%E4%BF%A1%E9%85%8D%E7%BD%AE)完成后，可使用 [NotifyMessageSendApi (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-system/yudao-module-system-api/src/main/java/cn/iocoder/yudao/module/system/api/notify/NotifyMessageSendApi.java)进行站内信的发送，支持多种用户类型。它的方法如下：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/035f2af8-c7c6-4346-a1e9-b4404ee79e56.png)

### 4.2 接入示例

以 `yudao-module-bpm` 模块，需要发站内信为例子，讲解 NotifyMessageSendApi 的使用。

① 在 `yudao-module-bpm-server` 模块的 [`pom.xml` (opens new window)](https://github.com/YunaiV/yudao-cloud/blob/master/yudao-module-bpm/yudao-module-bpm-server/pom.xml)引入 `yudao-module-system-api` 依赖，如所示：

```xml
<dependency>
    <groupId>cn.iocoder.cloud</groupId>
    <artifactId>yudao-module-system-api</artifactId>
    <version>${revision}</version>
</dependency>

```

② 在代码中注入 NotifyMessageSendApi Bean，并调用发送站内信的方法。代码如下：

```java
public class TestDemoServiceImpl implements TestDemoService {

    // 0. 注入 NotifyMessageSendApi Bean
    @Resource
    private NotifyMessageSendApi notifySendApi;

    public void sendDemo() {
        // 1. 准备参数
        Long userId = 1L; // 示例中写死，你可以改成你业务中的 userId 噢
        String templateCode = "test_01"; // 站内信模版，记得在【站内信管理】中配置噢
        Map<String, Object> templateParams = new HashMap<>();
        templateParams.put("key1", "奥特曼");
        templateParams.put("key2", "变身");

        // 2. 发送站内信
        notifySendApi.sendSingleNotifylToAdmin(new NotifySendSingleToUserReqDTO()
                .setUserId(userId).setTemplateCode(templateCode).setTemplateParams(templateParams));
    }

}

```
