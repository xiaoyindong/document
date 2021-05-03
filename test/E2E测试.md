## 1. 概述

E2E（end to end）端对端测试是最直观可以理解的测试类型，在前端应用程序中，端到端测试可以从用户的视角通过真实浏览器自动检查应用程序是否正常工作。

E2E吧整个系统当做一个黑盒，测试人员模拟真实用户在浏览器中操作UI，测试在真实浏览器环境中测试，测试出的问题可能是前端也可能是后端导致的，比如用户登录注册，加入购物车，订单结算等。

E2E测试一般是由QA测试工程师来做，稍小的项目可能根据测试用例操作一遍就完了，稍大一点的会写一些自动化测试代码。

前端E2E主要的业务流程可能会写E2E，不过规模要小很多，主要目的是便于给PM展示业务流程，便于修改Bug之后的回归。

E2E测试有点是真实的测试环境，更容易获得程序的信心，缺点是端到端测试运行不够快，启动浏览器需要占用几秒钟，网站响应速度又慢，通常一套端到端测试需要30分钟的运行时间，如果应用程序完全依赖于端到端测试，那么测试套件将需要数小时运行时间。端到端测试的另一个问题是调试起来比较困难，需要打开浏览器并逐步完成用户操作以重新bug。本地运行这个调试过程已经很糟糕了，如果是在持续集成的服务器上运行那调试将会更加糟糕。

常用的测试框架有Selenum，Cypress，Nightwatch，WebdriverIO，playright。

## 2. Cypress安装

[官网https://www.cypress.io](https://www.cypress.io)，[安装文档](https://docs.cypress.io/guides/getting-started/installing-cypress#System-requirements)

```s
npm install cypress --save-dev
# 启动
npx cypress open
```

启动后会自动打开一个类似的浏览器窗口，这个是测试管理器。同时会在项目中生成一个cypress目录，目录里面有4个子目录fixtures是测试数据，integration里面的examples是测试代码文件。plugins是插件，support是相关的支持配置。

在测试管理器里面可以点击测试用例，就会开始跑对应的测试。

首先添加一个测试文件integration/sample_spec.js，这里默认使用的mocha，断言使用的chai。

```js
describe('My First Test', () => {
  it('Does not do much!', () => {
    expect(true).to.equal(true)
  })
})
```

新增或删除的测试文件，默认都会自动更新到测试管理器里面。可以点击直接运行。

访问指定的网页，比如打开百度的网址，查看是否包含百度一下的按钮。

```js
describe('My First Test', () => {
  it('Visits the Kitchen Sink', () => {
    cy.visit('https://www.baidu.com');

    cy.contains('百度一下');
  })
})
```

模拟用户行为，找到输入框，输入内容，点击百度一下按钮。

```js
describe('My First Test', () => {
  it('Visits the Kitchen Sink', () => {
    cy.visit('https://www.baidu.com');
    // 找到输入框 输入Hello World 敲击回车
    cy.get('#kw').type('Hello World{enter}');
    // 验证是否包含 百度百科内容
    cy.contains('百度百科');
  })
})
```
