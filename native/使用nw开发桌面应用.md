## 1. 概述

```nwjs```是基于```Chromium```和```Node.js```运行的, 我们可以通过```html```+```css```来编写```UI```页面，使用js来实现功能。可以直接调用```Node.js```的各种```api```以及现有的第三方包。

由于```Chromium```和```Node.js```的跨平台，那么你的应用也是可以跨平台的。

现在已经有很多知名的应用是基于NW.js实现，这是官方统计的一些列表:```https://github.com/nwjs/nw.js/wiki/List-of-apps-and-companies-using-nw.js```。

前端领域比较熟悉的微信开发者工具就是基于```nwjs```开发的。

NW文档中心: ```https://nwjs.org.cn/```

## 2. 开始使用

你可以从互联网直接下载```nw```的各个版本```https://nwjs.org.cn/download.html```也可以使用```npm```安装。

将下载好的压缩包解压，你可以将解压后的文件夹修改一个名字，也可以新建一个文件夹将解压后的文件```copy```进去。其实主要有用的文件就是```nw```执行程序，只要这个就可以了。

然后在```nw```执行程序的同级目录新建一个```package.json```文件。在里面设置应用的名称和启动执行的```html```页面。然后我们在文件夹中新建一个```index.html```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7846cacda68647f7b9e8898978ab2aa3~tplv-k3u1fbpfcp-watermark.image)

```package.json```中写上应用名称和启动页面。

```json
{
  "name": "我的应用", // 名称
  "main": "index.html", // 启动页面
}
```

在```html```文件中随便写点什么。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的应用</title>
</head>
<body>
    我的应用程序
</body>
</html>
```

双击```nwjs```执行这个程序，页面长成这么个样子。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8dd384d5256d46bf8deefd07e62741ad~tplv-k3u1fbpfcp-watermark.image)

## 3. 应用配置

接着我们介绍一下```package.json```中都能配置哪些参数

```json
{
  "name": "应用的名称", // 应用的名称
  "main": "./index.html", // 指定应用的主页面
  "build": "1445048139741", // 这是为了给更新时判断版本用的时间戳
  "version": "0.0.1",// 当前的版本号
  "homepage": "一般是官网地址之类的",
  "description": "应用的描述", // 描述
  "window": {
    "title": "应用打开时候显示的名称", // 如果 index.html没有title,则会显示这里的值
    "icon": "assest/img/logo.png", // icon
    "position": "center", // 打开应用时在浏览器屏幕中的位置
    "width": 1280, // 应用的宽度
    "height": 680, // 应用的高度
    "toolbar": true, // 是否隐藏窗口的浏览器工具栏，nw老版本还有用，新版本已经无效了
    "frame": true, // 是否显示最外层的框架，设为false之后 窗口的最小化、最大化、关闭 就没有了
    "resizable": true, // 可以通过拖拽变换应用界面大小
    "min_width": 1028 // 最小宽度
  },
  "node-main": "./node-main.js",// 启动时执行的js，检查更新之类的。
}
```

其实这里的```package.jso```n就是我们日常开发项目中的项目管理文件，我们可以通过```npm```或者```yarn```的方式安装第三方的依赖包，然后通过```require```的方式导入进来，这里也是可以使用的。

比如我们通过```npm```安装一个```marked```模块。

```js
npm install marked --save-dev
```

```json
{
  "na