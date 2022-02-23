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

const inc = n => n + 1;
```

此时你会发现，相比于普通的函数，剪头函数确实大大简化了所定义函数这样一些相关的代码。

剪头函数的左边是参数列表，如果有多个参数的话可以使用```()```包裹起来，剪头的右边是函数体。如果在这个函数的函数体内需要执行多条语句，同样可以使用```{}```去包裹。如果只有一句代码可以省略```{}```。

```js
const inc = (n , m) => {
    return  n + 1;
};
```

对比普通函数和剪头函数的写法你会发现，使用剪头函数会让代码更简短，而且更易读。

### 1. this

相比普通函数，箭头函数有一个很重要的变化就是不会改变```this```的指向。

定义一个```person```对象，然后在这个对象当中去定义一个```name```属性，然后再去定义一个```sayHi```的方法，这个方法中可以使用```this```去获取当前对象。

```js
const person = {
    name: 'yd',
    sayHi: function() {
        console.log(this.name);
    }
}

person.sayHi(); // yd
```

这里把```sayHi```改为箭头函数的方式。这个时候打印出来的```name```就是```undefined```

```js
const person = {
    name: 'yd',
    sayHi: () => {
        console.log(this.name);
    }
}

person.sayHi(); // undefined
```

这就是箭头函数和普通函数最重要的区别，在剪头函数当中没有```this```的机制。所以说不会改变```this```的指向。也就是说在剪头函数的外面```this```是什么，在里面拿到的就是什么，任何情况下都不会发生改变。

## 13. 对象字面量的增强

传统的字面量要求必须在```{}```里面使用```属性名: 属性值```这种语法。即便说属性的值是一个变量，那也必须是```属性名: 变量名```, 而现在如果变量名与添加到对象中的属性名是一样的，可以省略掉```:```变量名。

```js
const bar = '123';
const obj = {
    key: 'value',
    bar
}
```

除此之外如果需要为对象添加一个普通的方法，现在可以省略里面的```:function```。

```js
const obj = {
    method1 () {
        console.log('method1');
    }
}

console.log(obj)
```

需要注意的是这种方法的背后他实际上就是普通的```function```，也就是说如果通过对象去调用这个方法，那么内部的```this```就会指向当前对象。

## 14. 动态属性名

另外对象字面量还有一个很重要的变化就是，他可以使用表达式的返回值作为对象的属性名。以前如果说要为对象添加一个动态的属性名，只能在对象创建过后，然后通过索引器的方式也就是```[]```来去动态添加。

```js
const obj = {};

obj[Math.random()] = 123;
```

在```ES2015```过后，对象字面量的属性名直接可以通过```[]```直接去使用动态的值了，这样一个特性叫做计算属性名，具体的用法就是在属性名的位置用```[]```包起来。在里面就可以使用任意的表达式了。这个表达式的执行结果将会作为这个对象的属性名。

```js
const obj = {
    [Math.random()]: 123,
}
```

## 15. Object.assign

这个方法可以将多个源对象当中的属性复制到一个目标对象当中，如果对象当中有相同的属性，那么源对象当中的属性就会覆盖掉目标对象的属性。

这里所说的源对象和目标对象他们都是普通的对象，只不过用处不同，是从源对象当中取，然后往目标对象当中放。

例如这里先定义一个```source1```对象，在这个对象当中定义一个```a```属性和一个```b```属性。然后再来定义一个```target```对象，这个对象当中也定义一个```a```属性，还有一个```c```属性。

```js
const source1 = {
    a: 123,
    b: 123,
}

const target = {
    a: 456,
    c: 456
}
```

```Object.assign```支持传入任意个数的参数，其中第一个参数就是目标对象，也就是说所有源对象当中的属性都会复制到目标对象当中。这个方法的返回值也就是这个目标对象。

```js

const result = Object.assign(target, source1);

console.log(target, result === target); {a: 123, c: 456, b: 123 }// true
```

```Object.assign```用来为```options```对象参数设置默认值也是一个非常常见的应用场景。

```js
const default = {
    name: 'yd',
    age: 18
}

