## 1. 概述

```Rollup```是一款基于```ES Module```的打包器，类似于```webpack```可以将项目中散落的细小模块打包为整块的代码，不用点是```Rollup```打包的模块可以更好的运行在浏览器或```nodeJs```环境。

从作用上来看```Rollup```与```webpack```非常类似，相比于```webpack```来说```Rollup```要小巧很多。```webpack```配合插件几乎可以完成前端工程化的绝大多数工作。```Rollup```仅是```ES Module```的打包器，并没有其他额外的功能。

```webpack```有对于开发者十分友好的```hmr```功能```Rollup中```则无法支持。```Rollup```诞生的目的并不是与```webpack```工具竞争，他的初衷只是希望提供一个高效的```ES Module```打包器，充分利用```ES Module```的各项特性构建出结构比较扁平，性能比较出众的类库。

## 2. 使用

这里准备一个简单的示例，使用```ES Module```方式组织代码模块化，示例的源代码包含三个文件，```message.js```以默认导出的方式导出了一个对象。

```js
export default {
    hi: 'Hey Guys, I am yd~'
}
```

```logger.js```中导出两个函数。

```js
export const log = msg => {
    console.log(msg);
}

export const error = msg => {
    conole.log('------ ERROR ------')
    console.log(msg);
}
```

```index.js```导入这两个模块，并且使用他们。

```js
import { log } from './logger';
import message from './message';

const msg = message.hi;
log(msg);
```

安装```rollup```对示例应用打包。

```s
yarn add rollup --dev
```

```rollup```自带```cli```程序，通过```yarn rollup```运行程序。可以发现，在不传递任何参数的情况下```rollup```会自动打印出帮助信息，帮助信息开始的位置就表示应该通过参数去指定一个打包入口文件。打包入口是```src```下面的```index.js```文件。

```s
yarn rollup ./src/index.js
```

此时还应该指定一个代码的输出格式，可以使用```--format```参数指定输出的格式比如```iife```也自执行函数的格式。

```s
yarn rollup ./src/index.js --format iife
```

还可以通过```--file```指定文件的输出路径，比如这里指定```dist```文件夹下的```bundle.js```，这样打包结果就会输出到```dist```文件当中。

```s
yarn rollup ./src/index.js --format iife --file dist/bundle.js
```

```rollup```打包结果惊人的简洁，基本上和手写的代码是一样的，相比于```webpack```中大量的引导代码，这里的输出结果几乎没有任何的多余代码。

```rollup```只是把打包过程中各个模块按照模块的依赖顺序先后的拼接到一起，而且仔细观察打包结果会发现，在输出结果中只会保留用到的部分，对于未引用的部分都没有输出。```rollup```默认自动开启```tree-shaking```优化输出的结果，```tree-shaking```概念最早也是在```rollup```工具中提出的。

```js
(function () {
    'use strict';

    const log = msg => {
        console.log(msg);
    };

    var message = {
        hi: 'Hey Guys, I am yd~'
    };

    const msg = message.hi;
    log(msg);

}());

```

## 3. 配置文件

```rollup```支持以配置文件的方式去配置打包过程中的各项参数，可以在项目的跟目录下新建一个```rollup.config.js```配置文件。这个文件是运行在```node```环境中，不过```rollup```自身会额外处理这个配置文件，所以可以直接使用```ES Modules```。

在这个文件中需要导出一个配置对象，对象中通过```input```属性指定打包的入口文件路径。通过```output```指定输出的相关配置，```output```属性要求是一个对象，在```output```对象中可以使用```file```属性指定输出的文件名。```format```属性可以用来指定输出格式。

```js
export default {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'iife'
    }
}
```

需要通过```--config```参数来表明使用项目中的配置文件，默认是不去读取配置文件的。

```js
yarn rollup --config rollup.config.js
```

## 4. 使用插件

```rollup```自身的功能就是```ES```模块的合并打包，如果项目有更高级别的需求，例如想去加载其他类型的资源文件，或者是要在代码中导入```CommonJS```模块，又或者是想要编译```ECMAScript```的新特性。这些额外的需求，```rollup```同样支持使用插件的方式扩展实现，而且插件是```rollup```唯一的扩展方式，他不像```webpack```中划分了```loader```，```plugin```和```minimize```这三种扩展方式。

尝试使用一个可以在代码中导入```JSON```文件的插件，这里使用的插件名字叫做```rollup-plugin-json```需要先安装这个插件。

```s
