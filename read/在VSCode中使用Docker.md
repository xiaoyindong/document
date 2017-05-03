文章参考自极客时间，玩转```VS Code```，禁止任何形式转载，私自转载自行承担法律责任。

## 1. 安装

```VS Code```的```Docker```支持是由插件来完成的，并且这个插件是```VS Code```官方团队维护的，所以它的发布者是```Microsoft```。可以在市场上点击下载，也可以直接在```VS Code```插件视图里搜索```Docker```进行安装。当然了，这个插件的正确运行，离不开一个正确安装的```Docker```环境，也就是当前机器已经正确安装并可以使用```Docker```。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d2a4146afc74569a4c4e8814d174ef0~tplv-k3u1fbpfcp-watermark.image?)

安装完```Docker```插件后，在活动栏上，能够看到一个集装箱的图标，点击它就能够看到```Docker```相关的信息了。

![屏幕快照 2021-11-14 16.25.48.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e83d86060d5843c0bdddcdcf56fdf6b5~tplv-k3u1fbpfcp-watermark.image?)

在这个视图中，能够看到以下信息:

![屏幕快照 2021-11-14 16.28.54.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0047e25d12e48f88f81c332345929a7~tplv-k3u1fbpfcp-watermark.image?)

当前环境中所有的```image```，当前环境中存在的```container```，以及```Docker```的仓库列表。

右击时```image```能够看到一系列的操作，比如查看```image```信息、发布```image```、运行```image```等。当然，这些操作同样也可以在命令面板中找到。

在```containers```上右击调出的上下文菜单有三个命令: 删除```container```、重启```container```以及查看```container```运行日志。

除了提供了一个视图```Docker```插件还能够对```Dockerfile```文件进行语法高亮。而且也支持自动补全，这样就可以通过建议列表来输入```Dockerfile```中的命令了。

## 2. 构建和运行

书写了正确的```Dockerfile```后，就可以通过```Dockerfile```来构建````image````了。为了方便理解，创建一个新的文件夹，在其中创建```Dockerfile```。

```s
FROM alpine:latest

RUN apk --no-cache add \ 
    htop

CMD [ "htop" ]
```

这段```Dockerfile```的意思是，希望基于```alpine```系统安装```htop```包，最后运行```htop```命令 ，查看当前运行的各种进程。

### 1. docker build

可以打开命令面板，执行```Docker: Build image```命令。这个命令会打开集成终端，然后执行