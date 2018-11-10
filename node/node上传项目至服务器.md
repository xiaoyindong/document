## 1. 应用

在常规的前端项目中，部署项目需要经过本地```build```，压缩文件，将压缩包上传至服务器并解压文件等步骤，过程较为繁琐。本文编写一个```nodejs```脚本，用来告别手动上传的过程，配置使用简单，实现前端一键自动化部署。

## 2. 依赖工具

```archiver```用于压缩文件

```node-ssh```通过```ssh```链接服务器

## 3. 安装

1. 安装archiver node-ssh 依赖

```js
npm install archiver node-ssh --save-dev
```

## 4 编写脚本

在项目跟目录新建```deploy.js```

```js
const path = require('path');
const archiver =require('archiver');
const fs = require('fs');
const node_ssh = require('node-ssh');
const ssh = new node_ssh();

// 上传服务器代码
const upload = () => {
    // 链接远程服务器
    ssh.connect({
       host: '192.xxx.x.xxx',
       username: 'root',
       password: 'xxxx',
       port:22
   }).then(function () {
       // 上传网站的发布包至服务器中的位置，(__dirname + '/dist.zip' 为本地文件位置， '/home/dist.zip'：服务器中的位置)
       ssh.putFile(__dirname + '/dist.zip', '/home/dist.zip').then(status => {
               console.log('上传文件成功');
               console.log('开始执行远端脚本');
               // 上传成功后触发远端脚本，此处执行服务器脚本，代码参考步骤4
         }).catch(err=>{
            console.log('文件传输异常:',err);
            process.exit(0);
         });
   }).catch(err=