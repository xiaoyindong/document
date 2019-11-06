## 1. 概述

```CentOS 8```操作系统默认已经开启```MySQL 8.0```，可从默认的```CentOS 8```存储库中安装最新版本的```MySQL```数据库服务器```8.0```版(首先先确保我们一定要有网的情况下安装)

## 2. 安装

通过以```root```用户使用```CentOS```软件包管理器来安装```MySQL 8.0```服务器：

```s
sudo dnf install @mysql
```

下载完毕之后

直接启动```mysql```服务

```s
systemctl start mysqld.service
```

## 3. 设置密码

启动完成之后直接打开```mysql```，用```root```用户登入即可，由于并没有设置密码。所以填写密码的环节直接回车即可登录。

```s
mysql -u root -p
```

登入成功之后可以修改密码，注意密码比较复杂，需要字母数字混合，简单密码会修改失败。

```s
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_password';
```

## 4. 关闭防火墙

关闭防火墙或者开启我们的```3306```端口就可以进行访问了

```s
# 查看firewall服务状态
systemctl status firewalld

# 开启、重启、关闭、firewalld.service服务
# 开启
service firewalld start
# 重启
service firewalld restart
# 关闭
service firewalld stop

# 查看防火墙规则
firewall-cmd --list-all    # 查看全部信息
firewall-cmd --list-ports  # 只看端口信息

# 开启端口
开端口命令：firewall-cmd --zone=public --add-port=80/tcp --permanent
重启防火墙：systemctl restart firewalld.service

命令含义：
--zone #作用域
--add-port=80/tcp  #添加端口，格式为：端口/通讯协议
--permanent   #永久生效，没有