## 1. 概述

我们都知道，```JavaScript```是一门单线程语言，单个```Node.js```实例运行在单个线程中，为了充分利用多核系统，有时需要启用一组```Node.js```进程去处理负载任务。```cluster```模块可以创建共享服务器端口的子进程。

一般多线程工作存在一个主进程和多个子进程，主进程负责派生(创建)子进程，主进程越简单越好，防止崩溃。子进程负责处理逻辑，也就是干活。

多进程对服务器来说，安全，性能高(更充分利用```CPU```)

1. 普通程序不能创建进程，只有系统进程才能创建进程

2. 进程是分裂出来的，只有主进程可以分裂。

3. 分裂出来的两个进程，执行的是同一套代码

4. 父子进程之间可以共享句柄, 端口就是一种句柄

```js
const cluster = require('cluster');
// 分叉，
if (cluster.isMaster) { // 如果是主进程就分裂
    cluster.fork();
};
```

有几个```cpu```就开几个进程，不是越多越好

```js
const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isMaster) {
    for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork();
    }
    console.log('我是主进程');
    cluster.on('exit', (worker, code, signal) => {
        console.log(`工作进程 ${worker.process.pid} 已退出`);
    });
} else {
    console.log('我是子进程')
}

```

主进程 = 守护进程

子进程 = 工作进程

一般子进程是用来干活的，主进程做管理。

```js
const cluster = require('cluster');
const os = require('os');
const process = require('process');

if (cluster.isMaster) {
    for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork();
    }
    console.log('我是主进程');
} else {
    console.log(process.pid);
    http.createServer((req, res) => {
        res.write('aaaa');
        res.end();
    }).listen(8080);
    console.log('端口号8080');
}

```

1. 上面的程序并不会报错，因为子进程可以共享端口号。

2. process.pid: 进程的pid，作为进程的唯一区分。

4. 进程调度，多个进程，只有第一个进程工作被塞满了才会启用第二个进程，第二个也满了，再启用第三个，

进程的开销和调度非常的耗费性能，计算机的运算是很快的，当肉眼可见时就已经表示很慢了。

多进程不会造成死锁，死锁的意思是对文件的读写进行时，其它程序对文件的访问会限制。

工作进程由```child_process.fork()```方法创建，因此它们可以使用```IPC```和父进程通信，从而使各进程交替处理连接服务。

```cluster```模块支持两种分发连接的方法。

第一种方法（也是除```Windows```外所有平台的默认方法）是循环法，由主进程负责监听端口，接收新连接后再将连接循环分发给工作进程，在分发中使用