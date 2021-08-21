## 1. JOB构建

```jenkins```是由多个```job```任务或者```project```构成的开发系统，可以将```开发```，```测试```，```部署```，```基础运维操作```创建一个任务保存在任务列表当中，方便在```jenkins```平台中日常的维护。

使用```内建模块```或者```脚本```创建任务，在任务里面通过配置相关的```参数```以及```工具模块```作为可执行的任务，共享到```jenkins```平台下。供不同权限的人重复```build```执行。

每一次执行的结果记录称为一个```build```构建。```workspace```目录中保存```git```拉取的代码和构建之后的文件。

### 1. Freestyle job

用途最为广泛的任务类型，在配置页面添加配置项和参数就可以完成一个满足不同工作人员的需求。

缺点是每个```Freestyle job仅```能实现一个开发功能。```Freestyle```的```job```配置只能通过前台手动完成，无法通过编写一段代码去实现```Freestyle```的所有功能，所以不利于```Job配置迁移```和```版本控制```。(没有审计和历史记录)。

逻辑相对简单，无需额外学习成本。

### 2. Pipline Job

早期是```jenkins```的插件，后来集成到了```jenkins```中可直接使用。可以实现```持续集成```和```持续交付```的管道。持续集成简称```CI```,开发的每一次提交都可以自动构建。持续交付```CD```,在持续集成的基础上将打包文件部署。

所有模块， 参数配置都可以体现为一个```pipeline```脚本，可以定义多个```stage```构建一个管道工作集。所有的配置代码化，方便```Job```配置迁移与版本控制。但是有一定的学习成本，需要学习```pipline```脚本基础。

## 2. 环境配置

### 1. 配置 Jenkins server 本地 gitlab DNS

将g```itlab```所在服务器的```ip```配置到本地的```host```中。

```s
vi  /etc/hosts

# 192.168.xx.xx gitlab.example.com
```

### 2. 安装git client, curl工具依赖

```s
yum install curl -y
```

### 3. 关闭系统Git http.sslVerify安全认证

```s
git config --system http.sslVerify false
```

### 4. 添加Jenkins后台client user与email

```jenkins```后台的系统管理-系统设置，找到```Git Plugin```列表中，```name```中添加```root```，```email```中添加```root@example.com```。

### 5. 添加git Credential凭据

```jenkins```后台的凭据菜单，```jenkins``` -> ```全局凭据``` -> ```添加凭据```，类型选择```username with password```，```范围全局```，```username```输入```root```，```password```输入对应的密码，```id```和```描述```可以不填，确认即可。

## 3. freestyle构建配置

首先需要创建一个```freestyle project```, 左上角的新建项目就可以。```test-freestyle-job```, 构建一个自由风格的软件任务。

编辑描述信息，随便输入点什么就可以了。```this is first test freestyle job```。

同样在```general```中添加参数配置，在配置页面勾选参数化构建过程，添加一个选项参数和文本参数。选项参数名称为```deploy_env```, 选项为```dev```(```换行```)```prod```, 描述随便写，```choose deploy environment```。文本参数的名称填写```version```，默认值填写```1.0.0```，描述随便写，```build version```。

配置源代码管理选项打开，将```git```上的代码```clone```到```jenkins```本地，进行随后的项目部署工作。输入```gitlab```的```url```地址，这里使用```https```的地址，```credentials```选择刚刚创建的账号密码。```branch```选中```master```。

最后通过添加一个```shell```模块，完成```build```配置。在构建选项中，点击增加构建步骤，选择执行```shell```。在编辑栏中添加任务脚本。声明脚本格式。

这里面的```deploy_env```和```version```就是前面添加的参数配置，这里会将选中的值传递进来。

```s
#!/bin/sh
e