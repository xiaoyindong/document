## 1. 概述

搭建的服务器至少内存要是```4G```,因为```gitlab```比较吃内存, 可以查看gitlab[官网](https://about.gitlab.com/install/)。

```gitlab```是一个开源分布式版本控制系统，他的开发语言是```ruby```。通过```UI```界面与用户交互实现项目代码管理，版本控制，代码复用与查找。

## 2. 安装

1. 首先需要关闭CentOS7系统下的放火墙。

```s
systemctl stop firewalld
# 禁止开机启动
systemctl disable firewalld
```

2. 关闭强制访问安全策略。

```s
vi /etc/sysconfig/selinux

SELINUX=disabled # enforcing -> disabled
# 重启
reboot
```

3. 稍等片刻重新链接主机

```s
# 查看是否禁用成功
getenforce
```

4. 安装gitlab的依赖文件

```s
yum install curl policycoreutils openssh-server openssh-clients postfixs
```

5. 下载gitlab仓库源。

```s
curl -sS https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.rpm.sh | sudo bash
```

6. 启动postfix邮件服务

```s
systemctl start postfix
systemctl enable postfix
```

7. 安装gitlab-ce社区版本服务包, 启动安装向导。

```s
yum -y install gitlab-ce
```

7. 安装gitlab-ce社区版本服务包, 启动安装向导。

```external_url```是访问域名，可以不设置，后面再添加

```s
# 带域名安装
external_url="http://gitlab.example.com" yum -y install gitlab-ce
# 不带域名安装
yum -y install gitlab-ce
```

8. 初始化配置

```s
gitlab-ctl reconfigure
```

9. 查看状态

安装完成直接运行下面命令查看状态。

```s
# 查看gitlab状态
gitlab-ctl status
```
然后可以使用```ip```或者设置的域名在浏览器访问这个地址。

9. 设置密码

旧版的```gitlab```首次访问会进入设置密码页面，后面就可以