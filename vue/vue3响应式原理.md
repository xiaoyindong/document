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
            const oldValue = Reflect.get(target, key, r