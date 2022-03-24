## 1. 注释

用正则/\/*[\s\S]*?*\//全局匹配注释，替换为空字符串

## 2. 选择器

| 选择器 | 示例 |
| -- | -- |
| 通配符选择器 | * |
| ID选择器 | #id |
| 类选择器 | .class |
| 元素选择器 | div |
| 属性选择器 | [attr="value"] |
| 伪类选择器 | a:hover |
| 伪元素选择器 | a::before |

## 3. 选择器有组合方式

后代选择器，后代选择器，子代选择器，相邻兄弟选择器，通用兄弟选择器，标签属性选择器，类属性选择器，通配符属性选择器，交集选择器，并集选择器

## 4. 选择器效率

ID > 类 > 类型（标签） > 相邻 > 子代 > 后代 > 通配符 > 属性 > 伪类

多使用高效率选择器，减少选择器层级，高效率选择器在前，避免使用通配符选择器，多用继承

## 5. 继承

字体 font 系列
文本 text-align text-ident line-height letter-spacing
颜色 color
列表 list-style
可见性 visibility
光标 cursor

## 6. 重置属性

all:initial相当于清空了用户配置和浏览器默认样式

工作中，我们更希望重置到默认样式，而不是清空它们

all:revert属性还原。可以将子元素的属性重置按如下规则重置：

继承属性：重置到父元素的属性值
非继承属性或父元素继承属性都未设置：重置到用户配置和浏览器默认属性

## 7. 优先级规则

开发者定义选择器 > 用户定义选择器 > 浏览器默认选择器

内联样式 > 内、外部样式

ID 选择器 > 类选择器、属性选择器、伪类选择器 > 类型选择器、伪元素选择器

相同优先级，书写顺序后 > 前

同级选择器，复合选择器 > 单选择器

自身的选择器 > 继承自父级的选择器

用户配置 !important 声明 > 开发者 !important 声明 > 其它

## 8. 限制 CSS 选择器的作用域

通过 CSS 命名限制，通过 Shadow DOM 限制，通过 @document 限制，通过 CSS Modules 限制

## 9. 单位

px，pt，em，rem，%，vw，vh，cm、mm、in、pc 和 Q

## 10. 百分比 % 相对于谁

百分比总是相对于父元素，无论是设置 font-size 或 width 等。如果父元素的相应属性，经浏览器计算后，仍无绝对值，那么 % 的实际效果等同于 默认值，如 height: 100%

## 11. 盒模型

内容 content + 内边距 padding + 边框 border + 外边距 margin

## 12. 默认是如何布局

writing-mode: horizontal-tb | vertical-rl | vertical-lr | sideways-rl | sideways-lr

## 13. 超出...

text-overflow: ellipsis;
white-spacing: nowrap;
overflow: hidden;

display: webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 1;

## 14. 滚动

-webkit-overflow-scrolling: touch;

## 15. flex

## 16. column

## 17. grid

## 18. 块级格式上下文

块级格式上下文，英文全称是 Block Formatting Context，简称 BFC

它声明了一块布局区域，浏览器对区域内盒子按照一定方式布局，包括默认布局、弹性布局、网格布局、表格布局等

默认布局时，区域高度包含浮动元素高度

不同区域间相互独立，区域内的盒子和区域外的盒子互不影响

不同区域不会发生外边距折叠

可以根据布局、溢出处理和有限布局，用不同方法创建块级格式上下文

绝对定位：position:absolute和position:fixed
浮动：float:left float:right

行内块元素：display: inline-block

溢出处理

overflow:hidden隐藏滚动条，裁剪溢出内容

overflow:scroll显示滚动条，裁剪溢出内容

overflow:auto未溢出，隐藏滚动条。溢出，显示滚动条

有限布局

contain属性值不为none

弹性布局

display:flex直接子元素

display:inline-flex直接子元素

网格布局

display:gird直接子元素

display:inline-gird直接子元素

多列布局（分栏布局）

column-count分栏数属性值不为auto

column-width分栏列宽属性值不为auto

column-span:all跨越所有列，表现为不分栏

表格布局

display:table表格

display:inline-table内联表格

display:table-cell单元格

display:table-caption表格标题

display:table-row行

display:table-row-grouptbody

display:table-header-groupthead

display:table-footer-grouptfoot

## 19. 哪些定位方式

static，relative，absolute，fixed，sticky

## 20. 层叠上下文

层叠上下文是元素在Z轴上的层次关系集合并影响渲染顺序，设置z-index可改变position不为static的元素的层叠顺序

层叠上下文中父元素层级决定了子元素层级，兄弟元素间的层级由z-index影响

## 21. 水平居中

text-align: centet，margin: 0 auto

justify-content: center

## 22. 垂直居中

line-height，vertical-align: middle，align-items: center

## 23. 圣杯布局

```html
<style>
body { margin: 0; }
div {
  text-align: center;
  color: #fff;
}
.header, .footer {
  height: 50px;
  background-color: pink;
  line-height: 50px;
}
.content {
  padding-left: 200px;
  padding-right: 150px;
  min-width: 500px;
  line-height: 500px;
}
.content > div {
  float: left;
  height: 500px;
}
.center {
  width: 100%;
  background-color: mediumturquoise;
}
.left, .right {
  position: relative;
}
.left {
  width: 200px;
  right: 200px;
  margin-left: -100%;
  background-color: skyblue;
}
.right {
  width: 150px;
  right: -150px;
  margin-left: -150px;
  background-color: lightsteelblue;
}
.footer {
cl  ear: both;
}
</style>
  <div class="header">header</div>
  <div class="content">
  <div class="center">center</div>
  <div class="left">left</div>
  <div class="right">right</div>
</div>
<div class="footer">footer</div>
```

## 24. 双飞翼布局

```html
<style>
body { margin: 0; }
div {
  text-align: center;
  color: #fff;
}
.header, .footer {
  height: 50px;
  background-color: pink;
  line-height: 50px;
}
.content > div {
  float: left;
  height: 500px;
  line-height: 500px;
}
.center {
  width: 100%;
  background-color: mediumturquoise;
}
.inner {
  height: 500px;
  margin-left: 200px;
  margin-right: 150px;
}
.left {
  margin-left: -100%;
  width: 200px;
  background-color: skyblue;
}
.right {
  margin-left: -150px;
  width: 150px;
  background-color: lightsteelblue;
}
.footer {
c  lear: both;
}
</style>
<div class="header">header</div>
<div class="content">
<div class="center">
<div class="inner">center-inner</div>
<div>
  <div class="left">left</div>
  <div class="right">right</div>
</div>
<div class="footer">footer</div>
```

## 25. 浏览器是如何解析和渲染 CSS 的

浏览器解析和渲染 CSS 的步骤：

解析
将 CSS 字符串转换为包括选择器、属性名、属性值的数据结构，长度单位被转换为像素，关键字被转换为具体值，需要计算的函数转为具体值

级联
相同元素相同属性的最终值基本由书写顺序，按先后决定，此外：

!important > 其它
style属性 > 其它
选择器优先级
ID > 类 > 类型（标签） > 相邻 > 子代 > 后代 > 通配符 > 属性 > 伪类

开发者 > 用户配置 > 浏览器默认属性

层叠

根据position不为static等属性或弹性布局中的子元素等情况创建层叠上下文。根据z-index决定层的叠加顺序

Render Tree
深度优先遍历之前解析 HTML 得到的 Dom Tree，匹配解析 CSS 得到的 CSSOM

计算元素的位置、宽高，将可见元素的内容和样式放入 Render Tree

布局
分层按照流式布局（块、内联、定位、浮动）、弹性布局、网格布局或表格布局等布置元素，按照尽可能多地展示内容的原则，处理溢出

绘制
分层绘制颜色、边框、背景、阴影

合成
将不同图层分格渲染出位图，可交由 GPU 线程处理

处理图层的透明度opactiy，和变形transform等

将所有图层合到一起

重新渲染
JS 更改 CSS 属性，CSS 动画以及伪类（如hover），内容变更等，可能会引起浏览器重新布局、绘制或者合成

## 26. 获取 CSS 样式的接口

style
可读写
属性名驼峰写法
通过内联样式style读写属性
currentStyle
可读
兼容连字符-写法
IE5.5 - IE8
getComputedStyle
可读
兼容连字符-写法
IE9+
来自CSS Object Model，计算后的属性
支持伪类
document.styleSheets
可读
获取规则列表
IE9+
可写支持insertRule``deleteRule

## 27. 重排和重绘

引起重排的属性

| 类型 | 属性名 |
| --- | --- |
| 盒模型 | displaypaddingmarginwidthheightmin-heightmax-heightborderborder-width |
| 定位和浮动 | positiontopbottomleftrightfloatclear |
| 文字及溢出 | font-familyfont-sizefont-weightline-heighttext-alignvertical-alignwhite-spaceoverflowoverflow-y |

引起重绘的属性

| 类型 | 属性名 |
| --- | --- |
| 颜色 | color |
| 边框 | border-colorborder-styleborder-radius |
| 背景 | backgroundbackground-imagebackground-positionbackground-repeatbackground-size |
| 轮廓 | outlineoutline-coloroutline-styleoutline-width |
| 可见性 | visibility |
| 文字方向 | text-decoration |
| 发光 | box-shadow |

引起合成的属性

| 类型 | 属性名 |
| --- | --- |
| 变形 | transform |
| 透明度 | opacity |

使用position:absolute或position:fixed等方法创建层叠上下文

使用contain:layout或contain:paint等属性值，让当前元素和内容独立于 DOM 树

减少使用display:table表格布局

利用浏览器自身优化

引起回流、重绘的属性操作会放入队列，达到一定数量或时间，再一次渲染
用变量缓存元素的属性值
要设置的属性值减少依赖其它属性值
避免频繁读取计算属性值

手动一次渲染

强制使用style.cssText或setAttribute('style', 样式)将所有设置的属性，一次写入内联样式

优化 DOM 树

使用文档碎片或display:none隐藏节点，缓存要插入的节点，之后将缓存结果一次性插入 DOM 树并显示

使用replaceChild``cloneNode减少先删除、创建再插入 DOM 的场景


## 28. 色相

```css
filter:hue-rotate(60deg); // 色相旋转60度
```

## 29. 蒙版

```css
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

## 30. 设置滚动条

```css
div::-webkit-scrollbar {
    width: 200px;
}
```

```css
-webkit-scrollbar: // 滚动条
-webkit-scrollbar-button:  // 滚动条上下箭头
-webkit-scrollbar-thumb: // 滚动按钮
-webkit-scrollbar-track: // 滚动区域
-webkit-scrollbar-track-piece: // 剩余滚动区域
-webkit-scrollbar-comer: // 横纵滚动交界
-webkit-scrollbar-resizer: // 纵向滚动交界
```

## 31. 拖动

```css
resize: horizontal;
```

## 32. 遮罩

```css
-webkit-mask-image: url(png文件遮罩)
```

## 33. 混合模式

```css
mix-blend-mode: hue; // 屏蔽灰色之后着色。
background-blend-mode: darken; // 背景混合模式
```

## 34. 滤镜

```css
filter: brightness(80%) grayscale(20%) contrast(1.2); // 光线下降80%；灰度20%；对比度
```

白天变黑夜

```css
background-blend-mode: darken;
filter: brightness(80%) grayscale(20%) contrast(1.2);
```

## 35. 自助滚动

父元素

```css
white-space: nowrap;
scroll-snap-align: x mandatory;
```

子元素固定宽度。

```css
scroll-snap-align: start;
```

## 36. 画图形

```css
shape-outsize: polygon(0, 0, 25%, 0, 57%);
```

响应式布局核心知识

```css
repeat() // 函数
minimax() // 函数
auto-fill/auto-fit
grid-auto-flow
max-content/min-content
```

## 37. 阴影

文本

```css
text-shadow: 横向偏移 纵向偏移 大小 颜色
```

盒子

```css
box-shadow: [insert] 横向偏移 纵向偏移 大小 [阴影区] 颜色
```
## 38. 渐变，一般只能加在背景上

线性渐变

```css
background-image: linear-gradient(left top, green);
```

径向渐变

```css
background-image: radial-gradient(left top, green);
```

## 39. animation

```css
animation-name: // 动画名称
animation-duration: // 时长
animation-timing-function: // ease 运动方式
animation-fill-mode: forwards; // 结束填充模式，恢复还是保留
animation-iteration-count: // 循环次数
animation-direction: alternate; // 循环方向
animation-play-state: paused; // 暂停
```

## 40. 分栏布局

columns

column-width

column-count

column-gap

column-rule < column-rule-width > | < column-rule-style > | < column-rule-color >

column-fill: auto | balance

column-span: none | all

column-break-before：auto | always | avoid | left | right | page | column | avoid-page | avoid-column

column-break-after：auto | always | avoid | left | right | page | column | avoid-page | avoid-column

column-break-inside：auto | avoid | avoid-page | avoid-column

## 41. 网格布局

```css
display: grid;
grid-template-columns: 100px 100px 100px;
grid-template-rows: 100px 100px 100px;
/* grid-template-columns: repeat(3, 33.33%); */
/* grid-template-columns: 1fr 1fr; */
/* grid-template-columns: 1fr 1fr minmax(100px, 1fr); */
```

grid-row-gap 属性

grid-column-gap 属性

grid-gap 属性

```css
grid-gap: <grid-row-gap> <grid-column-gap>;
```

```css
grid-auto-flow: column;
```

这个顺序由grid-auto-flow属性决定，默认值是row，即"先行后列"。也可以将它设成column，变成"先列后行"。grid-auto-flow属性除了设置成row和column，还可以设成row dense和column dense。这两个值主要用于，某些项目指定位置以后，剩下的项目怎么自动放置。

justify-items 属性

align-items 属性

place-items 属性

```css
justify-items: start | end | center | stretch;
align-items: start | end | center | stretch;
```

place-items属性是align-items属性和justify-items属性的合并简写形式

justify-content 属性

align-content 属性

place-content 属性

```css
justify-content: start | end | center | stretch | space-around | space-between | space-evenly;
align-content: start | end | center | stretch | space-around | space-between | space-evenly;  
```

justify-self 属性

align-self 属性

place-self 属性

```css
justify-self: start | end | center | stretch;
align-self: start | end | center | stretch;
```

## 42. 弹性布局

flex-direction

```css
flex-direction: row | row-reverse | column | column-reverse;
```

flex-wrap

```css
flex-wrap: nowrap | wrap | wrap-reverse;
```

flex-flow

```css
flex-flow: <flex-direction> || <flex-wrap>;
```

justify-content

```css
justify-content: flex-start | flex-end | center | space-between | space-around;
```

align-items

```css
align-items: flex-start | flex-end | center | baseline | stretch;
```

align-content

```css
align-content: flex-start | flex-end | center | space-between | space-around | stretch;
```

order

```css
order: <integer>;
```

flex-grow

```css
flex-grow: <number>; /* default 0 */
```

flex-shrink

```css
flex-shrink: <number>; /* default 1 */
```

flex-basis

```css
flex-basis: <length> | auto; /* default auto */
```

flex

```css
flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
```

align-self

```css
align-self: auto | flex-start | flex-end | center | baseline | stretch
```
