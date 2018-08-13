## 1. 概述

```websocket```具有三个优点，双向通信，自动跨域，性能高。可以通过安装```socket.io```来使用```socket```。

```s
npm install socket.io;
```

在```node```中```socket```不是独立使用的，需要依赖于```http```模块服务。浏览器首先请求```http```服务交换```key```，因为```websocket```默认就是加密的，拿到```key```之后```http```服务器将链接过继给```ws```服务器，后面变成了浏览器和```ws```服务器通信。

```js
const http = require('http');
const io = require('socket.io');

// 创建http服务，开启8080端口号
const httpServer = http.createServer().listen(8080);
// socket监听http服务
const wsServer = io.listen(httpServer);

// 当有链接的时候
wsServer.on('connection', sock => {
    // 发送
    // sock.emit
    sock.emit('time', Date.now());
    // 接收
    sock.on('aaa', (a, b, c) => {
        console.loh(a, b, c);
    })
})

```

```sock```下面只有两个东西```emit```用于消息广播用于```on```接收消息。

首先在浏览器端需要引入```socket.io.js```文件这个文件在安装```socket.io```模块时会自动提供```http://127.0.0.1:8080/socket.io/socket.io.js```。

```js
const sock = io.connect('ws://127.0.0.1:8080/');
sock.on('connect', () => {
    console.log('已链接');
    sock.emit('aaa', 12, 5,8);
    sock.on('time', (ts) => {
        console.loh(ts);
    })
});
sock.on('disconnect', () => {
    console.log('已断开');
});
```

服务器断开时会调用```sock```的```disconnect```方法，服务器启动时会自动进行链接调用```connect```方法。

- 服务端

```js
sock.on('connection', void);
sock.on('disconnect', void);
```

- 客户端

```js
sock.on('connect');
sock.on('disconnect');
```

## 2. 原理解析

```websocket```是```HTML5```新增的```API```，属于浏览器或者前端的内容。后端用的是```socket```，```socket```协议的历史相当古老基本四十年前就已经存在了。在```H5```中```websocket```自带一些安全的措施，而原生的```socket```就没什么安全性可言了。

在```node```中想要实现```socket```可以借助```node```原生的```net```模块，这是一个相对底层的网络模块，是一个```tcp```的库。```net```是```http```的底层，很多东西都需要自己去实现，比如这里可以使用```net.createServer```来创建服务。


```js
const http = require('http');
const net = require('net'); // TCP的库，可以理解为原生的Socket
const crypto = require('crypto'); // 借助加密库实现一些安全性

/* const httpServer = http.createServer((req, res) => {
    console.log('链接');
}).listen(8080); */
// http无法完成socket链接，所以采用原生的net套接字，自己写一个。
const server = net.createServer(sock=> {
    console.log('链接上了');
    sock.on('end', () => {
        console.log('客户端断开了')
    }); // 断开
    sock.once('data', (data) => {
        console.log('hand shake start...');
        // 最先过来的是http头
        console.log(data.toString());
        // 头虽然是2进制，但是都是可见数据，所以可以放心toString();
        const str = data.toString();
        // 将http头用\r\n切开
        let lines = str.split('\r\n');
        // 删除第一行和最后一行，没啥用
        lines = lines.slice(1, lines.length - 2);
        // 将所有请求头通过'分号空格'切开
      