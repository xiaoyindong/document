## 1. 打包工具的历史

模块化很好的解决了复杂应用开发中的代码组织问题，但随着引入模块化，又会产生一些新的问题。所使用的```ES Modules```本身就存在环境兼容问题，尽管现如今主流浏览器最新版本都已经支持这一特性。但是目前还没办法做到统一所有用户浏览器的使用情况，所以还需要解决兼容问题。其次通过模块化的方式，划分出的模块文件比较多，前端应用又是运行在浏览器当中的。应用中所需要的每一个文件，都需要从服务器中请求回来，这些零散的模块文件必将导致浏览器频繁请求，从而影响应用的工作效率。

对于整个开发过程而言，模块化肯定是有必要的，只是需要在原有的基础之上引入更好的方案或工具去解决上面几个问题，让开发者在应用的开发阶段可以享受模块化所带来的优势又不必担心模块化对生产环境所产生的一些影响。

首先希望有一个工具能够编译代码，就是将开发阶段包含新特性的代码直接转换为能够兼容绝大多数环境的代码，这样一来环境兼容问题也就不存在了。其次是能够将散落的模块文件打包到一起，这就解决了浏览器中频繁对模块文件发出请求的问题。

至于模块化文件划分，只是在开发阶段需要他，因为它能够更好的组织代码对于运行环境实际上是没有必要的，所以可以选择在开发阶段通过模块化的方式去编写。在生产阶段还是打包到同一个文件中，最后还需要支持不同种类的前端资源类型，这样就可以把前端开发过程当中所涉及到的样式、图片、字体等所有资源文件都当做模块使用，对于整个前端应用来讲就有了一个统一的模块化方案了。

前端领域目前有一些工具很好的解决了以上这几个问题，其中最为主流的就是```webpack```，```parcel```和```rollup```。以```webpack```为例，一些核心特性就很好的满足了上面所说的需求。

首先```webpack```作为一个模块打包工具(```Module Bundler```)他本身就可以解决模块化```js```代码打包的问题，通过```webpack```可以将一些零散的模块代码打包到同一个```js```文件中。对于代码中那些有环境兼容问题的代码可以在打包的过程中通过模块加载器(```Loader```)对其进行编译转换。其次，```webpack```还具备代码拆分(```Code Splitting```)的理念，能够将应用中所有的代码都按照需要进行打包。这样一来就不用担心代码全部打包到一起文件较大的问题了。

可以把应用加载过程中初次运行所必须的模块打包到一起，对于其他的那些模块单独存放。等应用工作过程中实际需要某个模块再异步加载这个模块从而实现增量加载或渐进式加载，这样就不用担心文件太碎或是文件太大这两个极端问题。

```webpack```支持在```js```中以模块化的方式载入任意类型的资源文件，例如在```webpack```当中可以通过```js```直接```import```一个```css```文件。这些```css```文件最终会通过```style```标签的形式工作，其他类型的文件也可以有类似的这种方式去实现。

## 2. 快速上手

```webpack``` 作为目前最主流的代码打包工具提供了一整套的前端项目模块化方案而不仅仅局限于对```js```的模块化。通过```webpack```提供的前端模块化方案，可以很轻松的对前端项目涉及到的所有的资源进行模块化。

这里有一个项目，目录中有个```src```文件夹，```src```中有两个文件 ```index.js``` 和 ```heading.js```， 在```src```同级有一个```index.html```文件。```heading.js```中默认导出一个用于创建元素的函数。

```js
export default () => {
    const element = document.createElement('h2');
    element.textContent = 'Hello word';
    element.addEventListener('click', () => {

    })
    return element;
}

```

```index.js```中导入模块并且使用了他。

```js
import createHeading from './heading.js';

const heading = createHeading();

document.body.append(heading);
```

在```index.html```中通过```script```标签以模块化的方式引入了```index.js```。

```html
<body>
    <script type="module" src="src/index.js"></script>
</body>
```

打开命令行通过```http-server .```工具运行起来。

```s
http-server .
```

可以看到正常的工作。下来引入```webpack```处理```js```模块。首先以通过```yarn init```的方式去初始化一个```package.json```。

```s
yarn init
```

完成过后安装```webpack```所需要的核心模块以及对应的```cli```模块。

```s
yarn add webpack webpack-cli --dev
```

有了```webpack```之后就可以打包```src```下面的```js```代码了。执行```yarn webpack```命令```webpack```会自动从```src```下面的```index.js```开始打包。

```s
yarn webpack
```

完成过后控制台会提，有两个```js```文件被打包到了一起，与之对应的是在项目的跟目录会多出一个```dist```目录，打包的结果就会存放在这个目录的```main.js```中。

回到```index.html```中，把```js```脚本文件的路径修改成```dist/main.js```，由于打包过程会把```import```和```export```转换掉，所以说已经不需要```type="module"```这种模块化的方式引入了。

```html
<body>
-    <script type="module" src="src/index.js"></script>
+    <script src="dist/main.js"></script>
</body>
```

再次启动服务，应用仍然可以正常工作。

```s
http-server .
```

可以把```webpack```命令放到```package.json```中的```script```，通过```yarn build```打包。

```json
"script": {
    "build": "webpack"
}
```

```s
yarn build
```

## 3. 配置文件

```webpack4.0```后的版本支持零配置打包，整个打包过程会按约定将```src/index.js```作为入口结果存放在```dist/main.js```中。很多时候需要自定义路径，例如入口文件是```src/main.js```，这就需要为```webpack```添加配置文件，在项目的跟目录添加```webpack.config.js```文件即可。这个文件运行在```node```环境也就说需要按照```Commonjs```的方式编写代码。

