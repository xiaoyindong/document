## 1. 基本使用

项目中想要使用```grunt```的话，首先需要安装他。

```s
yarn add grunt --dev
```

安装过后需要在项目跟目录添加```gruntfile.js```文件作为入口文件，用于定义一些需要```grunt```自动执行的任务。这个文件导出一个函数，函数接收一个```grunt```参数，参数是一个对象，对象中就是```grunt```提供的一些```api```。比如借助```registerTask```方法注册任务。

这个方法第一个参数指定任务名字，第二个参数指定任务函数。

```js
module.exports = grunt => {
    grunt.registerTask('foo', () => {
        console.log('hello grunt');
    })
}
```

```s
yarn grunt foo
```

```foo```就是注册任务的名字，```grunt```会自动的执行```foo```任务，当然也可以添加更多的任务。

如果添加任务的时候第二个参数指定一个字符串，这个字符串就是这个任务的描述，他会出现在```grunt```的帮助信息中。可以通过```grunt --help```得到```grunt```的帮助信息，帮助信息中有一个```avaible tasks```，在这个```tasks```当中任务描述就是自定义的任务描述。

```js
module.exports = grunt => {
    grunt.registerTask('foo', () => {
        console.log('hello grunt');
    })
    grunt.registerTask('bar', '任务描述', () => {
        console.log('other task');
    })
}
```

如果在注册任务的时候任务名称叫做```default```，那这个任务将会成为```grunt```的默认任务，在运行任务的时候不需要指定任务的名称，```grunt```将自动调用```default```。

```js
module.exports = grunt => {
    grunt.registerTask('foo', () => {
        console.log('hello grunt');
    })
    grunt.registerTask('bar', '任务描述', () => {
        console.log('other task');
    })
    grunt.registerTask('default', () => {
        console.log('default task');
    })
}
```

一般会用```default```去映射一些其他的任务，一般的做法是在```registerTask```函数第二个参数传入一个数组，这个数组中可以指定一些任务的名字。

```js
module.exports = grunt => {
    grunt.registerTask('foo', () => {
        console.log('hello grunt');
    })
    grunt.registerTask('bar', '任务描述', () => {
        console.log('other task');
    })
    grunt.registerTask('default', ['foo', 'bar']);
}
```

这时执行```default```就会依次执行数组中的任务。

```s
yarn grunt
```

```grunt```代码默认支持同步模式，如果需要异步操作必须使用```this```的```async```方法得到一个回调函数，在异步操作完成后调用这个回调函数，标识一下这个任务已经被完成。

```js
module.exports = grunt => {
    grunt.registerTask('foo', () => {
        console.log('hello grunt');
    })
    grunt.registerTask('bar', '任务描述', () => {
        console.log('other task');
    })
    grunt.registerTask('default', ['foo', 'bar']);

    grunt.registerTask('async-task', function () {
        const done = this.async();
        setTimeout(() => {
            console.log('async task');
            done();
        }, 1000)
    })
}
```

```s
yarn grunt async-task
```

## 2. 标记任务失败

如果在构建任务的逻辑代码当中发生错误，例如需要的文件找不到了，此时就可以将这个任务标记为一个失败的任务。具体实现可以通过在函数体当中```return false来```实现。

```js
module.exports = grunt => {
    grunt.registerTask('bad', () => {
        console.log('bad working~')
        return false
    })
}
```

如果这个任务是在任务列表当中那这个任务的失败会导致后续任务不在被执行。例如这里有多个任务通过```default```连在一起，正常情况他们会依次执行，但是当```bad```失败的时候```bar```也就不执行了。

```js
module.exports = grunt => {
    grunt.registerTask('bad', () => {
        console.log('bad working~')
        return false
    })
    grunt.registerTask('foo', () => {
        console.log('foo task~')
        return false
    })
    grunt.registerTask('bar', () => {
        console.log('bar task~')
        return false
    })
    grunt.registerTask('default', ['foo', 'bad', 'bar']);
}
```

运行的时候使用```--force```可以强制执行所有任务，使用```--force```之后即使```bad```任务执行失败了也是会正常去执行```bar```。

```s
yarn grunt default --force
```

如果任务是一个异步任务就没有办法直接通过```return false```标记任务失败，需要给异步的回调函数指```false```实参标记任务失败。

```js
module.exports = grunt => {
    grunt.registerTask('bad-async', function() {
        const done = this.async();
        setTimeout(() => {
            console.log('bad async');
            done(false)
        }, 1000)
    })
}
```

## 3. 配置方法

```grunt```还提供一个用于添加任务选项的```API```叫做```initConfig```，例如使用```grunt```压缩文件时就可以通过这种方式配置压缩的文件路径。

这个方法接收一个对象形式的参数，对象的属性名一般与任务名称保持一致，属性的值他可以是任意类型的数据。有了这个配置属性就可以在任务中使用这个配置属性。

这里注册一个叫做```foo```的任务，在任务中通过```grunt```提供的```config```方法获取这个配置，```config```方法接收一个字符串参数，这个参数就是```initConfig```中指定的字符串名字。

```js
module.exports = grunt => 