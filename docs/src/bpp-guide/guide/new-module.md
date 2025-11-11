---
outline: deep
---

# 新建页面


## 一. 新建目录、markdown文件

在`docs/src/bpp-guide`路径下新建目录、新建及编写markdown文件。例：新建markdown文件的路径为`docs/src/bpp-guide/guide/new-module.md`

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/screenshot_2025-11-11_08-58-32.png)


## 二. 配置路由

### 1. 注册导航栏

在文件`docs/.vitepress/config/zh.mts`，注册导航路由

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/screenshot_2025-11-11_14-50-24.png)

在`nav()`中配置点击导航栏时的默认页及导航栏名称

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/screenshot_2025-11-11_10-44-02.png)

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/screenshot_2025-11-11_11-34-19.png)

### 2. 配置页面路由
实现`sidebarBggGuide()`，配置文件页面路由，按照文件在模块的目录下路径名注册

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/screenshot_2025-11-11_10-27-10.png)


## 三、路由说明

以下是`docs/src`目录下文件与路由的对应关系

### 1. 导航栏

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/screenshot_2025-11-11_11-42-28.png)

![iamge](http://rsim.portsgmt.com:9001/bgbpp-vben/screenshot_2025-11-11_11-43-58.png)

### 2. 侧边栏

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/screenshot_2025-11-11_11-45-32.png)

在`docs/.vitepress/config/zh.mts`中配置路由
![image](http://rsim.portsgmt.com:9001/bgbpp-vben/screenshot_2025-11-11_14-37-27.png)

对应模块侧边栏
![image](http://rsim.portsgmt.com:9001/bgbpp-vben/screenshot_2025-11-11_14-38-45.png)

## 四. 存放照片

编写markdown文档中若涉及到图片的引用，图片存放在路径`docs/.image`下

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/screenshot_2025-11-11_10-02-51.png)

markdown文件中引用照片，如`![image](图片网址)`


## 五. 设置页面导航

若要开启页面导航功能，在markdown文件中首行添加如下代码

```markdown
  ---
  outline: deep
  ---
```

如图：

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/screenshot_2025-11-11_11-54-47.png)

![image](http://rsim.portsgmt.com:9001/bgbpp-vben/screenshot_2025-11-11_11-51-58.png)








