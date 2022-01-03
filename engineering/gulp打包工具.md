## 1. 基本使用

```gulp```作为当下最流行的前端构建系统，其核心特点就是高效易用。使用```gulp```的过程非常简单，大体过程就是在项目中安装```gulp```依赖, 然后创建```gulpfile```文件来配置```gulp```。

```s
npm init
npm install gulp --save
```

```gulpfile.js```

```js
exports.foo = () => {
    console.log('foo');
}
```

这样就创建了一个```foo```的```gulp```任务，可以运行一下```gulp foo```。

```s
npx gulp foo
```

```gulp```中所有的任务都是异步任务，需要标记任务完成，可以在函数中接收一个函数，调用这个函数就表示完成了。

```js
exports.foo = (done) => {
    console.log('foo');
    done(); // 结束标识
}
```

如果导出的是```default```任务会作为```gulp```的默认任务出现，运行```gulp```的时候可以不指定任务名称。在```gulp4.x```以前注册```gulp```任务需要使用```task```方法，不过这种方式已经不推荐了。

```js
const gulp = require('gulp');
gulp.task('foo', done => {
    console.log('任务')
    done();
})
```

## 2. 组合任务

可以通过```gulp```模块提供的```series```和```parallel```组合任务。```series```是一个函数，可以接收任意个数的参数，每个参数就是一个任务，```series```会自动的按顺序依次执行这些任务。

```js
const { series } = require('gulp');

const t1 = done => {
    console.log('任务1')
    done();
}
const t2 = done => {
    console.log('任务2')
    done();
}
const t3 = done => {
    console.log('任务3')
    done();
}

exports.foo = series(t1, t2, t3);
```

```s
npx gulp foo
```

```series```组合的是串行的任务，也就是按顺序执行的，如果想要组合并行任务可以使用```parallel```，用法和```series```相同。任务组合还是非常有用的，比如说编译```js```和```css```，可以通过并行的方式分别编译。

## 3. 异步任务

在调用一个异步任务的时候是无法明确这个任务是否执行完毕的，一般都是通过回调函数来解决。在glup中可以通过回调函数来解决异步任务，也就是```done```函数。可以给```done```函数中传入一个错误信息来阻止后面的任务执行。

```js
exports.foo = (done) => {
    console.log('foo');
    done(new Error('失败了'); // 结束标识
}
```

```gulp```也支持```Promise```的方式，就是在任务中返回```Promise```，可以返回```resolve```或者```reject```。

```js
exports.foo = () => {
    console.log('foo');
    return Promise.resolve()
}
```

当然```async```和```await```也是可以的，任务定义为```async```类型的函数就可以使用```await```了。

```js
exports.foo = async () => {
    // await ....
    console.log('foo');
    return Promise.resolve()
}
```

如果读取文件可以使用```stream```的方式, 返回````stream````就可以了。

```js
exports.foo = () => {
    console.log('foo');
    const readStream = fs.createReadStream('a.json');
    const writeStream = fs.createWriteStream('b.json');
    readStream.pipe(writeStream);
    return readStream; // 相当于注册end事件调用done
}
```

## 4. 核心原理

构建过程基本是将文件读取出来经过转换再写入到对应的位置，在以前这都是手动去做的有了```gulp```以后就可以通过代码自动化执行。

```js
const fs = require('fs');
const { Transform } = require('stream');
exports.default = () => {
    // 创建文件读取流
    const read = fs.createReadStream('a.css');
    // 文件写入流
    const write = fs.createWriteStream('b.css');
    // 文件转换
    const transform = new Transform({
        transform: (chunk, encoding, callback) => {
            // chunk是读取到的内容，也就是流
            // 使用正则删除空格删除注释
            const input = chunk.toString();
            const output = input.replace(/\s+/g, '').replace(/\/\*.+?\*\//g, '');
            callback(output);
        }
    })
    // 读取到的文件写入到对应文件
    read.pipe(transform).pipe(write);
    return read;
}
```

```gulp```官方的定义就是基于流的构建系统，```gulp```实现的是一种管道的概念。

## 5. 文件操作

```gulp```有自己的读取流和写入流，相比较```node```来说更好用一些。

```js
const { src, dest } = require('gulp');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');

export.default = () => {
    return src('src/a.css').pipe(cleanCss()).pipe(rename({ extname: '.min.css'})).pipe(dest('dist'));
}
```

这样会将```src/a.css```文件写入到```dist```文件夹下。

```js
const { src, dest } = require('gulp');
const cleanCss = require('gulp-clean-css')

export.default = () => {
    return src('src/*.css').pipe(cleanCss()).pipe(rename({ extname: '.min.css'})).pipe(dest('dist'));
}
```

## 6. 样式编译

```js
const { src, dest } = require('gulp');
const sass = require('gulp-sass');

const style = () => {
    return src('src/*.css', { base: 'src'}).pipe(sass({outputStyle: 'expanded'})).pipe(dest('dist'));
}

module.exports = {
    style
}
```

## 7. 脚本编译

```js
const { src, dest, parallel, series } = require('gulp');

const del = require('del');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const swig = require('gulp-swig');
const imagemin = require('gulp-imagemin');

// 删除dist
const clean = () => {
    return del(['dist']);
}
// 样式
const style = () => {
    return src('src/*.css', { base: 'src'}).pipe(sass({outputStyle: 'expanded'})).pipe(dest('dist'));
}
// js
const script = () => {
    return src('src/*.js', { base: 'src'}).pipe(babel({presets: ['@babel/preset-env']})).pipe(dest('dist'));
}
// html swig中可以使用传入的参数
const page = () => {
    return src('src/*.html', { base: 'src'}).pipe(swig({data: { date: new Date()})).pipe(dest('dist'));
}
// image
const image = () => {
    return src('src/images/**', { base: 'src'}).pipe(imagemin({})).pipe(dest('dist'));
}
// font
const font = () => {
    return src('src/fonts/**', { base: 'src'}).pipe(imagemin({})).pipe(dest('dist'));
}
// extra copy public file
const extra = () => {
    return src('public/**', { base: 'public'}).pipe(dest('dist'));
}

const compile = parallel(style, script, page, image, font);

const build = series(clean, parallel(compile, extra));

module.exports = {
   build
}
```

## 8. 自动加载插件

手动方式载入插件```require```会越来越多不利于后期维护，可以通过```gulp-load-plugin```提供的插件自动载入使用的插件。

```js
// 自动载入插件
const loadPlugins = require('gulp-load-plugins');
const plugins = loadPlugins();
```

用法很简单，会自动把```gulp-```删除，后面的名称变为驼峰命名，比如```gulp-sass```可以写成```plugins.sass```。

```js
const { src, dest, parallel, series } = require('gulp');

const del = require('del');

// 自动载入插件
const loadPlugins = require('gulp-load-plugins');
const plugins = loadPlugins();

// 删除dist
const clean = () => {
    return del(['dist']);
}
// 样式
const style = () => {
    return src('src/*.css', { base: 'src'}).pipe(plugins.sass({outputStyle: 'expanded'})).pipe(dest('dist'));
}
// js
const script = (