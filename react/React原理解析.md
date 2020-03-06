## 1. JSX是什么

弄懂```JSX```对理解虚拟```DOM```有很重要的作用，```JSX```只是看起来像```HTML```，实际上它是```JavaScript```，在```React```代码执行之前Babel会将```JSX```编译为```React API```。

```jsx
// 编译前
<div className="content">
    <h3>Hello React</h3>
    <p>React is great</p>
</div>
// 编译后
React.createElement(
    'div',
    {
        className: 'content'
    },
    React.createElement('h3', null, 'Hello World'),
    React.createElement('p', null, 'React is greate')
)
```


```React.createElement```代表一个具体的节点元素，第一个参数是节点名称，第二个是节点属性，后面的参数是子节点列表。可以自己在babeljs.is网站试验一下。

React.createElement是用来创建虚拟DOM的，返回的是一个虚拟DOM对象。然后React再将虚拟DOM转换为真实DOM最终显示到页面中。

jsx在运行时会被Babel转换为React.createElement对象，React.createElement会被React转换成虚拟DOM对象，虚拟DOM对象又会被React转换成真实DOM对象。

JSX语法的出现就是为了让React开发人员编写用户界面代码更加轻松。

## 2. 虚拟DOM

在React中，每个DOM对象都有一个对应的虚拟DOM对象，他是DOM对象的JavaScript表现形式，其实就是使用JavaScript对象来描述DOM对象信息，比如DOM对象的类型是什么，它身上有哪些属性，它拥有哪些子元素。

可以把虚拟DOM对象理解为DOM对象的一个副本，不过虚拟DOM不能直接显示在屏幕上。虚拟DOM就是为了解决React操作DOM的性能问题。

```jsx
// 编译前
<div className="content">
    <h3>Hello React</h3>
    <p>React is great</p>
</div>
// 编译后
{
    type: "div",
    props: { className: "content"},
    children: [
        {
            type: "h3",
            props: null,
            children: [
                {
                    type: "text",
                    props: {
                        textContent: "Hello React"
                    }
                }
            ]
        },
        {
            type: "p",
            props: null,
            children: [
                {
                    type: "text",
                    props: {
                        textContent: "React is greate"
                    }
                }
            ]
        }
    ]
}
```

React采用最小化的DOM操作来提升DOM操作的优势，只更新需要更新的，在React第一次创建DOM对象的时候会为每一个DOM对象创建虚拟的DOM对象，在DOM对象发生更新之前React会更新所有的虚拟DOM对象, 然后将更新前的虚拟DOM和更新后的虚拟DOM进行对比，找到变更的DOM对象，只将发生变化的DOM更新到页面中从而提升了js操作DOM的性能。

虽然在操作真实DOM之前进行的虚拟DOM更新和对比的操作，但是由于JS操作自有对象效率是很高的，成本几乎可以忽略不计的。

在React代码执行前，JSX会被Babel转换为React.createElement方法的调用，在调用createElement方法时会传入元素的类型，元素的属性，以及元素的子元素，createElement方法的返回值为构建好的虚拟DOM对象。这里我们自己来实现一个createElement方法。

createElement方法接收type, props, childrens三个参数。分别表示标签类型，标签属性和标签子元素。在这个方法中要返回一个虚拟DOM对象，在这个对象中有个type属性其实就是参数传入的值，接着是props和children。

```js
function createElement(type, props, ...children) {
    return {
        type,
        props,
        children
    }
}
```

我们这里使用TinyReact来分析React代码。首先要配置babel将jsx编译为Tiny的createElement方法，这样方便我们调试

.babelrc

```JSON
{
    "presets": [
        "@babel/preset-env",
        [
            "@babel/preset-react",
            {
                "pragma": "TinyReact.createElement"
            }
        ]
    ]
}
```

