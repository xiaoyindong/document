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

第一种方法（也是除```Windows```外所有平台的默认方法）是循环法，由主进程负责监听端口，接收新连接后再将连接循环分发给工作进程，在分发中使用了一些内置技巧防止工作进程任务过载。

第二种方法是，主进程创建监听```socket```后发送给感兴趣的工作进程，由工作进程负责直接接收连接。

理论上第二种方法应该是效率最佳的。 但在实际情况下，由于操作系统调度机制的难以捉摸，会使分发变得不稳定。 可能会出现八个进程中有两个分担了```70%```的负载。

因为```server.listen()```将大部分工作交给主进程完成，因此导致普通```Node.js```进程与```cluster```工作进程差异的情况有三种：

```server.listen({fd: 7})```因为消息会被传给主进程，所以父进程中的文件描述符```7```将会被监听并将句柄传给工作进程，而不是监听文件描述符 7 指向的工作进程。

```server.listen(handle)```显式地监听句柄，会导致工作进程直接使用该句柄，而不是和主进程通信。

```server.listen(0)```正常情况下，这种调用会导致```server```在随机端口上监听。

但在```cluster```模式中，所有工作进程每次调用```listen(0)```时会收到相同的“随机”端口。 实质上，这种端口只在第一次分配时随机，之后就变得可预料。 如果要使用独立端口的话，应该根据工作进程的```ID```来生成端口号。

```Node.js```不支持路由逻辑。 因此在设计应用时，不应该过分依赖内存数据对象，例如```session```和登陆等。

由于各工作进程是独立的进程，它们可以根据需要随时关闭或重新生成，而不影响其他进程的正常运行。 只要有存活的工作进程，服务器就可以继续处理连接。 如果没有存活的工作进程，现有连接会丢失，新的连接也会被拒绝。```Node.js```不会自动管理工作进程的数量，而应该由具体的应用根据实际需要来管理进程池。

虽然```cluster```模块主要用于网络相关的情况，但同样可以用于其他需要工作进程的情况。

## 2. Worker

```Worker```对象包含了关于工作进程的所有的公共的信息和方法。 在主进程中，可以使用```cluster.workers```来获取它。 在工作进程中，可以使用```cluster.worker```来获取它。

### 1. disconnect 事件

类似于```cluster.on('disconnect')```事件，但特定于此工作进程。

```js
cluster.fork().on('disconnect', () => {
  // 工作进程已断开连接。
});
```

### 2. error 事件

此事件和```child_process.fork()```提供的事件相同。

在一个工作进程中，也可以使用```process.on('error')```。

### 3. exit 事件

类似于```cluster.on('exit')```事件，但特定于此工作进程。

```js
const worker = cluster.fork();
worker.on('exit', (code, signal) => {
  if (signal) {
    console.log(`工作进程已被信号 ${signal} 杀死`);
  } else if (code !== 0) {
    console.log(`工作进程退出，退出码: ${code}`);
  } else {
    console.log('工作进程成功退出');
  }
});
```

### 4. listening 事件

类似于```cluster.on('listening')```事件，但特定于此工作进程, 此事件不会在工作进程中触发。

```js
cluster.fork().on('listening', (address) => {
  // 工作进程正在监听。
});
```

### 5. message 事件

类似于```cluster.on('message')```事件，但特定于此工作进程。

在工作进程内，也可以使用```process.on('message')```。

以下是一个使用消息系统的示例。 它在主进程中对工作进程接收的```HTTP```请求数量保持计数：

```js
const cluster = require('cluster');
const http = require('http');

if (cluster.isMaster) {

  // 跟踪 http 请求。
  let numReqs = 0;
  setInterval(() => {
    console.log(`请求的数量 = ${numReqs}`);
  }, 1000);

  // 对请求计数。
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numReqs += 1;
    }
  }

  // 启动 worker 并监听包含 notifyRequest 的消息。
  const numCPUs = require('os').cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (let id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
  }

} else {

  // 工作进程有一个 http 服务器。
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('你好世界\n');

    // 通知主进程接收到了请求。
    p