
## 1. 重置css

```Reset.css```重置初始样式。

```Normalize.css```修复不规则样式。
```Neat.css```融合了```Reset```和```Normalize```。

如果开发```H5```页面，最好全局添加如下样式。

```css
html { box-sizing: border-box;}
*,*:before, x:after { box-sizing: inherit;}
```

## 2. no-image

通过```css```实现的```icon```。

```s
http://cssicon.space
```

## 3. css hint

不要使用多个```class```选择元素，如```a.foo.boo```，移除空的```css```，正确使用属性。

使用```csshint```。

```s
npm install csshint

# csslint.net
```

## 4. BFC IFC GFC FFC

```Box```是```css```的布局基本单位，直观点来说就是一个页面是由很多个```Box```组成，元素的类型和```display```属性决定了这个```Box```的类型，不同类型的```Box```会参与不同的```Formatting Context```也就是一个决定如何渲染文档的容器。因此```Box```内的元素会以不同的方式渲染。

```block-level box```：```display```属性为```block```、```inline-block```、```inline-table```的元素，会产生```inline-leve box```，并且参与```inline formatting content```。

```inline-level box```：```display```属性为```inline```、```inline-item```、```table```的元素会生成```block-level box```并参与```block formatting Context```。

```Fromatting context```是```w3c css2.1```规范中的一个概念，他是页面中的一款渲染区域，并且有一套渲染规则，他决定了其子元素将如何定位，以及和其他元素的关系和相互作用。最常见的```Formatting Context```有```block fomatting context```简称```BFC```和```inline formatting context```简称```IFC```。

会生成BFC的元素：根元素```float```不为```none```， 绝对定位或```fixed```定位，```overflow```不为```visiable```，块级```css```属性。

```FFC```是```flex```布局的渲染。
```GFC```是```Grid Layout```。

## 5. 数学矩阵技巧

```SVG```

```Canvas```

```webgl```

```css3d```

```s
http://wow.techbrood.com/fiddle/25741
```

```css-matrix3d```

注意事项

1. 不要直接定义子节点，应把共性声明放到父类

2. 结构和皮肤相分离

3. 容器和内容相分离

4. 抽象出可重用的元素，建好组件库，在组件库内寻找可用的元素组装页面

5. 往你想要扩展的对象本身增加class而不是他的父节点

6. 对象应保持独立性

7. 避免使用Id选择器，权重太高，无法重用

8. 避免位置相关的样式。

9. 保证选择器相同的权重

10. 类名 简短 清晰 语义化

```s
http://oocss.org

# 下载 Alternate download
```

## 6. css 后处理器

```autoprefixer```、```postcss```。

## 7. css分层

```css```有语义化的命名约定和```css```层的分离，将有助于它的可扩展性，性能的提高和代码的组织管理大量的样式，覆盖，权重和很多```!important```。分好层可以让团队命名统一规范，方便维护。有责任感的去命名选择器。

### 1. SMACSS

```SMACSS```意思是分文件```base.css```、```layout.css```、```module.css```、```state.css```。

```base```：设定标签越苏的预设值。

```layout```：整个网站的大架构的外观。

```module```：应用在不同页面的公共模块。

```state```：定义元素不同的状态。

```theme```：画面上所有主视觉的定义，```border-color```、```background```。

修饰符用```-```,子元素用```__```。

### 2. BEM

```BEM```和```SMACSS```非常类似，主要用来如何给项目命名，一个简单命名更容易让别人一起工作，比如选项卡导航是一个块（```Block```），这个块里的元素的是其中标签之一，而当前选项卡是一个修饰状态。

```block```代表了更高级别的抽象或组件。

```block__element```代表```block```的后台，用于形成一个完整的```block```的整体。

```.block--modifier```代表```block```的不同状态。

修饰符使用的是```_```，子模块使用```__```符号。（不用一个```-```的原因是```css```单词连接）。

### 3. SUIT

### 4. ACSS

原子化的```css```，小粒度的```css```。

