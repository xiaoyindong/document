## 1. 概述

传统的```js```和```css```都没有模块的概念，后来在```js```界陆续有了```CommonJS```和```ES Module```来解决模块化。```CSS-in-JS```就是可以用```模块化```的方式组织```css```, 其主要是依托于了```js```的模块化方案。

```CSS-in-JS```不是指某一个具体的库，是指组织```css```代码的一种方式，代码库有```styled-component```和```emotion```。

## 2. 案例演示

button1.js

```js
import styled from '@emotion/styled'

export const Button = styled.button`
    color: red;
`
```

在传统的```css```中所有的样式文件运行在一个全局作用域，比如说一个```class```可以匹配全局的任意元素，随着项目成长，```css```会变得越来越难以阻止，最终导致失控。

```CSS-in-JS```可以通过生成独特的操作符，来实现作用域的效果。

下面就是```CSS-in-JS```自动生成的的样式。

```css
.css-1c4ktv6 > * {
    margin-top: 0;
    margin-bottom: 0;
}
```

使用```someHash```函数生成一个独特的```className```

```js
// 定义
const css = styledBlock => {
    const className = someHash(styledBlock);
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .${className} {
            ${styleBlock}
        }
    `;
    document.head.appendChild(styleEl);
    return className;
}
// 使用
const className = css(`
    color: red;
    padding: 20px
`)
```

### 1. 隐式依赖, 样式难以追踪

传统的```css```样式是按层级编写的，比如下面这样:

```css
.target .name h1 {
    color: red;
}
body #container h1 {
    color: green;
}
```

这个```h1```元素最终显示为什么颜色，假如想要追踪这个影响```h1```的样式，还是比较难以确定的。

使用```CSS-in-JS```的方案就简单直接，易于追踪。

```js
export const Title = styled.h1`
    color: green;
`
<Title>文字颜色</Title>
```

### 2. 使用变量

传统的```css```里面没有变量，但是在```CSS-in-JS```中就可以方便的控制变量。

```js
const Container = styled.div(props => ({
    display: 'flex',
    flexDirection: props.column || 'column'
}))
```

### 3. 解耦css和html

```css```选择器与```html```元素名称是耦合的

```css
.target .name h1 {
    color: red;
}
body #container h1