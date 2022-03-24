## 1. 概述

```fis```是百度前端团队推出的一款构建系统，只是现在用的人比较少，官方也很久没有更新```fis```了。

相比于```gulp```和```grunt```，```fis```的核心特点是高度继承，他将前端日常开发的任务和构建任务都继承到了内部，这样开发者就可以用过简单的配置去配置需要的功能。

```fis```中提供了一款```webserver```，可以方便的调试构建结果，这一系列的在```glup```和```grunt```中都需要手动配置。

## 2. 使用

需要安装，之后我们就可以使用他了。

```s
npm install fis3

fis3 release
```

```release```命令会将构建任务临时构建到一个文件夹中，一般在用户目录下，如果需要指定目录可以通过```-d```，会构建到项目根目录的```output```中。

```s
fis3 release -d output
```

```fis```首要解决的是资源定位问题，开发的过程中不需要关心正式环境的资源定位问题，```fis```构建的时候会自动找到。

```fis```也支持```config```文件配置```fis-conf.js```。

```js
fs.match('*.{js,css,ping}', {
    release: '/assets/$0'
})
```

除了资源定位还可以编译和压缩等。```fis```的配置文件相当于声明式的配置方式，通过```match```方法指定一个选择器，选择构建过程中的文件，后面的选项就是对于选中文件的配置。比如对```sass```文件进行处理。

```js
fis.match('**/*.scss', {
    parser: fis.plugin('node-sass'),
    optimizer: fis.plugin('clean-css'),
    rExt: '.css' // 修改扩展名
})
```

针对```js```的转换也类似。

```js
fis.match('**/*.js', {
    optimizer: fis.plugin('uglify-js'),
    parser: fis.plugin('babel-6.x')
})
```

[官方文档](http://fis.baidu.com/fis3/index.html)
