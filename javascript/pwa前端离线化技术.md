
## 概述

```webapp```用户体验差，不能离线访问，用户粘性低，```pwa```就是为了解决这一系列问题，让```webapp```具有快速，可靠，安全等特点。但是兼容性较差。

## PWA用到的技术

- web app manifest

图标添加

- service worker

缓存机制

- push api & notification api

消息通知

- app shell & app skeleton

## Web App Manifest 设置

安卓支持比较好

```html
<link rel="manifest" href="/manifest.js">
```

```manifest.js```

```json
{
    "name": "应用名称",
    "short_name": "桌面应用名称",
    "display": "standalone", // fullScreen(standalone) minimal-ui browser
    "start_url": "打开时的网址",
    "icons": [], // 设置桌面图片的icon图标，修改图标需要重新添加到桌面，[{src, sizes, type}]，[{"src": "", "sizes": "144x144", type: "image/png"}] 默认144 * 144
    "background_color": "#aaa", // 启动画面颜色
    "theme_color": "#aaa" // 状态栏颜色
}
```

```ios```需要使用```meta```来设置

```html
// 图标
<link rel="apple-touch-icon" href="apple-touch-iphone.png">
// 添加到主屏后的标题和short_name一致
<link rel="apple-mobile-web-app-title" content="标题">
// 隐藏safari地址栏 standalone模式下默认隐藏
<link rel="apple-mobile-web-app-capable" content="yes">
// 设置状态栏颜色
<link rel="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

横幅安装: 用户在浏览器中访问至少两次，两次访问间隔至少时间为```5```分钟(```safari```不支持横幅)

## 运行环境

1、localhost

2、https

只支持以上两种环境

如果不安装```service Worker``` 则无法添加图标

## Service Worker

- 不能访问/操作dom

- 会自动休眠，不会随浏览器关闭所失效(必须手动卸载)

- 离线缓存内容开发者可控

- 必须在https或者localhost下使用

- 所有api都基于promise

生命周期:

installing安装阶段
installed安装完成阶段
activating激活中
activated激活完成
redundant废弃

```script```的代码。

```js
window.addEventListener('load', function() {
    // 解决离线缓存的问题 缓存 把缓存取出来
    if ('serviceWorker' in navigator) { // 判断当前浏览器是否支持serviceWo