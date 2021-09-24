## 1. 概述

Composition API是vue3新增的api，依然可以使用options api。

调用createApp函数创建Vue实例，这里接收一个对象作为参数，这里的data不再支持对象必须是一个函数。

```html
<script type="module">
    import { createApp, reactive } from './node_modules/vue/dist/vue.esm-browser.js'

    const app = createApp({
        data() {
            return position: {
                x: 0,
                y: 0
            }
        }
    })

    app.mount('#app');
</script>
```

在模板中分别将x和y显示出来。

```html
<div id="app">
x: {{ position.x }}
<br />
y: {{ position.y }}
<div>
```

createApp是创建vue对象用的他会返回vue对象, 这个对象比vue2的对象成员要少很多，而且这些成员不再使用$开头，说明未来基本不再计划给对象新增成员。

Composition API在配置项中书写，这里会用到setup函数作为Composition API的入口，setup有两个参数第一个是props他的作用是接收外部传入的参数，并且它是一个响应式的对象不能被解构。第二个参数是context是一个对象。

setup需要返回一个对象，这个对象可以使用在模板，methods，computed以及生命周期中。setup会在props解析完毕，组件实例创建之前执行。在setup内部无法通过this获取组件实例。

```js
const app = createApp({
    setup() {
        const position = {
            x: 0,
            y: 0
        }
        // 这里的position并不是响应式的对象
        return {
            position
        }
    }
    mounted() {
        console.log(this.position);
    }
})
```

- reactive

setup中定义的position并不是响应式的，不过他的返回值却可以在methods等中使用。vue3提供reactive方法来将数据变成响应式。这里不使用observerable是为了避免和rxjs重名出现混淆。

```js
import { createApp, reactive } from './node_modules/vue/dist/vue.esm-browser.js'

....
    setup() {
        const position = reactive({
            x: 0,
            y: 0
        })
        // 这里的position并不是响应式的对象
        return {
            position
        }
    }
...
```

使用Composition API方式。

```js

import { createApp, reactive, onMounted, onUnmounted } from './node_modules/vue/dist/vue.esm-browser.js'

function useMousePosition () {
    const position = reactive({ x: 0, y: 0 });
    const update = (e) => {
        position.x = e.pageX;
        position.y = e.pageY;
    }
    onMounted(() => {
        