gatsby是一个基于React的静态站点生成器，允许通过React开发应用，当应用开发完成后他会将react应用转换成静态的html应用。

官网: https://www.gatsbyjs.org/

gastby主要解决的是首屏加载时间长和搜索引擎优化。

我们知道静态的html具有访问速度快，利于SEO优化，部署简单这些优点。

gastby是基于 React 和 GraphQL. 结合了 webpack, babel, react-router 等前端领域中最先进的工具. 对开发人员来说开发体验非常好。

gastby采用数据层和UI层分离而不失 SEO 的现代前端开发模式. 对SEO非常友好。

采用数据预读取的方式, 在浏览器空闲的时候预先读取链接对应的页面内容. 使静态页面拥有 SPA 应用的用户体验, 用户体验好。

数据来源多样化: Headless CMS, markdown, API等多种方式获取数据。

在gatsby内部功能是插件化, gatsby 中提供了丰富且功能强大的各种类型的插件, 用什么装什么不至于使项目臃肿。如果没有插件我们还可以自己去开发插件。

## 创建项目

首先需要全集安装脚手架工具

```s
npm install gatsby-cli -g
```

```s
# 创建项目 后面地址是创建项目使用的模板
gatsby new project-name https://github.com/gatsbyjs/gatsby-starter-hello-world

# 启动
gatsby develop or npm start

# 访问：
localhost:8000
```

## 创建页面

1. 路由方式创建

gatsby 框架内置基于文件的路由系统, 页面组件被放置在 src/pages 文件夹中，只要文件放在pages文件夹中就可以在浏览器当中以文件名来访问。

```s
localhost:8000/list
```

2. 编程方式创建

基于同一个模板创建多个HTML页面，有多少数据就创建多少页面，比如商品详情页面，有多少商品就生成多少商品详情展示页面。

这里遵循是是CommonJS规范，所以底部要使用module.exports导出方法，这个方法会在构建的时候执行，如果修改需要重新构建项目。

我们需要在项目根目录创建gatsby-node.js文件，名称是固定的，不可改变。

在这个文件中创建createPages方法用于创建页面，gatsby在构建应用是会调用该方法的。

```js
function createPages({ actions }) {
    const { createPage } = actions;
    // 获取模板绝对路径
    // 获取组件所需的数据
    // 根据模板和数据创建页面
}

module.exports = {  createPages }
```

我们先去创建一个模板，src/templates/index.js, 在这个文件中显示详细信息。这个文件就是一个react组件文件。

```js
import React from 'react';

export default function Index(props) {
    console.log(props);
    return <div>Hello</div>
}
```

然后我们再createPages方法中使用这个文件。这个方法会使用数据和模板创建对应数据的页面，所以数据是一个数组，数据中需要存储页面的访问地址。

创建页面使用createPage方法，他接收三个一个对象参数，对象中需要指定模板的绝对路径、创建出来的页面访问地址和传递给模板的数据。

```js
function createPages({ actions }) {
    const { createPage } = actions;
    // 获取模板绝对路径
    const template = require.resolve('./src/template/index.js')l
    // 获取组件所需的数据  slug就是模板访问的路径
    const data = [{slug: 'yd1', name: 'yd1'}, {slug: 'yd2', name: 'yd2'}]
    // 根据模板和数据创建页面
    data.forEach(item => {
        createPage({
            component: template, // 模板绝对路径
            path: item.slug, // 访问地址
            context: item, // 传递给模板的数据
        })
    })
}
```

这个时候重新构建就可以看到效果了，控制台会输出我们之前打印的props。也就是createPage传入的参数。

我们需要在模板中获取数据显示在页面中。

```js
import React from 'react';

export default function Index(props) {
    const { pageContext } = props;
    return <div>Hello {pageContext.name}</div>
}
```

## Link组件

在 Gatsby 框架中页面跳转通过 Link 组件实现, Link组件的to属性就是要跳转到的目标路径。

```js
import { Link } from 'gatsby';

<Link to="/list">list</Link>
```

## GraphQL 数据层

当启动程序的时候Gatsby会先从外部数据源请求数据，然后将数据统一存储在自己的数据层当中。

因为外部数据格式不同，在 Gatsby 框架中提供了一个统一的存储数据的地方，叫做数据层，让我们规范数据。

组件可以直接从数据层查询数据。数据层使用 GraphQL 构建。

我们可以通过: localhost:8000/___graphql 访问。

```s
localhost:8000/