文件导出一个对象, 通过导出对象的属性可以完成相应的配置选项，例如```entry```属性指定```webpack```打包入口文件的路径。可以将其设置为```./src/main.js```。

```js
module.exports = {
    entry: './src/main.js'
}
```

可以通过```output```配置输出文件的位置，属性值是一个对象，对象中的```filename```指定输出文件的名称，```path```属性指定输出文件的目录需要是一个绝对路径。

```js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    }
}
```

运行```yarn build```就在项目中生成了```dist/bundle.js```。

## 4. 工作模式

```webpack```新增了工作模式简化了```webpack```配置的复杂度，可以理解成针对不用环境的几组预设的配置，```webpack```可以设置一个```mode```属性，如不设置默认会使用```production```模式工作。在这个模式下```webpack```会自动启动一些优化插件，例如代码压缩。

可以在```webpack```启动时传入```--mode```的参数，这个属性有三种取值，默认是```production```，还有```development```也就是开发模式。开发模式```webpack```会自动优化打包的速度，会添加一些调试过程需要的服务到代码中。

```s
yarn webpack --mode=development
```

```node模```式就是运行最原始状态的打包，不会去任何额外的处理。

```s
yarn webpack --mode=none
```

除了通过```cli```参数指定工作模式，还可以在```webpack```的配置文件中设置工作模式，在配置文件的配置中添加mode属性就可以了。

```js
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    }
}
```

## 5. 打包结果分析

首先先将```webpack```的工作模式设置成```node```。这样就是以最原始的状态打包。

```js
const path = require('path');

module.exports = {
    mode: 'node',
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    }
}
```

```s
yarn webpack
```

完成过后打开生成的```bundle.js```文件，可以把整体结构折叠起来以便于对结构了解。快捷键是```ctrl + k``` 和 ```ctrl + 0```。

整体生成的代码是一个立即执行函数，这个函数是```webpack```的工作入口。接收一个叫做```modules```的参数，调用的时传入了一个数组。

```js
/******/ (function(modules) { // 接收参数位置
/******/ })
/******/ ([ // 调用位置
/******/ ]);
```

数组中的每个参数都是需要相同参数的函数，这里的函数对应的就是源代码中的模块。

```js
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {
/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {
/***/ })
/******/ ]);
```

也就是说每一个模块最终都会被包裹到一个函数中，从而实现模块的私有作用域。可以展开数组中第一个参数函数。

```js
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _heading_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


const heading = Object(_heading_js__WEBPACK_IMPORTED_MODULE_0__["default"])();

document.body.append(heading);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (() => {
    const element = document.createElement('h2');
    element.textContent = 'Hello word';
    element.addEventListener('click', () => {

    })
    return element;
});

/***/ })
/******/ ]);
```

```webpack```工作入口函数并不复杂注释也非常清晰，最开始先定义了一个对象(```installedModules```)，用于存放加载过的模块。紧接着定义了一个```__webpack_require__```函数，这个函数就是用来加载模块的，再往后就是向```__webpack_require__```函数上挂载了一些数据和一些工具函数。

这个函数执行到最后调用了```__webpack_require__```函数传入了```__webpack_require__.s = 0```开始加载模块，这个地方的模块```id```实际上就是上面模块数组中的元素下标，也就是说这里才开始加载源代码中的入口模块。

```js
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
```

```__webpack_require__```内部先判断了这个模块有没有被加载过，如果加载了就从缓存里面读，如果没有就创建一个新的对象。创建过后开始调用这个模块对应的函数，把刚刚创建的模块对象(```module```)，导出成员对象(```module.exports```)，```__webpack_require__```函数作为参数传入进去。这样的话在模块的内部就可以使用```module.exports```导出成员，通过```__webpack_require__```载入模块。

```js
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
```

在模块内部先调用了```__webpack_require__.r```函数，这个函数的作用是给导出对象添加一个标记，用来对外界表明这是一个```ES Module```。

```js
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _heading_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


const heading = Object(_heading_js__WEBPACK_IMPORTED_MODULE_0__["default"])();

document.body.append(heading);

/***/ }),
```

```__webpack_require__.r```函数。

```js
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
```

再往下又调用了```__webpack_require__```函数，此时传入的```id```是```1```，也就是说用来加载第一个模块。

```js
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _heading_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


const heading = Object(_heading_js__WEBPACK_IMPORTED_MODULE_0__["default"])();

document.body.append(heading);

/***/ }),
```

这个模块就是代码中```export```的```heading```，以相同的道理执行```heading```模块，将```heading```模块导出的对象```return```回去。

```js
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (() => {
    const element = document.createElement('h2');
    element.textContent = 'Hello word';
    element.addEventListener('click', () => {

    })
    return element;
});

/***/ })
```

```module.exports```是一个对象，```ES Module```里面默认是放在```default```里面，调用default函数将创建完的元素拿到```append```到```body```上面。

```js
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _heading_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


const heading = Object(_heading_js__WEBPACK_IMPORTED_MODULE_0__["default"])();

document.body.append(heading);

/***/ }),

```

这就是大致的执行过程，```webpack```打包过后的代码并不会特别的复杂，只是把所有的模块放到了同一个文件中，除了放到同一个文件当中还提供一个基础代码让模块与模块之间相互依赖的关系可以保持原有的状态，这实际上就是```webpack bootstrap```的作用。

打包的全部代码如下。

```js
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _heading_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


const heading = Object(_heading_js__WEBPACK_IMPORTED_MODULE_0__["default"])();

document.body.append(heading);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (() => {
    const element = document.createElement('h2');
    element.textContent = 'Hello word';
    element.addEventListener('click', () => {

    })
    return element;
});

/***/ })
/******/ ]);
```

