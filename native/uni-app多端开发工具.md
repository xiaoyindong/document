## 1. 概述

作为前端开发人员，单纯的```web```端开发已经无法满足业务需求，```微信小程序```，```安卓app```，```苹果app```，甚至是```windows```桌面端开发都成了需要掌握的技能。市面上各种跨平台开发解决方案层出不穷，比较有代表性的就是```UniApp```，```Flutter```，```React Native```，```Taro```，```Weex```等等。

```UniApp```是```dcloud```公司研发的基于```Vue.js```技术开发所有前端应用的框架。开发人员上手快，学习成本低，随着如今```UniApp```生态逐渐趋于成熟，基于```UniApp```开发多端项目，已经是很多中小企业常用的技术解决方案。

他可以让一套代码发布多个平台，比如```安卓```，```ios```，```H5```，```小程序```。

## 2. uni-app的优势

1. 开发者、案例数量更多，几十万应用。

2. 平台能力不受限，通过条件编译 + 平台特有API

3. 性能更好的Hybrid框架。

4. 周边生态丰富，有上千个插件，支持npm，小程序和sdk，兼容mpvue兼容weex

5. 学习成本低，基于通用的前端技术栈。

6. 开发成本低。

```uni-app```使用```vue.js```开发，在发布到```H5```时，支持所有的```vue```的语法，发布到```app```和```小程序```时，实现了部分的```vue```语法。

```uni-app```组件标签靠近小程序规范，接口能力也靠近微信小程序规范。完整的微信小程序生命周期。

## 3. uni-app核心知识

```uni-app```遵循```vue```单文件组件的规范，组件标签靠近小程序规范，接口能力靠近微信小程序规范，完整的小程序生命周期。数据绑定及事件处理同Vue规范，为了兼容多端运行，建议使用```flex```布局进行开发。

## 4. uni-app特色

在```uni-app```中使用条件编辑，支持不同的平台书写不同的代码块。

| 条件编译写法 | 说明 |
| ------- | ------- |
| #ifdef APP-PLUS 代码块 #endif| 仅出现在App平台下的代码 |
| #ifndef H5 代码块 #endif| 除了H5平台，其他平台均存在 |
| #ifdef H5 || MP-WEIXIN 代码块 #endif| 在H5平台或微信小程序平台存在的代码，只有```||```没有```&&``` |

```app```端的```nvue```开发，为了给```app```端做到原生的体验```uni-app```提供了一个后缀```nvue```的文件，```nvue```内置了一个```weex```的渲染引擎，给```app```提供了一个原生的渲染能力，在```nvue```中我们既可使用```weex```的组件```api```也可以使用```uni-app```的组件和```api```，这就相当于```nvue```为````weex````渲染引擎补充了大量```uni-app```的组件和```api```。

```html5+```引擎可以帮我们在```app```端调用原生的插件，比如一些比较复杂的功能纯前端很难做到的时候可以使用安卓或者```ios```的插件来去实现这些功能。```nvue```和```html5+```只能在```APP```端去使用。

## 5. 搭建开发环境