const options = Object.assign(default, opt);
```

## 16. Object.is

```is```方法用来判断两个值是否相等。在此之前```ECMAScript```当中去判断两个值是否相等可以使用```==```运算符。或者是```===```严格相等运算符。

这两者是区别是```==```会在比较之前自动转换数据类型，那也就会导致```0 == false```这种情况是成立的。而```===```就是严格去对比两者之间的数值是否相同。因为```0```和```false```他们之间的类型不同所以说他们是不会严格相等的。

但是严格相等运算符他也有两个特殊情况，首先就是对于数字```0```，他的```正负```是没有办法区分的。

其次对```于NaN```, 两个```NaN```在```===```比较时是不相等的。以前认为```NaN```是一个非数字，也就是说他有无限种可能，所以两个```NaN```他是不相等的，但在今天看来，````NaN````他实际上就是一个特别的值，所以说两个```NaN```他应该是完全相等的。

所以在```ES2015```中就提出了一种新的同值比较的算法来解决这个问题，通过```Obejct.is```正负零就可以被区分开，而且```NaN```也是等于```NaN```的。

```js
Object.is(+0, -0); // false
Object.is(NaN, NaN); // true
```

不过一般情况下根本不会用到这个方法，大多时候还是使用严格相等运算符，也就是```===```。

## 17. Proxy

专门为对象设置访问代理器的，那如果你不理解什么是代理可以想象成门卫，也就是说不管你进去那东西还是往里放东西都必须要经过这样一个代理。

通过```Proxy```就可以轻松监视到对象的读写过程，相比于````defineProperty````，```Proxy```的功能要更为强大甚至使用起来也更为方便。

通过```new Proxy```的方式创建代理对象。

```Proxy```构造函数的第一个参数就是需要代理的对象，第二个参数是代理对象处理对象，这可以通过```get```方法来去监视属性的访问，通过```set```方法来截取对象当中设置属性的过程。

```js
const person = {
    name: 'yd',
    age: 18
}

const personProxy = new Proxy(person, {
    get() {},
    set() {}
})

```

get方法可以接收两个参数，第一个就是所代理的```目标对象```，第二个就是外部所访问的这个属性的```属性名```。。

```js
{
    get(target, property) {
        console.log(target, property);
        return property in target ? target[property] : undefined;
    }
}
```

set方法接收三个参数, 分别是```代理目标对象```，以及要写入的```属性名```和```属性值```。

```js
{
    set(target, property, value) {
        console.log(target, property, value);
        if (property === 'age') {
            if (!Number.isInteger(value)) {
                throw new TypeError(``${value} must be a integer);
            }
        }
        target[property] = value;
    }
}
```

### 1. Proxy 对比 defineProperty

相比于```Object.defineProperty```,```Proxy```到底有哪些优势。

```Object.defineProperty```只能监听到对象属性的```读取```或```写入```，```Proxy```除读写外还可以监听对象中属性的```删除```，对对象当中```方法调用```等。

```js
const person = {
    name: 'yd',
    age: 18
}
const personProxy = new Proxy(person, {
    deleteProperty(target, property) {
        console.log(target, property);
        delete target[property];
    },
})
```

除了```delete```以外, 还有很多其他的对象操作都能够被监视到，列举如下。

get: 读取某个属性

set: 写入某个属性

has:```in```操作符调用

deleteProperty:```delete```操作符调用

getProperty:```Object.getPropertypeOf()```

setProperty:```Object.setProtoTypeOf()```

isExtensible:```Object.isExtensible()```

preventExtensions:```Object.preventExtensions()```

getOwnPropertyDescriptor:```Object.getOwnPropertyDescriptor()```

defineProperty:```Object.defineProperty()```

ownKeys:```Object.keys()```,```Object.getOwnPropertyNames()```,```Object.getOwnPropertSymbols()```

apply: 调用一个函数

construct: 用```new```调用一个函数。

第二点是对于数组对象进行监视更容易。

通常想要监视数组的变化，基本要依靠重写数组方法，这也是```Vue```的实现方式，```Proxy```可以直接监视数组的变化。

```js
const list = [];
const listProxy = new Proxy(list, {
    set(target, property, value) {
        console.log(target, property, value);
        target[property] = value;
        return true; // 写入成功
    }
});

listProxy.push(100);
```

```Proxy```内部会自动根据```push```操作推断出来他所处的下标，每次添加或者设置都会定位到对应的下标```property```。数组其他的也谢操作方式都是类似的。

最后```Proxy```是以非入侵的方式监管了对象的读写，那也就是说一个已经定义好的对象不需要对对象本身去做任何的操作，就可以监视到他内部成员的读写，而```defineProperty```的方式就要求必须按特定的方式单独去定义对象当中那些被监视的属性。

对于一个已经存在的对象要想去监视他的属性需要做很多额外的操作。这个优势实际上需要有大量的使用然后在这个过程当中去慢慢的体会。

## 18. Reflect

如果按照```java```或者```c#```这类语言的说法，```Reflect```属于一个静态类，也就是说他不能通过```new```的方式去构建一个实例对象。只能够去调用这个静态类中的静态方法。

这一点应该并不陌生，因为在```javascript```中的```Math```对象也是相同的，```Reflect```内部封装了一系列对对象的底层操作，具体一共提供了```14```个静态方法，其中有```1```个已经被废弃掉了，那还剩下```13```个，仔细去查看```Reflect```的文档会发现这```13```个方法的方法名与```Proxy```的处理对象里面的方法成员是完全一致的。

