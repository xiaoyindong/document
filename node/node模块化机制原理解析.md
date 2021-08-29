## 1. 概述

人们常说```node```并不是一门新的编程语言，他只是```javascript```的运行时，运行时你可以简单地理解为运行```javascript```的环境。在大多数情况下会在浏览器中去运行```javascript```，有了```node```的出现，可以在```node```中去运行```javascript```，这意味着哪里安装了```node```或者浏览器，就可以在哪里运行```javascript```。

## 2. node模块化的实现

```node```中是自带模块化机制的，每个文件就是一个单独的模块，并且它遵循的是```CommonJS```规范，也就是使用```require```的方式导入模块，通过```module.export```的方式导出模块。

```node```模块的运行机制也很简单，其实就是在每一个模块外层包裹了一层函数，有了函数的包裹就可以实现代码间的作用域隔离。

你可能会说，我在写代码的时候并没有包裹函数呀，是的的确如此，这一层函数是```node```自动实现的，可以来测试一下。

新建一个```js```文件，在第一行打印一个并不存在的变量，比如打印```window```，在```node```中是没有```window```的。

```js
console.log(window);
```

通过```node```执行该文件，会发现报错信息如下。(请使用系统默认```cmd```执行命令)。

```s
(function (exports, require, module, __filename, __dirname) { console.log(window);
ReferenceError: window is not defined
    at Object.<anonymous> (/Users/choice/Desktop/node/main.js:1:75)
    at Module._compile (internal/modules/cjs/loader.js:689:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)
    at Module.load (internal/modules/cjs/loader.js:599:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:538:12)
    at Function.Module._load (internal/modules/cjs/loader.js:530:3)
    at Function.Module.runMain (internal/modules/cjs/loader.js:742:12)
    at startup (internal/bootstrap/node.js:279:19)
    at bootstrapNodeJSCore (internal/bootstrap/node.js:752:3)
```

可以看到报错的顶层有一个自执行的函数，, 函数中包含```exports```, ```require```, ```module```, ```__filename```, ```__dirname```这些常用的全局变量。

我在之前的《前端模块化发展历程》一文中介绍过。自执行函数也是前端模块化的实现方案之一，在早期前端没有模块化系统的时代，自执行函数可以很好的解决命名空间的问题，并且模块依赖的其他模块都可以通过参数传递进来。```cmd```和```amd```规范也都是依赖自执行函数实现的。


在模块系统中，每个文件就是一个模块，每个模块外面会自动套一个函数，并且定义了导出方式 ```module.exports```或者```exports```，同时也定义了导入方式```require```。

```js
let moduleA = (function() {
    module.exports = Promise;
    return module.exports;
})();
```

## 3. require加载模块

```require```依赖```node```中的```fs```模块来加载模块文件，```fs.readFile```读取到的是一个字符串。

在```javascrpt```中可以通过```eval```或者```new Function```的方式来将一个字符串转换成```js```代码来运行。

### 1. eval
```js
const name = 'yd';
const str = 'const a = 123; console.log(name)';
eval(str); // yd;
```

### 2