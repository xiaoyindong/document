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

Vue2中响应式系统