React16之前的版本比对更新虚拟DOM的过程是采用循环递归方式来实现的，这种比对方式有一个问题，就是一旦任务开始进行就无法中断，如果应用中数组数量庞大，主线程被长期占用，直到整颗虚拟DOM树比对更新完成之后主线程才被释放，主线程才能执行其他任务，这就会导致一些用户交互或动画等任务无法立即得到执行，页面就会产生卡顿，非常的影响用户体验。

主要原因就是递归无法终端，执行重的任务耗时较长，javascript又是单线程的，无法同时执行其他任务，导致任务延迟页面卡顿用户体验差。

Fiber用白话来说就是一种DOM比对新的算法，以前的算法叫做stack，正是由于Stack算法存在上面的问题，React官方才重写了比对算法。Fiber采用的利用浏览器空余时间来执行任务，拒绝长时间占用主线程。放弃递归只采用循环，因为循环可以被中断。将大的任务拆分成一个个的小任务来执行。以前整颗DOM树的比对是一个任务，现在改成每个节点的比对是一个任务。

在Fiber方案中，为了实现任务的终止再结束，DOM比对算法被分成了两个部分，第一部分是虚拟DOM的比对，第二个是真实DOM的更新。其中虚拟DOM的比对是可以终止的，真实DOM的更新是不能终止的。

在使用React编写页面的时候我们使用的是jsx预发，babel会将jsx语法转换为React.createElement方法的调用，这个方法调用后返回虚拟DOM对象，然后就去执行第一个阶段也就是构建Fiber对象。我们通过循环在虚拟DOM中找到每个内部的对象，为每一个虚拟DOM对象构建Fiber对象，Fiber也是一个js对象和虚拟DOM对象类似。

```js
{
    type: "节点类型",
    props: "节点属性",
    stateNode: "节点DOM对象 或 组件实例对象",
    tag: "节点标记",
    effects: ['存储需要更改的fiber对象'],
    effectTag: "当前Fiber要被执行的操作",
    parent: "当前Fiber的父级Fiber",
    child: "当前Fiber的子级Fiber",
    sibling: "当前Fiber的兄弟Fiber",
    alternate: "Fiber备份用于比对时使用"
}
```

这里面存储了更多的信息，其中比较重要的是effectTag，当所有的Fiber节点生成之后需要将他们存储在数组当中，接着就可以执行第二阶段的操作循环Fiber数组，在循环的过程中根据effectTag来确定当前节点要做的操作将它应用在真实的DOM当中。

总结来说就是如果是初始渲染首先需要构建Fiber对象再将Fiber对象存储在数组当中，然后将Fiber要做的操作应用在真实的DOM当中，如果是状态更新就重新构建所有的Fiber对象再获取到旧的Fiber对象进行比对，然后形成Fiber数组，然后再将Fiber应用到真实DOM当中。

这里其实有一个问题，在第二阶段的时候所有的Fiber对象都在同一个数组中也就是他们的关系完全被抹平了，而页面中的每一个DOM元素都是一个子元素，我们需要知道谁是谁的子级谁是谁的父级，谁是谁的同级，这样我们才能准确的构建出DOM树，所以Fiber对象中还存储了当前节点的父级，子级，兄弟级。

## requestIdleCallback

requestIdleCallback是React-Fiber中用到的核心API，他的作用是利用浏览器的空余时间执行任务，如果有更高优先级的任务要执行时，当前执行的任务可以被终止，优先执行高级别任务。

requestIdleCallback这是浏览器内置的方法，直接挂载在window上，可以直接使用。接收一个回调函数，函数中接收一个对象作为参数，对象中存在timeRemaining方法返回空余时间的毫秒。

```js
requestIdleCallback(function(deadline) {
    // todo
    // deadline.timeRemaining() 获取浏览器的空余时间
})
```

我们都知道页面是按帧绘制出来的，当每秒绘制帧数达到60时页面是流畅的，小于这个值用户会觉得卡顿。也就是每16ms绘制一帧，如果每一帧执行的时间小于16ms就说明浏览器有空余时间，如果任务在剩余的时间内没有完成则会停止任务执行，继续优先执行主任务，也就是说requestIdleCallback总是利用浏览器的空余时间执行任务。

