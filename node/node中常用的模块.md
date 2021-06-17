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

### 4. isAbsolute()

获取路径是否是绝对路径

```js
path.isAbsolute('a'); // false
path.isAbsolute('/a'); // true
```

### 5. join()

拼接多个路径片段，还原成完整可用路径

```js
path.join('a/b', 'c', 'index.html'); // a/b/c/index.html
path.join('/a/b', 'c', 'index.html'); // /a/b/c/index.html
path.join('a/b', 'c', '../', 'index.html'); // a/b/index.html
```

### 6. resolve()

返回一个绝对路径

```js
path.resolve(); // 获取绝对路径
```

### 7. parse()

解析路径

```js
const obj = path.parse('/a/b/c/index.html');
/**
* root: /
* dir: /a/b/c
* base: index.html
* ext: .html
* name: index
*/
```

### 8. format()

序列化路径，与```parse```功能相反, 将对象拼接成完整的路径。

```js
path.format({
    root: '/',
    dir: '/a/b/c',
    base: 'index.html',
    ext: '.html',
    name: 'index'
});
// /a/b/c/index.html
```

### 9. normalize()

规范化路径，将不可用路径变为可用路径, 这个方法注意如果有转译字符会转译。

```js
path.normalize('a/b/c/d'); // a/b/c/d
path.normalize('a//b/c../d'); // a/b/c../d
path.normalize('a\\/b/c\\/d'); // a/b/c/d 
```

## 3. Buffer

```Buffer```一般称为缓冲区，可以认为因为```Buffer```的存在让开发者可以使用```js```操作```二进制```。```IO```行为操作的就是二进制数据。```NodeJS```中的```Buffer```是一片内存空间。他的大小是不占据```V8```内存大小的，```Buffer```的内存申请不是由```Node```生成的。只是回收的时候是```V8```的```GC```进行回收的。

```Buffer```是```NodeJS```中的一个全局变量，无需```require```就可以直接使用。一般配合```stream```流使用，充当数据的缓冲区。

```alloc```可以创建指定字节大小的```Buffer```，默认没有数据

```allocUnsafe``` 创建指定大小的```Buffer```但是不安全，使用碎片的空间创建```Buffer```，可能存在垃圾脏数据，不一定是空的。

```from``` 接收数据创建```Buffer```

在```v6```版本之前是可以通过实例化创建```Buffer```对象的，但是这样创建的权限太大了，为了控制权限，就限制了实例化创建的方式。

```js
// 创建Buffer
const b1 = Buffer.alloc(10);
const b2 = Buffer.allocUnsafe(10);
```

```from```创建```Buffer```可以接收三种类型，字符串，数组，```Buffer```。 第二个参数是编码类型。

```js
const b3 = Buffer.from('1');
const b4 = Buffer.from([1, 2, 3]);
```

```Buffer```的一些常见实例方法。

fill: 使用数据填充```Buffer```，会重复写入到最后一位

write：向```Buffer```中写入数据，有多少写多少，不会重复写入。

toString: 从```Buffer```中提取数据

slice: 截取```Buffer```

indexOf：在```Buffer```中查找数据

copy: 拷贝```Buffer```中的数据

```Buffer```的静态方法。

concat: 将多个```Buffer```拼接成一个新的```Buffer```

isBuffer: 判断当前数据是否是一个```Buffer```

```Buffer```的```split```方法实现。

```js
Array.Buffer.splice = function(sep) {
    let len = Buffer.form(sep).length;
    let ret = [];
    let start = 0;
    let offset = 0;

    while(offset = this.indexOf(sep, start) !== -1) {
        ret.push(this.slice(start, offset))
        start = offset + len;
    }
    ret .push(this.slice(start));
    return ret;
}
```

## 4. fs

在```Node```中```Buffer```和```Stream```随处可见，他们用于操作二进制数据。

```fs```是一个内置的核心模块，所有与文件相关的操作都是通过```fs```来进行实现的，比如文件以及目录的创建，删除，信息的查询或者文件的读取和写入。

如果想要操作文件系统中的二进制数据需要使用```fs```模块提供的```API```，这个过程中```Buffer```和```Stream```又是密不可分的。

介绍```fs```模块之前我们首先需要介绍一下文件系统的基础知识，比如权限位，标识符，文件描述符等。

权限是指当前的操作系统内不同的用户角色对于当前的文件可以执行的不同权限操作，文件的权限操作被分为```r```,```w```,```x```三种, ```r```是读权限，```w```是写权限，```x```是执行权限。如果用8进制的数字进行表示```r```是```4```，```w```是```2```，```x```是```1```，如果不具备该权限就是一个```0```。

操作系统中将用户分为三类分别是文件的所有者，一般指的是当前用户自己，再有就是文件的所属组，类似当前用户的家人，最后是其他用户也就是访客用户。

```Node```中```flag```表示对文件操作方式，比如是否可读可写。

r: 表示可读

w: 表示可写

s: 表示同步

+: 表示执行相反操作

x: 表示排他操作

a: 表示追加操作

```fd```就是操作系统分配给被打开文件的标识，通过这个标识符文件操作就可以识别和被追踪到特定的文件。不同操作系统之间是有差异的，```Node```为我们抹平了这种差异。

```Node```每操作一个文件，文件描述符就会递增一次，并且它是从```3```开始的。因为```0```，```1```，```3```已经被输入，输出和错误占用了。后面我们在使用```fs.open```打开文件的时候就会得到这个```fd```。

```fs```任何文件操作```api```都有同步和异步两种方式，这里只演示异步```API```，同步基本也相同

### 1. 文件读写

readFile: 从指定文件中读取数据

```js
const fs = require('fs');
const path = require('path');

fs.readFile(path.resolve('aaa.txt'), 'utf-8', (err, data) => {
    console.log(err);
    console.log(data);
})

```

writeFile: 向指定文件中写入数据

```js
fs.writeFile('bbb.txt', 'hello', {
    mode: 438, // 操作位
    flag: 'w+',
    encoding: 'utf-8'
}, (err) => {
    console.log(err);
})
```

appendFile: 追加的方式向指定文件中写入数据

```js
fs.appendFile('bbb.txt', 'hello', {}, (err) => {
    console.log(err);
})
```

copyFile: 将每个文件中的数据拷贝到另一个文件

```js
fs.copyFile('aaa.txt', 'bbb.txt', (err) => {
    console.log(err);
})
```

watchFile: 对指定文件进行监控

```js
fs.watchFile('bbb.txt', {
    interval: 20 // 20ms监控一次
}, (curr, prev) => {
    console.log(curr); // 当前信息
    console.log(prev); // 前一次信息
    if (curr.mtime !== prev.mtime) {
        // 文件被修改了
    }
})

fs.un