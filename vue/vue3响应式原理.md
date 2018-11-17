## 1. 概述

Vue3重写了响应式系统，和Vue2相比底层采用Proxy对象实现，在初始化的时候不需要遍历所有的属性再把属性通过defineProperty转换成get和set。另外如果有多层属性嵌套的话只有访问某个属性的时候才会递归处理下一级的属性所以Vue3中响应式系统的性能要比Vue2好。

Vue3的响应式系统可以监听动态添加的属性还可以监听属性的删除操作，以及数组的索引以及length属性的修改操作。另外Vue3的响应式系统还可以作为模块单独使用。

接下来我们自己实现Vue3响应式系统的核心函数(reactive/ref/toRefs/computed/effect/track/trigger)来学习一下响应式原理。

首先我们使用Proxy来实现响应式中的第一个函数reactive。

## 2. reactive

reactive接收一个参数，首先要判断这个参数是否是一个对象，如果不是直接返回，reactive只能将对象转换成响应式对象，这是和ref不同的地方。

接着会创建拦截器对象handler，其中抱哈get，set，deleteProperty等拦截方法，最后创建并返回Proxy对象。

```js
// 判断是否是一个对象
const isObject = val => val !== null && typeof val === 'object'
// 如果是对象则调用reactive
const convert= target => isObject(target) ? reactive(target) : target
// 判断对象是否存在key属性
const haOwnProperty = Object.prototype.hasOwnProperty
const hasOwn = (target, key) => haOwnProperty.call(target, key)

export function reactive (target) {
    if (!isObject(target)) {
        // 如果不是对象直接返回
        return target
    }

    const handler = {
        get (target, key, receiver) {
            // 收集依赖
            const result = Reflect.get(target, key, receiver)
            // 如果属性是对象则需要递归处理
            return convert(result)
        },
        set (target, key, value, receiver) {
            const oldValue = Reflect.get(target, key, receiver)
            let result = true;
            // 需要判断当前传入的新值和oldValue是否相等，如果不相等再去覆盖旧值，并且触发更新
            if (oldValue !== value) {
                result = Reflect.set(target, key, value, receiver)
                // 触发更新...
            }
            // set方法需要返回布尔值
            return result;
        },
        deleteProperty (target, key) {
            // 首先要判断当前target中是否有自己的key属性
            // 如果存在key属性，并且删除要触发更新
            const hasKey = hasOwn(target, key)
            const result = Reflect.deleteProperty(target, key)
            if (hasKey && result) {
                // 触发更新...
            }
            return result;
        }
    }
    return new Proxy(target, handler)
}
```

至此reactive函数就写完了，接着我们来编写一下收集依赖的过程。

在依赖收集的过程会创建三个集合，分别是targetMap,depsMap以及dep。

其中targetMap是用来记录目标对象和字典他使用的是weakMap，key是目标对象，targetMap的值是depsMap, 类型是Map，这里面的key是目标对象的属性名称，值是一个Set集合,集合中存储的元素是Effect函数。因为可以多次调用同一个Effect在Effect访问同一个属性，这个时候这个属性会收集多次依赖对应多个Effect函数。

一个属性可以对应多个Effect函数，触发更新的时候可以通过属性找到对应的Effect函数，进行执行。

我们这里分别来实现一下effect和track两个函数。

effect函数接收一个函数作为参数，我们首先在外面定一个变量存储callback, 这样track函数就可以访问到callback了。

```js

let activeEffect = null;
export function effect (callback) {
    activeEffect = callback;
    // 访问响应式对象属性，收集依赖
    callback();
    // 依赖收集结束要置null
    activeEffect = null;
}
```

track函数接收两个参数目标对象和属性, 他的内部要将target存储到targetMap中。需要先定义一个这样的Map。

```js

let targetMap = new WeakMap()

export function track (target, key) {
    // 判断activeEffect是否存在
    if (!activeEffect) {
        return;
    }
    // depsMap存储对象和effect的对应关系
    let depsMap = targetMap.get(target)
    // 如果不存在则创建一个map存储到targetMap中
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }
    // 根据属性查找对应的dep对象
    let dep = depsMap.get(key)
    // dep是一个集合，用于存储属性所对应的effect函数
    if (!dep) {
        // 如果不存在，则创建一个新的集合添加到depsMap中
        depsMap.set(key, (dep = new Set()))
    }
    dep.add(activeEffect)
}
```

