## 1. 概述

```Vite```是一个更轻、更快的```web```应用开发工具，面向现代浏览器。底层基于```ECMAScript```标准原生模块系统```ES Module```实现。他的出现是为了解决```webpack```冷启动时间过长以及```Webpack HMR```热更新反应速度慢等问题。

默认情况下```Vite```创建的项目是一个普通的```Vue3```应用，相比基于```Vue-cli```创建的应用少了很多配置文件和依赖。

```Vite```创建的项目所需要的开发依赖非常少，只有```Vite和@vue/compiler-sfc```。这里面```Vite```是一个运行工具，```compiler-sfc```则是为了编译```.vue```结尾的单文件组件。在创建项目的时候通过指定不同的模板也可以支持使用其他框架例如```React```。项目创建完成之后可以通过两个命令启动和打包。

```s
# 开启服务器
vite serve
# 打包
vite build
```

正是因为```Vite```启动的```web```服务不需要编译打包，所以启动的速度特别快，调试阶段大部分运行的代码都是你在编辑器中书写的代码，这相比于```webpack```的编译后再呈现确实要快很多。当然生产环境还是需要打包的，毕竟很多时候我们使用的最新```ES```规范在浏览器中还没有被支持，```Vite```的打包过程和```webpack```类似会将所有文件进行编译打包到一起。对于代码切割的需求``Vite``采用的是原生的动态导入来实现的，所以打包结果只能支持现代浏览器，如果需要兼容老版本浏览器可以引入```Polyfill```。

使用Webpack打包除了因为浏览器环境并不支持模块化和新语法外，还有就是模块文件会产生大量的```http```请求。如果你使用模块化的方式开发，一个页面就会有十几甚至几十个模块，而且很多时候会出现几```kb```的文件，打开一个页面要加载几十个```js```资源这显然是不合理的。

```Vite```创建的项目几乎不需要额外的配置默认已经支持```TS```、```Less```, ```Sass```，```Stylus```，```postcss```了，但是需要单独安装对应的编译器，同时默认还支持```jsx```和```Web Assembly```。

```Vite```带来的好处是提升开发者在开发过程中的体验，```web```开发服务器不需要等待即可立即启动，模块热更新几乎是实时的，所需的文件会按需编译，避免编译用不到的文件。并且开箱即用避免```loader```及```plugins```的配置。

```Vite```的核心功能包括开启一个静态的```web```服务器，能够编译单文件组件并且提供```HMR```功能。当启动```vite```的时候首先会将当前项目目录作为静态服务器的根目录，静态服务器会拦截部分请求，当请求单文件的时候会实时编译，以及处理其他浏览器不能识别的模块，通过```websocket```实现```hmr```。

## 2. 实现静态测试服务器

首先实现一个能够开启静态```web```服务器的命令行工具。```vite1.x```内部使用的是```Koa```来实现静态服务器。(ps：node命令行工具可以查看我之前的文章，这里就不介绍了，直接贴代码)。

```s
npm init
npm install koa koa-send -D
```

工具```bin```的入口文件设置为本地的```index.js```

```js
#!/usr/bin/env node

const Koa = require('koa')
const send = require('koa-send')

const app = new Koa()

// 开启静态文件服务器
app.use(async (ctx, next) => {
    // 加载静态文件
    await send(ctx, ctx.path, { root: process.cwd(), index: 'index.html'})
    await next()
})

app.listen(5000)

console.log('服务器已经启动 http://localhost:5000')
```

这样就编写好了一个```node```静态服务器的工具。

## 3. 处理第三方模块

我们的做法是当代码中使用了第三方模块(```node_modules```中的文件)，可以通过修改第三方模块的路径给他一个标识，然后在服务器中拿到这个标识来处理这个模块。

首先需要修改第三方模块的路径，这里需要一个新的中间件来实现。判断一下当前返回给浏览器的文件是否是```javascript```，只需要看响应头中的```content-type```。如果是```javascript```需要找到这个文件中引入的模块路径。```ctx.body```就是返回给浏览器的内容文件。这里的数据是一个```stream```，需要转换成字符串来处理。

```js

const stream2string = (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', chunk => {chunks.push(chunk)})
        stream.on('end', () => { resolve(Buffer.concat(chunks).toString('utf-8'))})
        stream.on('error', reject)
    })
}

// 修改第三方模块路径
app.use(async (ctx, next) => {
    if (ctx.type === 'application/javascript') {
        const con