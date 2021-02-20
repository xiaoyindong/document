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

```audioBitsPerSecond```是音频的码率，码率根据编码决定有的是```64k```有的是```128k```，```videoBitsPerSecond```视频码率设置的越多清晰度越高比如```720```可能就是```2M```，```bitsPerSecond```是整体码率。

``MediaRecorder``的```api```也比较多```MediaRecorder.start(timeslice)```是开启录制，```timeslice```是可选参数，如果不设置会存储在一个大的```buffer```中，如果设置了这个参数就会按照时间段存储数据，比如说```10s```存储一块数据。

```MediaRecorder.start()```是关闭录制，当停止录制时会触发```dataavailable```事件，获取得到最终的```blob```数据，```MediaRecorder.pause()```是暂停录制，```MediaRecorder.resume()```是恢复录制，```MediaRecorder.isTypeSupported()```是检查录制支持的文件格式。

```ondatavailable```当数据有效会触发，获取```e.data```。这个事件跟随```timeslice```执行，如果没有指定则记录整个数据。如果指定了会定时触发。

```onerror```在出现错误的时候触发录制会自动停止。

```js```中有```4```种数据存储方式```字符串```，```blob```是一个高效的存储区域，```buffer```，```arraybuffer```就是```blob```依赖的底层，可以说```blob```是对```arraybuffer```的封装。```arraybufferview```是各种各样类型的```buffer```。

一般常用```blob```，如果更底层一点可以使用```arraybuffer```。

## 10. 录制案例

这里来演示开始录制，播放录制的视频，下载录制的视频。

```html
<video playsinline id="player"></video>
<video playsinline id="recplayer" controls=“true”></video>
<button id="record">开始录制</button>
<button id="recplay">开始播放</button>
<button id="download">下载</button>
```

点击开始录制按钮的时候，需要判断是否已经开始录制，定义一个```textContent```状态来判断。如果是播放就暂停，如果是暂停就播放。

当开始录制时创建一个```startRecord```函数，并且调用，在```startRecord```函数中首先重置存储录制数据的数组，这是为了避免上一次录制的数据干扰，然后使用```new MediaRecorder```创建录制对象。在录制对象的``ondatavailable``事件中可以不断的获取到录制的视频流，通过```handleDataAvailable```来接收，然后将它拼接在```buf```的采集数组中。

```new MediaRecorder```传入的第一个参数是```getUserMedia```中的```stream```。

在```stopRecord```函数中只需要调用```mediaRecorder.stop```就可以了。

```js
// 初始化一个mediaRecorder录制对象
var mediaRecorder;
// 创建一个存储数据流的数组。
var buf = [];

btnRecord.onclick = () => {
    if (this.textContent === 'start record') {
        startRecord();
        this.textContent = 'stop record';
    } else {
        stopRecord();
        this.textContent = 'start record'
    }
}

function startRecord() {
    // 开始录制时重置数组
    buf = [];
    // 约束视频格式
    const options = {
        mimeType: 'video/webm;codecs=vp8'
    }
    // 判断是否是支持的mimeType格式
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error('不支持的视频格式');
        return;
    }
    // 从window中获取stream
    try {
        mediaRecorder = new MediaRecorder(window.stream, options);
        // 处理采集到的事件
        mediaRecorder.ondatavailable = handleDataAvailable;
        // 开始录制
        mediaRecorder.start(10);
    } catch (e) {
        console.error(e);
    }
}

// 处理采集到的数据
function handleDataAvailable(e) {
    if (e && e.data && e.data.size > 0) {
        // 存储到数组中
        buf.push(e.data);
    }
}

function stopRecord() {
    mediaRecorder.stop();
}

if (navigator.mediaDevices || navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
        video: {
            width: 640,
            height: 480,
            frameRate: 60,
            facingMode: 'environment'
        },
        audio: true,
    }).then(((stream) => { // 存储stream到window上
        window.stream = stream;
    }).catch((err) => {
        console.error(err);
    })
} else {
    console.log('不支持这个特性');
}
```

