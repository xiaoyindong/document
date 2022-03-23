ECMAScript是一门脚本语言，一般缩写为ES，通常把他看作是JavaScript的标准规范。但实际上JavaScript是ES的扩展语言，ES提供了最基本的语法，通俗点来说只是约定了代码的如何编写。JavaScript实现了标准开发，在语言基础上做了一定的扩展，可以在浏览器环境中操作DOM和BOM，在Node环境可以读写文件等操作。总的来说浏览器环境中的JavaScript等于ECMAScript + DOM + BOM。

## 1. 块级作用域

ES2015之前，```ES```中只有全局作用域和函数作用域两种类型的作用域，```ES2015```中新增了一个块级作用域，用```{}```包裹起来的范围。ES2015以前，块是没有单独的作用域的，这就导致在块中定义的成员外部也可以访问到。例如```if```中去定义的```foo```，在```if```的外面打印是可以正常打印出来的。

```js
if (true) {
    var foo = 'yd';
}
console.log(foo); // yd
```

这对于复杂代码是非常不利的，也是不安全的，有了块级作用域之后，可以在代码当中通过```let```或者```const```声明变量。用法和```var```一样的，只不过通过```let```声明的变量他只能在所声明的这个代码块中被访问到。

```js
if (true) {
    let foo = 'yd';
}
console.log(foo); // foo is not defined
```

块内定义的成员，外部是无法访问的。

```js
for (let i = 0; i < 3; i++) {
    for (let i = 0; i < 3; i++) {
        console.log(i); 
    }
}
// 0 1 2     0 1 2    0 1 2
```

const声明只读的恒量，特点是在```let```的基础上多了只读的特性，一旦声明过后就不能够再被修改，如果在声明后再去修改就会出现错误。

```js
const name = 'yd';

name = 'zd'; // 错误
```

const声明的成员不能被修改，并不是说不允许修改恒量中的属性成员，下面这种情况是允许的。

```js
const obj = {}
obj.name = 'yd';
```

## 2. 解构

```js
const arr = [100, 200, 300];
const [foo, bar, baz] = arr;
console.log(foo, bar, baz);
```

如果只想获取某个位置所对应的成员，可以把前面得成员都删掉，但是需要保留对应的逗号。确保解构位置的格式与数组是一致的。

```js
const [, , baz] = arr;
console.log(baz);
```

还可以在解构位置的变量名之前添加```...```表示提取从当前位置开始往后的所有成员，结果会放在数组中。三个点的用法只能在解构位置的最后使用。

```js
const [foo, ...rest] = arr;
console.log(rest);
```

如果解构位置的成员大于数组长度，提取到的是```undefined```。这和访问数组中不存在的下标是一样的。

```js
const [foo, bar, baz, more] = arr;
console.log(more); // undefined
```

可以给提取到的成员设置默认值。

```js
const [foo, bar, baz, more = 'default value'] = arr;
console.log(more);
```

对象同样可以被解构，不过对象的结构需要去根据属性名去匹配。

```js
const obj = { name: 'yd', age: 18 };

const { name } = obj;
```

同样未匹配到的成员返回```undefined```，也可以设置默认值。当解构的变量名在当前作用域中产生冲突。可以使用重命名的方式去解决。

```js
const obj = { name: 'yd', age: 18 };

const { name: name1 } = obj;

console.log(name1);
```

## 3. 模板字符串

模板字符串使用反引号\`声明，。如果在字符串中需要使用\`可以使用斜线转译。模板字符串可以支持多行字符串。

```js
const str = `
123
456
`
```

模板字符串支持通过插值表达式的方式在字符串中嵌入对应的值。事实上```${}```里面的内容就是标准的```JavaScript```也就是说这里不仅仅可以嵌入变量，还可以嵌入任何标准的```js```语句。

```js
const name = 'yd';
const age = 18;

const str = `my name is ${name}, I am ${age} years old`;

```

定义模板字符串的时候可以在前面添加一个标签，实际上是一个特殊的函数。

```js
const name = 'yd';
const age = 18;

const result = tag`My name is ${name}, I am ${age} years old`;
```

函数接收模板字符串内容分割过后的结果数组。还可以接收到所有在这个模板字符串中出现的表达式的返回值。

```js
const tag = (params, name, age) => {
    consoel.log(params, name, age); // ['My name is ', ' I am ', ' years old']; 'yd' 18
}

const str = tag`hello ${'world'}`;

```

## 4. 字符串扩展方法

### 1. startWith

是否以```Error```开头。

```js
console.log(message.startsWith('Error')); // true
```

### 2. endsWith

是否以```.```结尾。

```js
console.log(message.endsWith('.')); // true
```

### 3. includes

是否包含某个内容。

```js
console.log(message.includes('foo')); // true
```

## 5. 函数参数

直接在形参的后面直接通过等号去设置一个默认值。如果有多个参数的话，带有默认值的这种形参一定要出现在参数列表的最后。

```js
function foo (bar, enable = true) {
    console.log(enable); // false
}

foo(false);
```

对于未知个数的参数，以前使用```arguments```，````ES2015````新增了```...```操作符，会以数组的形式接收从当前这个参数的位置开始往后所有的实参。

```js

function foo (...args) => {
    console.log(args); // 参数集合
}

foo(1, 2, 3, 4);
```

这种操作符只能出现在形参列表的最后一位，并且只可以使用一次。

## 6. 展开数组

```js
console.log( ...arr );
```

## 7. 箭头函数

传统定义函数需要使用```function```关键词，现在可以使用```ES2015```定义一个完全相同的函数。

```js
function inc (number) {
    return number + 1;
}