## 6. 模块依赖方式

```css```文件也可以作为打包的入口，不过```webpack```的打包入口一般还是```js```，打包入口从某种程度来说可以算是应用的运行入口。就目前而言前端应用中的业务是由js驱动的，可以在```js```代码当中通过```import```的方式引入```css```文件。

```js
import createHeading from './heading.js';

import './style.css';

const heading = createHeading();

document.body.append(heading);
```

在webpack.config.js中配置```css```的```loader```，```css-loader``` 和 ```style-loader``` 需要安装到项目中。然后将```loader```需要配置到```config```的```module```中。

```s
yarn add css-loader style-loader --dev
```

```js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
}
```

运行打包命令启动项目后，样式是可以生效的。传统模式开发是将文件单独分开单独引入，```webpack```建议在```js```中去引入```css```，甚至编写代码中引入资源都可以在```js```中印日。因为真正需要资源的不是应用，而是正在编写的代码，代码想要正常工作就必须要加载对应的资源，这就是```webpack```的哲学。一开始可能不太容易理解，换种方式理解假设样式单独引入到页面中，如果代码更新了不再需要这个样式资源了，是不是需要手动的删除。通过```js```的代码引入文件或者建立```js```和文件之间的依赖关系是有明显优势的。

```js```代码本身是负责完成整个业务的功能，放大来看就是驱动了整个前端应用，在实现业务功能的过程当中可能需要用到样式或图片等一系列的资源文件。如果建立了这种依赖关系，一来逻辑上比较合理，因为```js```确实需要这些资源文件的配合才能实现对应的功能，二来可以保证上线时资源文件不缺失，而且每一个上线的文件都是必要的。

## 7. 文件资源加载器

```webpack```社区提供了非常多的资源加载器，基本上开发者能想到的合理需求都有对应的```loader```，接下来尝试一些非常有代表性的```loader```，首先是文件资源加载器。

大多数文件加载器都类似于```css-loader```，是将资源模块转换为```js```代码的实现方式进行工作，但是有一些经常用到的资源文件例如图片或字体这些文件是没办法通过```js```表示的。对于这类的资源文件，需要用到文件的资源加载器也就是```file-loader```。

在项目中添加一张普通的图片文件，通过```import``` 的方式导入这张图片。接收模块文件的默认导出也就是文件的资源路径，创建```img```元素把```src```设置成文件，最后将元素```append```到```body```中。

```js

import createHeading from './heading.js';

import './style.css';

import icon from './icon.png';

const heading = createHeading();

document.body.append(heading);

const img = new Image();

img.src = icon;

document.body.append(img);
```

这里导入了一个```webpack```不能识别的资源所以需要修改```webpack```配置。为```png```文件添加一个单独的加载规则配置，```test```属性设置```.png```结尾，```use```属性设置为```file-loader```，这样```webpack```打包的时候就会用```file-loader```处理图片文件了。

```s
yarn add file-loader --dev
```

```js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.png$/,
                use: 'file-loader'
            }
        ]
    }
}
```

打包过后```dist```目录中会多出一个图片文件，这个文件就是代码中导入的图片，不过文件名称发生了改变。文件模块代码只是把生成的文件名称导出了。

```js
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "e177e3436b8f0b3cfff0fd836ea3472c.png");

/***/ })
```

入口模块直接使用了导出的文件路径(```__webpack_require__(6)```)```img.src = _icon_png__WEBPACK_IMPORTED_MODULE_2__["default"];```。

```js
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _heading_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_css__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _icon_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);

const heading = Object(_heading_js__WEBPACK_IMPORTED_MODULE_0__["default"])();

document.body.append(heading);

const img = new Image();

img.src = _icon_png__WEBPACK_IMPORTED_MODULE_2__["default"];

document.body.append(img);

/***/ })
```

启动应用发现图片并不能正常的加载，控制台终端可以发现直接加载了网站根目录的图片，而网站根目录并没有这个图片所以没有找到。图片应该在```dist```目录当中。这个问题是由于```index.html```并没有生成到```dist```目录，而是放在了项目的跟目录，所以这里把项目的跟目录作为了网站的跟目录，而```webpack```会认为所有打包的结果都会放在网站的跟目录下面，所以就造成了这样一个问题。

通过配置文件去```webpack```打包过后的文件最终在网站当中的位置，具体的做法就是在配置文件中```output```位置添加```publicPath```。这里设置为```dist/```斜线不能省略。

```js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.png$/,
                use: 'file-loader'
            }
        ]
    }
}
```

完成以后重新打包，这一次在文件名称前面拼接了一个变量。

```js
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "e177e3436b8f0b3cfff0fd836ea3472c.png");

/***/ })
```

这个变量在```webpack```内部的代码提供的就是设置的```publicPath(\__webpack_require__.p = "dist/";)```

```js

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })

```

````webpack````在打包时遇到图片文件，根据配置文件中的配置，拼配到对应的文件加载器，此时文件加载器开始工作，先是将文件拷贝到输出的目录，然后再将文件拷贝到输出目录的路径作为当前模块的返回值返回，这样对于应用来说，所需要的资源就被发布出来了，同时也可以通过模块的导出成员拿到资源的访问路径。

## 8. url加载器

除```file-loader```这种通过```copy```文件的形式处理文件资源外还有一种通过```Data URLs```的形式表示文件。```Data URLs```是一种特殊的```url```协议，可以直接表示文件，传统的```url```要求服务器上有对应的文件，然后通过地址，得到服务器上对应的文件。而```Data URLs```本身就是文件内容，在使用这种```url```的时候不会再去发送任何的```http```请求，比如常见的```base64```格式。

