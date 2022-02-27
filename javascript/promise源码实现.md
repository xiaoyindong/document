## 1. 正文

```Promise```的使用就不介绍了，直接根据```Promise```的使用方式，实现一个自己的```Promise```，以此来了解```Promise```的源码思想。

下面代码是```Promise```的使用案例，基于这个案例来实现```Promise```。这里创建了一个```Promise```对象，传入函数对象，函数接收两个函数参数，分别表示成功和失败，然后在```then```方法中打印获取到的参数。

```js
let p = new Promise(funcion(resolve, reject) {
    reject('失败啦');
    resolve('成功啦');
});

p.then(function(value) {
    console.log(value);
})
```


首先先定义```Promise```的构造函数，因为创建```Promise```对象的时候会接收函数参数```executor```，并且函数会立即被调用，所以```Promise```内部立即执行这个函数。

```js
function Promise (executor) {
    excutor();
}
```

```executor```函数会接收两个函数方法，这里需要在调用的时候传入两个方法进去，一个是```resolve```，一个```reject```，创建这两个函数。

```js
function Promise (executor) {
    function resolve() {

    }
    function reject() {

    }
    excutor(resolve, reject);
}
```

调用```resolve```和```reject```的时候会传入一个信息，成功的时候传递成功的值，失败的时候传递失败的原因，也就是```resolve```和```reject```都需要接收参数。

```js
function Promise (executor) {
    function resolve(value) {

    }
    function reject(reason) {

    }
    excutor(resolve, reject);
}
```

## 2. 添加then方法

```Promise```的对象存在一个```then```方法，这个```then```方法里面会有两个参数，一个是成功的回调```onFulfilled```，另一个是失败的回调```onRejected```，调用```resolve```会执行```onFulfilled```，调用```reject```会执行```onRejected```。这个方法需要添加在原型上。

```js
Primsie.prototype.then = function(onFulfilled, onRejected) {

}
```

## 3. 添加状态

```Promise```存在```3```种状态的，等待状态```pending```，成功状态```resolved```，失败状态```rejected```，并且状态只可以改变一次，默认是等待状态，先调用了```resolve```就是成功状态，先调用```reject```就是失败状态。

通过```status```属性来保存这个状态，默认是```pending```。为了保证```this```不错乱使用```self```存储```this```，调用```resolve```或```reject```的时候让状态发生改变。需要注意```Promise```状态只可改变一次，只有当状态未发生改变时才去改变状态。

```js
function Promise (executor) {
    var self = this;

    self.status = 'pending';
    function resolve(value) {
        if (self.status === 'pending') {
            self.status = 'resolved';
        }
        
    }
    function reject(reason) {
        if (self.status === 'pending') {
            self.status = 'rejected';
        }
    }
    excutor(resolve, reject);
}
```

成功```resolve```或失败```reject```是会传递参数的，这里需要保存起来，定义```value```和```reason```分别保存。

```js
function Promise (executor) {
    var self = this;

    self.status = 'pending';
    self.value;
    self.reason;

    function resolve(value) {
        if (self.status === 'pending') {
            self.status = 'resolved';
            self.value = value;
        }
        
    }
    function reject(reason) {
        if (self.status === 'pending') {
            self.status = 'rejected';
            self.reason = reason;
        }
    }
    excutor(resolve, reject);
}
```

```then```方法中添加逻辑，当状态为成功时```onFulfilled```，状态失败时执行```onRejected```，并且分别传入相应的值。

```js
Primsie.prototype.then = function(onFulfilled, onRejected) {
    var self = this;
    if (self.status === 'resolved') {
        onFulfilled(self.value);
    }

    if (self.status === 'rejected') {
        onRejected(self.reason);
    }
}
```

至此就实现了一个简单的```Promise```。

## 4. Promise A+规范