const inc = n => n + 1;
```

箭头函数的左边是参数列表，如果有多个参数的话可以使用```()```包裹起来，右边是函数体。如果在这个函数的函数体内需要执行多条语句，可以使用```{}```包裹。

```js
const inc = (n , m) => {
    return  n + 1;
};
```

相比普通函数，箭头函数有一个很重要的变化就是不会改变```this```的指向。

## 8. Object字面量的增强

传统的字面量要求必须在```{}```里面使用```属性名: 属性值```这种语法。 现在如果变量名与添加到对象中的属性名是一样的，可以省略掉```:```变量名。

```js
const bar = '123';
const obj = {
    key: 'value',
    bar
}
```

如果需要为对象添加一个普通的方法，现在可以省略里面的```:function```。

```js
const obj = {
    method1 () {
        console.log('method1');
    }
}

console.log(obj)
```

这种方法的背后实际上就是普通的```function```，也就是说如果通过对象去调用这个方法，内部的```this```会指向当前对象。

对象字面量还可以使用表达式的返回值作为对象的属性名，叫做计算属性名。

```js
const obj = {};

obj[Math.random()] = 123;
```

Object.assign可以将多个源对象中的属性复制到目标对象中，如果对象当中有相同的属性，源对象中的属性会覆盖掉目标对象的属性。支持传入任意个数的参数，第一个参数是目标对象，所有源对象中的属性都会复制到目标对象当中。返回值就是目标对象。

```js
const source1 = {
    a: 123,
    b: 123,
}

const target = {
    a: 456,
    c: 456
}

const result = Object.assign(target, source1);

console.log(result === target); // true
```

通过```Obejct.is```正负零就可以被区分开，而且```NaN```也是等于```NaN```的。

```js
Object.is(+0, -0); // false
Object.is(NaN, NaN); // true
```

## 9. Proxy

相比于````defineProperty````，```Proxy```的功能要更为强大甚至使用起来也更为方便。通过```new Proxy```的方式创建代理对象。第一个参数就是需要代理的对象，第二个参数是处理对象，可以通过```get```方法来去监视属性的访问，通过```set```方法来截取对象当中设置属性的过程。

```js
const person = {
    name: 'yd',
    age: 18
}

const personProxy = new Proxy(person, {
    get(target, property) {
        console.log(target, property);
        return property in target ? target[property] : undefined;
    }
    set(target, property, value) {
        console.log(target, property, value);
        if (property === 'age') {
            if (!Number.isInteger(value)) {
                throw new TypeError(``${value} must be a integer);
            }
        }
        target[property] = value;
    }
})
```

```Object.defineProperty```只能监听到对象属性的```读取```或```写入```，```Proxy```除读写外还可以监听对象中属性的```删除```，对象中```方法调用```等。

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

get: 读取某个属性

set: 写入某个属性

has: in操作符调用

deleteProperty: delete操作符调用

getProperty: Object.getPropertypeOf()

setProperty: Object.setProtoTypeOf()

isExtensible: Object.isExtensible()

preventExtensions: Object.preventExtensions()

getOwnPropertyDescriptor: Object.getOwnPropertyDescriptor()

defineProperty: Object.defineProperty()

ownKeys: Object.keys()，Object.getOwnPropertyNames()，Object.getOwnPropertSymbols()

apply: 调用一个函数

construct: new调用一个函数。

而且Proxy对于数组对象进行监视更容易，会自动根据```push```操作推断出来他所处的下标，每次添加或者设置都会定位到对应的下标```property```。

而且Proxy是以非入侵的方式监管了对象的读写，也就是说一个已经定义好的对象不需要对对象本身做任何操作，就可以监视到他内部成员的读写，defineProperty必须按特定的方式单独定义对象中被监视的属性。

## 10. Reflect

Reflect属于静态类，只能够调用他的静态方法，内部封装了一系列对对象的底层操作，具体一共提供了```13```个静态方法，方法名与```Proxy```的处理对象里面的方法成员完全一致。这些方法就是````Proxy````处理对象那些方法内部的默认实现.

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

个人认为```Reflect```对象最大的意义就是他提供了一套统一操作```Object```的```API```，因为在这之前去操作对象时有可能使用```Object```对象上的方法，也有可能使用像```delete```或者是```in```这样的操作符，这些对于新手来说实在是太乱了，并没有什么规律。```Reflect```很好的解决了这个问题，统一了对象的操作方式。

## 11. class类

class关键词用于声明独立的定义类型。与一些老牌面向对象语言中```class```非常相似的。可以添加一个```constructor```方法也就是构造函数。同样可以使用```this```访问类型的实例对象。

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

类型中的方法分为```实例方法```和```静态方法```，实例方法是通过实例对象去调用的，静态方法是直接通过类型本身调用的，可以通过static关键字定义。

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

```js
const yd = Person.create('yd');
```

静态方法是挂载到类型上的，所以静态方法内部不会指向某一个实例对象，而是当前的类型。

可以通过关键词```extends```实现继承。super对象指向父类, 调用它就是调用了父类的构造函数。

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

## 12. Set

可以理解为集合，与传统的数组非常类似，不过```Set```内部的成员是不允许重复的。可以通过```add```方法向集合当中去添加数据，```add```方法会返回集合对象本身，所以可以链式调用。在这个过程中添加了已经存在的值会忽略。

```js
const s = new Set();

s.add(1).add(2).add(3).add(2);
```

可以使用```forEach```或者```for...of```遍历。

```js
s.forEach(i => console.log(i));

for (let i of s) {
    console.log(i);
}
```

size获取整个集合的长度。

```js
console.log(s.size);
```

has判断集合中是否存在某个值。

```js
console.log(s.has(100)); // false
```

delete用来删除集合当中指定的值，删除成功将会返回```true```。

```js
console.log(s.delete(3)); // true
```

clear用于清除当前集合中的全部内容。

```js
s.clear()
```

## 13. Map

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
