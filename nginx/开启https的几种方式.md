## 1. 概述

首先需要获取```https```证书，将```https```证书和网站域名进行绑定，就可以通过```https```访问网站了。

## 2. 证书获取

```https```证书有```4```种，这里我们只介绍最简单并且免费的，域名证书。

### 1. 阿里云获取证书

如果你的域名是阿里云购买的那就简单了，登录阿里云在搜索栏搜索```ssl```证书，选中```ssl证书(应用安全)```控制台，打开证书列表页面。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/149defed903b4ad89fc07efc4ef903ef~tplv-k3u1fbpfcp-watermark.image)

在证书列表页面，点击购买证书。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/997cb9e6bacb4f83893a75f67951fc06~tplv-k3u1fbpfcp-watermark.image)

```2021```年起阿里云证书将以资源包的形式开放(说实话，更麻烦了)，需要点击证书资源包中进行下单。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c0a2d5f3126403e98dfb2ee7771e941~tplv-k3u1fbpfcp-watermark.image)

选择免费证书扩容包```20```个，支付金额为```0```元，下单就可以了。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba8c3fef89e74afb82a0aa6bf35b3df4~tplv-k3u1fbpfcp-watermark.image)

选择左侧证书资源包选项卡，然后在剩余证书数量中点击证书申请。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9902af04a289479499707a1b12078862~tplv-k3u1fbpfcp-watermark.image)

申请一个。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc62a793527341c2817d55f23d2a061f~tplv-k3u1fbpfcp-watermark.image)

在下面新增的这条信息中点击申请证书，会要求填写一些信息，比如网站域名，证书所有人。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c98e490fa8e4108bda758f08b484ae7~tplv-k3u1fbpfcp-watermark.image)

登记之后就会出现下载按钮，在弹出的弹框中选择需要对应的环境就可以了，一般我这里下载的证书会配置在```nginx```中，所以下载```nginx```的。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0451332bf6464c58a7e82b43b58099dc~tplv-k3u