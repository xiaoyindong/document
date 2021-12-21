## 1. 基本语法

定义render函数，接收html字符串，和data参数。

```js
const render = (ejs = '', data = {}) => {

}
```

事例模板字符串如下:

```ejs
<body>
    <div><%= name %></div>
    <div><%= age %></div>
</body>
```

可以使用正则将<%= name %>匹配出来，只保留name。这里借助ES6的模板字符串。将name用${}包裹起来。

props中第2个值就是匹配到的变量。直接```props[1]```替换。

```js
[
  '<%= name %>',
  ' name ',
  16,
  '<body>\n    <div><%= name %></div>\n    <div><%= age %></div>\n</body>'
]
```

```js
const render = (ejs = '', data = {}) => {
    const html = ejs.replace(/<%=(.*?)%>/g, (...props) => {
        return '${' + props[1] + '}';
    });
}
```

## 2. Function

这里得到的html是一个模板字符串。可以通过Function执行一下。

```js
<body>
    <div>${ name }</div>
    <div>${ age }</div>
</body>
```

Function是一个构造函数，实例化后返回一个真正的函数，构造函数的最后一个参数是函数体的字符串，前面的参数都为形式参数。比如这里传入形参name，函数体通过console.log打印一句话。

```js
const func = new Function('name', 'console.log("我是通过Function构建的函数，我叫：" + name)');
// 执行函数，传入参数
func('yindong'); // 我是通过Function构建的函数，我叫：yindong
```

利用Function的能力可以将html模板字符串执行返回。函数字符串编写return，返回一个拼装好的模板字符串、

```js
const getHtml = (html, data) => {
    const func = new Function('data', `return \`${html}\`;`);
    return func(data);
}

const render = (ejs = '', data = {}) => {
    const html = ejs.replace(/<%=(.*?)%>/g, (...props) => {
        return '${' + props[1] + '}';
    });
    return getHtml(html, data);
}
```

## 3 with

这里render函数中props[1]的实际上是变量名称，也就是name和age，可以替换成data[props[1].trim()]，不过这样写会有一些问题，偷个懒利用with代码块的特性。

with语句用于扩展一个语句的作用域链。换句人话来说就是在with语句中使用的变量都会现在with中寻找，找不到才会向上寻找。

比如这里定义一个age数字和data对象，data中包含一个name字符串。with包裹的代码块中输出的name会先在data中寻找，age在data中并不存在，则会向上寻找。当然这个特性也是一个with不推荐使用的原因，因为不确定with语句中出现的变量是否是data中的。

```js
const age = 18;
const data = {
    name: 'yindong'
}

with(data) {
    console.log(name);
    console.log(age);
}
```

这里使用with改造一下getHtml函数。函数体用with包裹起来，data就是传入的参数data，这样with体中的所有使用的变量都从data中查找了。

```js
const getHtml = (html, data) => {
    const func = new Function('data', ` with(data) { return \`${html}\`; }`);
    return func(data);
}

const render = (ejs = '', data = {}) => {
    const html = ejs.replace(/<%=(.*?)%>/g, (...props) => {
        return '${' + props[1] + '}';
    });
    return getHtml(html, data);
}
```

这样就可以打印出真是的html了。

```html
<body>
    <div>yindong</div>
    <div>18</div>
</body>
```

## 4. ejs语句

这里扩展一下ejs，加上一个arr.join语句。

```ejs
<body>
    <div><%= name %></div>
    <div><%= age %></div>
    <div><%= arr.join('--') %></div>
</body>
```

```js
const data = {
    name: "yindong",
    age: 18,
    arr: [1, 2, 3, 4]
}

const html = fs.readFileSync('./html.ejs', 'utf-8');

const getHtml = (html, data) => {
    const func = new Function('data', ` with(data) { return \`${html}\`; }`);
    return func(data);
}

const render = (ejs = '', data = {}) => {
    const html = ejs.replace(/<%=(.*?)%>/g, (...props) => {
        return '${' + props[1] + '}';
    });
    return getHtml(html, data);
}

const result = render(html, data);

console.log(result);
```

可以发现ejs也是可以正常编译的。因为模板字符串支持arr.join语法，输入：

```html
<body>
    <div>yindong</div>
    <div>18</div>
    <div>1--2--3--4</div>