首先需要安装[HbuilderX](https://www.dcloud.io/hbuilderx.html)。

```app```开发版包含很多插件，标准版不包含插件，这里推荐开发板，然后按照提示一直下一步安装就可以了。第一次使用需要登录，直接注册登录就可以了。

### 1. 新建项目

点击左上角的加号，选择新建项目，在弹出的窗口中选择```uni-app```项目去创建工程就可以了。这里可以选择其他的类型项目。项目名称就是自己项目的名称，还有存放位置都可以自己选择。模板可以按自己喜欢选择，选择默认模板。

是否启用```unicloud```，也就是帮我们自己搭建一个云后台，不需要创建服务。这里也是看自己，暂时不选择。

也可以使用```vue-cli```初始化项目

```s
vue create -p dcloudio/uni-preset-vue test-o-uniapp
```

### 2. 运行调试

可以点击顶部的运行菜单，可以运行在浏览器，手机，小程序等等都可以。

```uni-app```的生命周期:

## 6. 应用生命周期

onLaunch: 初始化完成执行，全局只会执行一次

onShow: 启动或者从后台进入前台执行 

onHide: 应用从前台进入后台执行

onError: 报错时触发

onUniNViewMessage: 对nvue页面发送的数据进行监听

## 7. 页面生命周期

onload: 页面加载的时候触发

onReady: 监听页面的初次渲染完成

onShow: 监听页面显示

onHide: 页面隐藏

onUnload: 页面卸载

onTabItemTap: 监听tabbar的生命周期

## 8. 组件生命周期

beforeCreate: 在实例初始化之后，事件配置之前被调用

create: 实例创建完成之后被调用，挂载之前

mounted: 挂载之后调用

destroyed: 实例销毁之后调用

## 9. 基础配置

### 1. 平台配置

微信小程序：在开发者工具的设置菜单，点击安全，确保服务端口是开启状态。在```HX```中的偏好设置，在运行配置中，找到小程序运行配置，选择微信开发者工具的路径就可以了。配置之后点击运行，选择微信开发者工具，编译完成就会启动，这里要求使用稳定版开发者工具。

```app```真机，模拟器：安卓真机和```ios```模拟器的使用，首先安卓真机已经通过数据线和电脑点击好了，然后手机的设置中关于手机找到版本号单击```5```次会打开开发人员选项，打开```usb```调试，选择传输文件。这个时候在```HX```的运行中可以选择运行到设备，这个时候会在我们的手机中安装一个基座，然后重启项目就可以了。```ios```真机链接到电脑之后直接就可以在运行的设备中找到。

```IOS```模拟器调试需要```mac```安装了```xcode```，然后再```xcode```的偏好设置中找到```components```中找到模拟器，选择一个我们需要的，点击下面的```check and install```安装，安装之后重启```HX```, 运行就可以看到模拟器了。

H5: 运行的时候选择浏览器就可以了，如果找不到可以在偏好设置中，找到运行配置，然后找到浏览器的路径就可以了。

### 2. 项目结构

components: 自动以组件的目录

pages: 页面存放目录

static: 静态文件资源目录

unpackage: 编译后的文件存放目录

utils: 共用的工具类

common: 共用的文件

app.vue: app.js全局文件

main.js 应用入口

manifest.json: 项目配置, 启动图，sdk，图标配置。

pages.json: 页面配置，注册页面地址，每个页面配置，全局页面配置

readme.md: 项目说明

uni.scss: 全局注册的scss

## 10. 使用scss

在```style```标签中添加```lang="scss"```, 如果未安装可以在工具栏点击插件，找到```scss```编译点击安装就可以了。

## 11. uniCloud

云函数:

```js
exports.main = async (event, context) => {
    return event;
}
```

云数据库:

可以读写基于```noSql```的```json```数据库。

```js
const db = uniCloud.database();
const collection = db.collection('user');

exports.main = async (event, context) => {
    // 将token写入数据集
    collection.where({
        name: event.data.name,
        password: event.data.password
    }).update({
        token: event.token,
        token_time: event.timestamp
    });
    // 获取用户信息
    const user_info = await collection.where({
        name: event.data.name
    }).get();
    // 返回给前端
    return {
        code: 200,
        msg: '登录成功',
        data.user_info.data
    }
}
```

云存储和```CDN```: 可以前端直传```cdn```和云存储。

小程序自身提供云开发

配置云开发环境: 

创建项目的时候开启```unicloud```选项，创建之后项目中就会多出一个```cloudfunctions```文件夹，然后在```manifest.json```中获取到应用标识，然后在```cloudfunctions```文件夹右键创建服务空间，填写一个名称点击创建就可以了。这个时候在```cloudfunctions```文件夹右键就可以选择我们创建的服务空间。这就可以创建云函数之类的，然后右键上传部署，就可以部署到云开发平台。

web控制台: 在```cloudfunctions```右键打开```uniCloud Web```控制台，就会访问控制台，可以看到所有的空间，选中详情我们创建的空间，可以去删除

云数据库: 可以直接通过云函数操作数据库，也可以直接在控制台进行操作。可以在```cloudfunctions```右键创建```db_init.json```,这个文件可以配置数据库初始化。右键可以初始化云数据库。

还可以使用云存储: 存储图片地址之类的。使用```uniCloud.uploadFile```可以直接上传文件。

H5域名配置: 是因为浏览器跨域的问题，发行```H5```站点的时候允许在这里配置安全域名。

云函数就是运行在云端的函数，```event```是客户端调用云函数时候传入的参数，```context```包含了调用信息和运行状态，可以通过他查看运行信息比如操作系统之类的。

```js
exports.main = async (event, context) => {
    return event;
}
```

使用云函数就是使用```uniCloud.callFunction```来操作，```name```就是云函数的文件。

```js
uniCloud.callFunction({
    name: "login",
    data: {
        name: 'yd',
        age: 18
    },
    success(res) {
        console.log('云函数调用成功', res)
    },
    fail(error) {
        console.log(error)
    }
})
```

选择图片和上传图片

```js
uni.chooseImage({
    count: 1,
    success(res) {
        const tempFilePath = res.tempFilePaths[0]; // 获取图片blob地址
        uniCloud.uploadFile({ // 上传云端
            filePath: tempFilePath,
            success(res) {
                console.log(res);
            }
        })
    }
})
```

删除图片

```js
uniCloud.deleteFile({
    fileList: ['图片地址'],
    success(res) {
        console.log(res);
    }
})
```

获取手机系统信息

```js
uni.getSystemInfoSync();
```

获取小程序胶囊的信息

```js
uni.getMenuButtonBoundingClientRect();
```

vuex是内置模块，不需要安装

```js
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({
    state: { // 数据源
        historyList: []
    },
    mutations: { // 改变数据源的数据
        SET_HISTORY_LIST(state, history) {
            state.historyList = history;
        }
    }
    actions: {
        set_history({commit, state}, history) { // commit可以调用mutations中的方法，第一个参数，第二个参数是传入的参数。
            commit('SET_HISTORY_LIST', history);
        }
    }
})

const app = new Vue({
    ...store
})

```

自定义事件:

自定义事件只能在打开的页面触发，

```js
uni.$on('aaaa', (res) => {
    console.log(res);
})

uni.$emit('aaaa', 123);
```

富文本:

gaoyia-parse组件

```js
import uParse from '@/components/gaoyia-parse/parse.vue';
import '@/components/gaoyia-parse/parse.css';

export default {
    components: [uParse],
}

<u-parse :content="富文本内容" :noData="没有数据的时候展示"></u-parse>
```

## 12. 项目优化与平台兼容

微信小程序：

小程序中的渲染```list-card```渲染的时候如果慢渲染会导致页面错乱，最好是给外层添加一个父标签占位。

支付宝小程序：

打开支付宝小程序开发者工具，打开就可以了。

支付宝小程序隐藏导航栏是不生效的。需要使用条件判断处理一下。

## 13. 项目发行与打包

H5:

```h5```发行比较简单，在```manifest.json```中配置应用标识，可以获取到，然后再找到h5配置，在配置指南中找到每个字段对应的含义。点击工具栏的发行，选择```h5```端的发行，会打包出一个```dist```文件。

小程序:

首先需要填写小程序的```appId```，然后编译就可以了。

app:

```ios```和```安卓```打包需要一定的原生开发经验，```uni-app```可以使用云打包的方式，通过```dcloud```去打包，打包之后下载下来就可以了，使用的是```dcloud```的证书这就简单多了。首先打开```manifest.json```要配置```appid```，也要配置应用名称，描述，版本名称版本号要更新，必须要高于上一个版本。

配置完成之后点击发行，原生```app```云打包。安卓填写包名就可以了，安卓证书如果有可以使用自有的，如果没有使用公共证书。老版证书可以不要。```ios```配置只兼容```iphone```就可以了，证书有的话可以添加，如果没有可以使用越狱证书。 控制台会提示打包状态。可以在发行菜单查询打包状态。打包成功后控制台会出现下载地址。测试可以使用自定义基座。不要一直打包。

也可以使用本地打包，通过本地打包指南可以知道打包过程。
