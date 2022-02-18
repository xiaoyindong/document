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

可以打开命令面板，执行```Docker: Build image```命令。这个命令会打开集成终端，然后执行```docker build```命令。

### 2. docker run

生成了```image```之后，可以通过```image```来创建```container```了。此时，可以通过```Docker```视图的上下文菜单来生成```运行 container```，也可以从命令面板中，运行```Docker: Run```命令。然后```VS Code```就会询问使用哪个```image```。

### 3. docker run interactive

除了```Run```这个命令外，另一个非常有用的命令就是```Run Interactive```。可以创建并运行```container```，然后进入到这个```container```的```shell```环境。

在上面的例子里```container```运行的命令是```htop```，也就是实时监控系统运行的情况，执行了```Run interactive```命令，运行了```contaienr```并且进入到它的```shell```环境中后，就立刻看到了```htop```的运行界面。

对于命令面板里执行每个命令```VS Code```都会打开集成终端，然后运行相对应```Docker```脚本。可以先依赖于```VS Code```提供的命令，试着理解```VS Code```每个命令背后的脚本的含义。这就需要具备一定的```docker```命令行的知识。

### 4. 输出 log

对```Dockerfile```按如下稍作修改

```s
FROM alpine:latest

RUN apk --no-cache add \

    htop

CMD [ "pwd" ]
```

将```Dockerfile```中最后一个配置```CMD```进行了修改。这个```image```生成的```container```运行起来后会执行```pwd```命令，而非```htop```命令。

修改完```Dockerfile```之后，第一件要做的事情，就是重新构建```image```。在构建```image```时，可以覆盖之前的```image```，也可以重新起个名字来创建新的```image```。比如新的```image```取名为```vscode-docker-sample2:latest```。

有了新的```image```后，接下来就是从```vscode-docker-sample2:latest```创建一个新的```container```。

在运行```docker run```的时候，如果留意左侧视图```containers```这个列表的话，会发现```vscode-docker-sample2```的```container```出现了一下然后又消失了。这是为什么呢?来看一下集成终端，此时集成终端里运行的脚本是。

```s
docker run --rm -d vscode-docker-sample2:latest
```

这行脚本中有一个参数```–rm```，意思是如果```container```里的命令执行结束的话，就将这个```container```删除。由于这个```container```中运行的命令是```pwd```，这个命令很快就结束了，所以来不及在视图中看到并且操作它。如果不希望这个```container```被删除可以选择手动地运行如下的脚本。

```s
docker run -d vscode-docker-sample2:latest
```

这次创建的```container```运行结束后就不会被删除了。也就是此时能够在左侧```Containers```列表里看到```vscode-docker-sample2:latest (dreamy_...)```这个```container```了。它前面的图标里有一个 红色的点，这说明这个```container```已经结束工作了。

可以在这个```container```上右击调出上下文菜单，选择```Show logs```命令。接着就能够看到这个```container```中```pwd```命令执行的结果了，就是```/```。

## 3. Docker Compose

除了```Dockerfile```的支持，```Docker```插件还支持```Docker Compose```。```Docker Compose```是用于配置多个```container```并且将其同时运行。和```Dockerfile```一样也可以在```Docker compose file```里获得自动补全和错误检查。

这里用一个```Node.js```的代码示例，来展示```Docker Compose```以及接下来调试相关的内容。

首先将上文中创建的```Dockerfile```删除。然后在文件夹下创建一个```JavaScript```文件```index.js```。

```js
function foo() { 
    bar("Hello World");
}

function bar(sr) {
    console.l