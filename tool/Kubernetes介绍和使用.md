## 1. 概述

```docker```在```2014```年发布第一个版本。

在```2017```年年底之前```docker```并不支持```k8s```，因为```swarm```和 ```k8s``` 是竞争关系，```swarm```是```docker```自带的编排工具。

```docker swarm```分为```manager```节点和```worker```节点，```manager```节点是管理的功能，维持```cluster```状态并且提供对外的接口，可以通过```manager```部署```app```，```services```，```stack```等等。

```k8s```的架构和```docker swarm```类似，分布式的集群大的方向的架构都是类似的。都是有```manager```和```worker```，只不过在```kubernets```中```manager```叫做```master```节点，```worker```叫做```node```，就是单纯的```node```节点。

```master```对外提供接口，可以对整个```kubernets```集群进行操作。

### 1. master

```master```是```k8s```的大脑，主要功能```API Server```是暴露给外界访问的。可以通过```CLI```或者```UI```去操作```API Service```然后和整个集群进行交互操作。

```Scheduler```实现调度工作，假设通过```API```下达一个命令部署应用，这个应用需要两个容器，那这两个容器到底要运行在那个节点上去，这个就是```Scheduler```通过一些调度算法来决定运行在哪个节点。

```Controller```是一个控制，比如说容器要做一个负载均衡，要做一个扩展，控制运行个数等等。

最底层有一个```etcd```，他是一个分布式的```key-value-store```，就是一个存储，存储整个```k8s```的状态和配置。

### 2. node

```node```里面重要的一个概念是```pod```, ```pod```是容器调度的最小单位，pod指的是具有相同的```name space```的一些```container```的组合。

```name space```包含所有的```name space```, 比如说```user-name-space```, ```net-name-space```, 其实主要还是```network name space```。

具有相同的```network name space```组合，容器可能有一个也可能有多个，如果是多个的话他们是共享一个```network space```。

```Docker```，```kubelet```，```kube-proxy```, ```fluentd```。 

```docker```是容器组件，```kubelet```是```master```节点控制```node```节点的代理桥梁。```kube-proxy```和网络有关主要做端口的代理和转发，负载均衡等功能。```fluentd```主要是日志的采集，存储和查询。

## 2. 安装

```minikube```可以快速在本地搭建一个只有一个节点的集群，这个节点既是```master```又是```worker```，可以使用他来进行学习。这个工具可以用在```linux```，```macOS```，```windows```。

```kubeadm```可以方便的在本地搭建一个真正的```k8s```集群，有多个节点，至少一个```master```，一个 ```workder```，节点是可选的。当然节点越多需要的资源也就越多。他的使用要复杂一些。

现在很多云服务商都会提供搭建```k8s```的服务，只需要简单的````UI````界面操作就可以了。比如阿里云，谷歌云等等。

### 1. 在mac上安装

使用```minikube```来演示 ```https://minikube.sigs.k8s.io/docs/start/```, 安装还是比较简单的。

国内的阿里云上也存在很多的可[安装](yq.aliyun.com/articles/221687)的方式。

```s
minikube version
```

启动```minikube```, 这个启动可能会失败，因为服务在国外，可以参考上面的文档设置国内镜像。

```s