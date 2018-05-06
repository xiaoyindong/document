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

旧版的```gitlab```首次访问会进入设置密码页面，后面就可以使用设置的密码登录管理账号。

新版本可以进入```radis```日志修改密码。

```s
# 进入radis日志
gitlab-rails console

# 首先查询管理员账号id。
user = User.where(username:'root').first
#<User id:1 @root>

# 设置密码为123456789
user.password = '123456789'

# 确认密码
user.password_confirmation = '123456789'

# 保存
user.save!

# Enqueued ActionMailer::MailDeliveryJob (Job ID: 5541291d-d7e5-4684-b92d-bc5386a6aea5) to Sidekiq(mailers) with arguments: "DeviseMailer", "password_change", "deliver_now", {:args=>[#<GlobalID:0x00007f539eacbdd8 @uri=#<URI::GID gid://gitlab/User/1>>]}
# => true

# 退出
quit
```

```save```如果报错的话，检查下密码的长度，需要```8```位以上

接着可以使用用户名```root```及密码```123456789```登录了。

除了上面方式还可以```id=1```定位超级管理员，修改密码。

```s
u= User.where(id: 1).first

u.password='123456789'
# => "new_password" 
# 保存用户密码
u.save!

# Enqueued ActionMailer::DeliveryJob (Job ID: 99118288-b58b-4d52-94c1-28979bcb63e8) to Sidekiq(mailers) with arguments: "DeviseMailer", "password_change", "deliver_now", gid://gitlab/User/1
# => true

# 退出
quit
```

10. 登录

可以在浏览器中使用```ip```或者域名访问。

## 3. gitlab应用

```gitlab```的后台管理可以针对不用的项目不同用户去定制不同的访问策略，开发与运维的两个角色可以各司其职互不影响的在自己所在的场景下工作。

作为开发人员关注的点肯定是代码的快速发布和审核，一般项目测试之后我们会提交一个```master```分支合并的申请等待领导去审核，决定是否确认合并操作，确认之后开发人员会在另一个```fueture```分支继续工作。

作为运维人员关注的另一个点是保证```gitlab```的维护和管理，例如```CPU```利用率，内存使用情况。

运维人员点击```设置``` -> ```Monitoring``` -> ```System Info```这里面包含了若干系统资源的状态值。

最后，如果你是本地测试而不像校验https时，可以使用```http.sslVerify=false```禁用。
```s
git -c http.sslVerify=false clone http://gitlab.example.com/test/test1.git
```

## 4. 修改域名

如果要是设置域名，可以在运行```yum install -y gitlab-ce```命令的时候通过```EXTERNAL_URL```设置。这个域名可以是真实购买的域名，如果你要把```gitlab```安装到公网比如阿里云上的话。

```s
external_url="http://gitlab.example.com" yum install -y gitlab-ce
```

也可以安装之后通过修改```/etc/gitlab/gitlab.rb```修改域名。

```s
#查看当前绑定的域名或者IP
grep "^external_url" /etc/gitlab/g