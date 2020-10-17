## 1. 概述

为了提高代码的可维护性，vue3的代码全部使用TypeScript重写。因为大型项目的开发都推荐使用类型化的语言，在编码的过程中检查类型问题。

vue3.0使用Monorepo的方式来管理项目源代码，使用一个项目来管理多个包，把不同功能的代码放在不同的package中管理，这样每个功能模块划分都很明确，模块之间的依赖关系都很明确，这个的话每个模块都可以单独发布单独测试单独使用。

## 2. package目录结构

```s
packages/
    compiler-core # 和平台无关的编译器
    compiler-dom # 浏览器下的编译器，依赖于core
    compiler-sfc # 用来编译单文件组件 依赖core和dom
    compiler-ssr # 服务端渲染的编译器 依赖dom
    reactivity # 数据响应式系统
    runtime-core # 和平台无关的运行时
    runtime-test # 针对浏览器的运行时，处理原生dom的api，事件 针对测试的轻量运行时，是一颗对象dom树，所以可以运行在所有js环境中
    server-renderer # 用于服务端渲染
    shared # 内部使用的公共api
    size-check # 私有package，treeshaking之后检查包体积
    template-explorer # 浏览器运行的实时编译组件
    vue # 构建完整版vue，依赖compiler和runtime
```

## 3. 版本更新

vue3.0在构建的时候和vue2.0类似都构建了不同的版本，和vue2不同的是vue3不在构建umd模块化的方式，因为这种方式会让代码更加冗余。

3.0的版本中将seajs，esmodules和自执行函数分别打包到了不同的文件当中，在vue的dist中存放了vue3的所有构建版本。

cjs就是commonjs的模块化方式，包含vue.cjs.js开发版和vue.cjs.prod.js的压缩生产版，他们都是完整的vue，区别只是是否压缩。

global是全局版，可以在浏览器中通