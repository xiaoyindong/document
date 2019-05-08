## 1. 概述

在很久以前，如果想要去部署一个```app```，需要准备一台物理服务器，然后在这台服务器上面安装一个操作系统，然后在操作系统里面去部署这个```app```。这种方式部署非常慢，而且成本比较高，会有很大的资源浪费，只是部署一个```app```就要购买一台服务器，同时也难于迁移和扩展。

随着发展出现了虚拟化的技术，虚拟化技术就是基于计算机的基础上，虚拟化一套物理资源，然后基于虚拟的物理资源安装操作系统。这样一台物理机可以部署多个```app```。

每一个虚拟机都是一个完整的操作系统，要给其分配资源，当虚拟机数量增多的时候操作系统本身消耗的资源也会增多。

容器解决了开发和运维之间的矛盾，在开发和运维之间搭建了一个桥梁，是实现```devops```的最佳解决方案。

容器是对软件和软件依赖的表转化打包，可以实现应用之间的相互隔离，容器是共享同一个```OS Kernel```, 不同的容器是```在OS Kernel```上运行的。

容器是在```app```层面的隔离，虚拟化是在屋里层面做的隔离。虚拟机的实现首先是服务器上创建了虚拟的屋里设备，然后基于虚拟的屋里设备安装操作系统，在操作系统中部署```app```。容器是在服务器上安装```docker```，然后```docker```创建容器，在容器中部署```app```。所以虚拟机中每个虚拟机有自己独立的操作系统，容器中所有容器共享一个操作系统。

也可以把虚拟化和容器结合使用。在虚拟器当中安装```docker```。

```docker```是容器技术的一种实现，也就是说容器技术不只有```docker```。

### 1. 部署软件的问题

如果想让软件运行起来要保证操作系统的设置，各种库和组件的安装都是正确的。比如饲养热带鱼和冷水鱼，冷水鱼适应的水温在```5-30```度，热热带鱼只能适应```22-30```度水温，低于```22```度半小时就冻死了。如何将两种鱼养在一个鱼缸里面呢？为了环境一致，最早采用的是虚拟机，在电脑里面虚拟了一个完全的隔了的虚拟系统。

### 2. 虚拟机

虚拟机就是带环境安装的一种解决方案，它可以在一种操作系统里运行另一种操作系统，问题是资源占用多，冗余步骤多，启动速度慢。

由于虚拟机存在这些缺点，```Linux```发展出另一种虚拟化技术，```Linux```容器 ```Linux Containers``` 简写 ```LXC```。

```Linux```容器不是模拟一个完整的操作系统而是针对进程进行隔离，或者说，在正常进程的外面套了一个保护层，对于容器里面的进程来说，他接触到的各种资源都是虚拟的，从而实现与底层系统的隔离。具备启动快，占用资源少，体积少等特点。

```Docker``` 属于```Linux```的一种封装，提供简单易用的容器使用接口，是目前最流行的```Linux```容器解决方案。```Docker``` 将应用程序与该程序的依赖，打包在一个文件里面，运行这个文件，就会生成一个虚拟容器，程序在这个虚拟容器里运行，就好像在真实的物理机上运行一样。

| | 启动时间 | 资源占用 | 安全性 | 使用要求 |
| --- | --- | --- | --- | --- |
| docker | 秒级启动 | 轻量级容器镜像通畅以M为单位 | 由于共享宿主机内核，只是进程隔离，因此隔离性和稳定性不如虚拟机，容器具有一定权限访问宿主机内核，存在一些安全隐患 | 容器共享宿主机内核，可运行在主机的linux的发行版，不用考虑CPU是否支持虚拟化技术 |
| 虚拟机 | 分钟级别启动 | 虚拟机以G为单位 | 由于共享宿主机内核，只是进程隔离，因此隔离性和稳定性不如虚拟机，容器具有一定权限访问宿主机内核，存在一些安全隐患 | KVM基于硬件的完全虚拟化，需要硬性CPU虚拟化技术支持 |