```s
data:[mediatype][;base64],\<data>
```

```data:```表示协议，```[mediatype][;base64]```表示媒体类型和编码，```\<data>```则是具体的文件内容。例如下面给出的```Data URLs```，浏览器可以根据这个```url```解析出```html```类型的文件内容，编码是```url-8```，内容是一段包含```h1```的```html```代码。

```s
data:text/html;charset=UTF-8,<h1>html content</h1>
```

如果是图片或者字体这一类无法通过文本表示的```2```进制类型的文件，可以通过将文件的内容进行```base64```编码，以编码后的结果也就是字符串表示这个文件内容。这里```url```就是表示了一个```png```类型的文件，编码是```base64```，再后面就是图片的```base64```编码。

```s
data:image/png;base64,iVBORw0KGgoAAAANSUhE...SuQmCC
```

当然一般情况下```base64```的编码会比较长，这就导致编码过后的资源体积要比原始资源大，不过优点是浏览器可以直接解析出文件内容，不需要再向服务器发送请求。

```webpack```在打包静态资源模块时，就可以使用这种方式去实现，通过```Data URLs```以代码的形式表示任何类型的文件，需要用到一个专门的加载器```url-loader```。

```s
yarn add url-loader --dev
```

```webpack```配置文件中找到之前的```file-loader```将其修改为```url-loader```。

```js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.png$/,
                use: 'url-loader'
            }
        ]
    }
}
```

此时```webpack```打包时，再遇到```.png```文件就会使用```url-loader```将其转换为```Data URLs```的形式。打开```bundle.js```可以发现在最后的文件模块中导出的是一个完整的```Data URLs```。

```js
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("data:image/png;base64,iVBORw0KGgoAAAANSUh...AAAABJRU5ErkJggg==");

/***/ })
```

因为```Data URLs```中已经包含了文件内容，所以```dist```中也就不存在独立的```.png```物理文件了。

这种方式十分适合项目当中体积比较小的资源，如果体积过大会造成打包结果非常大从而影响运行速度。最佳的实践方式是对项目中的小文件通过```url-loader```转换成```Data URLs```然后在代码中嵌入，从而减少应用发送请求次数。对于较大的文件仍然通过传统的```file-loader```方式以单个文件方式存放，从而提高应用的加载速度。

```url-loader```支持通过配置选项的方式设置转换的最大文件，将```url-loader```字符串配置方式修改为对象的配置方式，对象中使用```loader```定义```url-loader```，然后额外添加```options```属性为其添加一些配置选项。这里为```url-loader```添加```limit```的属性，将其设置为 ```10kb(10 * 1024)```，单位是字节。

这样```url-loader```只会将```10kb```以下的文件转换成```Data URLs```，超过```10kb```的文件仍然会交给```file-loader```去处理。

```js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.png$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10 * 1024
                    }
                }
            }
        ]
    }
}
```

## 9. babel-loader

```webpack```默认就可以处理代码中的```import```和```export```，所以很自然的会有人认为，```webpack```会自动编译```ES6```的代码，实则不然，```webpack```仅仅完成模块打包工作，会对代码中的```import```和```export```做一些相应的转换，除此之外它并不能转换代码中其他的```ES6```代码。如果需要```webpack```在打包过程中同时处理其他```ES6```特性，需要为```js```文件配置一个额外的加载器```babel-loader```。

首先需要安装```babel-loader```，由于```babel-loader```需要依赖额外的```babel```核心模块，所以需要安装```@babel/core```模块和用于完成具体特性转换```@babel/preset-env```模块。

```s
yarn add babel-loader @babel/core @babel/preset-env --dev
```

配置文件中为js文件指定加载器为```babel-loader```，这样```babel-loader```就会取代默认的加载器，在打包过程当中处理代码中的一些新特性。

```js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /.js$/,
                use: 'babel-loader'
            }
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.png$/,
                use: 'url-loader'
            }
        ]
    }
}
```

还需要为```babel```配置需要使用的插件，配置文件中给```babel-loader```传入相应的配置，们直接使用```preset-env```插件集合，这个集合当中就已经包含了全部的```ES```最新特性。

```js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.png$/,
                use: 'url-loader'
            }
        ]
    }
}
```

## 10. 加载资源

```webpack```中提供了几种资源加载方式，首先第一个就是```ES Module```标准的```import```声明。

```js
import heading from './heading.js';
import icon from './icon.png';
```

其次是遵循```Commonjs```标准的```require```函数，不过通过```require```函数载入```ES Module```的话，对于```ES Module```的默认导出需要通过```require```函数导入结果的```default```属性获取。

```js
const heading = require('./heading.js').default;
const icon = require('./icon.png');
```

遵循```AMD```标准的```define```函数和```require```函数```webpack```也同样支持。

```js
define(['./heading.js', './icon.png', './style.css'], (createHeading, icon) => {
    const heading = createHeading();
    const img = new Image();
    img.src = icon;
    document.body.append(heading);
    document.body.append(icon);
});

require(['./heading.js', './icon.png', './style.css'], (createHeading, icon) => {
    const heading = createHeading();
    const img = new Image();
    img.src = icon;
    document.body.append(heading);
    document.body.append(icon);
})
```

```webpack```兼容多种模块化标准，除非必要的情况否则不要在项目中去混合使用这些标准，每个项目使用一个标准就可以了。

除了```js```代码中的三种方式外还有一些加载器在工作时也会处理资源中导入的模块，例如```css-loader```加载的```css```文件(```@import```指令和```url```函数)

```css
@import '';
```