我们可以测试一下，页面中有两个按钮一个div，点击第一个按钮的时候进行一些昂贵的操作，长期占用主线程，点击第二个按钮更改页面中div的背景颜色。

```html
<div class="playground" id="play">playground</div>
<button id="work">start</button>
<button id="interaction">handle some user</button>
<style>
.playground {
    background: red;
    padding: 20px;
    margin-bottom: 10px;
}
</style>
```

```js
var play = document.getElementById('play');
var workBtn = document.getElementById('work');
var interationBtn = document.getElementById('interaction');
var number = 100000000;
var value = 0;

function calc() {
    while (number > 0) {
        value = Math.random() > 0.5 ? value + Math.random() : value + Math.random()
        number--;
    }
}

workBtn.addEventListener('click', function() {
    calc();
})

interationBtn.addEventListener('click', function() {
    play.style.background = 'green'
})
```

我们知道，如果线程被长期占用当改变背景颜色的时候是不会生效的, 页面会卡顿时段时间才修改背景颜色，这是很不友好的，我们可以使用requestIdleCallback来解决这个问题。

当点击第一个按钮的时候我们可以调用requestIdleCallback这个API将calc函数放进去。

```js
workBtn.addEventListener('click', function() {
    requestIdleCallback(calc);
})
```

这个时候calc是会接收到一个参数的，我们命名为deadline，然后通过这个参数的timeRemaining方法来获取空余时间，当空余时间大于1ms的时候我们再去执行任务。

```js
function calc(deadline) {
    while (number > 0 && deadline.timeRemaining() > 1) {
        value = Math.random() > 0.5 ? value + Math.random() : value + Math.random()
        number--;
    }
}
```

这个时候当用户点击按钮的时候由于优先级较高会继续优先执行切换背景的代码，让循环任务停止下来。这里我们还要在函数底部加上requestIdleCallback(calc)表示在下次空闲时继续执行，否则停止了就不会再执行了。

```js
function calc(deadline) {
    while (number > 0 && deadline.timeRemaining() > 1) {
        value = Math.random() > 0.5 ? value + Math.random() : value + Math.random()
        number--;
    }
    requestIdleCallback(calc);
}
```

## 创建任务队列

下面我们就要开始去实现Fiber算法，首先我们要有一段jsx代码，我们要看一下如何利用Fiber将jsx转换成DOM对象显示在页面中。

