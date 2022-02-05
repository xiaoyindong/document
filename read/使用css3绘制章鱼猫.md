## 1. 概述

最近整理```CSS```和大家分享一下使用 ```CSS3``` 绘制```github``` 的章鱼猫 ```Logo``` 的过程。

网上经常能看到一些通过```border```属性实现的圆形，椭圆形，三角形。这里主要用到的就是```CSS```的```border```属性。通过```border-radius```来设置矩形的圆角。

```border-radius```最多可指定四个值，分别是左上角，右上角，右下角和左下角。也可以分别设置每个角的值，而且可以精确到角度的```X```，```Y```轴的值。

```css
// 左上角
border-top-left-radius: 40px 80px;
// 右上角
border-top-right-radius: 40px 80px;
// 左下角
border-bottom-right-radius: 40px 80px;
// 右下角
border-bottom-left-radius: 40px 80px;
```

```40px```和```80px```分别表示```X```轴参与弯曲弧度的部分为```40px```，```Y```轴参与弯曲的弧度为```80px```。

![屏幕快照 2021-08-17 19.36.48.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ad077f128f84feaa1d80ccf1501f376~tplv-k3u1fbpfcp-watermark.image)

## 2. 开始绘制

章鱼猫的所有部位都是通过```div```元素标签绘制再通过定位进行组合，首先绘制出头部的轮廓。通过设置四个角度的圆角画出大饼脸。

```css
position: absolute;
border: 1px solid red;
width: 268px;
height: 204px;
left: 116px;
top: 77px;
border-top-left-radius: 137px 94px;
border-top-right-radius: 137px 94px;
border-bottom-left-radius: 105px 95px;
border-bottom-right-radius: 104px 82px;
```

![屏幕快照 2021-08-17 19.42.46.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5905e9ac4d9042578193f71a560107b0~tplv-k3u1fbpfcp-watermark.image)

加上耳朵。

```css
position: absolute;
border: 1px solid red;
width: 60px;
height: 60px;
transform: rotate(12deg);
top: 66px;
left: 133px;
border-top-right-radius: 150px 36px;
border-bottom-left-radius: 43px 95px;
```

![屏幕快照 2021-08-17 19.44.37.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8efe07cde2354a938ccf513e1f7ca85e~tplv-k3u1fbpfcp-watermark.image)

五官

![屏幕快照 2021-08-17 19.45.01.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9610ca9fa26419bbb1291e9102db27c~tplv-k3u1fbpfcp-watermark.image)

胡须

```css
position: absolute; 
height: 8px;
width: 98px;
top: 222px;
left: 26px;
border-top-left-radius: 98px 10px;
border-top: 1px solid red;
```

![屏幕快照 2021-08-17 19.45.18.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/661e9a060e394bdda3e45f97179e1d66~tplv-k3u1fbpfcp-watermark.image)

四只脚和小尾巴，可以使用```border```属性来设置。

```css
border-right: 6px solid red;
width: 100px;
height: 70px;
border-bottom-right-radius: 70px 70px;
```

不过这里偷懒了，直接使用模块绘制的。

![屏幕快照 2021-08-17 19.45.38.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4139a8e9dee441b7a94f7a90cd6f1496~tplv-k3u1fbpfcp-watermark.image)

## 3. 填充颜色

整体完成之后添加上颜色。

![屏幕快照 2021-08-17 20.14.00.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30fe8a0ce20a40549c50567643d8a34a~tplv-k3u1fbpfcp-watermark.image)

已经变得有模有样了，继续~

![屏幕快照 2021-08-17 20.20.10.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dfbe1e94ce714b48b7d94b91d01a478a~tplv-k3u1fbpfcp-watermark.image)

最后装饰一下小尾巴！

![屏幕快照 2021-08-17 20.29.35.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4804dcf1ea5d476ab25fc965c6e03913~tplv-k3u1fbpfcp-watermark.image)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>章鱼猫</title>
    <style>
        * {
            box-sizing: border-box;
        }
        #box {
            margin: auto;
            background: url('11111.jpeg');
            width: 500px;
            height: 500px;
            background-repeat: no-repeat;
            background-size: 100%;
            border: 1px solid #999;
            position: relative;
        }
        .head {
            position: absolute;
            /* border: 1px solid red; */
            background: #000;
            width: 268px;
            height: 204px;
            left: 116px;
            top: 77px;
            border-top-left-radius: 137px 94px;
            border-top-right-radius: 137px 94px;
            border-bottom-left-radius: 105px 95px;
            border-bottom-right-radius: 104px 82px;
        }
        .ears-left {
            position: absolute;
            /* border: 1px solid red; */
            background: #000;
            width: 60px;
            height: 60px;
            transform: rotate(12deg);
            top: 66px;
            left: 133px;
            border-top-right-radius: 150px 36px;
            border-bottom-left-radius: 43px 95px;
        }
        .ears-right {
            position: absolute;
            /* border: 1px solid red; */
            background: #000;
            width: 60px;
            height: 60px;
            top: 66px;
            left: 304px;
            transform: rotate(-14deg);
            border-top-left-radius: 161px 36px;
            border-bottom-right-radius: 50px 130px;
        }
        .face {
            position: absolute;
            /* border: 1px solid red; */
            background: #ffc09f;
            width: 203px;
            height: 107px;
            top: 164px;
            left: 150px;
            border-top-left-radius: 50px 46px;
            border-top-right-radius: 50px 46px;
            border-bottom-left-radius: 76px 56px;
            border-bottom-right-radius: 62px 54px;
        }
        .eye-left, .eye-right {
            position: absolute;
            width: 43px;
            height: 61px;
            /* border: 1px solid red; */
            background: #fdfffd;
            top: 182px;
            left: 174px;
            border-radius: 50%;
        }
        .eye-right {
            left: 288px;
        }
        .eye-left2, .eye-righ2 {
            position: absolute;
            width: 27px;
            height: 39px;
            /* border: 1px solid red; */
            background: #b14239;
            border-radius: 50%;
            top: 193px;
            left: 183px;
        }
        .eye-righ2 {
            left: 296px;
        }
        .nose {
            position: absolute; 
            height: 11px;
            width: 11px;
            /* border: 1px solid red; */
            background: #b4403b;
            border-radius: 50%;
            top: 233px;
            left: 246px;
        }
        .mouth {
            position: absolute; 
            height: 10px;
            width: 22px;
            border: 3px solid #b4403b;
            top: 251px;
            left: 240px;
            border-bottom-left-radius: 12px;
            border-bottom-right-radius: 12px;
            border-top: none;
        }
        .beard-left-1 {
            position: absolute; 
            height: 8px;
            width: 98px;
            top: 222px;
            left: 26px;
            border-top-left-radius: 98px 10px;
            border-top: 1px solid #000;
        }
        .beard-right-1 {
            position: absolute; 
            height: 8px;
            width: 98px;
            top: 222px;
            left: 380px;
            border-top-right-radius: 98px 10px;
            border-top: 1px solid #000;
        }
        .beard-left-2 {
            position: absolute; 
            height: 20px;
            width: 330px;
            top: 228px;
            left: 26px;
            border-top-left-radius: 570px 40px;
            border-top: 1px solid #000;
        }
 