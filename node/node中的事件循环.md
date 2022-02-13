## 正文

浏览器中存在两个任务队列，一个是```宏任务```一个是```微任务```。但是在```NodeJS```中一共存在```六个事件队列```，```timers```，```pending callbacks```，```idle prepare```，```poll```，```check```，```close callbacks```。每一个队列里面存放的都是回调函数```callback```。

这六个队列是按顺序执行的。每个队列负责存储不同的任务。

```timer```里面存在的是```setTimeout```与```setInterval```的回调函数

```pending callback```是执行操作系统的回调，例如```tcp```,```udp```。

```idle``` 和 ```prepare```只在系统内部进行使用。一般开发者用不到

```poll```执行与```IO```相关的回调操作

```check```中存放```setImmediate```中的回调。

```close callbacks```执行```close```事件的回调。

在```Node```中代码从上到下同步执行，在执行过程中会将不同的任务添加到相应的队列中，比如说```setTimeout```就会放在```timers```中, 如果遇到```文件读写```就放在```poll```里面，等到整个同步代码执行完毕之后就会去执行满足条件的微任务。可以假想有一个队列用于存放微任务，这个队列和前面的六种没有任何关系。

当同步代码执行完成之后会去执行满足条件的微任务，一旦所有的微任务执行完毕就会按照上面列出的顺序去执行队列当中满足条件的宏任务。

首先会执行```timers```当中满足条件的宏任务，当他将```timers```中满足的任务执行完成之后就会去执行队列的切换，在切换之前会先去清空微任务列表中的微任务。

所以微任务执行是有两个时机的，第一个时机是所有的同步代码执行完毕，第二个时机队列切换前。

注意在微任务中```nextTick```的执行优先级要高于```Promise```，这个只能死记了。

```js
setTimeout(() => {
    console.log('s1');
})

Promise.resolve().then(() => {
    console.log('p1');
})

console.log('start');

process.nextTick(() => {
    console.log('tick');
})

setImmediate(() => {
    console.log('st');
})

console.log('end');

// start end tick p1 s1 st
```

```js
setTimeout(() => {
    console.log('s1');
    Promise.resolve().then(() => {
        console.log('p1');
    })
    process.nextTick(() => {
        console.log('t1');
    })
})

Promise.resolve().then(() => {
    console.log('p2')
})

console.log('start')