首先我们需要搭建一个开发环境，我这里已经搭建好了，大家可以自取。[链接](https://github.com/xiaoyindong/fiber/tree/1ce885afcfe7c3d45ce53309df2b2128b2a4790f)

项目依赖以下模块，以及模块具体作用都做了解析。

| 依赖项 | 描述 |
| --- | --- |
| webpack | 模块打包工具 |
| webpack-cli | 打包命令工具 |
| webpack-node-externals | 打包服务器端模块时剔除node_modules文件夹中的模块 |
| @babel/core | ES转换工具 |
| @babel/preset-env | babel预置，转换高级javaScript语法 |
| @babel/preset-react | 转换jsx语法 |
| babel-loader | webpack工具babel加载器 |
| nodemon | 监控服务端文件变化，重启应用 |
| npm-run-all | 命令行工具，可以同时执行多个命令 |
| express | 基于node平台的web开发框架 |

在src/index.js中加入下面这段代码。我们知道jsx代码会被babel转换为React.createElement这个方法的调用，我们这里需要引入React，为了更好的分析他我们前一章手写过React[React源码分析](https://github.com/xiaoyindong/tinyReact/), 这里我们直接将createElement这个方法复制到项目中引入进来。

```jsx
const jsx = <div>
    <p>Hello Fiber</p>
</div>

console.log(jsx);
```

可以看到控制台输出了一个对象，可以看到第一标签是div，子元素是p标签，p标签的子元素是text文本元素, [代码地址](https://github.com/xiaoyindong/fiber/tree/cb499ffd248f85cf67fbacba6ec4659900fd5838)

```json
{
    "type": "div",
    "props": {
        "children": [
            {
                "type": "p",
                "props": {
                    "children": [
                        {
                            "type": "text",
                            "props": {
                                "children": [],
                                "textContent": "Hello Fiber"
                            }
                        }
                    ]
                }
            }
        ]
    }
}
```

接着我们需要引入render将虚拟DOM渲染到页面中引入render方法。

```js
import React, { render } from './react';
const jsx = <div>
    <p>Hello Fiber</p>
</div>

const root = document.getElementById('root');

render(jsx, root)
```

我们需要定义一下render方法，这个函数接收两个参数，虚拟DOM和要渲染的容器。

在这个函数中需要做两件事，第一件是想任务队列中添加任务，第二个是指定在浏览器空闲时执行任务。所谓的任务就是要做的事，比如通过虚拟DOM构建Fiber对象就是任务，任务队列就是一个数组，因为任务不只一个。所以任务放在任务队列中，队列就是数组。

```js
const render = (element, dom) => {
    
}
```

我们这里还需要定义一个队列createTaskQueue，可以向队列中添加内容和读取内容。

```js
const createTaskQueue = () => {
    const taskQueue = [];
    return {
        push: item => { // 向任务队列中添加任务
            return taskQueue.push(item);
        },
        pop: () => { // 从任务队列中获取任务
            return taskQueue.shift();
        },
        isEmpty: () => { // 判断是否存在任务
            taskQueue.length === 0
        }
    }
}

export default createTaskQueue;
```

然后在render方法中向队列中添加任务，一个任务就是一个对象，这个对象有父级和子级两个属性，[链接地址](https://github.com/xiaoyindong/fiber/tree/2206c45ca212282b65c0a0e5c4c79e655590b79a)

```js
import { createTaskQueue } from '../Misc';
const taskQueue = createTaskQueue();

export const render = (element, dom) => {
    // 1. 向任务队列中添加任务
    taskQueue.push({
        dom, // 父级
        props: {
            children: element // 子级
        }
    })
    // 2. 指定在浏览器空闲时执行任务
}
```

## 实现任务的调度逻辑

接下来我们要实现任务的调度逻辑，在render方法中我们要调用requestIdleCallback这个api在浏览器空闲的时候去执行任务。

```js
const render = (element, dom) => {
    // 1. 向任务队列中添加任务
    taskQueue.push({
        dom, // 父级
        props: {
            children: element // 子级
        }
    })
    // 2. 指定在浏览器空闲时执行任务
    requestIdleCallback(performTask)
}
```

requestIdleCallback再被调用的时候需要传递一个函数作为参数，当浏览器空闲的时候就会去调用这个函数，这个函数我们命名为performTask。我们先定义一下这个方法。

这个方法只负责调度任务并不执行任务，我们创建一个workLoop方法来执行任务。将deadline参数传递进去。

```js
const performTask = deadline => {
    workLoop(deadline)
}
```

这时我们还需要定义workLoop方法, 这才是真正干活的方法，首先我们需要判断任务是否存在。首先我们要定义一个subTask来存储当前的任务，默认值为空，这样在workLoop中我们首先要判断subTask是否存在。如果不存在我们调用getFirstTask方法获取一个任务。

```js
let subTask = null;

const getFirstTask = () => {
    
}

const workLoop = deadline => {
     if (!subTask) {
        subTask = getFirstTask()
     }
}
```

如果任务存在我们就执行这个任务。因为有多个任务，所以我们这里要使用循环来处理。循环中判断subTask存在并且浏览器的空余时间大于1ms再执行任务。执行任务的代码我们放在executeTask函数中来单独处理。executeTask接收的对象其实就是一个Fiber。

executeTask执行结束之后需要返回一个新的任务。

```js

const executeTask = fiber => {

}

const workLoop = deadline => {
    if (!subTask) {
        subTask = getFirstTask()
    }

    while (subTask && deadline,timeRemaining() > 1) {
        subTask = executeTask(subTask);
    }
}
```


我们知道requestIdleCallback是会被打断的，如果有更优先的任务执行这里就断掉了，这个方法就会退出，也就是执行到performTask中，所以我们这里要去判断一下subTask是否有值，如果有值就是任务没有执行完，同时我们也要判断任务队列中是否有值。[源码地址](https://github.com/xiaoyindong/fiber/tree/a8034fa0197bd55dee9dda9ef2e1a9aabc5cc6ed)

```js
const performTask = deadline => {
    workLoop(deadline);
    if (subTask || !taskQueue.isEmpty()) {
        requestIdleCallback(performTask)
    }
}
```

## 任务执行 - 构建Fiber对象

在任务执行之前我们首先需要明确要执行的是什么任务，这个任务应该怎样被执行。

我们要执行的任务就是根据虚拟DOM独享为每一个节点构建Fiber对象。具体执行的方式也很简单，比如下面的对象为例。首先先构建最外层的div对象，然后再构建里面的两个div，当这三个节点构建完成之后就要去设定他们之间的对应关系。

这里需要注意对于parent这个div来说，只有第一个div是他的子节点，剩余的都是child这个div的兄弟节点。当他们三个的关系建立完毕之后，再去找父级的第一个子级节点child，看这个节点是否有子级，这里有个p。当p构建完毕，这条链路就构建完了。既没有子级也没有同级。这个时候继续向父级查找，看父级是否有兄弟节点，如果存在兄弟节点，判断是否已经构建如果已经构建完了再检查这个节点的子节点。如果没有构建就构建之后再检查子节点。

```html
<div class="parent">
    <div class="child">
        <p></p>
    </div>
    <div class="sibling">
        <p></p>
    </div>
</div>
```

我们来实现一下上面的流程。在这个jsx中root是父节点，div是子节点，这里我们已经通过render方法传递进去了。

```jsx
import React, { render } from './react';
const jsx = <div>
    <p>Hello Fiber</p>
</div>

const root = document.getElementById('root');

render(jsx, root)
```

在render这个方法中我们前面已经写完了任务的调度逻辑，下面我们编写构建Fiber的逻辑，在getFirstTask方法中我们首先要获取一个subTask，从任务队列中获取这个任务。然后构建最外层节点对应的Fiber对象。

这里我首先要获取的是第一个小任务，并不是任务队列中的第一个任务，是任务队列中任务的第一个小任务。我们把任务队列中拿出来的task看成是一个大任务，要从中获取第一个子任务。也就是构建最外层Fiber节点对象。这里返回这个Fiber对象。

```js
{
    type: "节点类型",
    props: "节点属性",
    stateNode: "节点DOM对象 或 组件实例对象",
    tag: "节点标记", // host_root  host_component class_component function_component
    effects: ['存储需要更改的fiber对象'],
    effectTag: "当前Fiber要被执行的操作", // 新增 删除 修改
    parent: "当前Fiber的父级Fiber",
    child: "当前Fiber的子级Fiber",
    sibling: "当前Fiber的兄弟Fiber",
    alternate: "Fiber备份用于比对时使用"
}
```

对于最外层节点不需要有type属性，所以我们直接省略掉。因为是最外层节点，所以effectTag和parent也是不存在的，sibling和alternate暂时也不需要，child暂时先写成null。

```js
const getFirstTask = () => {
    // 从任务队列中获取任务
    const task = taskQueue.pop();
    // 返回最外层节点Fiber对象
    return {
        props: task.props,
        stateNode: task.dom,
        tag: 'host_root',
        effects: [],
        child: null,
    }
}
```

getFirstTask函数返回的值会赋值给subTask，当subTask有值并且浏览器有空余时间的时候就会调用循环，执行executeTask函数。父级节点已经构建完了，这个时候我们要开始构建子级节点了。executeTask接收的参数就是subTask。

要构建子节点首先要拿到子节点的虚拟DOM对象，可以通过subTask.props.children, subTask也就是fiber，所以可以从fiber.props.children中获取。

```js
const executeTask = fiber => {
    reconcileChildren(fiber, fiber.props.children)
}
```

这里我们调用reconcileChildren方法来做这件事，传入fiber和子节点的虚拟DOM对象。因为要建立父子之间的关系，所以两个参数都要传递。

这里的children可能是一个DOM对象也可能是一个数组，在构建子节点之前我们要处理一下。我们统一处理成数组，如果是对象就给对象包裹一层数组。

接着我们要拿到arrifiedChildren中的虚拟DOM将它转换成Fibler，这里用到了循环。这里定义了三个变量，index和number用于循环，element存储当前遍历到的DOM对象。

```js
const arrified = arg => Array.isArray(arg) ? arg : [arg]

const reconcileChildren = (fiber, children) => {
    // 将children转换成数组
    const arrifiedChildren = arrified(children);

    let index = 0;

    let numberOfElements = arrifiedChildren.length;

    let element = null;

    while (index < numberOfElements) {
        element = arrifiedChildren[index];
        index++;
    }
}
```

element就是我们需要的子节点，接下来我们就可以构建fiber对象了，我们声明一个newFiber对象。他的值默认为空，当循环的时候获取到对应的Fiber对象。

```js
const reconcileChildren = (fiber, children) => {
    // 将children转换成数组
    const arrifiedChildren = arrified(children);

    let index = 0;

    let numberOfElements = arrifiedChildren.length;

    let element = null;
    // 当前正在构建的的Fiber
    let newFiber = null;
    // 存储前一个节点，用于构建兄弟关系
    let prevFiber = null;

    while (index < numberOfElements) {
        element = arrifiedChildren[index];
        newFiber = {
            type: element.type,
            props: element.props,
            tag: 'host_component',
            effects: [],
            effectTag: 'placement', // 新增
            stateNode: null, // dom对象，暂时没有
            parent: fiber,
        }
        // 如果第一个子节点就赋值到fiber上
        if (index == 0) {
            fiber.child = newFiber;
        } else {
            // 否则放在前一个的兄弟节点上
            prevFiber.sibling = newFiber;
        }
        prevFiber = newFiber;
        index++;
    }
}
```

在fiber对象当中有一个属性叫做stateNode, 这个属性的值要取决当前节点的类型，如果当前节点是普通节点，就存储当前节点DOM对象，如果是组件的话就存储组件的实例对象。这里我们要声明一个方法来做这个判断。这个方法接收当前的fiber对象作为参数。

这里依赖createDOMElement方法，实现方法可以参考前一章[手写React源码](https://github.com/xiaoyindong/tinyReact/)，具体实现这里就不啰嗦了。

```js
// 获取节点对象
newFiber.stateNode = createStateNode(newFiber);

const createStateNode = fiber => {
    // 普通节点
    if (fiber.tag === 'host_component') {
        return createDOMElement(fiber)
    }
}
```

在Fiber对象中还有一个tag属性，他表示的是当前节点到底是标签节点还是组件节点，这里也需要一个函数来判断。

```js

const getTag = vdom => {
    if (typeof vdom.type === 'string') {
        return 'host_component'
    }
}

newFiber = {
    type: element.type,
    props: element.props,
    tag: getTag(element),
    effects: [],
    effectTag: 'placement', // 新增
    stateNode: null, // dom对象，暂时没有
    parent: fiber,
}

```

这里需要注意的是根节点是不需要调用getTag来获取的，根节点始终都为host_root字符串。

至此外层节点对象和第一个子集节点对象我们就构建完成了，接着我们开始查找节点，继续构建节点对象。之前我们通过reconcileChildren方法构建了外层节点对象和第一个子级节点对象，当第一个子集构建完成之后，代码会重新回到这个函数。我们在这里判断fiber是否有child，如果有就返回。这样executeTask执行结束之后就会返回一个新的任务。

这样executeTask执行完会再次执行executeTask。第二次执行时传入的fiber就是fiber.child，将子级当做父级来执行。继续构建子级的子级。

```js
const executeTask = fiber => {
    // 构建子级fiber对象
    reconcileChildren(fiber, fiber.props.children)
    if (fiber.child