考虑如何设计一个系统的接口，原子是框架一个区块的最基本的特质，比如说表单，由于多个表单组件组成，网站由多个模块组成。

```css
.fl { float: left}
```

### 5. ITCSS

```ITCSS```：混合```css```，```minx```。

## 8. nextcss

```s
https://cssnext.github.io/playground
```

```css
:root { // 全局变量
    --fontSize: 1rem; // 变量
    --mainColor: #12345678;
    --highlightColor: hwb(190, 35%, 20%)
}

body {
    color: var(--mainColor)
}

:root {
    --centered: {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
.centered {
    @apply --centered;
}
```

```calc```代表```css```表达式。

```css
calc(15px * 2);

image-set (
    url(img/test.png) 1x,
    url(img/test-2x.png) 2x
)
```

```filter```滤镜



```css
// css正则
[frame=hsides i] { // 忽略hsides大小写

}
```

使用```webpack```的```css-loader```编译添加```modules```。

使用```postcss```进行编译```css```。

使用```postcss-preset-env```编译```cssnext```语法。

postcss插件集

```postcss-custom-properties```运行时变量。

```postcss-simple-vars```与```scss```一致的变量实现。

```postcss-mixins```实现类似```sass```的```@mixin```的功能。

```postcss-extend```实现类似```sass```的继承功能。

```postcss-import```实现类似```sass```的```import```。

```cssnext```面向未来，```cssgrace```修复过去，兼容```ie6```。

```s
https://cssdb.org
```

```autoprefixer```已经被继承，不需要用了。

### css-doodle

是一个```webcomonent```，```https://css-doodle.com/```。

```html
<css-doodle>
</css-doodle>
```

## 9. Houdini

在现今的```web```开发中，```js```几乎占据所有版面，除了控制页面逻辑与操作```DOM```对象外，连```css```都直接写在````js````里面了，就算浏览器还没实现的特性，总会有人做出对应的```polyfills```，让你快速的将新```Feature```应用到```Production```环境中，更别提````Babel````等工具帮忙转移。

而```css```就不同了，除了制定了```css```标准规范所需的时间外，各家浏览器的版本，实战进度差异更是旷日持久，顶多利用```postcss```，```sass```等工具来帮转译出浏览器能接受的```css```，开发者们能操作的就是通过```js```去控制```DOM```与```CSSOM```来影响页面的变化，但是对于接下来的```layout```，```paint```与```composite```就几乎没有控制权了。

为了解决上述问题，为了让css的魔力不再被浏览器把持，```houdini```就诞生了。```css houdini```让开发者能够介入浏览器的```css engine```。

允许开发者自由扩展```css```此法分析器```Parser```，```Paint```，```Layout```。

```worklets```的概念和```web worker```类似，允许引入脚本文件并执行特定的```js```代码，这样的```js```代码要满足两个条件，第一可以在渲染流程中调用，第二和主线程独立。

```worklet```脚本严格控制了开发者所能执行的操作类型，这就保证了性能，```worklets```的特点就是轻量以及生命周期较短。

```js
CSS.paintWorklet.addModule('xxx.js');
CSS.layoutWorklet.addModule('xxx.js');
// xxx.js
registerPaint('xxx', class {
    static get inputProperties() {}
    static get inputArguments() {}
    paint(ctx, geom, props) {}
})

```

演示```css```。

```css
.el {
    --elUnit: 500px;
    --arcColor: yellow;
    height: var(--elUnit);
    width: var(--elUnit);
    --background-canvas: (ctx, geom) > { // 变量，可以使用函数
        // geom 当前类 .el 所有的信息
        // ctx相当于一个canvas
        ctx.strokeStyle = `var(--arcColor)`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(200, 200, 50, 0, 2*Math.PI);
        ctx.stroke();
        ctx.closePath();
    };
    background: paint(--background-canvas);
}
```

需要在```js```中进行激活。

```html
<script>
CSS.paintWorklet.addModule('./arc.js');
</script>
```

```arc.js```

```js
if (typeof registerPaint !== 'undefined') {
    registerPaint('background-canvas', class {
        stati