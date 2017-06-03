## 1. ECMAScript 概述

```ECMAScript```他也是一门脚本语言，一般缩写为```ES```，通常会把他看作为```JavaScript```的标准规范。

但实际上```JavaScript```是```ECMAScript```的扩展语言，因为```ECMAScript```只是提供了最基本的语法，通俗点来说只是约定了代码的如何编写，例如该怎么样定义变量或函数，怎样去实现分支或者循环之类的语句，这只是停留在语言层面，并不能完成应用中的实际功能的开发。

```JavaScript```实现了标准开发，在语言基础上做了一定的扩展，使得可以在浏览器环境中操```作DOM```和```BOM```，在```Node```环境可以读写文件等操作。

总的来说浏览器环境中的```JavaScript```等于```ECMAScript```加上```web```所提供的```API```，也就是```DOM```和```BOM```。

在```Node```环境中所使用的```JavaScript```，实际上就等于是```ECMAScript```加上```Node```所提供的一系列```API```。例如```fs```或者```net```这样的内置模块。

2015年开始```ECMAScript```就保持每年一个大版本的迭代。```JavaScript```这门语言的变得越来越高级，越来越便捷。

## 2. let 与块级作用域

在```ES2015```之前，```ECMAScript```当中只有全局作用域和函数作用域两种类型的作用域。在```ES2015```中又新增了一个块级作用域。

块指的就是代码中用一对```{}```所包裹起来的范围，例如```if```语句和```for```语句中的```{}```都会产生这里所说的块。

```js
if (true) {
    consoel.log('yd');
}

for (var i = 0; i < 10; i++) {
    console.log('yd');
}
```

在```ECMAScript2015```以前，块是没有单独的作用域的，这就导致在块中定义的成员外部也可以访问到。例如在```if```当中去定义了一个```foo```的变量，然后在```if```的外面打印这个```foo```，结果也是可以正常打印出来的。

```js
if (true) {
    var foo = 'yd';
}
console.log(foo); // yd
```

这一点对于复杂代码是非常不利的，也是不安全的，有了块级作用域之后，可以在代码当中通过```let```这个新的关键词声明变量。

他的用法和```var```是一样的，只不过通过```let```声明的变量他只能在所声明的这个代码块中被访问到。

```js
if (true) {
    let foo = 'yd';
}
console.log(foo); // foo is not defined
```

在快级内定义的成员，外部是无法访问的。

这样一个特性非常适合声明```for```循环当中的计数器。

```js
for (let i = 0; i < 3; i++) {
    for (let i = 0; i < 3; i++) {
        console.log(i); 
    }
}
```

## 3. const

他可以用来去声明一个只读的恒量或者叫常量，他的特点就是在```let```的基础上多了一个只读特性。

所谓只读指的就是变量一旦声明过后就不能够再被修改，如果在声明过后再去修改这个成员就会出现错误。

```js
const name = 'yd';

name = 'zd'; // 错误
```

这里要注意的问题```const```所声明的成员不能被修改，并不是说不允许修改恒量中的属性成员。下面这种情况是允许的。

```js
const obj = {}
obj.name = 'yd';
```

## 4. 数组的解构

```ECMAScript2015```新增了从数组或对象中获取指定元素的一种快捷方式，这是一种新的语法，这种新语法叫做解构。

```js
const arr = [100, 200, 300];
const [foo, bar, baz] = arr;
console.log(foo, bar, baz);
```

如果只是想获取其中某个位置所对应的成员，例如只获取第三个成员, 这里可以把前两个成员都删掉。但是需要保留对应的逗号。确保解构位置的格式与数组是一致的。这样的话就能够提取到指定位置的成员。

```js
const [, , baz] = arr;
console.log(baz);
```

除此之外还可以在解构位置的变量名之前添加```...```表示提取从当前位置开始往后的所有成员，最终所有的结果会放在一个数组当中。

```js
const [foo, ...rest] = arr;
console.log(rest);
```

三个点的用法只能在解构位置的最后一个成员上使用，另外如果解构位置的成员个数小于被解构的数组长度，就会按照从前到后的顺序去提取，多出来的成员就不会被提取。

反之如果解构位置的成员大于数组长度，那么提取到的就是```undefined```。这和访问数组当中一个不存在的下标是一样的。

```js
const [foo, bar, baz, more] = arr;
console.log(more); // undefined
```

如果需要给提取到的成员设置默认值，这种语法也是支持的，只需要在解构变量的后面跟上一个等号，然后后面写上一个默认值。

```js
const [foo, bar, baz, more = 'default value'] = arr;
console.log(more);
```

## 5. 对象的解构

对象也同样可以被解构，不过对象的结构需要去根据属性名去匹配提取，而不是位置。

```js
const obj = { name: 'yd', age: 18 };
```

解构他里面的成员就是在以前变量位置去使用一个对象字面量的```{}```, 然后在```{}```里同样也是提取出来的数据所存放的变量名，不过这里的变量名还有一个很重要的作用就是去匹配被解构对象中的成员，从而去提取指定成员的值。

```js
const obj = { name: 'yd', age: 18 };

const { name } = obj;
```

