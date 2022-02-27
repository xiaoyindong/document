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

   