其实这些方法就是````Proxy````处理对象那些方法内部的默认实现.

```js
const obj = {
    foo: '123',
    bar: '456',
}

const Proxy = new Proxy(obj, {
    get(target, property) {
        console.log('实现监视逻辑');
        return Reflect.get(target, property);
    }
})
```

这也就表明在实现自定义的```get```或者```set```这样的逻辑时更标准的做法是先去实现自己所需要的监视逻辑，最后再去返回通过```Reflect```中对应的方法的一个调用结果。

个人认为```Reflect```对象最大的意义就是他提供了一套统一操```作Object```的```API```，因为在这之前去操作对象时有可能使用```Object```对象上的方法，也有可能使用像```delete```或者是```in```这样的操作符，这些对于新手来说实在是太乱了，并没有什么规律。

```Reflect```对象就很好的解决了这样一个问题，他统一了对象的操作方式。

## 19. Promise

```Promise```提供了一种全新的异步编程解决方案，通过链式调用的方式解决了在传统异步编程过程中回调函数嵌套过深的问题。

关于```Promise```的细节有很多内容，所以说这里先不做详细介绍在```JavaScript```异步编程的文章中已经专门针对```Promise```进行了详细的分析。

## 20. class类

以前```ECMAScript```中都是通过定义函数以及函数的原型对象来去实现的类型，在构造函数中可以通过this去访问当前的实例对象，如果需要在这个类型所有的实例间去共享一些成员，可以借助于函数对象的```prototype```, 也就是原型去实现。

```js
function Person (name) {
    this.name = name;
}

Person.prototype.say = function() {
    console.log(this.name);
}
```

```ECMAScript2015```可以使用一个叫做```class```的关键词来声明类型，这种独立定义类型的语法，要更容易理解，结构也会更加清晰。

```js
class Person {

}
```

这种语法与一些老牌面向对象语言当中```class```非常相似的。如果需要在构造函数当中做一些额外的逻辑，可以添加一个```constructor```方法，这个方法就是构造函数。

同样可以在这个函数中使用```this```去访问当前类型的实例对象。

```js
class Person {
    constructor (name) {
        this.name = name;
    }
    say() {
        console.log(this.name);
    }
}
```

### 1. 静态方法

类型中的方法分为```实例方法```和```静态方法```，实例方法就是需要通过这个类型构造的实例对象去调用，静态方法是直接通过类型本身去调用。可以通过static关键字定义。

```js
class Person {
    constructor (name) {
        this.name = name;
    }
    say() {
        console.log(this.name);
    }
    static create (name) {
        return new Person(name);
    }
}
```

调用静态方法是直接通过类型然后通过成员操作符调用方法名字。

```js
const yd = Person.create('yd');
```

注意：因为静态方法是挂载到类型上面的，所以说在静态方法内部他不会指向某一个实例对象，而是当前的类型。

### 2. 类的继承

继承是面向对象当中一个非常重要的特性，通过继承这种特性能抽象出来相似类型之间重复的地方, 可以通过关键词```extends```实现继承。

super对象指向父类, 调用它就是调用了父类的构造函数。

```js
class Student extends Person {
    constructor(name, number) {
        super(name);
        this.number = number;
    }
    hello () {
        super.say();
        console.log(this.number);
    }
}

const s = new Student('yd', '100');

s.hello();
```

## 21. Set

可以把他理解为集合，他与传统的数组非常类似，不过```Set```内部的成员是不允许重复的。那也就是说每一个值在同一个```Set```中都是唯一的。

通过这个类型构造的实例就用来存放不同的数据。可以通过这个实例的```add```方法向集合当中去添加数据，由于```add```方法他会返回集合对象本身，所以可以链式调用。如果在这个过程中添加了之前已经存在的值那所添加的这个值就会被忽略掉。

```js
const s = new Set();

s.add(1).add(2).add(3).add(2);
```

想要遍历集合当中的数据，可以使用集合对象的```forEach```方法去传递一个回调函数。

```js
s.forEach(i => console.log(i));
```

也可以使用```for...of```循环。

```js
for (let i of s) {
    console.log(i);
}
```

可以通过```size```属性来去获取整个集合的长度。

```js
console.log(s.size);
```

```has```方法就用来判断集合当中是否存在某一个特定的值。

```js
console.log(s.has(100)); // false
```

```delete```方法用来删除集合当中指定的值，删除成功将会返回一个```true```。

```js
console.log(s.delete(3)); // true
```

```clear```方法用于清除当前集合当中的全部内容。

```js
s.clear()
```

## 22. Map

```Map```结构与对象非常类似，本质上他们都是```键值对集合```但是这种对象结构中的键，只能是字符串类型，如果说用其他类型作为键会被转换成字符串，出现```[object object]```。不同的对象转换成字符串可能会变成相同的键名```[object object]```