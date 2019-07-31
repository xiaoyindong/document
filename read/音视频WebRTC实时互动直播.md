## 1. 概述

```WebRTC```是谷歌于```2011```年开源的一个音视频处理引擎，这个引擎是支持跨平台的可以在各个平台编译运行，谷歌希望```WebRTC```用作浏览器之间实现音视频通话这种快速的开发使用的。

```WebRTC```有两个主要功能，一是实时数据传输，大家可能对实时数据传输没什么印象，做通信的同学认知的会深一些，如果在```100ms```的延迟传输，说明通话质量非常好，如果是```200ms```说明通话质量比较优质，如果```500ms```可以接受，如果超过```1s```通话会有明显的迟滞。实时传输是端与端之间建立一条最高效的传输通道，这一点```WebRTC```做的是非常好的。

另一个主要功能就是音视频引擎，引擎并不是简单地做了音视频的编解码，它支持扩展编解码，音视频同步，数据平滑处理。

在实时数据传输，数据处理和异常处理等方面```WebRTC```做的都是比较优秀的。

```WebRTC```不仅用于浏览器，音视频会议，在线教育，照相机，音乐播放器，共享远程桌面，录制，即时通信工具，p2p网络加速，文件传输工具，游戏，实时人脸识别等都可以用到```WebRTC```。并且主流浏览器对```WebRTC```支持都比较不错。

谷歌给提供了一个```demo```地址，可以访问看下，```https://appr.tc/```。

## 2. WebRTC的运行机制

这里要介绍下```轨```和```流```，```轨```就类似火车的轨道，每一条轨道都是独立的，音频是一个轨道，视频也是一个轨道，他们之间是不想交的，会单独存放。

```流```指的是媒体流，和传统的媒体流基本是一个概念，媒体流里面包含音频轨，视频轨还有字幕轨，类似层级的概念，媒体流里面包含了很多轨。

```MediaStream```是媒体流的基础类，```RTCPeerConnection```是整个```WebRTC```里面最重要的一个类包含了很多功能，只需要创建这个实例，将媒体流塞进去就可以了，传输是默认实现了的。```RTCDataChannel```是非音视频的数据。

## 3. 基于node搭建一个https服务

```s
brew install mkcert
// 安装根证书
mkcert ---install
// 生成本地签名，假设域名为123.com
mkcert 123.com
```

使用```https```模块创建```node```服务

```js
const https = require('https');
const fs = require('fs');
const app = https.createServer({
    key: fs.readFileSync('./xxxx.key'),
    cert: fs.readFileSync('./xxxx.pem')
}, (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('https');
}).listen(443, '0.0.0.0');
```

## 4. WebRTC设备管理

在```WebRTC```规范中给提供一个叫做```enumerateDevices```的```api```可以获取到电脑中的音频和视频设备。

```js
var ePromsie = navigator.mediaDevices.enumerateDevices();
```

返回的是一个```Promise```，在```Promsie```中存在一个```MediaDevicesInfo```，里面存在四个主要的信息。

| 属性 | 说明 |
| ---- | ---- |
| deviceId | 设备ID |
| label | 设备的名字 |
| kind | 设备的种类 |
| groupId | 两个设备groupID如果相同说明是同一个物理设备 |


首先需要判断是否支持```WebRTC```，如果支持就调用```enumerateDevices```方法，```then```中返回的````deviceInfos````是一个数组，每一项就是设备信息。里面包含音频设备和视频设备。

注意这里需要在服务器环境访问，并且需要```https```才可以。

```js
if (navigator.mediaDevices || navigator.mediaDevices.enumerateDevices) {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
        deviceInfos.forEach((deviceInfo) => {
            console.log(deviceInfo.kind, deviceInfo.label, deviceInfo.deviceID, deviceInfo.groupId);
        })
    }).catch((err) => {
        console.error(err);
    })
} else {
    console.log('不支持这个');
}
```

## 5. 采集音视频数据

使用```getUserMedia```进行数据采集, 同样返回一个```promise```，参数是```MediaStreamConstraints```类型。

```js
var ePromsie = navigator.mediaDevices.getUserMedia(constraints);
```

```getUserMedia```获取视频，传递给```video```标签实时播放。

```html
<video autoplay playsinline id="player"></video>
```

```js```部分同样需要做下判断，```getUserMedia```传入的是```constraints```是一个对象，有两个参数，分别是```video```和```audio```,```video```和```audio```可以是布尔值，也可以是具体音视频的配置，设置```true```，表示音视频都采集。