```html-loader```加载的```html```文件中的一些```src```属性也会触发相应的模块加载。

```main.js```

```js
import './main.css';
```

```main.css```

```css
body {
    min-height: 100vh;
    background-image: url(background.png);
    background-size: cover;
}
```

```webpack```在遇到```css```文件时会使用```css-loader```进行处理，处理的时候发现```css```中有引入图片，就会将图片作为一个资源模块加入到打包过程。```webpack```会根据配置文件中针对于遇到的文件找到相应的```loader```，此时这是一张```png```图片就会交给```url-loader```处理。

```reset.css```。

```css
@import url(reset.css);
body {
    min-height: 100vh;
    background-image: url(background.png);
    background-size: cover;
}
```

```html```文件中也会引用其他文件例如img标签的```src```，```src/footer.html```。

```html
<footer>
    <img src="better.png" />
</footer>
```

```s
yarn add html-loader --dev
```

配置文件中为扩展名为```html```的文件配置```loader```。

```js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.png$/,
                use: 'url-loader'
            },
            {
                test: /.html$/,
                use: 'html-loader'
            }
        ]
    }
}
```

```html-loader```默认只会处理```img```标签的```src```属性，如果需要其他标签的一些属性也能够触发打包可以额外做一些配置，具体的做法就是给```html-loader```添加```attrs```属性，也就是```html```加载的时候对页面上的属性做额外的处理。比如添加一个```a:href```属性，让他能支持```a```标签的```href```属性。

```js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.png$/,
                use: 'url-loader'
            },
            {
                test: /.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: ['img:src', 'a:href']
                    }
                }
            }
        ]
    }
}
```

完成以后运行打包，在打包的结果中可以看到```a```标签用到的资源已经参与了打包。

## 11. 工作原理

在项目中一般都会散落着各种各样代码及资源文件，```webpack```会根据配置找到其中的一个文件作为打包的入口，一般情况这个文件都会是```js```文件。

然后顺着入口文件中的代码根据代码中出现的import或者```require```之类的语句解析推断出来这个文件所依赖的资源模块，然后分别解析每个资源模块对应的依赖，最后就形成了整个项目中所有用到文件之间的一个依赖关系的依赖树。

有了依赖关系树后```webpack```会递归这个依赖树然后找到每个节点对应的资源文件。最后再根据配置文件中的属性找到这个模块所对应的加载器，然后交给加载器去加载这个模块。

最后会将加载到的结果放到```bundle.js```也就是打包结果中，从而实现整个项目的打包。整个过程中```loader```的机制起了很重要的作用，如果没有```loader```就没办法实现各种各样的资源文件的加载，对于```webpack```来说也就只能算是一个用来去打包或是合并```js```模块代码的工具了。

## 12. 开发一个Loader

```markdown-loader```，需求是有了这个加载器后就可以在代码当中直接导入```markdown```文件。

```main.js```

```js
import about from './about.md';
console.log(about);
```

```about.md```

```md
# 关于我

我是隐冬
```

```markdown```文件一般是要被转换为```html```后呈现到页面上的，所以说这里希望导入的```markdown```文件得到的结果是````markdown````转换过后的```html```字符串。

在项目的根目录创建```markdown-loader.js```文件，```webpack-loader```需要去导出一个函数，这个函数就是```loader```对所加载到资源的处理过程，入参是加载到的资源文件的内容，输出是加工过后的结果。通过```source```接收输入，通过返回值输出。

```js
module.exports = source => {
    console.log(source);
    return 'hello';
}
```

在```webpac```k的配置文件中添加加载器的规则配置，扩展名就是```.md```使用的加载器是我编写的```markdown-loader```模块。

```js
const path = require('path');

module.exports = {
    mode: 'none',
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /.md$/,
                use: './markdown-loader'
            }
        ]
    }
}

```


```webpack```加载资源的过程类似工作管道，可以在这个过程中依次使用多个```loader```，但是最终这个管道工作过后的结果必须是一段```javascript```代码，```markdow-loader```中，将返回的字符串修改为```console.log("hello")```标准的```js```代码。

```js
module.exports = source => {
    console.log(source);
    return 'console.log("hello")';
}
```

```webpack```打包的时候就是把```loader```返回的字符串拼接到模块当中了。

```js
/* 1 */
/***/ (function(module, exports) {

console.log("hello")

/***/ })

```

安装```markdown```解析的模块```marked```。

```s
yarn add marked --dev
```

在加载器当中使用这个模块去解析来自参数中的```source```，这里返回值就是一段```html```字符串也就是转换过后的结果。正确的做法就是把这段```html```变成一段```javascript```代码。

```js
const marked = require('marked');
module.exports = source => {
    // console.log(source);
    // return 'console.log("hello")';
    const html = marked(source);
    return `module.exports = ${JSON.stringify(html)}`
}
```

打包后就是下面的样子。
```js
/* 1 */
/***/ (function(module, exports) {

module.exports = "<h1 id=\"关于我\">关于我</h1>\n<p>我是隐冬</p>\n"

/***/ })
```

除了```module.exports```方式以外```webpack```还允许在返回的代码中直接使用```ES Module```的方式去导出。

```js
const marked = require('marked');
module.exports = source => {
    // console.log(source);
    // return 'console.log("hello")';
    const html = marked(source);
    // return `module.exports = ${JSON.stringify(html)}`
    return `export default ${JSON.stringify(html)}`
}
```

打包结果同样也是可以的，```webpack```内部会自动转换导出代码中的```ES Module```。

```js
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<h1 id=\"关于我\">关于我</h1>\n<p>我是隐冬</p>\n");

/***/ })
```