### 3. docker的使用场景

节省项目环境部署时间，可实现单项目打包和整套项目打包。支持环境一致性、持续集成、微服务、弹性伸缩等特点。

## 2. 安装

```docker```是```2013```年退出的，但是在此之前的```2004```年和```2008```，容器技术就已经开始在```linux```中使用了。

```docker```底层就是基于```2008```年的```LXC```实现的。```docker```分为企业版和社区版，企业版是收费的。

```s
https://docs.docker.com/install/linux/docker-ce/centos/

https://blog.csdn.net/yimenglin/article/details/93718784
```

```s
# 移除旧版docker
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine

curl -fsSL https://get.docker.com
```

安装依赖包

```s
sudo yum install -y yum-utils
```

设置阿里云镜像源

```s
sudo yum-config-manager \
    --add-repo \
    https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

更新```yum```软件源缓存，并安装```docker-ce```

```s
sudo yum install docker-ce docker-ce-cli containerd.io
```

```s
# 停止docker
systemctl stop docker
# 启动docker
systemctl start docker
# 查看docker版本, 会分别展示client和server的版本。
docker version
# 验证docker是否安装成功
docker run hello-world
```

## 3. 镜像和容器

对于```docker```的架构和底层技术来讲，随着学习和慢慢理解以后，会对```docker```的架构和技术会有更深入的了解。

```docker```是一个```platform```，提供了一个打包，开发，运行```app```的平台。这个平台将底层的物理设备和上层的```app```隔离开了，在```docker```之上来做事情。

```docker engine```有一个后台进程，他提供了一个```rest```的```api```接口，然后```docker engine```还有一个```cli```接口，```docker```是一个```cs```的架构，```cli```和后台进程使用过```rest```来通信的。

通过可以查看```docker```后台的进程

```s
ps -ef | grep docker
```

### 1. Image镜像

```Image```是分层的每一层都可以添加和删除文件，成为一个新的```Image```。不同的```Image```可以共享相同的```layer```。```Image```是只读的。

查看本机的```Image```

```s
docker Image ls
```

可以通过```dockerfile```文件定义```docker```的```Image```，使用```docker build```来打包一个新的```Image```。

```s
docker build -t 
```

也可以从```Registry```中获取一个```docker```, 比如下载```ubuntu:14.04```这个```Image```。这和```github```类似，可以使用```pull```从```hub.docker```中拉取```Image```。

```s
docker pull ubuntu:14.04
```

也可以将自己的```docker```文件```push```到```dockerhub```。

### 2. 自制一个Image

这里以一个简单的```Hello World```程序为例, 制作一个```Image```。

要运行```hello world```需要有```hello world```的程序，这里使用```C```语言来编写这个程序。

首先需要创建一个目录，这里叫```hello-word```。然后在这个目录里面创建一个文件，比如叫```hello.c```。

```s
mkdir hello-word
cd hello-word
vim hello.c
```

然后在这个文件里面书写代码，就是使用```printf```输出```hello world```字符串。

```c
# include<stdio.h>

