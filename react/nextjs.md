Next.js是React服务端渲染应用框架，用于构建SEO友好的SPA应用。

在Next.js中支持两种预渲染方式，静态生成和服务端渲染，基于页面的路由系统路由零配置，自动代码拆分，优化页面加载速度。支持静态导出，可将应用导出为静态网站。内置CSS-IN-JS库styled-jsx。

方案成熟，可用于生产环境，世界许多公司都在使用。应用部署简单，拥有专属部署环境Vercel，也可以部署在其他环境。

## 创建Next.js项目

```js
npm init next-app next-guide
npm run dev
```

- 1. 创建页面

在Next.js中，页面是呗放置在pages文件夹中的React组件，组件需要被默认导出，组件文件中不需要引入React，页面地址与文件地址是对应的关系。

pages/list.js

```js
export default function List () {
    return <div>List</div>
}

// 访问
// localhost:3000/list.html
```

- 2. 页面跳转

要实现页面跳转需要用到一个组件Link, 默认是使用的Javacript进行页面转天，既SPA形式的跳转。

如果浏览器中JavaScript被禁用则会使用链接跳转。Link组件中不应添加除href属性以外的属性，其余属性添加到a标签上。

Link组件会通过预取功能自动优化应用程序以获得最佳性能。也就是当浏览器空闲的时候Link组件会预先去加载到Link中页面的内容，当我们访问的时候已经是家在完的，页面会很快。

```jsx
import Link from 'next/link';

<Link href="/list"><a title="title">list page</a></Link>
```
## 资源文件

应用程序跟目录中的public文件夹英语提供静态资源

通过以下形式进行访问, 不需要写出public路径。

pulic/images/1.jpg -> /images/1.jpg

1. 修改页面源数据

可以通过Head组件来进行修改, 可以定制网页的源数据。

```jsx
import Head from 'next/head';

<>
    <Head>
        <title>Index Page</title>
    </Head>
</>
```

2. CSS样式

为元素添加样式有多中，在Next.js中内置了styled-jsx, 他是一个css-in-