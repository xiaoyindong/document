## 1. 概述

从我们接触前端开始，每个项目的根目录下一般都会有一个```package.json```文件，这个文件定义了当前项目所需要的各种模块，以及项目的配置信息（比如名称、版本、许可证等）。

当运行```npm install```命令的时候，会根据```package.json```文件中的配置自动下载所需的模块，也就是配置项目所需的运行和开发环境。

比如下面这个文件，只存在简单的项目名称和版本号。

```json
{
  "name" : "yindong",
  "version" : "1.0.0"
}
```

```package.json```文件是一个```JSON```对象，这从他的后缀名```.json```就可以看出来，该对象的每一个成员就是当前项目的一项设置。比如name就是项目名称，version是版本号。

当然很多人其实并不关心```package.json```的配置，他们应用的更多的是```dependencies```或```devDependencies```配置。

下面是一个更完整的```package.json```文件，详细解释一下每个字段的真实含义。

```json
{
    "name": "yindong",
    "version":"0.0.1",
    "description": "antd-theme",
    "keywords":["node.js","antd", "theme"],
    "homepage": "https://zhiqianduan.com",
    "bugs":{"url":"http://path/to/bug","email":"yindong@xxxx.com"},
    "license": "ISC",
    "author": "yindong",
    "contributors":[{"name":"yindong","email":"yindong@xxxx.com"}],
    "files": "",
    "main": "./dist/default.js",
    "bin": "",
    "man": "",
    "directories": "",
    "repository": {
		"type": "git",
		"url": "https://path/to/url"
	},
    "scripts": {
      "start": "webpack serve --config webpack.config.dev.js --progress"
    },
    "config": { "port" : "8080" },
    "dependencies": {},
    "devDependencies": {
        "@babel/core": "^7.14.3",
        "@babel/preset-env": "^7.14.4",
        "@babel/preset-react": "^7.13.13",
        "babel-loader": "^8.2.2",
        "babel-plugin-import": "^1.13.3",
        "glob": "^7.1.7",
        "less": "^3.9.0",
        "less-loader": "^9.0.0",
        "style-loader": "^2.0.0",
        "webpack": "^5.38.1",
        "webpack-cli": "^4.7.0",
        "webpack-dev-server": "^3.11.2"
    },
    "peerDependencies": {
        "tea": "2.x"
    },
    "bundledDependencies": [
        "renderized", "super-streams"
    ],
    "engines": {"node": "0.10.x"},
	  "os" : [ "win32", "darwin", "linux" ],
    "cpu" : [ "x64", "ia32" ],
    "private": false,
    "publishConfig": {}
  }
  
```

## 2. name 字段

```package.json```文件中最重要的就是```name```和```version```字段，这两项是必填的。名称和版本一起构成一个标识符，该标识符被认为是完全唯一的。对包的更改应该与对版本的更改一起进行。

```name```必须小于等于 ```214``` 个字符，不能以```.```或```_```开头，不能有大写字母，因为名称最终成为URL的一部分因此不能包含任何非URL安全字符。
```npm```官方建议我们不要使用与核心节点模块相同的名称。不要在名称中加```js```或```node```。如果需要可以使用```engines```来指定运行环境。

该名称会作为参数传递给```require```，因此它应该是简短的，但也需要具有合理的描述性。

## 3. version 字段

```version```一般的格式是```x.x.x```并且需要遵循该规则。

```package.json```文件中最重要的就是```name```和```version```字段，这两项是必填的。名称和版本一起构成一个标识符，该标识符被认为是完全唯一的。每次发布时```version```不能与已存在的一致。

## 4. description 字段

```description```是一个字符串，用于编写描述信息。有助于人们在```npm```库中搜索的时候发现你的模块。

## 5. keywords 字段

```keywords```是一个字符串组成的数组，有助于人们在```npm```库中搜索的时候发现你的模块。

## 6. homepage 字段

```homepage```项目的主页地址。

## 7. bugs 字段

```bugs```用于项目问题的反馈issue地址或者一个邮箱。

```json
"bugs": { 
  "url" : "https://github.com/owner/project/issues",
  "email" : "project@hostname.com"
}
```

## 8. license 字段

```license```是当前项目的协议，让用户知道他们有何权限来使用你的模块，以及使用该模块有哪些限制。

```json
"license" : "BSD-3-Clause"
```

## 9. author 字段、contributors 字段

```author```是具体一个人，```contributors```表示一群人，他们都表示当前项目的共享者。同时每个人都是一个对象。具有```name```字段和可选的```url```及```email```字段。

```json
"author": {
  "name" : "yindong",
  "email" : "yindong@xx.com",
  "url" : "https://zhiqianduan.com/"
}
```

也可以写成一个字符串

```json
"author": "yindong yindong@xx.com (https://zhiqianduan.com/)"
```

## 10. files 字段

```files```属性的值是一个数组，内容是模块下文件名或者文件夹名，如果是文件夹名，则文件夹下所有的文件也会被包含进来（除非文件被另一些配置排除了）

可以在模块根目录下创建一个```.npmignore```文件，写在这个文件里边的文件即便被写在```files```属性里边也会被排除在外，这个文件的写法与```.gitignore```类似。

## 11. main 字段

```main```字段指定了加载的入口文件，```require```导入的时候就会加载这个文件。这个字段的默认值是模块根目录下面的```index.js```。

## 12. bin 字段

```bin```项用来指定每个内部命令对应的可执行文件的位置。如果你编写的是一个```node```工具的时候一定会用到```bin```字段。

当我们编写一个```cli```工具的时候，需要指定工具的运行命令，比如常用的```webpack```模块，他的运行命令就是```webpack```。

```json
"bin": {
  "webpack": "bin/index.js",
}
```

当我们执行```webpack```命令的时候就会执行```bin/index.js```文件中的代码。

在模块以依赖的方式被安装，如果存在```bin```选项。在```node_modules/.bin/```生成对应的文件，
```Npm```会寻找这个文件，在```node_modules/.bin/```目录下建立符号链接。由于```node_modules/.bin/```目录会在运行时加入系统的```PATH```变量，因此在运行npm时，就可以不带路径，直接通过命令来调用这些脚本。

所有```node_modules/.bin/```目录下的命令，都可以用```npm run [命令]`