接下来尝试一下第二种方法，```markdown-loader```中去返回一个```html```字符串。然后交给下一个```loader```去处理这个```html```的字符串。这里直接返回```marked```解析过后的```html```，然后再去安装一个用于去处理```html```加载的```loader```叫做```html-loader```。

```js
const marked = require('marked');
module.exports = source => {
    // console.log(source);
    // return 'console.log("hello")';
    const html = marked(source);
    // return `module.exports = ${JSON.stringify(html)}`
    // return `export default ${JSON.stringify(html)}`
    return html;
}
```

```s
yarn add html-loader --dev
```

把```use```属性修改为一个数组，这样就会依次使用多个```loader```了。需要注意执行顺序是从数组的后面往前面，也就是说应该把先执行的```loader```放在数组的后面。

```js
const path = require('path');

module.exports = {
    mode: 'none',
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /.md$/,
                use: ['html-loader', './markdown-loader']
            }
        ]
    }
}

```

完成后打包依然是可以的。

```js
/* 1 */
/***/ (function(module, exports) {

module.exports = "<h1 id=\"关于我\">关于我</h1>\n<p>我是隐冬</p>\n"

/***/ })
```

```loader```不建议使能用剪头函数会拿不到上下文的```this```。

官方推荐使用```loader-utils```工具处理```loader.query```。

```js
const loaderUtils = require('loader-utils');
module.exports = function(source) {
    const options = loaderUtils.getOptions(this);
    console.log(options);
    return source;
}
```

```this.callback```可以返回更多内容用于替代```return```。

```js
module.exports = function(source) {
    const options = loaderUtils.getOptions(this);
    const result = "2123";
    this.callback(null, result);
}
```

```this.async```用于处理异步。

```js
module.exports = function(source) {
    const options = loaderUtils.getOptions(this);
    // 定义异步callback
    const callback = this.async();
    setTimeout(() => {
        const result = "2123";
        callback(null, result);
    });
}
```

```resolveLoader```可以用于```webpack```配置```loader```的简写，当配置文件里面使用模块，先去```node_modules```里面找，如果找不到就去后面路径上面找。


```json
resolveLoader: {
    modules: ["node_modules", "./loaders"],
}
```

## 13. 插件机制介绍

插件机制是```webpack```另一个核心特性，目的是为了增强```webpack```在项目自动化方面的能力，```loader```负责实现项目中各种各样资源模块的加载，```plugin```则是用来解决项目中除了资源加载以外其他的一些自动化的工作。

例如```plugin```可以实现在打包之前清除```dist```目录，还可以```copy```不需要参与打包的资源文件到输出目录，又或是压缩打包结果输出的代码。总之，有了插件```webpack```几乎无所不能的实现了前端工程化中绝大多数工作，这也是很多初学者会把```webpack```理解成前端工程化的原因。

接下来体验几个常见的插件。

### 1. clean-webpack-plugin

自动清除输出目录，```webpack```每次打包的结果都是覆盖到```dist```目录而在打包之前```dist```中可能已经存在一些之前的遗留文件，再次打包可能只覆盖那些同名的文件，对于其他已经移除的资源文件会一直积累在```dist```里面非常不合理。合理的做法是每次打包前自动清理```dist```目录，这样的话```dist```中就只会保留需要的文件。

```clean-webpack-plugin```就很好的实现了这样一个需求。

```s
yarn add clean-webpack-plugin --dev
```

```webpack```配置文件中导入这个插件，插件中导出了一个```CleanWebpackPlugin```的成员可以解构出来，```webpack```使用插件需要为配置对象添加```plugins```属性，值是一个数组里面每一个成员就是一个插件实例。绝大多数插件模块导出的都是一个类型，使用插件就是通过类型创建实例，然后将实例放入到```plugins```数组中。

```js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.png$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
}
```

### 2. html-webpack-plugin

在之前```html```都是通过硬编码的方式单独存放在项目的跟目录下的这种方式有两个问题，第一项目发布时需要发布跟目录下的```html```文件和```dist```目录下所有的打包结果，相对麻烦一些。而且上线过后还需要确保```html```代码当中路径引用都是正确的。第二个如果输出的目录或输出的文件名也就是打包结果的配置发生了变化，那```html```代码当中```script```标签所引用的路径也要手动修改。

解决这两个问题最好的办法就是通过```webpack```自动生成```html```文件，也就是让```html```参与到构建过程中去，在构建过程中```webpack```知道生成了多少个```bundle```，会自动将这些打包的```bundle```添加到页面中。这样```html```也输出到了```dist```目录，上线时只需把```dist```目录发布出去就可以了。二来html中对于```bundle```的引用是动态注入的，不需要硬编码也就确保了路径的引用是正常的。

需要借助```html-webpack-plugin```插件。

```s
yarn html-webpack-plugin --dev
```

配置文件中载入这个模块```html-webpack-plugin```默认导出的就是一个插件的类型，不需要解构他内部的成员。

```js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.png$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin()
    ]
}
```

打包过后```dist```目录中生成了```index.html```文件，这里引入的```bundle.js```路径是可以通过```output```属性中的```publicPath```进行修改的，可以删除这个配置。这样打包之后```index.html```中```bundle```的引用就标成了```/bundle.js```。

```js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        // publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.png$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin()
    ]
}
```


对于默认生成的```html```的标题是可以修改的，页面中的一些原数据标签和基础的```DOM```结构也是可以定义的，对于简单的自定义可以通过修改```html-webpack-plugin```插件传入的参数属性实现。```html-webpack-plugin```构造函数可以传入一个对象参数，用于指定配置选项，```title```属性就是用来设置```html```的标题。```meta```属性可以设置页面中的一些原数据标签。