```Promise```的概念不是凭空出现的，是[Promise A+规范](https://promisesaplus.com/)中定义的，要求所有实现```Promise```的代码都必须要基于这个规范。

> 1.1 “promise”是一个具有then方法的对象或函数，其行为符合此规范。也就是说Promise是一个对象或者函数。
>
> 1.2 “thenable”是一个定义then方法的对象或函数，说句人话也就是这个对象必须要拥有then方法。
>
> 1.3 “value”是任何合法的JavaScript值（包括undefined、或者promise）。
>
> 1.4 promise中的异常需要使用throw语句抛出。
>
> 1.5 当promise失败的时候需要给出失败的原因。

### 1. 状态

>
> 1.1 promise必须要拥有三个状态: pending、fulfilled 和 rejected。
>
> 1.2 当promise的状态是pending时，他可以变为成功fulfilled或者失败rejected。
>
> 1.3 如果promise是成功状态，则他不能转换成任何状态，而且需要一个成功的值，并且这个值不能被改变。
>
> 1.4 如果promise是失败状态，则他不能转换成任何状态，而且需要一个失败的原因，并且这个值不能被改变。
>

## 5. then方法原理

现在```Promise```只实现了最简易的功能，还存在一个异步逻辑需要实现，现在是不支持的，因为当```Promise```函数中异步调用```resolve```的时候，```then```方法不会执行。因为```then```方法执行的时候```resolve```并没有执行，也就是```Promise```的状态还未变化。等到异步的```Promise```状态发生改变的时候，```then```已经执行完了。而官方的```Promise```无论```then```方法是否执行完毕，只要```Promise```状态变了，```then```中绑定的函数就会执行。

下面的例子是官方```Promise```的应用，同一个实例绑定多个```then```方法，所有的```then```绑定的成功或失败都会相应的执行。

```js
let p = new Promise(funcion(resolve, reject) {
    setTimeout(function() {
        resolve('成功啦');
    }, 1000)    
});

p.then(function(value) {
    console.log(value);
})

p.then(function(value) {
    console.log(value);
})

p.then(function(value) {
    console.log(value);
})
```

需要改造```Promise```代码。当调用```then```方法的时候可能还是```pending```状态，这个时候应该把```onFulfilled```和```onRejected```先存起来，当执行了```resolve```或者```reject```的时候再执行```onFulfilled```或```onRejected```。所以需要定义两个变量，分别存储```onFulfilled```和```onRejected```。

```js
function Promise (executor) {
    var self = this;

    self.status = 'pending';
    self.value;
    self.reason;
    self.onResolvedCallbacks = []; // 存放所有成功的回调。
    self.onRejectedCallbacks = []; // 存放所有失败的回调。
    function resolve(value) {
        if (self.status === 'pending') {
            self.status = 'resolved';
            self.value = value;
        }
        
    }
    function reject(reason) {
        if (self.status === 'pending') {
            self.status = 'rejected';
            self.reason = reason;
        }
    }
    excutor(resolve, reject);
}

Primsie.prototype.then = function(onFulfilled, onRejected) {
    var self = this;
    if (self.status === 'resolved') {
        onFulfilled(self.value);
    }

    if (self.status === 'rejected') {
        onRejected(self.reason);
    }
    if (self.status === 'pending') {
        self.onResolvedCallbacks.push(onFulfilled);
        self.onRejectedCallbacks.push(onRejected);
    }
}
```

因为```onFulfilled```和```onRejected```在执行的时候需要传入对应的value值，这里用一个函数包裹起来，将对应的值也传入进去。

```js
Primsie.prototype.then = function(onFulfilled, onRejected) {
    var self = this;
    if (self.status === 'resolved') {
        onFulfilled(self.value);
    }

    if (self.status === 'rejected') {
        onRejected(self.reason);
    }
    if (self.status === 'pending') {
        self.onResolvedCallbacks.push(function () {
                onFulfilled(self.value);
            });
            self.onRejectedCallbacks.push(function() {
                onRejected(self.reason);
            });
    }
}
```

当成功或者失败的时候，执行```onFulfilled```和```onRejected```的函数，也就是在```resolve```和reject中分别循环执行对应的数组函数。

```js
function resolve(value) {
    if (self.status === 'pending') {
        self.status = 'resolved';
        self.value = value;
        self.onResolvedCallbacks.forEach(function (fn) {
            fn();
        })
    }
}

function reject(reason) {
    if (self.status === 'pending') {
        self.status = 'rejected';
        self.reason = reason;
        self.onRejectedCallbacks.forEach(function (fn) {
            fn();
        })
    }
}
```

这时候当异步执行```resolve```的时候，```then```中绑定的函数就会执行，并且绑定多个```then```的时候，多个方法也全部都会执行。

## 6. 实现链式调用

```Promise```最大的优点就是链式调用，如果一个```then```方法返回普通值，这个值会传递给下一次```then```中，作为成功的结果。如果返回的是一个```primise```，则会把```promise```的执行结果传递下去，并且取决于这个```Promise```的成功或失败。如果返回的是一个报错就会执行到下一个```then```的失败的函数中。

捕获错误的机制是，默认会找距离自己最近的then的失败方法，如果找不到就向下继续找，一直找到```catch```方法。

```js
let p = new Promise(funcion(resolve, reject) {
    setTimeout(function() {
        resolve('成功啦');
    }, 1000)    
});

p.then(function(value) {
    retrun 123;
}).then(function(value) {
    console.log(value);
}).catch(function(error) {
    console.log(error);
}).then(function(data) {
    console.log(data);
})
```

```Promise```的链式调用和其它对象比如JQuery的链式调用有所不同，```Promise```的then方法返回的是一个全新的```Promise```，而不是当前的```Promise```。因为```Promise```的状态只能改变一次，如果使用同一个```Promise```的话后面的```then```就失去了成功失败的自由性。

在```then```方法之后再去```return```一个新的```Promise```，原本的逻辑放在新创建的```Promise```内部即可，因为他是立即执行的一个函数。这里定义一个```promise2```接收新创建的```Promise```，在函数底部返回出去。

```js
Primsie.prototype.then = function(onFulfilled, onRejected) {
    var self = this;
    const promise2 = new Promise(function (resolve, reject) {
        if (self.status === 'resolved') {
            onFulfilled(self.value);
        }

        if (self.status === 'rejected') {
            onRejected(self.reason);
        }
        if (self.status === 'pending') {
            self.onResolvedCallbacks.push(function () {
                onFulfilled(self.value);
            });
            self.onRejectedCallbacks.push(function() {
                onRejected(self.reason);
            });
        }
    })
    return promise2;
}
```

还需要拿到```then```方法执行的结果，前一个```then```方法的返回值会传递给下一个then。

```js
...
const x = onFulfilled(self.value);
...
const x = onRejected(self.reason);
...
```

如果```x```是一个普通值可以直接调用```promise2```的```resolve```方法，将这个值传递出去，这样下一个```then```就可以获取的到，所以执行```resolve(x)```。

```js
Primsie.prototype.then = function(onFulfilled, onRejected) {
    var self = this;
    const promise2 = new Promise(function (resolve, reject) {
        if (self.status === 'resolved') {
            const x = onFulfilled(self.value);
            resolve(x);
        }

        if (self.status === 'rejected') {
            const x = onRejected(self.reason);
            resolve(x);
        }
        if (self.status === 'pending') {
            self.onResolvedCallbacks.push(function () {
                const x = onFulfilled(self.value);
                resolve(x);
            });
            self.onRejectedCallbacks.push(function() {
                const x = onRejected(self.reason);
                resolve(x);
            });
        }
    })
    return promise2;
}
```

如果失败需要执行```reject```方法，这里使用```try...catch```捕获错误。

```js
Primsie.prototype.then = function(onFulfilled, onRejected) {
    var self = this;
    const promise2 = new Promise(function (resolve, reject) {
        if (self.status === 'resolved') {
            try {
                const x = onFulfilled(self.value);
                resolve(x);
            } catch(e) {
                reject(e);
            } 
        }

        if (self.status === 'rejected') {
            try {
                const x = onRejected(self.reason);
                resolve(x);
            } catch(e) {
                reject(e);
            } 
        }
        if (self.status === 'pending') {
            self.onResolvedCallbacks.push(function () {
                try {
                    const x = onFulfilled(self.value);
                    resolve(x);
                } catch(e) {
                    reject(e);
                } 
            });
            self.onRejectedCallbacks.push(function() {
                try {
                    const x = onRejected(self.reason);
                    resolve(x);
                } catch(e) {
                    reject(e);
                } 
            });
        }
    })
    return promise2;
}
```

然后```onFulfilled(self.value)```返回的值不一定是一个常量，还可能是个```promise```，需要写一个方法来判断，如果返回值是```promise```就调用```promise```，否则才继续向```resolve```传递。

这里定义一个```resolvePromise```方法，在函数中判断返回值x和promse2的关系以及后续的处理，所以需要传递```promise2```参数，```x```参数，```resolve```参数和```reject```参数。

这```4```个参数是不能直接传递至```resolvePromise```中的，文档中要求他们不能在当前的上下文，所以要在```try...catch```代码块外层添加```setTimeout```在异步线程中添加。

```js

function resolvePromise (promise2, x, resolve, reject) {

}

Primsie.prototype.then = function(onFulfilled, onRejected) {
    var self = this;
    const promise2 = new Promise(function (resolve, reject) {
        if (self.status === 'resolved') {
            setTimeout(function() {
                try {
                    const x = onFulfilled(self.value);
                    resolvePromise(promise2, x, resolve, reject);
                } catch(e) {
                    reject(e);
                } 
            }, 0)
        }

        if (self.status === 'rejected') {
            setTimeout(function() {
                try {
                    const x = onRejected(self.reason);
                    resolvePromise(promise2, x, resolve, reject);
                } catch(e) {
                    reject(e);
                }
            }, 0)
        }
        if (self.status === 'pending') {
            self.onResolvedCallbacks.push(function () {
                setTimeout(function() {
                    try {
                        const x = onFulfilled(self.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch(e) {
                        reject(e);
                    }
                }, 0)
            });
            self.onRejectedCallbacks.push(function() {
                setTimeout(function() {
                    try {
                        const x = onRejected(self.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch(e) {
                        reject(e);
                    }
                }, 0)
            });
        }
    })
    return promise2;
}
```

## 7. resolvePromise函数

```resolvePromise```函数的作用是判断```x```是否是```promise```，如果是```promise```就执行并且将执行结果添加到```resolve```方法中，如果是常量则直接添加到```resolve```方法中。这些内容在文档上都可以找得到，具体可以自行翻阅文档，这里就不列出了，直接代码实现。

首先判断```promise2```和```x```引用了一个相同的对象，也就是他们是同一个```promise```对象。比如下面这种情况。

```js
const p = new Promise(function(resolve, reject) {
    resolve('成功');
})
const promise2 = p.then(data => { // 这个时候x和promise2就是相等的，也就是自己等待自己去做做完什么事，等 和 做某事不能同时执行。
    return promise2;
})
```

应该抛出一个类型错误作为错误原因。

```js
function resolvePromise (promise2, x, resolve, reject) {
    if (promise2 === x) { // 防止自己等待自己
        return reject(new TypeError('循环引用了'));
    }
}
```

如果```x```是```promise```类型，直接使用x的状态，也就是x成功就成功，x失败就失败。如果```x```是对象或者函数，就取他的then方法，获取then方法的时候如果出现异常，就执行失败。因为then方法可能是对象的一个不可访问的方法，get的时候报异常，所以我们需要使用```try...catch```去获取。

如果```x```不是```promise```类型，是个普通值，直接调用```resolve```就可以。

```js
function resolvePromise (promise2, x, resolve, reject) {
    if (promise2 === x) { // 防止自己等待自己
        return reject(new TypeError('循环引用了'));
    }
    // x是object或者是个function
    if ((x !== null && typeof x === 'object') || typeof x === 'function') {
        try {
            let then = x.then;
        } catch (e) {
            reject(e);
        }
    } else {
        resolve(x);
    }
}
```

接着判断```then```，如果```then```是个函数，就认为他是```Promise```, 需要通过```call```执行```then```方法，改变```this```的指向为```x```，```then```中传入成功和失败的函数，官方文档中指明成功函数的参数叫```y```，失败的参数为```r```。

如果```then```不是一个函数那么当前这个``then``是一个普通对象，调用```resolve```方法直接返回即可。

```js
try {
    let then = x.then;
    if (typeof then === 'function') {
        then.call(x, function (y) {
            resolve(y); // 成功的结果，让promise2变为成功状态
        }, function (r) {
            reject(r);
        });
    } else {
        resolve(x)
    }
} catch (e) {
    reject(e);
}
```

```y```有可能也是一个```Promise```，所以不能直接写```resolve(y)```，应该递归判断```y```和```promise2```的关系。需要调用```resolvePromise```。```y```是```then```的成功回调返回的值，和之前的```x```基本一个概念。

为什么这里要用递归呢，因为```then```返回的可能是```Promise```嵌套，也就是```Promise```中仍旧包含```Promise```，在```Promise```的标准中这样的写法是被允许的。所以要用递归来解决，拿到最终的返回，也就是基本类型。

```js
try {
    let then = x.then;
    if (typeof then === 'function') {
        then.call(x, function (y) {
            resolvePromise (promise2, y, resolve, reject)
            // resolve(y); // 成功的结果，让promise2变为成功状态
        }, function (r) {
            reject(r);
        });
    } else {
        resolve(x)
    }
} catch (e) {
    reject(e);
}
```

自己编写的```Promise```可能会和别人的```Promise```嵌套使用，官方文档要求，```Promise```中要书写判断避免因对方```Promise```编写不规范带来的影响。

比如对方的```Promise```成功和失败都调用了，或者多次调用了成功。需要使用```called```变量来表示```Promise```有没有被调用过，一旦状态改变就不能再改变了。

```js
function resolvePromise (promise2, x, resolve, reject) {
    if (promise2 === x) { // 防止自己等待自己
        return reject(new TypeError('循环引用了'));
    }
    let called; // 表示Promise有没有被调用过
    // x是object或者是个function
    if ((x !== null && typeof x === 'object') || typeof x === 'function') {
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, function (y) {
                    if (called) { // 是否调用过
                        return;
                    }
                    called = true;
                    resolvePromise (promise2, y, resolve, reject)
                }, function (r) {
                    if (called) { // 是否调用过
                        return;
                    }
                    called = true;
                    reject(r);
                });
            } else { // 当前then是一个普通对象。
                resolve(x)
            }
        } catch (e) {
            if (called) { // 是否调用过
                return;
            }
            called = true;
            reject(e);
        }
    } else {
        if (called) { // 是否调用过
            return;
        }
        called = true;
        resolve(x);
    }
}
```


当前```Promise```还存在一个小问题，如果```Promise```有多个```then```方法，只在最后一个```then```方法中传递了```onFulfilled```，是需要将```Promise```的返回值传递过去的，也就是下面的代码需要用内容输出，这叫值的穿透。

```js
p.then().then().then(function(data) {
    console.log(data);
})
```

实现起来也比较简单，假如用户没有传递```onFulfilled```，或者传入的不是函数，可以给个默认值，也就是这个参数是一个可选参数。

```js
Primsie.prototype.then = function(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (data) { return data;};
    onRejected = typeof onRejected === 'function' ? onRejected : function (err) { throw err;};
}
```

最后在调用```executor```的时候也可能会出错，只要```Promise```出现错误，就需要走到```then```的``reject``中，所以这里也需要```try...catch```。

```js
try {
    executor(resolve, reject);
} catch (e) {
    reject(e);
}
```

至此Promise就写完了，全部代码如下:

```js
function Promise (executor) {
    var self = this;
    self.status = 'pending';
    self.value;
    self.reason;
    self.onResolvedCallbacks = []; // 存放所有成功的回调。
    self.onRejectedCallbacks = []; // 存放所有失败的回调。
    function resolve(value) {
        if (self.status === 'pending') {
            self.status = 'resolved';
            self.value = value;
            self.onResolvedCallbacks.forEach(function (fn) {
                fn();
            })
        }
    }

    function reject(reason) {
        if (self.status === 'pending') {
            self.status = 'rejected';
            self.reason = reason;
            self.onRejectedCallbacks.forEach(function (fn) {
                fn();
            })
        }
    }
    try {
        executor(resolve, reject);
    } catch (e) {
        reject(e);
    }
}

function resolvePromise (promise2, x, resolve, reject) {
    if (promise2 === x) { // 防止自己等待自己
        return reject(new TypeError('循环引用了'));
    }
    let called; // 表示Promise有没有被调用过
    // x是object或者是个function
    if ((x !== null && typeof x === 'object') || typeof x === 'function') {
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, function (y) {
                    if (called) { // 是否调用过
                        return;
                    }
                    called = true;
                    resolvePromise (promise2, y, resolve, reject)
                }, function (r) {
                    if (called) { // 是否调用过
                        return;
                    }
                    called = true;
                    reject(r);
                });
            } else { // 当前then是一个普通对象。
                resolve(x)
            }
        } catch (e) {
            if (called) { // 是否调用过
                return;
            }
            called = true;
            reject(e);
        }
    } else {
        if (called) { // 是否调用过
            return;
        }
        called = true;
        resolve(x);
    }
}

Promise.prototype.then = function(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (data) { return data;};
    onRejected = typeof onRejected === 'function' ? onRejected : function (err) { throw err;};
    var self = this;
    const promise2 = new Promise(function (resolve, reject) {
        if (self.status === 'resolved') {
            setTimeout(function() {
                try {
                    const x = onFulfilled(self.value);
                    resolvePromise(promise2, x, resolve, reject);
                } catch(e) {
                    reject(e);
                } 
            }, 0)
        }

        if (self.status === 'rejected') {
            setTimeout(function() {
                try {
                    const x = onRejected(self.reason);
                    resolvePromise(promise2, x, resolve, reject);
                } catch(e) {
                    reject(e);
                }
            }, 0)
        }
        if (self.status === 'pending') {
            self.onResolvedCallbacks.push(function () {
                setTimeout(function() {
                    try {
                        const x = onFulfilled(self.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch(e) {
                        reject(e);
                    }
                }, 0)
            });
            self.onRejectedCallbacks.push(function() {
                setTimeout(function() {
                    try {
                        const x = onRejected(self.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch(e) {
                        reject(e);
                    }
                }, 0)
            });
        }
    })
    return promise2;
}

```

## 8. 测试

可以使用```promises-aplus-tests```测试```Promise```是否符合规范。测试的时候需要提供一段脚本，通过入口进行测试。

```js
Promise.defer = Promise.deferred =  function() {
    let dfd = {};
    dft.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}
```

```s

# 安装
npm install promises-aplus-tests -g

# 执行测试脚本
promises-aplus-tests promise.js

```

## 9. 静态方法实现

```js
Promise.all = function (values) {
    return new Promise(function (resolve, reject) {
        var arr = []; // 最终结果的数组
        var index = 0;

        function processData (key, value) {
            index++;
            arr[key] = value;
            if (index === values.length) {
                resolve(arr);
            }
        }

        for (var i = 0; i < values.length; i++) {
            var current = values[i];
            if (current && current.then && typeof current.then === 'function') {
                current.then(function(y) {
                    processData(i, y);
                }, reject);
            } else {
                processData(i, current);
            }
        }
    });
}

Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < values.length; i++) {
            var current = values[i];
            if (current && current.then && typeof current.then === 'function') {
                current.then(resolve, reject);
            } else {
                resolve(current);
            }
        }
    });
}

Promise.resolve = function(value){
    return new Promise((resolve,reject)=>{
        resolve(value);
    });
}

Promise.reject = function(reason){
    return new Promise((resolve,reject)=>{
        reject(reason);
    });
}
```