track是依赖收集的函数。需要在reactive函数的get方法中调用。

```js
get (target, key, receiver) {
    // 收集依赖
    track(target, key)
    const result = Reflect.get(target, key, receiver)
    // 如果属性是对象则需要递归处理
    return convert(result)
},
```

这样整个依赖收集就完成了。接着就要实现触发更新，对应的函数是trigger，这个过程和track的过程正好相反。

trigger函数接收两个参数，分别是target和key。

```js
export function trigger (target, key) {
    const depsMap = targetMap.get(target)
    // 如果没有找到直接返回
    if (!depsMap) {
        return;
    }
    const dep = depsMap.get(key)
    if (dep) {
        dep.forEach(effect => {
            effect()
        })
    }
}
```

trigger函数要在reactive函数中的set和deleteProperty中触发。

```js
set (target, key, value, receiver) {
    const oldValue = Reflect.get(target, key, receiver)
    let result = true;
    // 需要判断当前传入的新值和oldValue是否相等，如果不相等再去覆盖旧值，并且触发更新
    if (oldValue !== value) {
        result = Reflect.set(target, key, value, receiver)
        // 触发更新...
        trigger(target, key)
    }
    // set方法需要返回布尔值
    return result;
},
deleteProperty (target, key) {
    // 首先要判断当前target中是否有自己的key属性
    // 如果存在key属性，并且删除要触发更新
    const hasKey = hasOwn(target, key)
    const result = Reflect.deleteProperty(target, key)
    if (hasKey && result) {
        // 触发更新...
        trigger(target, key)
    }
    return result;
}
```

## 3. ref

ref接收一个参数可以是原始值也可以是一个对象，如果传入的是对象并且是ref创建的对象则直接返回，如果是普通对象则调用reactive来创建响应式对象，否则创建一个只有value属性的响应式对象。

```js
export function ref (raw) {
    // 判断raw是否是ref创建的对象，如果是直接返回
    if (isObject(raw) && raw.__v__isRef) {
        return raw
    }

    // 之前已经定义过convert函数，如果参数是对象就会调用reactive函数创建响应式
    let value = convert(raw);

    const r = {
        __v__isRef: true,
        get value () {
            track(r, 'value')
            return value
        },
        set value (newValue) {
            // 判断新值和旧值是否相等
            if (newValue !== value) {
                raw = newValue
                value = convert(raw)
                // 触发更新
                trigger(r, 'value')
            }
        }
    }

    return r
}
```

## 4. toRefs

toRefs接收reactive函数返回的响应式对象，如果不是响应式对象则直接返回。将传入对象的所有属性转换成一个类似ref返回的对象将准换后的属性挂载到一个新的对象上返回。

```js
export function toRefs (proxy) {
    // 如果是数组创建一个相同长度的数组，否则返回一个空对象
    const ret = proxy instanceof Array ? new Array(proxy.length) : {}

    for (const key in proxy) {
        ret[key] = toProxyRef(proxy, key)
    }

    return ret;
}

function toProxyRef (proxy, key) {
    const r = {
        __v__isRef: true,
        get value () { // 这里已经是响应式对象了，所以不需要再收集依赖了
            return proxy[key]
        },
        set value (newValue) {
            proxy[key] = newValue
        }
    }
    return r
}
```

toRefs的作用其实是将reactive中的每个属性都变成响应式的。reactive方法会创建一个响应式的对象，但是如果将reactive返回的对象进行解构使用就不再是响应式了，toRefs的作用就是支持解构之后仍旧为响应式。

## 5. computed

接着再来模拟一下computed函数的内部实现

computed需要接收一个有返回值的函数作为参数，这个函数的返回值就是计算属性的值，需要监听函数内部响应式数据的变化，最后将函数执行的结果返回。

```js
export function computed (getter) {
    const result = ref()

    effect(() => (result.value = getter()))

    return result
}
```

computed函数会通过effect监听getter内部响应式数据的变化，因为在effect中执行getter的时候访问响应式数据的属性会去收集依赖，当数据变化会重新执行effect函数，将getter的结果再存储到result中。
