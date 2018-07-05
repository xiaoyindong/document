## 1. 概述

```Cordova```是用```web```技术构建移动应用平台。可以认为```Cordova```是一个容器，用于将```web```应用一直到移动端，同时支持移动端的功能，比如摄像头，蓝牙，定位等。```cordova```是```phoneGap```贡献给```Apache```的开源项目。```https://cordova.apache.org```。如果```PhoneGap```是```Chrome```浏览器的话，那么```Cordova```就相当于```Webkit```。

```Cordova```的优势是学习成本低，开发速度快，对前端工程师友好，跨平台可以实现一套代码多端部署。```Cordova```开发```App```性能不如原生，而且跨浏览器兼容性差，存跨平台兼容性。

```Cordova```分为```Web App```、```webview```、```插件```三部分。

## 2. 环境搭建

1. Node.js

2. Git

3. Android（JDK，Android Studio, Gradle）

4. Xcode

```s
npm install ios-sim -g
npm install ios-deploy -g
```

环境变量配置

```s
JAVA_HOME，ANDROID_HOME，ANROID_SDK_ROOT
```

## 3. 初始化项目

```s
npm install -g cordova

cordova -v
```

创建项目

```js
cordova create HelloCordova io.cordova.hellocordova CordovaApp

// HelloCordova 目录名称
// io.cordova.hellocordova 唯一标识
// App的名称
```

添加平台，默认是没有平台的

```s
cd HelloCordova
# 浏览器
cordova platform add browser
# 安卓
cordova platform add android --save
# 查看
cordova platform ls
```

运行

```s
# 浏览器运行
cordova run browser
# 真机调试
cordova run android
# 模拟器启动
cordova emulate android
```

```cordova```就相当于一个```npm```的包，只是这个包允许调用一些原生的功能。

项目结构

```s
index.html
    meta
        Content-Security-Policy 内容安全策略，放置跨站脚本攻击的。
        format-detection 格式检测
        msapplication-tap-highlight windows上的触碰高亮
        viewport 视口
        color-scheme 多种主题模式

cordova.js 平台构建后才会出现的文件

config.xml 项目的主配置文件。
```
