## 1. 概述

Github 2019年秋天发布的CI/CD工具，功能强大且稳定。github被微软收购以后，越来越强大，正在由一个git托管服务变为一个研发项目解决方案。

代码在项目的.github/workflows目录下，.yml格式的文件。

## 2. 语法

name是一个名字，可以是文件名也可以是其他名字，就是整体的名字。

.github/demo.yml
```yml
name: demo
```

on是触发条件，有push，branches，paths等。push是触发条件，branches表示分支，paths表示哪些文件变化了会触发。如果省略是只要变更了就触发。

```yml
name: demo
on:
    push:
        branches:
            - master
            - dev
        paths:
            - '.github/workflows/**'
            - '__test__/**'
            - 'src/**'
```

jobs是任务，steps是步骤，可自定义，也可使用第三方。每个任务要指定一个runs-on也就是指定操作系统，这里指定的是ubuntu-latest。

steps是步骤，在第一个test中第一个steps中有多个，有几个-就是有几个steps，uses: actions/checkout@v2就是git pull。这里用的第三方的actions。

第二句- name: Use Node.js编辑了step的名称，uses: actions/setup-node@v1是安装了nodejs，通过wi