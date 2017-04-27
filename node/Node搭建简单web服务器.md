## 1. web服务器搭建

```node```搭建简单服务器，使用到的模块

1. http 创建服务

2. fs 读写文件

3. url 接续请求路径+参数

```js
// 导入包文件
const http = require('http');
const fs = require('fs');
const url = require('url');

// 创建服务
const server = http.createServer((req, res) {
    // req 请求对象
    // res 响应对象
    
    // 解析请求参数
    const params = url.parse(req.url, true);

    fs.readFile(`www${req.url}`, (err, data) => { // 通过url路径，拿到www文件夹中对应的文件
        if (err) { // 如果文件不存在，返回404
            res.writeHeader(404); // 设置状态码
            res.write('404'); // 写入返回值，需为字符串
        } else {
          