脚手架仓库自取地址 [链接](https://github.com/xiaoyindong/tinyReact)

src/index.js

```jsx
import TinyReact from "./TinyReact"

const virtualDOM = (
  <div className="container">
    <h1>你好 我是虚拟DOM</h1>
  </div>
)

console.log(virtualDOM);
```

控制台打印结果。

```JSON
{
    "type": "div",
    "props": {
        "className": "container"
    },
    "children": [
        {
            "type":"h1",
             "props":null,
            "children": [
                "你好 我是虚拟DOM"
            ]
        }
    ]
}
```

这里我们就打印出来一个简单的虚拟DOM，不过也有一个问题，这里的文本节点"你好 我是虚拟DOM"直接以字符串添加到了children数组中，这是不对的，正确的做法应该是文本节点也应该是一个虚拟DOM对象。

我们只需要循环children数组，判断如果不是一个对象就认为他是一个文本节点，我们将它替换成一个对象，

```js
function createElement(type, props, ...children) {
    // 遍历children对象
    const childElements = [].concat(...children).map(child => {
        if(child instanceof Object) {
        return child; // 是对象直接返回
        } else {
        // 不是对象 调用createElement方法生成一个对象
        return createElement('text', { textContent: child });
        }
    })
    return {
    type,
    props,
    children: childElements
    }
}
```

文本节点变成了一个对象。

```JSON
{
    "type": "div",
    "props": {
        "className": "container"
    },
    "children": [
        {
            "type":"h1",
             "props":null,
            "children": [
                {
                    "type":"text",
                    "props": {
                        "textContent": "你好 我是虚拟DOM"
                    },
                    "children": []
                }
            ]
        }
    ]
}
```

我们都知道在组件模板中如果是布尔值或者null值，节点是不显示的。我们这里需要处理一下。

```jsx
<div className="container">
    <h1>你好 我是虚拟DOM</h1>
    {
        1 === 2 && <h1>布尔值节点</h1>
    }
</div>
```

```js
function createElement(type, props, ...children) {
  // 遍历children对象
  const childElements = [].concat(...children).reduce((result, child) => {
    // 判断child不能是布尔也不能是null
    // 因为使用reduce，所以result是前一次循环的返回值，最终返回result就可以
    if (child !== false && child !== true && child !== null) {
      if (child instanceof Object) {
        result.push(child); // 是对象直接返回
      } else {
        // 不是对象 调用createElement方法生成一个对象
        result.push(createElement('text', {
          textContent: child
        }));
      }
    }
    return result;
  }, [])
  return {
    type,
    props,
    children: childElements
  }
}
```

我们还需要将children放入到props中，只需要使用Object.assign将props和children合并返回就可以了。

```js
return {
    type,
    props: Object.assign({ children: childElements}, props),
    children: childElements
}
```

## 3. 虚拟DOM转换为真实DOM

我们要定义一个render方法,。

src/tinyReact/render.js

这个方法要接收三个参数，第一个参数是虚拟DOM，第二个参数是要渲染到的页面元素，第三个参数是旧的虚拟DOM用于进行对比。render方法的主要作用就是将虚拟DOM转换为真实DOM并且渲染到页面中。

```js
import diff from './diff'

function render(virtualDOM, container, oldDOM) {
    diff(virtualDOM, container, oldDOM);
}
```

需要在diff方法中进行一次处理，如果旧的虚拟DOM存在就进行对比，如果不存在就直接将当前的虚拟DOM放置在container中。

src/tinyReact/diff.js

```js
import mountElement from './mountElement';

function diff (virtualDOM, container, oldDOM) {
    // 判断oldDOM是否在巡
    if (!oldDOM) {
        return mountElement(virtualDOM, container);
    }
}
```

要判断需要转换的虚拟DOM是组件还是普通的标签。需要分别进行处理, 这里我们先默认只有原生jsx标签，写死调用mountNativeElement方法。

src/tinyReact/mountElement.js

```js
import mountNativeElement from './mountNativeElement';

function mountElement(virtualDOM, container) {
    // 处理原生的jsx和组件的jsx
    mountNativeElement(virtualDOM, container);
}
```


mountNativeElement文件用于将原生的虚拟DOM转换成真实的DOM，这里调用createDOMElement方法来实现。

src/tinyReact/mountNativeElement.js

```js
import createDOMElement from './createDOMElement';

function mountNativeElement(virtualDOM, container) {
    // 将虚拟dom转换成真实的对象
    let newElement = createDOMElement(virtualDOM);
    // 将转换之后的DOM对象放在页面中
    container.appendChild(newElement);
}
```

创建真实DOM的方法单独定义文件，方便复用。需要判断如果是元素节点就创建相应的元素，如果是文本节点就创建对应的文本。然后通过递归的方式创建子节点。最后将我们创建的这个节点放在指定的容器container中就可以了。

src/tinyReact/createDOMElement.js

```js
import mountElement from "./mountElement";

function createDOMElement(virtualDOM) {
    let newElement = null;
    if (virtualDOM.type === 'text') {
        // 文