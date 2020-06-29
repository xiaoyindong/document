## 1. 概述

```Koa```的设计思想是中间件，类似于流水线。涉及```数据交互```、```cookie```、```session```、```router```以及模板引擎。```koa v1```基于```generator```，```koa v2```基于```generator + async + await```，```koa v3```基于```await```。

## 2. 搭建简单服务器

```s
npm i koa koa-static koa-better-body koa-convert koa-router
```

```koa```：主体，自身带```cookie```功能。

```koa-static```：静态文件。

```koa-better-body```：管理请求，```get```，```post```，```upload```。

```koa-convert```：中间件过度koa版本兼容。

```koa-router```：路由。

```koa```丢弃了原生```node```的写法，```express```保留原生```node```写法，```koa```强依赖```router```，必须用```router```。

```js
const koa = require('koa');
const router = require('koa-router');
const server = new koa();
server.listen(8080);

const rout1 = router();
server.use(rout1.routes());
rq.get('/a', async (ctx, next) => {
    // ctx.req 原生req对象
    // ctx.request 封装好的req对象
    // ctx.res 原生的res
    // ctx.response 封装好的response
    // ctx.request.headers 获取请求头
    ctx.response.status = 403; // 设置状态码
    ctx.response.set('a', 12); // 设置响应头
    ctx.response.body = 'abc'; // 设置返回参数
})

// co