</body>
```

如果ejs中包含forEach语句，就比较复杂了。此时render函数就无法正常解析。

```ejs
<body>
    <div><%= name %></div>
    <div><%= age %></div>
    <% arr.forEach((item) => {%>
        <div><%= item %></div>
    <%})%>
</body>
```

这里分两步来处理。仔细观察可以发现，使用变量值得方式存在=号，而语句是没有=号的。可以对ejs字符串进行第一步处理，将<%=变量替换成对应的变量，也就是原本的render函数代码不变。

```js
const render = (ejs = '', data = {}) => {
    const html = ejs.replace(/<%=(.*?)%>/g, (...props) => {
        return '${' + props[1] + '}';
    });
    console.log(html);
}
```

```ejs
<body>
    <div>${ name }</div>
    <div>${ age }</div>
    <% arr.forEach((item) => {%>
        <div>${ item }</div>
    <%})%>
</body>
```

第二步比较绕一点，可以将上面的字符串处理成多个字符串拼接。简单举例，将a加上arr.forEach的结果再加上c转换为，str存储a，再拼接arr.forEach每项结果，再拼接c。这样就可以获得正确的字符串了。

```js
// 原始字符串
retrun `
    a
    <% arr.forEach((item) => {%>
        item
    <%})%>
    c
`
// 拼接后的
let str;
str = `a`;

arr.forEach((item) => {
    str += item;
});

str += c;

return str;
```

在第一步的结果上使用/<%(.*?)%>/g正则匹配出<%%>中间的内容。

```js
const render = (ejs = '', data = {}) => {
    let html = ejs.replace(/<%=(.*?)%>/g, (...props) => {
        return '${' + props[1] + '}';
    });
    html = html.replace(/<%(.*?)%>/g, (...props) => {
        return '`\r\n' + props[1] + '\r\n str += `';
    });
    console.log(html);
}
```

获取到的字符串长成这个样子。

```
<body>
    <div>${ name }</div>
    <div>${ age }</div>
    `
 arr.forEach((item) => {
 str += `
        <div>${ item }</div>
    `
})
 str += `
</body>
```

添加换行会更容易看一些。可以发现，第一部分是缺少首部\`的字符串，第二部分是用str存储了forEach循环内容的完整js部分，并且可执行。第三部分是缺少尾部\`的字符串。

```js
// 第一部分
<body>
    <div>${ name }</div>
    <div>${ age }</div>
    `

// 第二部分
 arr.forEach((item) => {
 str += `
        <div>${ item }</div>
    `
})

// 第三部分
 str += `
</body>
```

处理一下将字符串补齐，结尾通过return返回。

```js
// 第一部分
str = `<body>
    <div>${ name }</div>
    <div>${ age }</div>
    `

// 第二部分
 arr.forEach((item) => {
 str += `
        <div>${ item }</div>
    `
})

// 第三部分
 str += `
</body>
`

return str;
```

这部分逻辑可以在getHtml函数中添加，首先在with中定义str用于存储第一部分的字符串，尾部通过return 返回str字符串

```js
const getHtml = (html, data) => {
    const func = new Function('data', ` with(data) { var str = \`${html}\`; return str; }`);
    return func(data);
}
```

这样就可以实现执行ejs语句了。

```js
const data = {
    name: "yindong",
    age: 18,
    arr: [1, 2, 3, 4]
}

const html = fs.readFileSync('./html.ejs', 'utf-8');

const getHtml = (html, data) => {
    const func = new Function('data', ` with(data) { var str = \`${html}\`; return str; }`);
    return func(data);
}

const render = (ejs = '', data = {}) => {
    let html = ejs.replace(/<%=(.*?)%>/g, (...props) => {
        return '${' + props[1] + '}';
    });
    html = html.replace(/<%(.*?)%>/g, (...props) => {
        return '`\r\n' + props[1] + '\r\n str += `';
    });
    return getHtml(html, data);
}

const result = render(html, data);

console.log(result);
```

输出结果

```ejs
<body>
    <div>yindong</div>
    <div>18</div>

        <div>1</div>

        <div>2</div>

        <div>3</div>

        <div>4</div>

</body>
```

一个简单的ejs模板解释器就写完了。
