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

global是全局版，可以在浏览器中通过script标签导入，导入js之后会增加一个全局的vue对象。

browser是浏览器的原生版，可以在浏览器中通过script的type为module的方式导入。

bundler版本没有打包所有的代码，需要配合打包工具来使用，使用es modules的方式打包。通过脚手架默认导入的就是vue.runtime.esm-bundler.js版本，有点是体积最小，在项目打包的时候可以根据开发者使用的功能按需打包。

## 4. Composition API

Composition学习的最好方式是查看官方的RFC，(https://github.com/vuejs/rfcs)。

Vue2在开发中小型项目的时候已经很好用了，但是使用Vue2开发需要长期迭代和维护大型项目的时候也会有一些限制，在大型项目中可能有一些功能比较复杂的组件，在看别人开发的组件的时候可能比较难以理解。

Vue2开发的组件使用的是Options API，使用一个包含描述组件选项的对象来创建组件，这种方式经常使用，创建组件的时候经常设置data, methods, props，生命周期等，这些选项组成了对象来描述组件。如果看他人开发的组件可能会难以看懂，因为同一个功能的代码会涉及data, methods等多个配置。多个功能就会导致配置凌乱。

Composition API是vue3新增的一组API，是一组基于函数的API，让我们可以更灵活的组织组件的逻辑。这样的好处是查看某个逻辑的时候只需要关注某个函数即可。比如下面的postion只需要关注usePosition函数, 不需要关注其他逻辑。

```js
import { reactive, onMounted, onUnmonted } from 'vue';
function useMousePosition () {
    const position = reactive({ x: 0, y: 0 });
    const update = (e) => {
        position.x = e.pageX;
        position.y = e.pageY;
    }
    onMounted(() => {
        window.addEventListener('mousemove', update);
    })
    onUnmounted(() => {
        window.removeEventListener('mousemove', update)
    })
    return position;
}

export default {
    setup() {
        const position = useMousePosition();
        return {
            position
        }
    }
}
```

在Option API中，同一逻辑的代码被拆分到了很多的位置不方便阅读，Composition API可以保证统一逻辑的代码聚集在同一个位置，还可以提供给其他组件使用。

Vue3中两种API都是支持的。

## 5. 性能提升

Vue3中的性能提升可以从下面3个方面来说

1. 响应式系统升级

Vue2中响应式系统的核心使用的是Object.defineProperty这在初始化的时候会遍历data中的全部成员，通过defineProperty将属性转换成get和set，如果属性是对象的话还需要递归遍历，这些都是在初始化时定义的。

Vue3使用Proxy对象重写了响应式系统，Proexy的性能本身就比defineProperty好，另外Proxy可以拦截对象的所有操作，不需要初始化的时候遍历所有的属性，另外如果有多层属性嵌套的话只有访问某个属性的时候才会递归处理。

Proxy默认就可以监听到动态新增的属性，而Vue2中不具备这样的功能，如果动态添加需要重新使用defineProperty设置，Vue2也监听不到属性的删除对数组的索引和length属性也无法监听。

2. 优化编译

通过优化编译和重写虚拟DOM让首次渲染和更新的性能也有了大幅度的提升。

vue2中diff的过程会跳过静态根节点因为静态跟节点的内容不会发生变化，也就是vue2中通过标记根节点优化了diff的过程，但是在vue2中静态节点仍旧需要进行diff，这个过程没有优化。

vue3中为了提高性能在编译的时候会标记提升所有的静态节点，然后diff的时候只需要对比动态节点的内容，另外在Vue3中新引入了一个Fragments也就是片段的特性，模板中不需要再创建一个唯一的根节点，模板里面可以直接放文本内容，或者很多同级的标签。这个功能需要升级vetur插件。

也就是说vue3中在编译的过程中会通过标记和提升静态节点，通过patch flag将来在diff的时候会跳过静态根节点只需要更新动态节点中的内容，极大的提升了diff的性能。

通过事件处理函数的缓存减少了不必要的更新操作。

3. 源码体积

vue3中移除了一些不常用的API，比如inline-template, filter等，可以让最终代码的体积变小。filter可以通过method计算属性来实现，另外vue3对tree-shaking的支持更好，tree-shaking依赖es modules, 也就是ES6的模块化结构。

通过编译阶段的静态分析找到没有引入的模块，在打包的时候直接过滤掉，让打包后的体积更小。vue3在设计之初就考虑到了tree-shaking, 内置的组件和指令都是按需引入的。除此之外vue3中的很多api都是支持tree-shaking的。所以vue3中新增的一些api如果你没有使用的话这部分代码是不会被打包的，只会打包你所使用的api。

但是默认的核心模块都会被打包。

vue3在设计的时候就考虑到了性能的问题，通过代码的优化编译的优化或者打包来提高性能。

## 6. Vite

伴随Vue3的推出vue的作者还推出了自己的构建工具vite。vite比过去基于webpack的cli更加快速。

介绍vite之前我们先回顾一下浏览器中使用ES Modules的方式。

除了IE的现代浏览器都已经支持了ES Module的语法，也就是使用import导入模块，使用export导出模块。在网页中可以直接通过script导入模块，只需要type设置为module。

标记为module的script标签默认是延迟加载的类似于script标签加入defer属性，type为module的标签相当于省略了defer，他是在当前文档解析完成也就是dom树生成之后并且在DOMContentLoaded事件之前执行。

```html
<script ype="module" src="./index.js"></script>
```

vite的快就是使用浏览器支持的ES Module的方式，避免开发环境下打包从而提升开发速度。

Vite在开发环境下不需要打包，因为在开发模式下Vite使用浏览器原生支持额ES Module加载模块，支持ES Module的浏览器使用script标签加载模块，正因为他不需要打包，所以开发模式打开页面基本是秒开的。

Vue-CLi在开发模式下首先会打包整个项目，如果项目比较大速度会特别慢，Vue会开启一个测试服务器，他会拦截浏览器发送的请求，浏览器会向服务器发送请求获取相应的模块，vite会对浏览器不识别的模块进行处理比如后缀名为.vue的文件，会在服务器对.vue文件进行编译将编译过后的文件返回给浏览器。

使用这样的方式让vite具备快速冷启动，按需编译，模块热更新等优点，并且模块热更新的性能与模块总数无关，无论有多少模块HMR的速度始终比较快。

vite在生产环境下使用rollup打包，rollup是基于浏览器原生的ES Module进行打包，不需要使用babel将import转换成require以及一些响应的辅助函数。因此打包的体积会比webpack打包的体积更小。现在的浏览器基本都已经支持ES Module的方式打包模块。

vite有两种创建项目的方式，一种是创建基于vue3的项目。

```s
npm init vite-app my-project
cd my-project
npm install
npm run dev
```

还有一种方式是基于模板创建项目，可以让他支持其他的框架。

```s
npm init vite-app --template react
npm init vite-app --template preact
```

vite开启的web服务器会劫持.vue的请求，首先会把.vue文件解析成.js文件，并且把响应头中的content-type设置为applicaton/javascript目的是告诉浏览器返回的是一个js脚本。
