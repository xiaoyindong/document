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
        window.addEventListener('mousemove', update);
    })
    onUnmounted(() => {
        window.removeEventListener('mousemove', update)
    })
    return position;
}

const app = createApp({
    setup() {
        const position = useMousePosition();
        // 这里的position并不是响应式的对象
        return {
            position
        }
    }
})
```

Composition API中存在reactive,toRefs，ref三个函数，他们都是创建响应式数据的。

setup中的代码如果我们修改一下，如下就不再是响应式了，因为我们使用reactive包装的是position对象，这里不使用position了所有无法实现响应式。但是使用position还显得比较冗杂。

```js
setup() {
    const {x, y} = useMousePosition();
    // 这里的position并不是响应式的对象
    return {
        x,
        y
    }
}
```
- toRefs

toRefs就是解决这样一个问题的，我们可以在useMousePosition返回值的位置将position使用toRefs包裹一下，这样就可以了。

```js
import { createApp, reactive, onMounted, onUnmounted, toRefs } from './node_modules/vue/dist/vue.esm-browser.js'

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
    return toRefs(position);
}
```

toRefs可以把一个响应式对象的成员也转换成响应式的。他要求传入的对象必须是一个代理对象也就是响应式对象。它内部会创建一个新的对象然后遍历传入的代理对象所有属性，将所有属性的值都转换成响应式对象，然后挂载到新创建的对象上然后将新创建的对象返回。

它内部会为代理对象的每一个对象属性创建一个具有value属性的对象，该对象是响应式的。value属性具有get和set，可以赋值和返回值。所以每一个属性都是响应式的。

- ref

这是一个函数，他的作用是将普通数据转换成响应式，和reactive不同的是，reactive是将对象转换成响应式，ref是将基本类型数据转换成响应式。

ref返回的是一个对象，这个对象只有一个value属性，并且value属性是有get和set的。ref返回的值访问的时候可以省略value，修改值的时候需要使用value。

```js
import { createApp, ref } from './node_modules/vue/dist/vue.esm-browser.js'

function useCount() {
    // 创建响应式
    const count = ref(0);
    return {
        count,
        add: () => {
            count.value++;
        }
    }
}

createApp({
    setup() {
        return {
            ...useCount()
        }
    }
}).mount('#app')
```

## 2. 计算属性

计算属性的作用是简化模板中的代码，缓存计算的结果当数据变化后才会重新计算，在vue3中可以在setup中通过computed函数来创建计算属性。

- 用法一

传入一个获取值的函数，函数内部依赖响应式的数据，当依赖的数据发生变化后会重新执行该函数获取数据。返回一个不可变的响应式对象类似于使用ref创建的对象。只有一个value属性，获取计算属性的值要通过value属性来获取。模板中使用计算属性可以省略value。

```js
createApp({
    setup() {
        const count = ref(1);
        const activeCount = computed(() => {
            return count.value;
        })
        return {
            count,
            add: () => {count.value + 1}
        }
    }
})
```

- 用法二

第二种用法是传入一个对象，这个对象具有get和set返回一个不可变的响应式对象。

```js
const count = ref(1);
const plusOne = computed({
    get: () => count.value + 1,
    set: (val) => {
        count.value = val - 1;
    }
})
```

## 3. watch

和computed类似，在setup函数中可以使用watch来创建一个侦听器，使用方式和之前使用this.$watch或选项中的watch作用是一样的，监听响应式的变化执行一个回调函数，可以获取到监听数据的新值和旧值。

watch有三个参数，第一个参数是监听的数据可以是一个获取值的函数监听这个函数返回值的变化，或者直接是一个ref或者reavtive返回的对象，还可以是数组，第二个参数是监听到数据变化之后执行的函数，这个函数有两个参数分别是新值和旧值。第三个参数是选项对象，可以传入两个选项deep深度监听和immediate立即执行，这个和vue2中是一样的。

watch的返回值是一个函数，用于取消监听。

```js
createApp({
    setup() {
        const question = ref('');
        // 这里第一个参数不再是字符串，和vue2中略有不同
        watch(question, (nValue, oValue) => {
            console.log(nValue, oValue);
        })
        return question;
    }
})
```

## 4. watchEffect

Vue3中提供一个新的函数WacthEffect, 他其实是watch函数的简化版本，内部实现和watch调用的同一个函数do watch, 不同点是watchEffect没有第二个回调函数参数。

watchEffect接收一个函数作为参数，他会监听函数内使用到的响应式数据的变化会立即执行一次这个函数。当数据变化后会重新运行该函数。返回值也是一个取消监听的函数。

```js
createApp({
    setup() {
        const count = ref(0);
        const stop = watchEffect(() => {
            console.log(count.value);
        })

        return {
            count,
            stop,
            add: () => {
                count.value + 1;
            }
        }
    }
})
```