```js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        // publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.png$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Webpack Plugin Sample',
            meta: {
                viewport: 'width=device-width'
            }
        })
    ]
}
```

如果需要对```html```文件进行大量自定义，最好的做法就是在原代码中添加一个用于生成```html```文件的一个模板，然后让```html-webpack-plugin```插件根据模板生成页面。

对于模板中动态输出的内容可以使用loadsh模板语法的方式去输出。通过```htmlWebpackPlugin.options```属性去访问到插件的配置数据，```htmlWebpackPlugin```变量实际上是内部提供的变量，也可以通过另外的属性添加一些自定义的变量。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= htmlWebpackPlugin.options.title %></title>
</head>
<body>
    <script src="dist/"></script>
</body>
</html>
```

配置文件当中通过```template```属性指定所使用的模板文件。

```js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        // publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.png$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Webpack Plugin Sample',
            meta: {
                viewport: 'width=device-width'
            },
            template: './src/index.html'
        })
    ]
}
```

除了自定义输出文件的内容，同时输出多个页面文件也是常见的需求，可以通过创建新的实例对象，用于去创建额外的```html```文件，通过```filename```指定输出的文件名，这个属性的默认值是```index.html```。

```js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        // publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.png$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Webpack Plugin Sample',
            meta: {
                viewport: 'width=device-width'
            },
            template: './src/index.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'about.html'
        })
    ]
}

