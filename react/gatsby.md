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
localhost:8000/___graphql
```

1. 页面组件

如果是页面组件可以通过graphql方法来查询，这个方法在gatsby中直接导入就可以。

在组件文件中直接导出查询命令就可以了, 框架执行查询并将结果传递给组件的 prop 对象. 存储在 props 对象的 data 属性中。

```js
import { graphql } from 'gatsby';

function PageComponent({data}) {
    return <div>{data.site.siteMetadata.title}</div>
}

export const query = graphql`
    query {
        site {
            siteMetadata {
                title
            }
        }
    }
`
```

2. 非页面组件

如果是非页面组件，是不可以直接导出查询命令的，需要手动的执行查询命令才能得到结果，需要依赖useStaticQuery执行查询命令，返回结果是查询结果。

```js
import { graphql, useStaticQuery } from 'gatsby'

const data = useStaticQuery(graphql`
    query {
        site {
            siteMetadata {
                title
            }
        }
    }
`)
```

gatsby允许将源数据存储在配置中，然后gatsby会把网站源数据添加到数据层中，然后就可以在组件中拿到数据了。

gatsby-config.js

siteMetadata就是我们定义的数据。

```js
modules.exports = {
    siteMetadata: {
        title: 'gatsby'
    }
}
```

## 插件

Gatsby 框架内置插件系统, 插件是扩展应用程序为应用添加功能的最好的方式。官方提供了很多非常好用的插件，如果你找不到还可以自己编写插件，而且可以发布给别人用。

在 Gatsby 中有三种类型的插件: 分别为数据源插件 ( source ), 数据转换插件 ( transformer ), 功能插件 ( plugin )

数据源插件负责从应用外部获取数据，将数据统一放在 Gatsby 的数据层中。

数据转换插件负责转换特定类型的数据的格式，比如我们可以将 markdown 文件中的内容转换为对象形式。

最后一种是功能插件他是为应用提供功能，比如通过插件让应用支持 Less 或者 TypeScript。

插件的命名是有规范的，数据源插件名称中必须包含source，数据转换插件必须包含transformer，功能插件名称必须包含plugin。

插件查找地址: https://www.gatsbyjs.org/plugins/

我们这么有一个需求，要将本地 JSON 文件中的数据放入数据层需要用到两个插件。

gatsby-source-filesystem插件用于将本地文件中的数据添加至数据层。

gatsby-transformer-json插件用于将原始JSON字符串转换为JavaScript对象。

插件的使用很简单，首先需要下载插件，使用npm install下载就可以了。

下载之后配置插件，我们需要在根目录的gatsby-cinfog.js文件中配置插件，在plugins属性中添加我们的插件。

plugins是一个数组，每一项都是一个插件，他支持字符串和对象两种类型，如果需要配置插件参数就是用对象，resolve指明要配置什么插件，options就是配置选项，name表示资源类别，这个是自定义的这里写json，path是数据源文件路径。

gatsby-transformer-json插件不需要配置，直接写上名字就可以了。

```js
modules.exports = {
    plugins: [
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "json",
                path: `${__dirname}/data.json`
            }
        },
        "gatsby-transformer-json"
    ]
}
```

重新构建项目之后我们就可以在组件中通过graphql查询到数据了。

## 图像优化

之所以要进行图像优化是因为图像文件和数据文件不在源代码中的同一位置，图像文件在static文件夹中，数据文件在json中，我们希望他们能在同一个位置，因为他们是有关联关系的。

第二个问题是图像路径基于构建站点的绝对路径, 而不是相对于数据的路径, 难以分析出图片的真实位置。

第三个问题是图像没有经过任何优化操作，比如说压缩体积，响应式图片等等。

要对图像优化需要用到几个插件。

第一个就是gatsby-source-filesystem他是用于将本地文件信息添加至数据层当中，第二个是gatsby-plugin-sharp:他是用于提供本地图像的处理功能(调整图像尺寸, 压缩图像体积 等等)，第三个是gatsby-transformer-sharp是将 gatsby-plugin-sharp 插件处理后的图像信息添加到数据层。最后我们要用到gatsby-image，这是一个React 组件, 优化图像显示, 他是基于 gatsby-transformer-sharp 插件转化后的数据。

通过这些插件我们对图片做了生成多个具有不同宽度的图像版本, 为图像设置 srcset 和 sizes 属性, 因此无论您的设备是什么宽度都可以加载到合适大小的图片。大屏显示器就显示大图片，小屏显示器就显示小图片。

使用"模糊处理"技术, 其中将一个20px宽的小图像显示为占位符, 直到实际图像下载完成为止。

```s
npm install gatsby-plugin-sharp gatsby-transformer-sharp gatsby-image
```

安装之后我们创建一个json文件夹，将json数据放在这个文件夹中，别忘记修改gatsby-source-filesystem插件中对应的位置。接着我们再把images文件夹从static文件夹中移动到json文件夹中。让图片和数据放在一起。

我们在json中添加一个图片数据，别忘了找一张图片放在images文件夹中，假设文件名为1.jpg

json/data.json
```js
[
    {
        "title": "图片",
        "url": "./images/1.jpg"
    }
]
```

我们需要在plugins中添加两个插件。

```js
modules.exports = {
    plugins: [
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "json",
                path: `${__dirname}/json/data.json`
            }
        },
        "gatsby-transformer-json",
        "gatsby-plugin-sharp",
        "gatsby-transformer-sharp"
    ]
}
```

重启项目就生效了。在allDataJson中就可以找到数据和图片。

```s
allDataJson.nodes.url.childImagesSharp
```

```js
import React from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image'

export default function Product({ data }) {
    console.log(data.allDataJson.nodes);
    const node = data.allDataJson.nodes[0];
    return <div>
        <Img fluid={node.url.childImageSharp.fluid}/>   
    </div>
}

export const query = graphql`
    query {
        allProductsJson {
            nodes {
                title
                url {
                    childImageSharp {
                        fluid {
                            as