## 1. 概述

```Electron```核心组成分为三个部分，```Chromium```，```Node.js```，```Native apis```。这三部分共同构成了```Electron```架构。

```Chromium```可以理解为浏览器，用于支持``html``，```css```，```js```页面构成。```Native apis```用于支持和操作系统的一些交互操作。```Node.js```用于操作文件等。

```Electron```可以看成一个框架，将```chromium```及```Node.js```整合到一起，它允许通过```web```技术构建程序，可以通过```Native apis```对操作系统进行一切操作。

桌面应用就是运行在不同操作系统中的软件，软件中的功能实现都是通过```Native Api```与操作系统的通信。操作系统对于前段来说基本相当于黑盒，想实现功能的时候只需要调用```API```就可以了，无需关注内部实现。

```Electron```内部存在不同的进程，一个是主进程，一个是渲染进程，当启动```app```的时候首先会启动主进程，主进程完成之后就会创建```Native UI```, 会创建一个或者多个 ``window``，用```window```来呈现界面也就是```web```界面。每个```window```都可以看做一个渲染进程，各进程间相互独立，不同窗口数据可以通过```rpc```或者```ipc```通信，通信方法是封装好的，开发者直接使用就可以了。

```app```启动后主进程创建```window```窗口，然后```win```窗口会去加载界面也就是渲染进程，如果页面存在交互，需要将渲染进程中接收到的指令信息通过```IPC```通信给主进程，主进程收到信息之后通过调用操作系统实现功能，完成之后再通知给渲染进程。

主进程可以看做是```package.json```中```main```属性对应的文件。一个应用只能有一个主进程，只要主进程可以进行```GUI```的```API```操作。主进程可以管理所有的```web```界面和渲染进程。

渲染进程就是```windows```中展示的界面进程，一个应用可以有多个渲染进程，渲染进程不能直接访问原生```API```可以通过主进程访问。

## 2. 环境搭建

[官网](https://www.electronjs.org)

```s
# 克隆示例项目的仓库
$ git clone https://github.com/electron/electron-quick-start

# 进入这个仓库
$ cd electron-quick-start

# 安装依赖并运行
$ npm install && npm start
```

```main.js```是主进程。

```js
const { app, BrowserWindow } = require('electron')
const path = require('path')

// 创建窗口 并且加载页面 界面是运行在渲染进程的
function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    // 加载页面
    mainWindow.loadFile('index.html')

    mainWindow.on('close', () => {
        console.log('当前窗口关闭')
    })
}

// 生命周期
app.whenReady().then(() => {
    // 加载界面
    createWindow();

    app.on('activate', () => {
        console.log('激活的时候')
    })
})

app.on('window-all-closed', () => {
    console.log('所有窗口都关闭');
    // 关闭应用
    app.quit(); 
})
```

## 3. 生命周期

### 1. ready: app初始化完成

```js
app.on('ready', () => {
    const mainWin = new BrowserWindow({
        width: 800,
        height: 400
    })
})
```

### 2. dom-ready: 一个窗口中的文本文件加载完成

```webContents```用于控制当前窗口的内容，每个窗口都有一个```webContents```。

```js
mainWin.webContents.on('dom-ready', () => {
    
})
```

### 3. did-finsh-load: 导航完成时触发，dom-ready之后

```js
mainWin.webContents.on('did-finsh-load', () => {
    
})
```

### 4. window-all-closed: 所有窗口都关闭时触发，如果没有监听会直接退出

```