```

如果说需要创建多个页面，就可以在插件列表当中加入多个```htmlWebpackPlugin```实例的对象，每个对象就是用来负责生成一个页面文件的。

### 3. copy-webpack-plugin

项目中一般有一些不需要参与构建的静态文件最终也需要发布到线上，例如网站的```favicon.ico```，一般会把这一类文件统一放在项目根目录下的```public```目录中，希望```webpack```在打包时可以将他们复制到输出目录。对于这种需求可以借助```copy-webpack-plugin```实现。

```s
yarn add copy-webpack-plugin --dev
```

配置文件当中导入这个插件的类型并在```plugins```属性当中添类型实例，这个这个类型的构造函数要求传入一个数组，用于指定需要```copy```的文件路径，可以是一个通配符，也可以是一个目录或者是文件的相对路径。这里传入```public/**```表示在打包时会将```public```目录下所有的文件拷贝到输出目录。

```js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        // publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.png$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Webpack Plugin Sample',
            meta: {
                viewport: 'width=device-width'
            },
            template: './src/index.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'about.html'
        }),
        new CopyWebpackPlugin([
            'public/**'
        ])
    ]
}

```

至此就了解了几个非常常用的插件，这些插件一般都适用于任何类型的项目，最好能仔细过一遍这些插件的官方说明，然后看看他们还可以有哪些特别的用法，做到心中有数。

除此之外社区当中还提供了成百上千的插件，并不需要全部认识，在有一些特殊的需求时，提炼需求中的一些关键词然后去```github```上去搜索他们，例如想要压缩输出的图片可以搜索```imagemin webpack plugin```。

## 14. 开发一个插件

```webpack```的插件机制其实就是软件开发过程中最长见到的钩子机制。```webpack```要求的插件必须是一个函数，或者是一个包含```apply```方法的对象，一般会把插件定义为一个类型，在类型中定义```apply```方法。

这里定义```MyPlugin```的类型，在这个类型中定义```apply```方法，这个方法会在```webpack```启动时被调用，接收一个```compiler```对象参数就是```webpack```工作过程中的核心对象，对象里面包含了此次构建的所有的配置信息，通过这个对象可以注册钩子函数。

这里的需求是希望这个插件可以用来去清除```webpack```打包生成的```js```中没必要的注释，有了这个需求需要明确这个任务的执行时机，也就是要把这个任务挂载到哪个钩子上。

需求是删除```bundle.js```中的注释，也就是说当```bundle.js```文件内容明确后才可以实施相应的动作，在```webpack```的官网的```API```文档中找到```emit```的钩子，这个钩子在```webpack```即将要往输出目录输出文件时执行。

通过```compiler```当的```hooks```属性访问到```emit```钩子，然后通过```tap```方法注册钩子函数，这个方法接收两个参数，第一个参数是插件的名称```MyPlugin```，第二个是需要挂载到这个钩子上的函数。在函数中接收一个```complation```的对象参数，这个对象可以理解成此次打包过程的上下文。

所有打包过程中产生的结果都会放到这个对象中，使用对象的```assets```属性获取即将写入到目录文件中的资源信息```complation.assets```。这是一个对象通过```for in```遍历这个对象，对象当中的键就是每一个文件的名称。然后将这个插件应用到配置当中通过 ```new MyPlugin```的方式把他应用起来。

```js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

class MyPlugin {
    apply(compiler) {
        console.log('MyPlugin 启动');
        compiler.hooks.emit.tap('MyPlugin', complation => {
            for (const name in complation.assets) {
                console.log(name);
            }
        })
    }
}

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        // publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.png$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Webpack Plugin Sample',
            meta: {
                viewport: 'width=device-width'
            },
            template: './src/index.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'about.html'
        }),
        new CopyWebpackPlugin([
            'public/**'
        ]),
        new MyPlugin()
    ]
}
```

此时打包过程就会输出打包的文件名称，可以通过文件中值的```source```方法来获取文件内容。

```js
class MyPlugin {
    apply(compiler) {
        console.log('MyPlugin 启动');

        compiler.hooks.emit.tap('MyPlugin', complation => {
            for (const name in complation.assets) {
                console.log(assets[name].source());
            }
        })
    }
}
```

拿到文件名和内容后要判断文件是否以```.js```结尾，如果是```js```文件将文件的内容得到然后通过正则的方式替换掉代码当中对应的注释，将替换的结果覆盖到原有的内容当中，要覆盖```complation```当中```assets```里面所对应的属性。这个属性的值同样暴露一个```source```方法用来去返回新的内容。除此之外还需要一个```size```方法，用来返回这个内容的大小，这个是```webpack```内部要求的必须的方法。

```js
class MyPlugin {
    apply(compiler) {
        // console.log('MyPlugin 启动');
        compiler.hooks.emit.tap('MyPlugin', complation => {
            for (const name in complation.assets) {
                // console.log(assets[name].source());
                if (name.endsWith('.js')) {
                    const contents = complation.assets[name].source();
                    const withoutComments = contents.replace(/\/*\**\*\//g, '');
                    complation.assets[name] = {
                        source: () => withoutComments,
                        size: () => withoutComments.length
                    }
                }
            }
        })
    }
}
```

打包过后```bundle.js```每一行开头的注释就被移除掉了，以上就是实现移除```webpack```注释插件的过程，通过这个过程了解，插件是通过往```webpack```生命周期里面的一些钩子函数里面挂载任务函数来去实现的。如果需要深入了解插件机制，可能需要理解一些```webpack```底层的实现原理，通过去阅读源代码来了解他们。

## 15. 开发体验问题

在此之前已经了解了一些```webpack```的相关概念和一些基本的用法，但是以目前的状态去应对日常的开发工作还远远不够，编写源代码再通过```webpack```打包然后运行应用，最后刷新浏览器这种方式过于原始。如果实际的开发过程中还按照这种方式去使用必然会大大降低开发效率。

希望开发环境必须能够使用```http```的服务运行而不是以文件的形式预览，这样一来可以更加接近生产环境的状态，而且使用```ajax```之类的一些```api```也需要服务器环境。其次希望这个环境在修改源代码后```webpack```可以自动完成构建，然后浏览器可以及时的显示最新的结果，这样的话就可以大大的减少在开发过程中额外的重复操作。

最后还需要能够去提供```sourceMap```支持，运行过程中一旦出现了错误就根据错误的堆栈信息快速定位到源代码当中的位置，便于调试应用。

### 1. 自动编译

用命令行手动重复去使用```webpack```命令从而去得到最新的打包结果，这种办法特别的麻烦可以使用```webpack-cli```提供的```watch```工作模式解决这个问题。这种模式项目下的源文件会被监视，一旦这些文件发生变化，会自动重新运行打包任务。

用法非常简单，就是启动```webpack```时添加```--watch```参数。

```s
yarn webpack --watch
```

可以再开启一个新的命令行终端以```http```的形式运行应用。

```s
http-server ./dist
```

此时修改源代码```webpack```就会自动重新打包，可以刷新页面看到最新的页面结果。

### 2. 自动刷新浏览器

如果流浏览器能在编译过后自动去刷新，开发体验将会更好一些，```browser-sync```工具就会实现自动刷新的功能。

```s
yarn add --global browser-sync
```

使用```browser-sync```启动```http```服务同时要监听```dist```文件下的文件变化。此时修改源文件保存过后浏览器会自动刷新然后显示最新的结果。

```s
browser-sync dist --files "**/*"
```

原理是```webpack```自动打包源代码到```dist```当中，```dist```的文件变化被```browser-sync```监听从而实现了自动编译并且自动刷新浏览器。

### 3. 开发服务器

```Webpack Dev Server```提供了一个开发服务器，并且将自动编译和自动刷新浏览器等一系列对开发友好的功能全部集成在了一起。这是一个高度集成的工具使用起来非常的简单。

```s
yarn add webpack-dev-server --dev
```

```s
yarn webpack-dev-server
```

运行命令内部会自动使用```webpack```打包我应用并且会启动一个```http-server```去运行打包结果。还会监听代码变化，一旦源文件发生变化就会自动打包，这一点和```watch```模式是一样的。

```webpack-dev-server```为了提高工作效率并没有将打包结果写入到磁盘中，是将打包结果暂时存放在内存中，内部的```http-server```也是从内存中把这些文件读出来发送给浏览器，这样一来就会减少很多磁盘不必要的读写操作，从而大大提高构建效率。

这个命令可以传入```--open```参数，用于自动唤起浏览器，打开运行地址。

```s
yarn webpack-dev-server --open
```

如果有两块屏幕就可以把浏览器放到另外一块屏幕中，一边编码，一边及时预览开发环境。

### 4. 静态资源访问

静态文件需要作为开发服务器的资源被访问需要额外的去告诉```webpack-dev-server```，具体的方法就是在webpack的配置文件当中添加对应的配置。在配置对象当中添加```dev-server```的属性这个属性专门用来为```webpack-dev-server```指定相关的配置选项。

配置对象的```contentBase```属性用来指定静态资源路径，可以是一个字符串或者是一个数组，也就是说可以配置一个或者是多个路径，这里设置为```public```目录。

之前通过```copy-webpack-plugin```插件将```public```目录输出到了输出目录，正常所有输出的文件都应该可以直接被```server```也就是直接在浏览器端访问到。按道理来讲这些文件不需要再作为开发服务器的额外的资源路径了，但是在实际使用```webpack```的时候一般都会把```copy-webpack-plugin```这插件留在上线前的那次打包中。在平时的开发过程中一般不会去使用它，因为在开发过程中会重复执行打包任务。假设```copy```的文件比较多或者是比较大，每次执行插件的话打包过程中的开销就会比较大速度自然也就会降低了。

```js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    devServer: {
        contentBase: './public',
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.png$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpack