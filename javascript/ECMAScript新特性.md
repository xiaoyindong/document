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

```Map```结构与对象非常类似，本质上他们都是```键值对集合```但是这种对象结构中的键，只能是字符串类型，如果说用其他类型作为键会被转换成字符串，出现```[object object]```。不同的对象转换成字符串可能会变成相同的键名```[object object]```导致数据覆盖丢失。

```Map```类型才算是严格上的键值对类型，用来映射两个任意类型之间键值对的关系。可以使用这个对象的```set```方法去存数据。键可以是任意类型的数据。不需要担心他会被转换为字符串。

```js
const m = new Map();

const key = {};

m.set(key, 18);

console.log(m);
```

可以使用```get```方法获取数据，```has```方法判断他里面是否存在某个键。```delete```方法删除某个键。```clear```方法清空所有的键值。

```js
console.log(m.get(key));

console.log(m.has(key));

m.delete(key);

m.clear();
```

可以使用forEach方法遍历。在这个方法的回调函数当中第一个参数就是被遍历的值，第二个参数是被遍历的键。

```js
m.forEach((value, key) => {
    console.log(value, key);
})
```

## 23. Symbol

在```ECMAScript2015```之前对象的属性名都是字符串，而字符串是有可能会重复的。如果重复的话就会产生冲突，比如在使用第三方模块时，如果需要扩展第三方模块，而这时就有可能把第三方模块的方法覆盖掉，导致代码执行异常。

```ES2015```提供了一种全新的原始数据类型```Symbol```，翻译过来的意思叫做符号，翻译过来就是表示一个独一无二的值。

通过```Symbol```函数就可以创建一个```Symbol```类型的数据，而且这种类型的数据```typeof```的结果也是```symbol```，那这也就表示他确实是一个全新的类型。

```js
const s = Symbol();
typeof s; // symbol类型
```

这种类型最大的特点就是独一无二，通过```Symbol```函数创建的每一个值都是唯一的永远不会重复。

```js
Symbol() === Symbol(); // false
```

```Symbol```创建时允许接收一个字符串，作为这个值的描述文本, 对于多次使用```Symbol```时就可以区分出是哪一个```Symbol```，这个参数仅是描述作用，相同的描述字段生成的值仍是不同的。

```js
const s1 = Symbol('foo');
const s2 = Symbol('foo');

s1 === s2; // false

```

```ES2015```开始对象允许使用```Symbol```作为属性名。那也就是说现在对象的属性名可以是两种类型，```string```和```Symbol```。

```js
const person = {
    [Symbol()]: 123,
    [Symbol()]: 456
}
```

```Symbol```除了用在对象中避免重复以外，还可以借助这种类型的特点来模拟实现对象的私有成员。以前私有成员都是通过约定，例如约定使用下划线开头就表示是私有成员。约定外界不允许访问下划线开头的成员。

现在有了```Symbol```就可以使用```Symbol```去作为私有成员的属性名了。在这个对象的内部可以使用创建属性时的```Symbol```。去拿到对应的属性成员。

```js
const name = Symbol();
const person = {
    [name]: 'yd',
    say() {
        return this[name];
    }
}
```

截止到```2020```标准，```ECMAScript```一共定义了8种数据类型。

如果需要在全局去复用一个相同的```Symbol```值，可以使用全局变量的方式去实现，或者是使用```Symbol```类型提供的一个静态方法```for```，这个方法接收一个字符串作为参数，相同的参数一定对应相同的值。

```js
const s1 = Symbol.for('foo');
const s2 = Symbol.for('foo');

s1 === s2; // true
```

这个方法维护了一个全局的注册表，为字符串和```Symbol```提供了一个对应关系。需要注意的是，在内部维护的是字符串和```Symbol```的关系，那也就是说如参数不是字符串，会转换为字符串。

```js
const s1 = Symbol.for('true');
const s2 = Symbol.for(true);

s1 === s2; // true
```

### 1. 常量

在```Symbol```内部提供了很多内置的```Symbol```常量，用来去作为内部方法的标识，可以让自定义对象去实现一些```js```内置的接口。

如果想要自定义对象的toString标签，ECMAScript要求使用Symbol的值来去实现这样一个接口。

```js
obj[Symbol.toStringTag] = 'test'
obj.toString(); // [object test];
```

这里的```toStringTag```就是内置的一个```Symbol```常量，这种```Symbol```在后面为对象去实现```迭代器```时会经常遇到。

使用```Symbol```的值去作为对象的属性名那这个属性通过传统的```for in```循环是无法拿到的。而且通过```Object.keys```方法也是获取不到这样```Symbol```类型的属性名。```JSON.stringify```去序列化，```Symbol```属性也会被隐藏掉。
```js
const obj = {
    [Symbol()]: 'symbol value',
    foo: 'normal value'
}

for (var key in obj) {
    console.log(key);
}

Object.keys(obj);
```

总之这些特性都使得```Symbol```属性，特别适合作为对象的私有属性，当然想要获取这种类型的属性名可以使用```Object.getOwnPropertySymbols(obj)```方法。

```js
Object.getOwnPropertySymbols(obj)
```

这个方法的作用类似于```Object.keys```, 所不同的是```Object.keys```他只能获取对象当中字符串属性名，而```Object.getOwnPropertySymbols```方法他获取到的全是```Symbol```类型的属性名。

## 24. for...of

```for...of```是```ECMAScript2015```之后新增的遍历方式。未来会作为遍历所有数据结构的统一方式。
```js
const arr = [1, 2, 3, 4];
for (const item of arr) {
    console.log(item); // 1， 2，3，4
    // break; // 终止循环
}
```

for...of循环拿到的就是数组中的每一个元素，而不是对应的下标。这种循环方式就可以取代之前常用的数组实例当中的```forEach```方法。

```for...of```循环可以使用```break```关键词随时去终止循环。

除了数组可以直接被```for...of```循环去遍历，一些伪数组对象也是可以直接被```for...of```去遍历的，例如```arguments```，```set```，```map```。

```for...of```在遍历```Map```时, 可以直接拿到键和值。键和值是直接以数组的形式返回的，也就是说数组的第一个元素就是当前的键名，第二个元素就是值。这就可以配合数组的解构语法，直接拿到键和值。

```js
const m = new Map();
m.set('foo', '123');
m.set('bar', '345');

for (const item of m) {
    console.log(item); // ['foo', '123'];
}

for (const [key, value] of m) {
    console.log(key, value); // 'foo', '123'
}
```

```for...of```是不能直接遍历普通对象的，他要求被遍历的对象必须存在一个叫做```Iterable```的接口。

### 1. 可迭代接口

可迭代接口就是一种可以被```for...of```循环统一遍历访问的规格标准，换句话说只要这个数据结构实现了可迭代接口他就能够被```for...of```循环遍历，那这也就是说之前尝试的那些能够直接被```for...of```循环去遍历的数据类型他都已经在内部实现了这个接口。

```iterable```约定对象中必须要挂载一个叫做```Symbol.iterable```的方法，这个方法返回一个对象，对象上存在一个```next```方法，```next```方法也返回一个对象，对象中存在```value```和```done```两个属性，```value```是当前遍历到的值，```done为```是否为最后一个。每调用一次```next```就会后移一位。

总结起来就是所有被```for...of```遍历的数据类型必须包含一个叫做```iterable```的接口，也就是内部必须挂载一个```Symbol.iterable```方法，这个方法需要返回一个带有```next```方法的对象，不断调用这个```next```方法就可以实现对内部所有成员的遍历。这就是```for...of```循环的内部原理。

### 2. 实现可迭代接口

在这个对象中放一个数组```store```用来存放值得被遍历的数据，然后在```next```方法中去迭代这个数组，需要去维护一个下标```index```，让他默认等于```0```；

由于```next```中的函数并不是```obj```对象，所以使用```self```去存储一下当前的```this```供下面使用，在```next```方法中```value```就是```self.store[index]```，```done```就是```index >= self.store.length```。完成以后需要让```index+```+, 也就是让指针后移一位。

```js
const obj = {
    store: [1, 2, 3, 4, 5],
    [Symbol.iterator]: function() {
        let index = 0;
        const self = this;
        return {
            next: function() {
                const result = {
                    value: self.store[index],
                    done: index >= self.store.length
                }
                index++;
                return result;
            }
        }
    }
}

for (const item of obj) {
    console.log(item); // 1, 2, 3, 4, 5
}
```

## 25. 生成器

```ECMAScript201```5中还新增了一种生成器函数generator，是为了能够在复杂的异步编程中减少回调函数嵌套产生的问题，从而去提供更好的异步编程解决方案。

定义生成器函数就是在普通的函数```function```后面添加一个```*```，这样函数就变成了一个生成器函数。函数执行之后会返回一个生成器对象。

```js
function * foo() {
    return 100;
}
const result = foo();
console.log(result);

```

在这个对象上也和迭代器一样有一个```next```方法，实际上生成器函数也实现了```iterable```接口，也就是迭代器接口协议。

生成器函数在使用会配合一个叫做```yield```的关键字，```yield```关键词与```return```关键词类似，但是又有很大的不同。

生成器函数会自动返回一个生成器对象，调用这个生成器的```next```会让这个函数的函数体开始执行，执行过程中一旦遇到```yield```关键词函数的执行就会被暂停下来，而且```yield```的值将会被作为```next```的结果返回，继续调用```next```函数就会从暂停的位置继续向下执行到下一个```yield```直到这个函数完全结束。

```js
const * foo() {
    console.log(1111);
    yield 100;
    console.log(2222);
    yield 200;
    console.log(3333);
    yield 300;
}
```

生成器函数最大的特点就是惰性执行，每调用一次```next```就会执行一次```yield```。

### 1. 生成器应用

了解了生成器函数的基本用法来看一个简单的应用场景实现一个发号器。

在实际业务开发过程中经常需要用到自增的```id```，而且每次调用这个```id```都需要在原有的基础上去```+1```，这里如果使用生成器函数去实现这样一个功能是最合适的了。

首先定义一个```createId```生成器函数，然后定义一个初始的```id```等于```1```，然后通过一个死循环不断的去```yield id++```。这里不需要担心死循环的问题，因为每次在```yield```过后这个方法会被暂停，循环自然也就会被暂停。直到下一次调用```next```再次去执行一次又会被暂停下来。

这样在外部就可以通过这个方法去创建一个生成器对象```id```，每次调用一下这个生成器的```next```方法就能够获取到自增的```value```，也就是```id```。

```js
function * createId() {
    let id = 1;
    while(true) {
        yield id++;
    }
}
const id = createId();

id.next().value;
```

实现发号器是一个非常简单的需求，还可以使用生成器函数实现对象的```iterator```方法，因为生成器也实现了对象的```iterator```接口，而且使用生成器函数去实现```iterator```方法会比之前的方式简单很多。

## 26. ES Modules

```ES Modules```是```ECMAScript2015```中标准化的一套语言层面的模块化标准规范，我之前写过一篇模块化发展历程的文章，里面有详细的介绍，里面和```CommonJs```以及其他标准做了统一的对比，感兴趣的可以翻阅一下那篇文章。

## 27. include方法

这个方法检查数组中是否存在某个元素。在这之前如果需要检查数组中是否包含某个元素都是使用```indexOf```方法。

但是```indexOf```不能查询到数组中的```NaN```，现在有了```includes```方法之后直接可以判断数组当中是否存在某个指定的元素了，并且他返回的是一个布尔值，而且也可以判断```NaN```

## 28. **指数运算符

以前需要进行指数运算需要借助```Math```对象的```pow```方法来去实现。例如去求```2```的```10```次方。

```js
Math.pow(2, 10); // 表示2的10次方。
```

指数运算符，他就是语言本身的运算符，就像是之前所使用的加减乘除运算符一样，使用起来也非常简单。

```js
2**10; // 2的10次方
```

## 29. Object对象新增三个扩展方法

```Object.keys```返回的是所有的键组成的数组，```Object.values```返回的是所有值组成的数组。

