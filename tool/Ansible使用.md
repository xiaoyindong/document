
## 1. Playbooks入门和编写规范

```Playbooks```是```ansiable```的编排语言框架，它本身的简单易读的语法结构以及丰富的内建模块非常方便编写远程部署策略。

```Playbooks```基础的文件格式为```yml```文件格式。```inventory```存放```server```详细清单目录，```roles```保存要部署的详细任务列表。```testbox```表示详细任务, ```main```住任务文件。```deploy```任务入口文件。

```yml
inventory/
    testenv
roles/
    testbox/
        tasks/
            main.yml
deploy.yml
```

```testenv```由上下两部分组成，```testservers```表示```server```组列表，也就是要部署的服务器的列表，值为目标部署服务器的主机名。```testservers```表示目标主机使用的参数列表。

```yml
[testservers]
test.example.com

[testservers:vars]
server_name=test.example.com
user=root
output=/root/test.txt
```

上面的意思是给```test.example.com```这个主机定义了```server_name```, ```user```以及```output```参数。

```main.yml```主任务文件用来保存特性```roles```下面具体执行的任务。这里会保存一个或多个```task```作为任务，```task```一般由两部分组成，```任务名称```和```执行的脚本```，脚本通常调用内建模块编排执行逻辑。

```yml
- name: Print server name and user to remote testbox
  shell: "echo 'Currently {{ user }} is logining {{ server_name }}' > {{ output }}"
```

这里打印的```user```，```server_name```和```output```就是前面```testenv```定义的值。

入口文件```deploy.yml```，他直接和```ansible```对话。这里的```host```对应```testenv```中的```testservers```。

```gather_facts```获取```Server```基本信息，```remote_user```指定目标服务器系统用户，```roles```是进入```roles/testbox```任务目录进行执行。

```yml
- hosts: "testservers"
  gather_facts: true
  remote_user: root
  roles:
    - testbox
```

因为```ansible```是使用```ssh```作为通信协议，为了保证正常的通信，需要配置```ansible```主机与目标主机的秘钥认证，保证无需密码即可访问目标主机。

```ansible```服务端创建```ssh```本地秘钥

```s
ssh-keygen -t rsa
```

```ansible```服务器端建立与目标部署机器的秘钥认证。将```ansible```服务器的公钥传输到目标服务器中，可以实现直接连接。

```s
ssh-copy-id -i /home/deploy/.ssh/id_rsa.pub root@test.example.com
```

部署到```testenv```环境

```s
ansible-playbook -i inventory/testenv ./deploy.yml
```

实时演示一下。 需要创建一个```testbox```虚拟机主机。同样安装```CentOS7```。尝试通过```ansible```主机将文件远程传输至```testbox```虚拟主机。

首先```ssh```登录到```ansible```主机上，然后切换到```ansible2.5```版本。

```s
su - deploy 
source .py3-a2.5-env/bin/activate
source .py3-a2.5-env/ansible/hacking/env-setup -q
ansible-playbook --version
```

编写```playbooks```框架

```s
mkdir test_playbooks
cd test_playbooks
mkdir inventory
mkdir roles
cd inventory/
vi testenv
```

编辑```testenv```

```s
[testservers]
test.example.com

[testservers:vars]
server_name=test.example.com
user=root
output=/root/test.txt
```

创建```main.yml```

```s
cd ..
cd roles/
mkdir testbox
cd testbox
mkdir tasks
cd tesks/
vi main.yml
```

编辑```main.yml```, 添加一个测试任务，这里```shell```前是两个空格。

```yml
- name: Print server name and user to remote testbox
  shell: "echo 'Currently {{ user }} is logining {{ server_name }}' > {{ output }}"
```

返回路径，回到```test_palybooks```

```s
cd ../../..
```

创建```deploy.yml```文件

```s
vi deploy.yml
```

编辑这个文件, 告诉```ansible```使用```host```任务，并且在目标主机中获取主机信息，并且使用目标主机的```root```账户读写权限。最后告诉```ansible```执行```roles```下的```testbox```任务。

```yml
- hosts: "testservers"
  gather_facts: true
  remote_user: root
  roles:
    - testbox
```

使用```tree```查看一下目录结构

```s
tree .
```

这样文件就配置好了，接下来要配置一下秘钥认证

```s
# 返回root命令行
su - root
# 编辑dns
vi /etc/hosts
```

添加dns文件。

```s
xx.xx.xx.xx test.example.com
```

返回到```deploy```命令行

```s
exit
```

创建```ssh```秘钥认证对, 一路回车。

```s
ssh-keygen -t rsa
# cat ~/.ssh/id_*.pub | ssh  root@test.example.com 'cat >> .ssh/authorized_keys'
ssh-copy-id-i ~/.ssh/id_rsa.pub root@test.example.com
```

这样就可以不需要密码直接连接到```test.example.com```服务器了，这里在```ansible```的```deploy```目录中，执行入口文件。

```s
cd test_playbooks/

ansible-playbook -i inventory/testenv ./deploy.yml
```

执行完成。可以去目标主机查看状态。创建了一个```test.txt```文件并且将数据写到了文件中。

```s
ssh root@test.e