开始播放事件中创建一个```blob```, 传入的第一个参数是```buffer```，第二个参数指定类型也就是说明```blob```中传入的是什么东西，这里指定```video/webm```。这样就生成了一个可以处理```video```的```buffer```的```blob```。

然后将```blob```赋值给```video```标签的```src```属性，这里需要使用```URL```的```createObjectURL```方法来实现。至于```srcObject```属性是赋值直播流的，这里不需要赋值为```null```就可以了。然后使用```play```方法开始播放。

```js
btnPlay.onclick = function() {
    var recplayer = document.getElementById('recplayer');
    const blob = new Blob(buf, { type: 'video/webm'});
    recplayer.src = window.URL.createObjectURL(blob);
    recplayer.srcObject = null;
    recplayer.play();
}
```

这样就可以播放录制的视频了，先开始录制，录制一段时间然后暂停，会自动保存录制的视频，然后再开始播放。就会播放刚刚录制的视频了。

下载和播放类似首先需要拿到录制的数据，同样的也是使用```URL```对象的```createObjectURL```方法创建```url```。然后再创建一个```a```标签，将```url```赋值给```href```属性，设置文件的名称为```aaa.webm```。最后触发```a```的点击事件。

```js
btndownload.onclick = function() {
    const blob = new Blob(buf, { type: 'video/webm'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.style.display = 'none';
    a.download = 'aaa.webm';
    a.click();
}
```

## 11. 通过WebRTC捕获桌面

使用```getDisplayMedia```来实现，他与```getUserMedia```是很类似的, 包括参数也是一致的。

```js
var ePromsie = navigator.mediaDevices.getDisplayMedia(constraints);
```

这个功能是```chrome```的实验功能，只在最新的几个版本中存在。需要手动设置一下。

```s
chrome://flags/#enable-experimental-web-platform-features
```

在这个设置中, 将它选中```enabled```来设置打开。

js代码基本就是之前的代码，只需将```getUserMedia```修改为```getDisplayMedia```即可。

```js
if (navigator.mediaDevices || navigator.mediaDevices.getDisplayMedia) {
    navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
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

打开页面就会弹出共享屏幕，询问是录制整个屏幕还是录制应用窗口，还可以是```chrome```的一个标签页。

## 12. Socket.io处理消息简述

```WebRTC```中对服务器是没有规定的，主要是对web端的一些规定，这主要是因为每个公司的业务模型是不一样的，很难统一这种规范，所以不如干脆让每个公司自己去定义，只要可以实现数据交互就可以了，这样做也比较灵活更容易被接受。

如果没有信令服务器的话```WebRTC```之间是没办法通信的。发起端和接收端想要传递数据的话，有两个信息是必须经过信令服务器相互交换之后才能进行通信的，第一个是媒体信息，也就是如果要实现通信就要确定编解码器，比如说```A```的视频编码是```H264```,```B```也要告诉```A```是否接受```H264```,所以这个信息是必须要传递的。第二个要传递的信息是网络信息，两个客户端尽可能要会选择```p2p```传输，在链接之前如何发现对方，也是通过服务器。

这里简单演示一个通过```socket.io```搭建的服务器。

```s
npm install socket.io --save-dev
```

```node```代码将```https```和```socket```中进行一个绑定。```socketIo = listen(https_server);```。

```js
const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');
const serveIndex = require('serve-index');
const socketIo = require('socket.io');

const app = express();
app.use(serveIndex('./public'));
app.use(express.static('./public'));

const http_server = http.createServer(app);

http_server.listen(80, '0.0.0.0');

const https_server = https.createServer({
    key: fs.readFileSync('./xxxx.key'),
    cert: fs.readFileSync('./xxxx.pem')
}, app);

const io = socketIo.listen(https_server);

https_server.listen(443, '0.0.0.0');