```Object.entries```将对象转成数组，每个元素是键值对的数组，可以快速将对象转为```Map```

```js
const l = Object.entries({a: 1, b: 2});
const m = new Map(l);
```

## 30. Object.getOwnPropertyDescriptors

获取对象的描述信息

```Object.assign```复制时，将对象的属性和方法当做普通属性来复制，并不会复制完整的描述信息，比如```this```等.

```js
const p1 = {
    a: 'y',
    b: 'd',
    get name() {
        return `${this.a} ${this.b}`;
    }
}

const p2 = Object.assign({}, p1);
p2.a = 'z';
p2.name; // y d; 发现并没有修改到a的值，是因为this仍旧指向p1
```

使用```Object.getOwnPropertyDescriptors```获取完整描述信息

```js
const description = Object.getOwnPropertyDescriptors(p1);
const p2 = Object.defineProperties({}, description);
p2.a = 'z';
p2.name; // z d
```


## 31. String.prototype.String.prototype.padStart

用给定的字符串在尾部拼接到指定长度

```js
'abc'.padEnd(5, '1');  // abc11;
```

用给定的字符串在首部拼接到指定长度

```js
'abc'.padStart(5, '1'); // 11abc;

```

## 32. 允许对象和数组在最后添加一个逗号

```js
[1, 2, 3,]

{a: 1, b: 2, }
```

## 33. async + await

在函数声明时加入```async```关键字，则函数会变为异步函数，当使用```await```调用时，只有等到被```await```的```promise```返回，函数才会向下执行。

```js
const as = async () => {
    const data = await ajax();
}
```

## 34. 收集剩余属性

将对象或者数组的剩余属性收集到新对象中

```js
const data = {a: 1, b: 2, c: 3, d: 4};
const {a, b, ...arg} = data;
console.log(arg); // {c: 3, d: 4};
```

事实上 Map、Set、String 同样支持该能力。

## 35. for of 支持异步迭代

在此之前想要实现异步迭代想要在```for of```外层嵌套一个```async```函数

```js
async function () {
    for (const fn of actions) {
        await fn();
    }
}
```

```ES2018```提供了一种新的书写方式。

```js
async function() {
    for await (const fn of actions) {
        fn();
    }
}

```

## 36. JSON 成为 ECMAScript 的完全子集

在以前，行分隔符```\u2028```和段分隔符```\u2029```会导致```JSON.parse```抛出语法错误异常。

```ECMAScript```优化了这个功能。

```JSON.stringify```也做了改进，对于超出```Unicode```范围的转义序列，```JSON.stringify()```会输出未知字符：

```js
JSON.stringify('\uDEAD'); // '"�"'
```

## 37. 修正Function.prototpye.toString()

在以前，返回的内容中```function```关键字和函数名之间的注释，以及函数名和参数列表左括号之间的空格，是不会被显示出来的。 现在会精确返回这些内容，函数如何定义的，这就会如何显示。

## 38. Array.prorptype.flat()、Array.prorptype.flatMap()

```flat()```用于对数组进行降维，它可以接收一个参数，用于指定降多少维，默认为```1```。降维最多降到一维。

```js
const array = [1, [2, [3]]]
array.flat() // [1, 2, [3]]
array.flat(1) // [1, 2, [3]]，默认降 1 维
array.flat(2) // [1, 2, 3]
array.flat(3) // [1, 2, 3]，最多降到一维
```

```flatMap()```允许在对数组进行降维之前，先进行一轮映射，用法和```map()```一样。然后再将映射的结果降低一个维度。可以说```arr.flatMap(fn)```等效于```arr.map(fn).flat(1)```。但是根据```MDN```的说法，```flatMap()```在效率上略胜一筹，谁知道呢。

```flatMap()```也可以等效为```reduce()```和```concat()```的组合，下面这个案例来自```MDN```，但是这不是一个```map```就能搞定的事么？

```js
var arr1 = [1, 2, 3, 4];
 
arr1.flatMap(x => [x * 2]);
// 等价于
arr1.reduce((acc, x) => acc.concat([x * 2]), []);
// [2, 4, 6, 8]
```

