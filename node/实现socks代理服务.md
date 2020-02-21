## 1. 前言

公司的前端网站有点多，而且每次访问都需要登录，即使做了记住密码功能也会定期要求登录，特别的不方便。主要我觉得这一点都不够互联网。我想实现开发一个桌面软件，只要这个软件登录了访问其他的网站就都不需要再登录了，岂不是爽歪歪。

原理其实还是比较简单的，本地搭建一个代理服务器，将所有的请求发送到这个代理服务器，再由代理服务器转发到对应的服务器，类似于抓包工具。但是抓包工具一般代理的是http和https。又去看了看VPN，是socks代理，似乎更好一些。

在github上找到了这个[你也能写个 Shadowsocks](https://github.com/gwuhaolin/blog/issues/12)，作者太良心了，写的非常详细。

## 2. 动手

这里选择nodejs来做，[你也能写个 Shadowsocks](https://github.com/gwuhaolin/blog/issues/12)作者也提供了node版本。

socks5 是 tcp/ip 层面的网络代理协议，这里要使用net模块来搭建服务。因为http模块封装了很多的细节，所以net模块只能自己来封装。

首先客户端会向服务端发送连接，客户端发送的数据包包含三个字段。ver，nmethods，methods。
ver代表 socks 的版本，默认为0x05，其固定长度为1个字节，nmethods表示第三个字段method的长度，也是1个字节，method表示客户端支持的验证方式，可以有多种，长度是1-255个字节。

- 0x00：NO AUTHENTICATION REQUIRED（不需要验证）

- 0x01：GSSAPI

- 0x02：USERNAME/PASSWORD（用户名密码）

- 0x03: to X'7F' IANA ASSIGNED

- 0x80: to X'FE' RESERVED FOR PRIVATE METHODS

- 0xFF: NO ACCEPTABLE METHODS（都不支持，没法连接了）

```js
const net = require('net');

const config = {
    port: 1081,
}

const server = net.createServer((sock) => {
    sock.on('error', (err) => {
        console.log(`远程到代理服务器的连接发生错误，错误信息：${err.message}`);
        sock.destroy();
    });
    console.log(`接受连接：${sock.remoteAddress}:${sock.remotePort}`);

    sock.once('readable', () => {
        const data = sock.read();
        console.log(data); // {"type":"Buffer","data":[5,1,0]}
    });
});

server.listen(config.port, () => {
    server.on('error', function (err) {
        console.log(`代理服务器发生错误，错误信息：${err.message}`);
        server.close();
    });
    console.log(`代理服务器启动，监听0.0.0.0:${config.port}...`);
})
```

我这里用的mac电脑，可以在系统偏好设置 -> 网络 -> 高级 -> 代理 中选中socks代理，代理服务器填写127.0.0.1:1081，这里用的1081端口号，如果冲突可以自行修改。windows电脑可以自己百度一下如何代理。

上面代码中打印了{"type":"Buffer","data":[5,1,0]}，5，1，0分别是ver，nmethods，methods，虽然展示为5，1，0其实他们都是16进制，实际为0x05，0x01，0x00。

| -	| VERSION | METHODS_COUNT | METHODS |
| -- | -- | -- | -- |
| data | 0x05 | 0x01 | 0x00 |
|