int main() {
    printf("hello world\n");
}
```

有了这个程序以后需要将它编译成一个```2```进制文件，编译```C```语言程序需要使用```gcc```程序。可以使用```yum install gcc```安装```gcc```，还需要安装```glibc-static```。

```s
yum install glibc-static
```

通过```gcc```编译```hello.c```, ```-o```是输出的文件名，这里叫```hello```

```s
gcc -static hello.c -o hello
```

这样在```hello-word```目录下就会多出一个```hello```的文件，这是一个可执行的文件。直接运行他就会执行。

```s
./hello
```

接着将这个```hello```制作成一个```Image```，首先需要创建一个```Dockerfile```文件。

```s
cd hello-word
vim Dockerfile
```

在这个文件的第一行需要书写```FROM```,表示在什么之上，可以在其他的```Image```之上，这里是一个```base```的```Image```所以在```scratch```之上安装，表示从头开始。

使用```ADD```，将```hello```添加到```Image```的跟目录中。

接着运行```CMD```，指定运行的文件，比如这里指定```/hello```。
```s
FROM scratch
ADD hello /
CMD ["/hello"]
```

这是一个非常简单的```dockerfile```，有了这个```dockerfile```以后就可以去```build```一个```Image```了。可以通过```docker build -t``` 指定一个```tag```，比如这里的```tag```叫```yindong/hello-world```, 后面的.表示当前的目录找到```dockerfile```。

```s
docker build -t yindong/hello-world .
```

执行完毕就构建完了，这里因为有三行，所以会执行```step3```步。然后通过d```ocker Image ls```就可以看到构建的```yindong/hello-world```了。

可以使用```docker history ImageId```查看```docker```的分层。这个```id```就是```docker Image ls```中出现的```id```。

这里```FROM```的```scratch```，所以这个默认不算一层，所以打印出来的只有两层。

```s
docker history id
```

现在可以去运行```docker```了，通过```docker run yindong/hello-world```

```s
# docker run Image名字
docker run yindong/hello-world
```

这样就可以打印出```hello world```了。

```docker```的i```mage```其实就是将可执行文件存储起来，运行的时候是共享了宿主机的硬件环境，不过在运行的时候他是独立运行的。

这就是一个简单的```Image```，实际上```nginx```，```mysql```都可以做成```Image```，他们的工作原理和上面演示的也都是一样的。

### 3. Container

```Container```是通过```Image```创建的，也就是说必须有```Image```，然后通过```Image```来创建```Container```，```Container```是在```Image```的基础上增加了一层```Container layer```，这层是可读写的。因为之前讲过```Image```是只读的，```Container```因为要去运行程序和安装软件等所以他需要可写的空间。

类比面向对象的概念```Image```就相当于是类，```Container```就相当于实例。

```Image```负责```app```的存储和分发，```Container```负责运行```app```。

要基于```Image```创建```Container```其实也很简单，就是```docker run Image```的名字就可以了。

可以使用d```ocker container ls```查看当前本地正在运行的容器。

```s
docker container ls
```

```docker container ls -a```可以查看所有的容器包括运行的和退出的。

```s
docker container ls -a
```

可以通过```docker run -it```的方式来交互式的运行```Image```。也就是可以在这里运行命令，读写文件之类的。实际上进入到了```Container```里面。并且在执行```exit```退出容器的时候，之前的操作也会清除。

```s
docker run -it centos
exit
docker --help
```

## 3. 命令

````docker````的命令分为两部分，第一部分是```Management Commands```第二部分是 ```Commands```。

```Management Commands```是对```docker```里面的对象进行管理的。

```s
docker --help
# 查看命令
docker Image
docker container
# 查看container列表
docker container ls -a
# 删除container，id可以不用写全
docker container rm id
```

```Commands```提供的是一些简便的方法，比如使用```docker container ls -a```查看```container```列表。

```s
docker ps -a
# 删除一个container，默认docker的rm就是remove container
docker rm id
# docker Image ls
docker Images
# 删除 Image
docker Image rm id
docker rmi id
```

## 4. 删除container

通过```docker ps -a```会查看到很多的过期```container```，可以使用```docker rm```删除，也可以使用```docker container ls -aq```打印出所有```container id```, 这相当于使用搜索打印第一列。

```s
docker container ls -aq
docker container ls -a | awk {'print$1'}
```

有了这个id可以通过```docker rm $(docker container ls -aq)```删除所有的。

```s
docker rm $(docker container ls -aq)
```

如果更复杂的情况比如删除所有已经退出的```container```，通过筛选退出的容器。然后使用```docker rm```删除掉这些```container```。

```s
# 列出状态为exited的container
docker container ls -f "status=exited" -q
# 删除指定调教的container
docker rm $(docker container ls -f "status=exited" -q)
```

### 2. docker container commit命令

这个命令是创建一个```container```，然后在这个```container```中发生了一些变化，比如说安装了某个软件，这样的话可以把这个已经改变的```container```生成一个新的```Image```，可以简写成```docker commit```

```s
docker container commit
docker commit
```

使用```docker run -it centos```去交互的运行```centos```。这样就有了一个```container```。

```s
docker run -it centos
```

在这个```container```里面去做一些变化，去安装一个vim。

```s
yum install -y vim
```

安装完成之后退出```exit```，退出之后通过```docker container ls -a```找到刚刚运行的```container```。

可以通过```docker commit```命令将这个```container```打包成一个```Image```，这个```Image```基于```centos```并且里面安装好了```vim```。

接收的第一个参数是要```commit```的```container```，第二个参数要```Image```的```REPOSITORY```和```TAG```。

```s
# docker commit container列表中的name 新Image的名字。
docker commit hardcore_ishizaka yindong/centos-vim
```

这个新出现的```Image```大小要比之前的```centos```大一些，可以使用```docker history id```来对比一下```yindong/centos-vim```和```centos```，可以发现他们有很多相同的```layer```。

这是因为```yindong/centos-vim```是基于```centos```的，所以会直接复用```centos```的```Layer```，在最后一层中大概有```150MB```的大小，这是因为安装了```vim```的原因。

这种创建```Image```的方式并不十分提倡，因为如果把这个```Image```发布出去别人拿到这个```Image```并不会知道这个```Image```怎么产生的，这就会有问题，因为这个```Image```很可能包含不安全的内容。

大部分情况下还是建议通过```Dockerfile```的方式创建```Image```。



首先创建一个```docker-centos-vim```的目录在这个目录里面创建一个```Dockerfile```。

```s
mkdir docker-centos-vim
cd docker-centos-vim
vim Dockerfile
```

在这个```Dockerfile```中首先使用```FROM```是```centos```。运行```yum```命令安装```vim```，需要使用```RUN```来执行。

```s
FROM centos
RUN yum install -y vim
```

然后使用```docker build```命令构建Image。

```s
docker build -t yindong/centos-vim-new .
```

这里会产生两层，第一层是引用的```centos```，第二层会创建一个临时的```container```用来安装```vim```，然后在将这个临时的```container```生成```Image```，完成之后```removing```掉这个临时的```container```，这样就创建了一个新的```Image```。

## 5. Dockerfile


```Dockerfile```定义了很多的关键字。

### 1. FROM

用于指定在哪个```Image```之上去```build```的```Image```。

可以选择```scratch```表示从头去只做一个```Image```。

```s
FROM scratch
```

对于```FROM```来讲尽量使用官方的```Image```作为```base Image```。

### 2. LABEL

定义```Image```的```Metadata```信息，比如说版本，作者，描述等信息。

```s
LABEL maintainer="yindong@126.com"
LABEL version="1.0"
LABEL description="This is description"
```

```LABEL```定义的```Metadata```不可缺少，因为对于```Image```来讲是必须存在一些帮助信息，他像是代码里面的注释，来帮助别人使用。

### 3. RUN

```RUN```是非常常用的，因为很多时候需要运行一些命令，一般需要安装一些软件的时候也经常会使用到```RUN```，每运行一次```RUN```对于```Image```来讲都会新生成一层，所以对于```RUN```来说他的最佳实践中要求为了避免无用分层，合并多条命令成一行。

比如说```yum install``` 和 ```yum update```推荐通过```&&```合并成一层。为了美观如果```&&```导致行变得越来越长可以通过反斜线```\```换行，增加美观。

```s
# 使用反斜线换行
RUN yum update && yum install -y vim \
    python-dev

# 注意清理cache
RUN apt-get update && apt-get install -y perl \
    pwgen --no-install-recommends && rm -rf \
    /var/lib/apt/lists/*

RUN /bin/bash -c 'source $HOME/.bashrc; echo $HOME'
```

### 4. WORKDIR

设定当前工作目录，这个有点像```linux```里面通过```cd```去改变目录，在当前的目