## 39. String.prototype.trimStart()、String.prototype.trimEnd()

用过字符串```trim()```的都知道这两个函数各自负责只去掉单边的多余空格。

## 40. Object.fromEntries()

从名字就能看出来，这是```Object.entries()```的逆过程。```Object.fromEntries()```可以将数组转化为对象。

## 41. description of Symbol

```Symbol```是新的原始类型，通常在创建```Symbol```时会附加一段描述。只有把这个```Symbol```转成```String```才能看到这段描述，而且外层还套了个 'Symbol()' 字样。```ES2019```为```Symbol```新增了```description```属性，专门用于查看这段描述。

```js
const sym = Symbol('The description');
String(sym) // 'Symbol(The description)'
sym.description // 'The description'
```

## 42. try...catch

过去，```catch```后面必须有一组括号，里面用一个变量代表错误信息对象。现在这部分是可选的了，如果异常处理部分不需要错误信息，可以把它省略，像写```if...else```一样写```try...catch```。

```js
try {
  throw new Error('Some Error')
} catch {
  handleError() // 这里没有用到错误信息，可以省略 catch 后面的 (e)。
}
```

## 43. Array.prototype.sort

```JavaScript```中内置的数组排序算法使用的是不稳定的排序算法，也就是说在每一次执行后，对于相同数据来说，它们的相对位置是不一致的。

```js
var arr1 = [{a: 1, b: 2}, {a: 2, b: 2}, {a: 1, b: 3}, {a: 2, b: 4}, {a: 5, b: 3}];
arr1.sort((a, b) => a.a - b.a);
```

返回的结果第一次可能是这样的:```[{a: 1, b: 2}, {a: 1, b: 3}...]```

但是第二次就变成:```[{a:1,b:3}, {a:1, b: 2}....]```

那么在```es2019```中，```JavaScript```内部放弃了不稳定的快排算法，而选择使用```Tim Sort```这种稳定的排序算法。优化了这个功能。

## 44. 类的私有属性

你可能不希望类内部的所有内容都是全局可用的。通过在变量或函数前面添加一个```#```可以将它们完全保留为类内部使用

```js
class Message {
 #message = "Howdy"
 greet() { console.log(this.#message) }
}

const greeting = new Message()

greeting.greet() // Howdy 内部可以访问
console.log(greeting.#message) // Private name #message is not defined  不能直接被访问
```
## 45. Promise.allSettled

当处理多个```Promise```时，特别是当它们相互依赖时，记录每个```Promise```所发生的事情来调试错误是很有必要的。通过```Promise.allSettled```可以创建一个新的```Promise```，它只在所有传递给它的```Promise```都完成时返回一个数组，其中包含每个```Promise```的数据。

```js
const p1 = new Promise((res, rej) => setTimeout(res, 1000));

const p2 = new Promise((res, rej) => setTimeout(rej, 1000));

Promise.allSettled([p1, p2]).then(data => console.log(data));

// [
//   Object { status: "fulfilled", value: undefined},
//   Object { status: "rejected", reason: undefined}
// ]
```

```Promise.all```是当多个```promise```全部成功，或出现第一个失败就会结束。```Promise.allSettled```是所有都执行完成，无论成功失败。

## 46. 合并空运算符 ??

假设变量不存在，希望给系统一个默认值，一般会使用```||```运算符。但是在```javascript```中```空字符串```，```0```，```false```都会执行```||```运算符，```ECMAScript2020```引入合并空运算符解决该问题，只允许在值为```null```或```undefined```时使用默认值。

```js
const name = '';

console.log(name || 'yd'); // yd;
console.log(name ?? 'yd'); // '';
```

## 47. 可选链运算符 ?.

业务代码中经常会遇到这样的情况，```a```对象有个属性```b```,```b```也是一个对象有个属性```c```。

```js
const a = {
    b: {
        c: 123,
    }
}
```

访问```c```，经常会写成```a.b.c```，但是如果```b```不存在时，就会出错。

```ECMAScript2020```定义可选链运算符解决该问题，在```.```之前添加一个```?```将键名变成可选。

