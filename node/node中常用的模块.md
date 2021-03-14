## 1. process

```process```是一个全局的变量，所以使用的时候是不需要执行```require```操作，可以直接使用。

这里分两部分来说明，第一个就是可以借助它去获取进程信息，比如进程工作的时候本地是一个什么样的环境，通过```process```可以获取。第二个通过```process```可以对当前的进程做一些操作，比如说可以监听进程执行过程中内置的事件，创建子进程完成更多的操作。

### 1. 内存相关获取

```js
// 查看内存消耗
console.log(process.memoryUsage());
/**
* rss： 常驻内存
* heapToal: 总内存大小
* heapUsed: 已使用内存
* external: 扩展内存 - 底层模块占用的C/C++核心模块
* arrayBuffers: 缓冲区大小
*/
```

### 2. CPU相关信息获取

```js
console.log(process.cpuUsage());
/**
* user: 用户占用的时间片段
* system: 系统占用的时间片段
*/
```

### 3. 运行时可以通过process查看运行目录，Node环境，cpu架构，用户环境，系统平台。

```js
process.cwd(); // 运行目录
process.version; // Node版本
process.versions; // 运行环境版本
process.arch; // cpu架构
process.env.Node_ENV; // 环境 需要先设置
process.env.PATH; // 环境变量
process.env.USERPROFILE; // 管理员目录路径 不同环境方式不一样 process.env.HOME
process.platform; // 平台 win32 macos

```

### 4. 运行时可以获取启动参数，PID，运行时间，

```js
process.argv; // 获取运行参数，空格分隔可在数组中获取到，默认会存在Node目录和执行脚本的目录两个值。
process.argv0; // 获取第一个值, 只有这一个api
process.pid; // 获取运行的pid
process.ppid; 
process.uptime; // 脚本运行时间
```

事件监听在```process```中提供的内容。这里不会着重说明```process```里面到底有哪些事件，主要还是看一看在```NodeJS```里面熟悉一下事件驱动编程以及发布订阅的模式。

```process```是实现了```emit```接口的。可以使用```on```监听事件，内部提供了很多的事件，比如```exit```，程序退出的时候执行。这里绑定的事件只能执行同步代码，是不可以执行异步代码的，这里要注意。

```js
process.on('exit', (code) => { // 退出时
    console.log(code); // 0
})

process.on('beforeExit', (code) => { // 退出之前
    console.log(code); // 0
})
```

手动退出，这种退出不会执行```beforeExit```，而且```exit```后面的代码也不会执行，因为执行```exit```就已经退出了。

```js
process.exit();
```

### 5. 标准输出，输入，错误

```js
process.stdout; // 是一个流，可以对他进行读写操作。

process.stdout.write('123'); // 123
```

```js
const fs = require('fs');

fs.createReadStream('text.txt').pipi(process.stdout); // 读取文件输出。
```

```js
process.stdin; // 可以拿到控制台输入的内容
process.stdin.pipe(process.stdout); // 输入之后输出
```

```js
// 设置字符编码
process.stdin.setEncoding('utf-8');
// 监听readable事件，是否可读也就是有无内容
process.stdin.on('readable', () => {
    // 获取输入的内容
    let chunk = process.stdin.read();
    if (chunk !== null) {
        process.stdout.write(chunk);
    }
})
```

## 2. path

```Node```中的内置模块，可以直接使用```require```将它导入，他的主要作用就是处理文件的目录和路径。只需要调用不同的方法。```path```相当于一个工具箱，只需要掌握它里面提供的工具，也就是方法。

```js
const path = require('path');
```

### 1. basename()

获取路径中基础名称

```js
path.basename(__filename); // test.js
// 传入第二个参数如果匹配会省略后缀，不匹配仍旧返回真实的后缀
path.basename(__filename, '.js'); // test
path.basename('/a/b/c'); // c
path.basename('/a/b/c/'); // c
```

### 2. dirname()

获取路径中的目录名称

```js
path.dirname(__filename); // d:\Desktop\test
path.dirname('/a/b/c'); // /a/b
path.dirname('/a/b/c/'); // /a/b
```

### 3. extname()

获取路径中的扩展名称

```js
path.extname(__filename); // .js
path.extname('/a/b'); //
path.extname('/a/b/index.html.js.css'); // .css
path.extname('/a/b/index.html.js.'); // .
```

### 4. 