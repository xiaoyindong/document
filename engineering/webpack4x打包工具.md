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
  