```js
let person = {};
console.log(person?.profile?.age ?? 18); // 18
```

## 48. bigInt

```JavaScript```可以处理的最大数字是```2的53次方 - 1```，可以在可以在```Number.MAX_SAFE_INTEGER```中看到。

更大的数字则无法处理，```ECMAScript2020```引入```BigInt```数据类型来解决这个问题。通过把字母```n```放在末尾, 可以运算大数据。通过常规操作进行加、减、乘、除、余数和幂等运算。

它可以由数字和十六进制或二进制字符串构造。此外它还支持```AND```、```OR```、```NOT```和```XOR```之类的按位运算。唯一无效的位运算是零填充右移运算符。

```js
const bigNum = 100000000000000000000000000000n;
console.log(bigNum * 2n); // 200000000000000000000000000000n

const bigInt = BigInt(1);
console.log(bigInt); // 1n;

const bigInt2 = BigInt('2222222222222222222');
console.log(bigInt2); // 2222222222222222222n;
```

```BigInt```是一个大整数，不能存储小数。

## 49. 动态导入import

```import('./a.js')```返回一个Promise对象。

```js

const a = 123;
export { a };

```

```js
import('./a.js').then(data => {
    console.log(data.a); // 123;
})
```

## 50. globalThis

标准化方式访问全局对象，```globalThis```在浏览器中```window```作为全局对象，在```node```中```global```作为全局对象，```ECMAScript2020```提供```globalThis```作为语言的全局对象，方便代码移植到不同环境中运行。

## 51. String.prototype.replaceAll()

为了方便字符串的全局替换，```ES2021```将支持```String.prototype.replaceAll()```方法，可以不用写正则表达式就可以完成字符串的全局替换

```js
'abc111'.replaceAll('1', '2'); // abc222
```

## 52. Promise.any

只要有一个```promise```是```fulfilled```时，则返回一个```resolved promise```；所有的```promise```都是```rejected```时，则返回一个```rejected promise```

```js
Promise.any([ Promise.reject(1), Promise.resolve(2) ])
 .then(result => console.log('result:', result))
 .catch(error => console.error('error:', error)); // result: 2 
```

## 53. 逻辑赋值运算符

逻辑赋值运算符由逻辑运算符和赋值表达式组合而成：

```js
a ||= b;
// 与 a ||= b 等价
a || (a = b);
// 与 a ||= b 等价
if (!a) {
    a = b;
}


a &&= b;
// 与 a &&= b 等价
a && (a = b);
// 与 a &&= b 等价
if (a) {
    a = b;
}

a ??= b;
// 与 a ??= b 等价
a ?? (a = b);
// 与 a ??= b 等价
if (a === null || a === undefined) {
    a = b;
}
```

注意:

```js
a = a || b; // 与 a ||= b 不等价
a = a && b; // 与 a &&= b 不等价
a = a ?? b; // 与 a ??= b 不等价
```

## 54. 数字分隔符

使用```_```对数字进行分割，提高数字的可读性，例如在日常生活中数字通常是每三位数字之间会用```,`` 分割，以方便人快速识别数字。在代码中，也需要程序员较便捷的对数字进行辨识。

```js
// 1000000000 不易辨识
const count1 = 1000000000;

// 1_000_000_000 很直观
const count2 = 1_000_000_000;

console.log(count1 === count2); // true
```

## 55. WeakRefs

```WeakRef```实例可以作为对象的弱引用，对象的弱引用是指当该对象应该被```GC```回收时不会阻止```GC```的回收行为。而与此相反的，一个普通的引用（默认是强引用）会将与之对应的对象保存在内存中。只有当该对象没有任何的强引用时，```JavaScript```引擎```GC```才会销毁该对象并且回收该对象所占的内存空间。因此，访问弱引用指向的对象时，很有可能会出现该对象已经被回收。

```js
const ref = new WeakRef({ name: 'koofe' });
let obj = ref.deref();
if (obj) {
  console.log(obj.name); // koofe
}
```

对于```WeakRef```对象的使用要慎重考虑，能不使用就尽量不要使用。