```

绑定之后就可以去处理站点上所有的```connection```事件了，回调函数中的参数socket代表每一个客户端。

首先这台服务器是要有房间的概念，要有加入房间的事件和离开房间的事件。这里加入定义为```join```，离开定义```leave```。客户端传递一个参数说明加入到哪个房间，用```room```来接收。

当收到加入房间的时候，加入到对应的房间，```socket.io```自身就提供了```join```方法也就是加入到那哪个房间。这里的房间就是一个名字或者```id```，如果不存在```socket.io```会自动创建一个房间。```io.sockets.adapter.rooms```, 这是一个对象，可以通过```room```的标识查到。

加入成功之后可以给当前用户回复，也可以给所有人回复。

```js
const io = socketIo.listen(https_server);

io.sockets.on('connection', (socket) => {
    socket.on('join', (room) => {
        socket.join(room);
        const myRoom = io.sockets.adapter.rooms[room];
        const users = Object.keys(myRoom.sockets).length; // 获取房间内用户数量。
        // 当前用户回复
        socket.emit('joined', room, socket.id);
        // 给房间内除了自己所有人回复
        socket.to(room).emit('joined', room, socket.id);
        // 给房间所有人回复
        io.in(room).emit('joined', room, socket.id);
        // 给除了自己的所有人发送
        socket.broadcast.emit('joined', room, socket.id);
    })
})

https_server.listen(443, '0.0.0.0');
```

用户离开的逻辑和用户加入的基本一样，用户数这里需要减一，使用```socket.leave```方法让用户离开房间。

```js
io.sockets.on('connection', (socket) => {
    socket.on('leave', (room) => {
        
        const myRoom = io.sockets.adapter.rooms[room];
        let users = Object.keys(myRoom.sockets).length; // 获取房间内用户数量。
        users -= 1;
        socket.leave(room);
        // 当前用户回复
        socket.emit('joined', room, socket.id);
        // 给房间内除了自己所有人回复
        socket.to(room).emit('joined', room, socket.id);
        // 给房间所有人回复
        io.in(room).emit('joined', room, socket.id);
        // 给除了自己的所有人发送
        socket.broadcast.emit('joined', room, socket.id);
    })
})
```

```H5```端链接socket.io。

```js
// 链接服务
const socket = io.connect();

// 使用on接收消息
socket.on('joined', (room, id) => {

})

// 发送消息, 名字叫join，值为1
socket.emit('join', '1');
```

## 13. 端对端链接

```RTCPeerConnection```是```WebRTC```的核心类, 接收一个可选参数。

```js
new RTCPeerConnection([configuration])
```

类的方法有按功能可以分为四类，媒体协商类，媒体流和轨道类，传输相关类和统计相关类。

对于```AB```两个端来说如果想要创建连接，首先```A```会创建一个```offer```，创建```offer```实际上就形成了一个```sdp```，他是一个包含了媒体信息编解码信息传输的相关的信息，创建之后通过云端的信令牌服务器传给```B```, 在传输之前```A```需要调用```setLocalDescription```方法去收集候选者也就是可连接端。

```B```端收到```offer```之后，会调用```setRemoteDescription```方法将```offer```的```sdp```数据放到自己远端的描述信息槽里，当这些做完之后需要返回```A```一个```answer```，就是创建```B```本身的一个媒体信息，```offer```是```A```的媒体信息，```answer```是```B```的媒体信息，也就是编解码信息之类的。形成之后```B```也要调用一个```setLocalDescription```方法，也是收集候选者。调用之后```B```将```answer```通过服务转给````A````。

```A```收到```answer```也会将这个值使用```setRemoteDescription```存在自己的远程槽里，这样在每一端都有两个```SDP```，第一个是自己的媒体信息，第二是对方的媒体信息。拿到这两个媒体信息之后在内部进行一个协商，比较两者是否可以通信。协商之后取出交集，协商过程就建立好了。

简单来说就是发送端和接收端都有两个数据要设置，自身的数据和另一方的数据。发送端创建数据之后要将数据设置在自己身上还要发送给接收端，接收端拿到之后设置到自己身上，然后接收端创建的数据也要设置在自己身上还要传给发送端，让他也设置到自己身上。

当一开始创建```RTCPeerConnection```的时候协商处于一个```stable```