解构对象的其他特点基本上和解构数组是完全一致的。未匹配到的成员返回```undefined```，也可以设置默认值。

在对象当中有一个特殊的情况，解构的变量名是被解构对象的属性名，所以说当前作用域中如果有这个名称就会产生冲突。这个时候可以使用重命名的方式去解决这个问题。

```js
const obj = { name: 'yd', age: 18 };

const { name: name1 } = obj;

console.log(name1);
```

解构对象的应用场景比较多，不过大部分的场景都是为了简化代码，比如代码中如果大量用到了console对象的方法，可以先把这个对象单独解构出来，然后再去使用独立的log方法。

```js
const { log } = console;
log('1');
```

## 6. 模板字符串

传统定义字符串的方式需要通过```'```或者是```"```来标识。```ES2015```新增了模板字符串，使用反引号\`声明，。如果在字符串中需要使用\`，可以使用斜线去转译。

在模板字符串当中可以支持多行字符串。

```js
const str = `
123
456
`
```

模板字符串当中还支持通过插值表达式的方式在字符串中去嵌入所对应的数值，在字符串中可以使用```${name}```就可以在字符串当中嵌入```name变```量中的值。

```js
const name = 'yd';
const age = 18;

const str = `my name is ${name}, I am ${age} years old`;

```

那种方式会比之前字符串拼接方式要方便的多页更直观一点，不容易写错，事实上```${}```里面的内容就是标准的```JavaScript```也就是说这里不仅仅可以嵌入变量，还可以嵌入任何标准的```js```语句。

## 7. 带标签的模板字符串

模板字符串还有一个更高级的用法，就是在定义模板字符串的时候可以在前面添加一个标签，这个标签实际上是一个特殊的函数。添加标签会调用这个函数。 

```js
const name = 'yd';
const age = 18;

const result = tag`My name is ${name}, I am ${age} years old`;
```

函数可以接收到一个数组参数，是模板字符串内容分割过后的结果。

```js
const tag = (params) => {
    consoel.log(params); // ['My name is ', ' I am ', ' years old'];
}
```

除了这个数组以外，还可以接收到所有在这个模板字符串中出现的表达式的返回值。

```js
const tag = (params, name, age) => {
    consoel.log(params, name, age); // ['My name is ', ' I am ', ' years old']; 'yd' 18
}

const str = tag`hello ${'world'}`;

```

## 8. 字符串扩展方法

字符串对象存在几个非常常用的方法。分别是```includes```，```startsWith```和```endsWith```。

### 1. startWith

如果想要知道这个字符串是否以```Error```开头。

```js
console.log(message.startsWith('Error')); // true
```

### 2. endsWith

同理如果想要知道这个字符串是否以```.```结尾。

```js
console.log(message.endsWith('.')); // true
```

### 3. includes

如果需要明确的是字符串中间是否包含某个内容。

```js
console.log(message.includes('foo')); // true
```

## 9. 函数参数默认值

以前想要为函数中的参数去定义默认值需要在函数体中通过逻辑代码来实现。

```js
function foo (enable) {
    enable = enable === undefined ? true : enable;
    console.log(enable); // false
}

foo(false);
```

有了参数默认值这个新功能以后，可以直接在形参的后面直接通过等号去设置一个默认值。

```js
function foo (enable = true) {
    console.log(enable); // false
}

foo(false);
```

如果有多个参数的话，带有默认值的这种形参一定要出现在参数列表的最后。

```js
function foo (bar, enable = true) {
    console.log(enable); // false
}

foo(false);
```

## 10. 剩余参数

对于未知个数的参数，以前都是使用```arguments```对象去获取，```arguments```对象实际上是一个伪数组，在````ES2015````当中新增了一个```...```操作符，也就是剩余操作符，可以在函数的形参前面加上```...```, 此时这个形参args就会以数组的形式去接收从当前这个参数的位置开始往后所有的实参。

```js

// function foo() {
//     console.log(arguments); // 参数集合
// }

function foo (...args) => {
    console.log(args); // 参数集合
}

foo(1, 2, 3, 4);
```

因为接收的是所有的参数，所以这种操作符只能出现在形参列表的最后一位，并且只可以使用一次。

## 11. 展开数组

```...```操作符除了可以收起剩余数据这还有一种```spread```的用法，意思就是展开。

例如这里有一个数组，想要把数组当中的每一个成员按照次序传递给```console.log```方法，最原始的办法是通过下标一个一个去找到数组当中的每一个元素，分别传入到console.log方法当中。在```ES2015```当中就没有必要这么麻烦了，可以直接去调用```console```的```log```方法，然后通过```...```的操作符展开这里的数组。```...```操作符会把数组当中的每一个成员按照次序传递到列表当中。

```js
console.log( ...arr );
```

## 12. 箭头函数

```在ECMAScript```当中简化了函数表达式的定义方式允许使用```=>```这种类似箭头的符号来去定义函数，那这种函数一来简化了函数的定义，二来多了一些特性具体来看。

传统来定义一个函数需要使用```function```关键词，现在可以使用```ES2015```来去定义一个完全相同的函数。

```js
function inc (number) {
    return number + 1;
}

const inc = n =