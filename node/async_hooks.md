## 1. 概述

```Async Hooks``` 是 ```Node8``` 新出来的特性，提供了一些 ```API``` 用于跟踪 ```NodeJs``` 中的异步资源的生命周期，属于 ```NodeJs``` 内置模块，可以直接引用。

```js
const async_hooks = require('async_hooks');
```

这是一个很少使用的模块，为什么会有这个模块呢？

我们都知道，```JavaScript```在设计之初就是一门单线程语言，这和他的设计初衷有关，最初的```JavaScript```仅仅是用来进行页面的表单校验，在低网速时代降低用户等待服务器响应的时间成本。随着```Web```前端技术的发展，虽然前端功能越来越强大，越来越被重视，但是单线程似乎也没有什么解决不了的问题，相比较而言多线程似乎更加的复杂，所以单线程依旧被沿用至今。

既然J```avaScript```是单线程，但是在日常开发中总是会有一些比较耗时的任务，比如说定时器，再比如说如今已经标准化的```Ajax```，```JavaScript```为了解决这些问题，将自身分为了``BOM``，```DOM```，```ECMAScript```，```BOM```会帮我们解决这些耗时的任务，称之为异步任务。

正因为浏览器的```BOM```帮我们处理了异步任务，所以大部分的程序员对异步任务除了会用几乎一无所知，比如同时有多少异步任务在队列中？异步是否拥堵等，我们都是没有办法直接获得相关信息的，很多情况下，底层确实也不需要我们关注相关的信息，但如果我们在某些情况下想要相关信息的时候，```NodeJS```提供了一个```Experimental```的```API```供我们使用，也就是```async_hooks```。为什么是```NodeJS```呢，因为只有在```Node```中定时器，```http```这些异步模块，才是开发者可以控制的，浏览器中的```BOM```是不被开发者控制的，除非浏览器提供对应的```API```。

## 2. async_hooks规则

```async_hooks```约定每一个函数都会提供一个上下文，我们称之为```async scope```，每一个```async scope```中都有一个 ```asyncId```, 是当前```async scope```的标志，同一个的```async scope```中```asyncId```必然相同。

这在多个异步任务并行的时候，```asyncId```可以使我们可以很好的区分要监听的是哪一个异步任务。

```asyncId```是一个自增的不重复的正整数，程序的第一个```asyncId```必然是```1```。

```async scope```通俗点来说就是一个不能中断的同步任务，只要是不能中断的，无论多长的代码都共用一个```asyncId```，但如果中间是可以中断的，比如是回调，比如中间有```await```，都会创建一个新的异步上下文，也会有一个新的```asyncId```。

每一个```async scope```中都有一个```triggerAsyncId```表示当前函数是由那个```async scope```触发生成的；

通过 ```asyncId``` 和 ```triggerAsyncId``` 我们可以很方便的追踪整个异步的调用关系及链路。

```async_hooks.executionAsyncId()```用于获取```asyncId```，可以看到全局的```asyncId```是```1```。

```async_hooks.triggerAsyncId()```用于获取```triggerAsyncId```，目前值为```0```。

```js
const async_hooks = require('async_hooks');
console.log('asyncId:', async_hooks.executionAsyncId()); // asyncId: 1
console.log('triggerAsyncId:', async_hooks.triggerAsyncId()); // triggerAsyncId: 0
```

我们这里使用```fs.open```打开一个文件，可以发现```fs.open```的```asyncId```是```7```，而```fs.open```的```triggerAsyncId```变成了```1```，这是因为```fs.open```是由全局调用触发的，全局的```asyncId```是```1```。

```js
const async_hooks = require('async_hooks');
console.log('asyncId:', async_hooks.executionAsyncId()); // asyncId: 1
console.log('triggerAsyncId:', async_hooks.triggerAsyncId()); // triggerAsyncId: 0
const fs = require('fs');
fs.open('./test.js', 'r', (err, fd) => {
    console.log('fs.open.asyncId:', async_hooks.executionAsyncId()); // 7
    console.log('fs.open.triggerAsyncId:', async_hooks.triggerAsyncId()); // 1
});
```

## 3. 异步函数的生命周期

当然实际应用中的```async_hooks```并不是这样使用的，他正确的用法是在所有异步任务创建、执行前、执行后、销毁后，触发回调，所有回调会传入```asyncId```。

我们可以使用```async_hooks.createHook```来创建一个异步资源的钩子，这个钩子接收一个对象作为参数来注册一些关于异步资源生命周期中可能发生事件的回调函数。每当异步资源被创建/执行/销毁时这些钩子函数会被触发。

```js
const async_hooks = require('async_hooks');

const asyncHook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) { },
  destroy(asyncId) { }
})

```

目前 ```createHook``` 函数可以接受五类 ```Hook Callbacks``` 如下：

### 1.init(asyncId, type, triggerAsyncId, resource)

### 2. init 回调函数一般在异步资源初始化的时候被触发。

### 3. asyncId: 每一个异步资源都会生成一个唯一性标志

### 4. type: 异步资源的类型，一般都是资源的构造函数的名字。

```txt
FSEVENTWRAP, FSREQCALLBACK, GETADDRINFOREQWRAP, GETNAMEINFOREQWRAP, HTTPINCOMINGMESSAGE,
HTTPCLIENTREQUEST, JSSTREAM, PIPECONNECTWRAP, PIPEWRAP, PROCESSWRAP, QUERYWRAP,
SHUTDOWNWRAP, SIGNALWRAP, STATWATCHER, TCPCONNECTWRAP, TCPSERVERWRAP, TCPWRAP,
TTYWRAP, UDPSENDWRAP, UDPWRAP, WRITEWRAP, ZLIB, SSLCONNECTION, PBKDF2REQUEST,
RANDOMBYTESREQUEST, TLSWRAP, Microtask, Timeout, Immediate, TickObject
```

triggerAsyncId: 表示触发当前异步资源被创建的对应的 ```async scope``` 的 ```asyncId```

#### 1. resource

代表被初始化的异步资源对