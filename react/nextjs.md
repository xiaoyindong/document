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

为元素添加样式有多中，在Next.js中内置了styled-jsx, 他是一个css-in-js库，允许在React组件中编写css，css仅作用域组件内部。

```jsx
<div>
    <div className="demo">test</div>
    <style jsx>{`
        .demo {
            color: red;
        }
    `}
    </style>
</div>
```

还有一种是css模块的方式，通过使用css模块功能，允许将组件的css样式编写在单独的css文件中，css模块约定样式文件的名称必须为组件文件名称.modules.css

index.module.css

```css
.p {
    color: green;
}
```

```js
import styles from './index.module.css';
<div className={styles.p}>test</div>
```

3. 全局样式文件

在 pages 文件夹中去新建 _app.js, 必须叫这个名字，不可修改的。

然后在项目根目录下创建 styles 文件夹, 并在其中创建 global.css，这个名字是可以随便修改的。

接着在 _app.js 中通过 import 引入 global.css，在_app.js中还要加入如下代码。

```js
export default function App({ Component, pageProps}) {
    return <Component {...pageProps} />
}
```

global.css

```css
body {
    background: red;
}
```

最后重新启动开发服务器就可以生效了。

## 预渲染

预渲染是指数据和HTML的拼接在服务器端提前完成。预渲染可以使 SEO 更加友好。预渲染会带来更好的用户体验, 可以无需运行 JavaScript 即可查看应用程序UI。

在 Next.js 中支持两种形式的预渲染: 静态生成和服务器端渲染，静态生成和服务器端渲染是生成 HTML 的时机不同。

静态生成: 静态生成是在构建时生成 HTML. 以后的每个请求都共用构建时生成好的 HTML。

服务器端渲染: 服务器端渲染是在请求时生成 HTML. 每个请求都会重新生成 HTML。

Next.js 允许开发者为每个页面选择不同的预渲染方式. 不同的预渲染方式拥有不同的特点. 应根据场景进行渲染，但建议大多数页面建议使用静态生成。

静态生成一次构建, 反复使用, 访问速度快. 因为页面都是事先生成好的。

适用场景：营销页面、博客文章、电子商务产品列表、帮助和文档。

服务器端渲染访问速度不如静态生成快, 但是由于每次请求都会重新渲染, 所以适用数据频繁更新的页面或页面内容随请求变化而变化的页面。

1. 静态生成

如果组件不需要在其他地方获取数据, 直接进行静态生成。

如果组件需要在其他地方获取数据, 在构建时 Next.js 会预先获取组件需要的数据, 然后再对组件进行静态生成。

getStaticProps 方法的作用是获取组件静态生成需要的数据. 并通过 props 的方式将数据传递给组件，该方法是一个异步函数, 需要在组件内部进行导出，在开发模式下, getStaticProps 改为在每个请求上运行。

getStaticProps这个方法是构建的时候运行的，也就是说他是运行在node上的，所以我们可以用node的语法编写，他也可以访问文件和数据库。

```js
import Head from 'next/head';
import styles from './list.moduls.css'

// 导出一个异步函数
export async function getStaticProps() {
    // 从文件系统，API，数据库中获取数据
    const data = ...
    // props属性的值将会传递给组件
    return {
        props: ... // 返回的数据
    }
}

export default function List(props) {
    // props中获取到getStaticProps中返回的props
    rteurn <>
        <Head>
            <title>Index Page</title>
        </Head>
        <div className={styles.demo}>test</div>
    </>
}
```

2. 服务端渲染

服务端渲染就是构建的时候不去生成html，在页面请求的时候才去动态的生成html返回给浏览器器，这里需要用到getServerSideProps。

同样的写法如果采用服务器端渲染, 需要在组件中导出 getServerSideProps 方法。方法中的context会携带客户端请求带过来的参数。

```js
export async function getServerSideProps(context) {
    return {
        props: {
            data: context.query
        }
    }
}

export default function List(props) {
    // props中获取到getStaticProps中返回的props
    console.log(props);
    rteurn <>
        <Head>
            <title>Index Page</title>
        </Head>
        <div className={styles.demo}>test</div>
    </>
}
```

3. 基于动态路由的静态渲染

基于参数为页面组件生成HTML页面，有多少参数就生成多少HTML页面，在构建应用时, 先获取用户可以访问的所有路由参数, 再根据路由参数获取具体数据, 然后根据数据生成静态 HTML。

创建基于动态路由的页面组件文件, 命名时在文件名称外面加上[], 比如[id].js。这里叫id那么返回值中的params对应的值也要叫id

导出异步函数 getStaticPaths, 用于获取所有用户可以访问的路由参数。

```js
export async function getStaticPaths() {
    // 获取所有用户可以访问的路由参数
    // props属性的值将会传递给组件
    return {
        // 返回固定格式的路由参数
        paths: [{params: {id: 1}}, {params: {id: 2}}],
        // 当用户访问的路由参数没有在当前函数中返回时，是否显示404，false是显示，true是不显示
        fallback: false
    }
}
```

如果fallback设置为true需要给页面一个等待状态，否则构建会不通过。

```js
// 判断服务端是否执行静态生成
import { useRouter } from 'next/router';

export default function List(props) {
    const router = useRouter();
    // 如果值为true就是正在静态生成
    if (router.isFallback) {
        return <div>loading</div>
    }
    rteurn <>
        <Head>
            <title>Index Page</title>
        </Head>
        <div className={styles.demo}>test</div>
    </>
}
```

最后导出异步函数getStaticProps, 用于根据路由参数获取具体的数据。

这里getStaticPaths 和 getStaticProps 只运行在服务器端, 永远不会运行在客户端, 甚至不会被打包到客户端 JavaScript 中, 意味着这里可以随意写服务器端代码, 比如查询数据库。

```js
export async function getStaticProps({params}) {
    // params => id: 1
    // 此处根据路由参数获取具体数据
    return {
        // 将数据传递到组件中进行静态页面的生成
        props: {}
    }
}
```

4. 自定义404页面

要创建自定义 404 页面, 需要在 pages 文件夹中创建 404.js 文件。

```js
export default function Custom404() {
    return <h1>404</h1>
}
```

## API Routes

API Routes 可以理解为接口, 客户端向服务器端发送请求获取数据的接口.

Next.js 应用允许 React 开发者编写服务器端代码创建数据接口.

在 pages/api 文件夹中创建 API Routes 文件. 比如 user.js

在文件中默认导出请求处理函数, 函数有两个参数, req 为请求对象, res 为响应对象.

当前 API Routes 可以接收任何 Http 请求方法.

```js
export default function(req, res) {
    res.status(200).send({id: 1, name: 'yd'})
}
```

不要在 getStaticPaths 或 getStaticProps 函数中访问 API Routes, 因为这两个函数就是在服务器端运行的,  可以直接写服务器端代码.

API Routes可以理解为中间层代理，我们将针对服务的请求发送到node中间层，中间层再去请求服务请求到之后再返回给前端。

```js
localhost:3000/api/user

{
    id: 1,
    name: 'yd'
}
```