```then```方法中会获取到流数据，由于这里设置了视频和音频，所以他包含视频轨和音频轨。这里将获取到的流数据给到```video```标签需要使用```html```的```srcObject```属性。

```js
if (navigator.mediaDevices || navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(((stream) => {
        document.querySelector('#player').srcObject = stream;
    }) => {
        
    }).catch((err) => {
        console.error(err);
    })
} else {
    console.log('不支持这个特性');
}
```

## 6. 浏览器兼容问题

```webrtc1.0```规范出来之前，各个浏览器厂商都在按照自己的计划使用```webrtct```这就造成了各个浏览器厂商使用的```getUserMedia```的名字是不一样的都增加了一个自己的前缀。

在```3w```规范里采集音视频数据使用的是```getUserMedia```, 不过在谷歌浏览器里面实现的名字是```webkitGetUserMedia```很像```css3.0```的兼容方式，火狐在前面加的就是```mozGetUserMedia```。

这就给前端开发人员造成了很大的麻烦，如果想通过这个```api```采集音视频数据，对于不同的浏览器厂商就要做类型判断。

```js
const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
```

随着```webrtc```在各个浏览器中的推进，```google```开源了一个[adapter.js](https://appr.tc/js/adapter.js)库，这个库就是适配各个浏览器中不同```api```的。最初只有几十行代码，但是随着```webrtc```的发展，现在发展到差不多有两千多行的代码。不过随着时间的推移，浏览器厂商的兼容性越来越好```adapter.js```可能后面会被放弃掉。不过目前来说还是需要使用它来做兼容的。实际工作中最好还是使用他来做兼容。

使用```adapter```很简单，只需要引入这个```js```就可以了, 引入之后在各种浏览器里就可以使用了，包括移动端。

```html
<video autoplay playsinline id="player"></video>
<script src="https://appr.tc/js/adapter.js"></script>
```

不同浏览器中通过```enumerateDevices```获取到的设备信息是不同的，在```chrome```中可以直接获取到设备信息当然这也和不用的版本有关，但是在```苹果浏览器```和```firefox```浏览器中对设备的权限控制会严格一些。

使用```getUserMedia```采集数据的时候浏览器会弹出一个窗口，询问是否允许访问音视频设备。用户点击允许之后才获取到了权限，这个时候再去使用```enumerateDevices```获取设备信息。

## 7. 音视频采集的约束

通过约束可以精确的控制音视频的采集数据。

首先就是宽和高，也就是视频数据的宽高，```width```和```height```，一般视频的宽高有两种比例，一种是```4:3```一种是```16:9```, 比如```320 * 240```，```640 * 480```这都属于```4:3```的比例，显得更方正。```1280 * 720```这是```16:9```的比例，他显得更长一些。

对于手机来说他是反的，比如说如果竖屏拍摄的话那高度是```16```，宽度变成了```9```。通过宽高的约束就可以控制分辨率。

还有比例```aspectRatio```，在这里是个小数点，一般情况下只需要设置宽和高就可以了，一般不会设置这个值。

```frameRate```是帧率可以通过他来控制码流，如果帧率低画面不会平滑，会有一些卡顿，帧率高会很平滑一般```30 - 60```就相对较好了。帧率大码流也会比较大，也就是采集的数据比较多。

```facingMode```这个一般对手机来说，他是控制摄像头翻转的，就是前置摄像头和后置摄像头。```user```是前置摄像头，```environment```是后置摄像头，l```eft```是前置左摄像头，```right```是前置右摄像头。在```PC```这个设置一般没什么作用。

```resizeMode```表示是否裁剪画面，这个用途也不是很多。

这些舒适性的设置比较简单，可以把```video```的布尔值改为对象，然后在里面设置对应的参数。比如宽高设置```640```和```480```，帧率设置```60```，如果是手机可以使用```facingMode```修改使用摄像头。

```js
if (navigator.mediaDevices || navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
        video: {
            width: 640,
            height: 480,
            frameRate: 60,
            facingMode: 'environment'
        },
        audio: false,

    }).then(((stream) => {
        document.querySelector('#player').srcObject = stream;
    }) => {
        
    }).catch((err) => {
        console.error(err);
    })
} else {
    console.log('不支持这个特性');
}
```

同样在音频中也有一些参数约束，首先是```volume```是音量相关的。值是```0-1```。第二个是```sampleRate```采样率，在音频中有很多采样率，比如```48000```，```32000```，```16000```，```8000```等很多，可以根据自己的需要设置采样率。

```sampleSize```还有采样大小或者位深，也就是每一个采样由多少位表示，一般都用```16```位也就是两个字节表示。

```echoCancellation```回音，也就是采集数据后是否开启回音消除，在实时直播的过程中回音消除是一个特别重要的功能。当双方通话的时候如果有回音传过来会对通话质量造成很大的影响。这个参数的值是布尔，可以设置开启或者关闭。

```autoGainControl```表示在原因的声音基础上是否增加音量，也是一个布尔值。

```noiseSuppression```表示降噪，就是在采集数据的时候是否要开启降噪功能。

```latency```是直播过程中的延迟大小，如果设置的小的话代表实时通信的时候延迟性就小。当网络不是特别好的时候，延迟设置的小就会卡顿。

```channelCount```是单声道还是双声道，一般单声道就够了，如果是对乐器来说会使用双声道，这样音质更好。

```deviceID```是如果多个输入输出设备的时候可以进行设备的切换，比如手机前置摄像头和后置摄像头。

```groupID```物理设备

```WebRTC```约束也可以像下面这样写，可以根据网络情况自动的选择。

```js
{
    audio: {
        noiseSuppression: true,
        echoCancellation: true,
    },
    video: {
        width: {
            min: 300,
            max: 640,
        },
        height: {
            min: 300,
            max: 480
        },
        frameRate: {
            min: 15,
            max: 30
        }
    }
}
```

## 8. 处理获取到的视频

可以给视频添加一些特效，因为是在浏览器当中，所以需要使用浏览器的```css filter```。具体支持下表这些特效。

| 特效 | 说明 | 特效 | 说明 |
| ---- | ---- | ---- | ---- |
| grayscale | 灰度 | opacity | 透明度 |
| sepia | 褐色 | brightness | 亮度 |
| saturate | 饱和度 | constrast | 对比度 |
| hue-rotate | 色相旋转 | blur | 模糊 |
| invert | 反色| drop-shadow | 阴影 |

使用也很简单，就是给```video```标签设置```filter```样式。

```css
.blur {
    -webkit-filter: blur(3px);
}
.grayscale {
    -webkit-filter: grayscale(1);
}
.invert {
    -webkit-filter: invert(1);
}
```

截取视频中的某一帧，做法也非常的简单，就是利用```canvas```获取当前播放的帧，最终输出成一张图片就可以了。可以在一个点击事件中做这件事，点击之后，获取```canvas```的```2d```画布，然后通过```drawImage```将视频(```video```标签)绘制到```canvas```中。这时```canvas```中会绘制出当前```video```展示的内容。可以右键另存图片。也可以通过服务端将图片生成下载。

```js
btn.onclick = function() {
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
}
```

```mediastream```方法和事件

```MediaStream.addTranck()```: 向流媒体中加入音视频轨。

```MediaStream.removeTrack()```: 从媒体流中移除指定的轨。

```MediaStream.getVideoTracks()```: 获取所有的视频轨。

```MediaStream.getAudioTracks()```: 获取所有音频轨。

```MediaStream.stop()```: 将媒体流关闭，会关闭每一个轨中的```stop```

```MediaStream.onaddtrack```：添加媒体轨的事件。

```MediaStream.onremovetrack```: 移除媒体轨的事件。

```MediaStream.onended```: 当流结束的时候的事件。

```js
if (navigator.mediaDevices || navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
        video: {
            width: 640,
            height: 480,
            frameRate: 60,
            facingMode: 'environment'
        },
        audio: false,

    }).then(((stream) => {
        document.querySelector('#player').srcObject = stream;
        // 获取第一个视频轨，一般这里只有一个视频轨
       const track = stream.getVideoTracks()[0];
       console.log(track.getSettings()); // 获取视频配置。
    }) => {
        
    }).catch((err) => {
        console.error(err);
    })
} else {
    console.log('不支持这个特性');
}
```

## 9. 录制介绍

录制媒体流实际上就是获取通过```getUserMedia```获取的实时音视频数据。

```MediaRecoder```有很多的事件和方法。使用也非常简单。直接实例化就可以了。

```js
new MediaRecorder(stream, [, options]);
```

这里的参数```stream```是通过```getUserMedia```或者```video```或者```audio```或者```canvas```获取的```stream```。

存在很多的选项。主要有```mimeType```指定录制的是音频还是视频，录制的格式是什么。

格式有很多比如谷歌的音视频格式```video/webm```,```audio/webm```， 还可以指定视频的编码```video/webm;codecs=vp8```,```video/webm;codecs=h264```, 音频编码```audio/webm;codecs=opus```。

```audi