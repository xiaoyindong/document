
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