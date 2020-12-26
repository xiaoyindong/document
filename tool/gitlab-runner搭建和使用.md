## 1. 前言

构建任务都会占用很多的系统资源，```GitLab CI```是```GitLab```的一部分，如果由```GitLab CI```来运行构建任务的话，在执行构建任务的时候，```GitLab```的性能会大幅下降。

```GitLab CI```最大的作用是管理各个项目的构建状态，因此，运行构建任务这种浪费资源的事情就交给```GitLab Runner```来做。

```GitLab Runner```最好安装到单独的linux机器上，在构建任务运行期间并不会影响到```GitLab```的性能。

在```GitLab Runner 10```中，名称从```GitLab ci multi Runner```变为```GitLab Runner```。如果想要了解```GitLab ci multi Runner```可查看```https://docs.gitlab.com/runner/install/old.html```

## 2. 安装Docker

如果要使用```Docker executor```，需要在```GitLab Runner```之前安装Docker。如果不使用此步骤可跳过。

```s
curl -sSl https://get.docker.com/ | sh
```

## 3. 安装 gitlab ci runner

官方文档：```GitLab Runner(https://docs.gitlab.com/runner/install/linux-repository.html)```

```GitLab Runner```其实是将某台服务器，注册成为```GitLab CI```的任务执行单元，用于在```CI```过程中，执行相应的任。

```Gitlab CI```对```Runner```并没有什么严格的要求，可以是一台```linux```实体机，也可以是个```Docker```容器。

针对不同的```Runner```，可以在注册时划分不同的固有角色（https://docs.gitlab.com/runner/executors/index.html），以及打上不同的