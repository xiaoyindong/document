## 1. 概述

这里演示```freestyle```和```pipeline```两种部署方式。结合```Jenkins```，```ansible```，```Gitlab```.

首先需要有一台域名为```gitlab.example.com```的```gitlab```主机，用来保存源代码和版本管理。

还需要有一台域名为```jenkins.example.com```的```jenkins```服务与```ansible```共用一台服务器。在这台主机中安装```Jenkins```和```ansible```。保证```jenkins```和```ansible```共用一个系统用户可以协同工作。

还需要一台域名为```test.example.com```的服务，作为远程交付的主机。项目使用自动化交付到这台主机当中，并可以根据用户的需求持续的更新，自动交互到客户手中。

利用J```enkins```抓取开发人员的项目代码，维护```ansible```脚本到```jenkins```的```workspace```工作区域，通过```Jenkins```内建工具编写```freestyle```或者```pipeline```将代码推送到交付主机。

## 2. FreestyleJob 部署

1. 初始环境构建

2. 编写ansible playbook脚本实现静态网页远程部署

3. 将playbook部署脚本提交到gitlab仓库

4. 构建Freestyle Job任务框架

5. Jenkins集成ansible与Gitlab实现静态网页的自动化部署


先关闭```git```的安全认证。

```s
git config --global http.sslVerify false
```

### 1. 编写playbook

```nginx_playbooks```目录。

```s
inventory/
    prod
    dev
roles/
    nginx/
        files/
            health_check.sh
            index.html
        tasks/
            main.yml
        templates/
            nginx.conf.j2

deploy.yml
```

```deploy.yml```

```yml
- hosts: "nginx"
  gather_facts: true
  remote_user: root
  roles:
    - nginx
```

```inventory/prod```

```yml
[nginx]
test.example.com

[nginx:vars]
server_name=test.example.com
port=80
user=deploy
worker_processes=4
max_open_file=65505
root=/www
```

```inventory/dev```

```yml
[nginx]
test.example.com

[nginx:vars]
server_name=test.example.com
port=80
user=deploy
worker_processes=4
max_open_file=65505
root=/www
```

```roles/nginx/files/health_check.sh```用于检查网站是否部署成功

```s
#!/bin/sh

URL=$1

curl -Is http://$URL > /dev/null && echo "The remote side is healthy" || echo "The remote side is failed, please check"
```

```roles/nginx/files/index.html```

```
this is first website
```

```roles/nginx/templates/nginx.conf.j2```

```s
# For more information on configuration, see:
user    {{ user }};
worker_processes    {{ worker_processes }};

error_log  /var/log/nginx/error.log;

pid  /var/run/nginx.pid;

evnets {
  worker_connections    {{ max_open_file }};
}

http {
  include   /etc/nginx/mime.types;
  default_type    application/octet-stream;

  log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
  access_log /var/log/nginx/access.log main;

  sendfile on;

  keepalive_timeout 65;

  server {
    listen  {{ port }} default_server;

    location / {
      root  {{ root }};
      index   index.html index.htm;
    }

    error_page 404  /404.html;
    location = /404.html {
      root    /usr/share/nginx/html;
    }

    error_page    500 502 503 504 /50x.html;
    location = /50x.html {
      root    /usr/share/nginx/html
    }
  }
}
```

```roles/testbox/tasks/main.yml```

```yml
- name: Disable system firewall
  service: name=firewalld state=stopped

- name: Disable SELINUX
  selinux: state=disabled

- name: setup nginx yum source
  yum: pkg=epel-release state=latest

- name: write the nginx config file
  template: src=roles/nginx/templates/nginx.conf.j2 dest=/etc/nginx/nginx.conf

- name: create nginx root folder
  file: 'path={{ root }} state=directory owner={{ user }} group={{ user }} mode=0755'

- name: copy index.html to remote
  copy: 'remote_src=nop src=roles/nginx/files/index.html desc=/www/index.html mode=0755'

- name: restart nginx service
  service: name=nginx state=restarted

- name: run the health check locally
  shell: "sh roles/nginx/files/health_check.sh {{ server_name }}"
  delegate_to: localhost
  register: health_status

- debug: msg="{{ health_status.stdout }}"
```

编写好之后可以将上面的文件提交到```gitlab```中，方便```Jenkins```抓取。

### 2. Jenkins集成ansible。

新建任务```nginx-freestyle-job```, 选择构建```自由风格```的软件项目，描述随便输入就可以，源码管理选择```git```，仓库地址选择上面提交的```playbook```仓库地址，这里注意使用```https```格式的，凭证选择```root```，分支选中```master```。

参数化构建过程新增一个选项参数，```deploy_env```, 选项输入```prod```和```dev```，再添加一个文本参数，名称为```branch```，默认值为```master```。

构建区域增加构建步骤，选择执行```shell```，在```shell```命令中输入内容。

```s
#/bin/sh

set +x
source /home/deploy/.py3-a2.5-env/bin/activate
source /home/deploy/.py3-a2.5-env/ansible/hacking/env-setup -q

cd $WORKSPACE/nginx_playbooks
ansible --version
ansible-playbook --version

ansible-playbook -i inventory/$deploy_env ./deploy.yml -e project=nginx -e branch=$branch -e env=$deploy_env
```

点击```build with parameters```, 选择```deploy_dev```的```dev```环境，分支为```master```。

部署完成

## 3. Pipeline部署

基于```Nginx```, ```Mysql```，```PHP```, ```Wordpress```来实现自动化交付平台。

1. 初始环境构建

2. 编写ansible playbook脚本实现静态网页远程部署

3. 将playbook部署脚本提交到gitlab仓库

4. 编写Pipeline Job脚本实现Jenkins流水线持续交付流程

5. Jenkins集成ansible与Gitlab实现Wordpress自动化部署

首先进行```ansible```的```playbook```脚本的编写工作，可以先关闭```git```的安全认证。

```s
git config --global http.sslVerify false
```

### 1. 编写playbook

```wordpress_playbooks```目录。

```s
inventory/
    prod
    dev
roles/
    wordpress/
        files/
            health_check.sh
            index.php
            www.conf
        tasks/
            main.yml
        templates/
            nginx.conf.j2

deploy.yml
```

```deploy.yml```

```yml
- hosts: "wordpress"
  gather_facts: true
  remote_user: root
  roles:
    - wordpress
```

```inventory/prod```

```yml
[wordpress]
test.example.com

[wordpress:vars]
server_name=test.example.com
port=80
user=deploy
worker_processes=4
max_open_file=65505
root=/data/www
gitlab_user='root'
gitlab_pass='123456'
```

```inventory/dev```

```yml
[wordpress]
test.example.com

[wordpress:vars]
server_name=test.example.com
port=8080
user=deploy
worker_processes=2
max_open_file=30000
root=/data/www
gitlab_user='root'
gitlab_pass='123456'
```

```roles/wordpress/files/health_check.sh```用于检查网站是否部署成功

```s
#!/bin/sh

URL=$1
PORT=$2

curl -Is http://$URL:$PORT/info.php > /dev/null && echo "The remote side is healthy" || echo "The remote side is failed, please check"
```

```roles/wordpress/files/index.php```

```php
<?php phpinfo(); ?>
```

```roles/wordpress/files/www.conf```

```s
; Start a new pool named 'www'.
[www]

; Unix user/group of processes
; Note: The user is mandatory. If the group is not set, the default user's group
;       will be used.
; RPM: apache Choosed to be able to access some dir as httpd
user = deploy
; RPM: Keep a group allowed to write in log dir.
group = deploy

; The address on which to accept FastCGI requests.
; Valid syntaxes are:
;   'ip.add.re.ss:port'    - to listen on a TCP socket to a specific IPv4 address on
;                            a specific port;
;   '[ip:6:addr:ess]:port' - to listen on a TCP socket to a specific IPv6 address on
;                            a specific port;
;   'port'                 - to listen on a TCP socket to all addresses
;                            (IPv6 and IPv4-mapped) on a specific port;
;   '/path/to/unix/socket' - to listen on a unix socket.
; Note: This value is mandatory.
;listen = 127.0.0.1:9000
listen = /var/run/php-fpm/php-fpm.sock


; Set listen(2) backlog.
; Default Value: 511 (-1 on FreeBSD and OpenBSD)
;listen.backlog = 511

; Set permissions for unix socket, if one is used. In Linux, read/write
; permissions must be set in order to allow connections from a web server. Many
; BSD-derived systems allow connections regardless of permissions.
; Default Values: user and group are set as the running user
;                 mode is set to 0660
listen.owner = deploy
listen.group = deploy
;listen.mode = 0660
; When POSIX Access Control Lists are supported you can set them using
; these options, value is a comma separated list of user/group names.
; When set, listen.owner and listen.group are ignored
;listen.acl_users =
;listen.acl_groups =

; List of addresses (IPv4/IPv6) of FastCGI clients which are allowed to connect.
; Equivalent to the FCGI_WEB_SERVER_ADDRS environment variable in the original
; PHP FCGI (5.2.2+). Makes sense only with a tcp listening socket. Each address
; must be separated by a comma. If this value is left blank, connections will be
; accepted from any ip address.
; Default Value: any
listen.allowed_clients = 127.0.0.1

; Specify the nice(2) priority to apply to the pool processes (only if set)
; The value can vary from -19 (highest priority) to 20 (lower priority)
; Note: - It will only work if the FPM master process is launched as root
;       - The pool processes will inherit the master process priority
;         unless it specified otherwise
; Default Value: no set
; process.priority = -19

; Choose how the process manager will control the number of child processes.
; Possible Values:
;   static  - a fixed number (pm.max_children) of child processes;
;   dynamic - the number of child processes are set dynamically based on the
;             following directives. With this process management, there will be
;             always at least 1 children.
;             pm.max_children      - the maximum number of children that can
;                                    be alive at the same time.
;             pm.start_servers     - the number of children created on startup.
;             pm.min_spare_servers - the minimum number of children in 'idle'
;                                    state (waiting to process). If the number
;                                    of 'idle' processes is less than this
;                                    number then some children will be created.
;             pm.max_spare_servers - the maximum number of children in 'idle'
;                                    state (waiting to process). If the number
;                                    of 'idle' processes is greater than this
;                                    number then some children will be killed.
;  ondemand - no children are created at startup. Children will be forked when
;             new requests will connect. The following parameter are used:
;             pm.max_children           - the maximum number of children that
;                                         can be alive at the same time.
;             pm.process_idle_timeout   - The number of seconds after which
;                                         an idle process will be killed.
; Note: This value is mandatory.
pm = dynamic

; The number of child processes to be created when pm is set to 'static' and the
; maximum number of child processes when pm is set to 'dynamic' or 'ondemand'.
; This value sets the limit on the number of simultaneous requests that will be
; served. Equivalent to the ApacheMaxClients directive with mpm_prefork.
; Equivalent to the PHP_FCGI_CHILDREN environment variable in the original PHP
; CGI.
; Note: Used when pm is set to 'static', 'dynamic' or 'ondemand'
; Note: This value is mandatory.
pm.max_children = 50

; The number of child processes created on startup.
; Note: Used only when pm is set to 'dynamic'
; Default Value: min_spare_servers + (max_spare_servers - min_spare_servers) / 2
pm.start_servers = 5

; The desired minimum number of idle server processes.
; Note: Used only when pm is set to 'dynamic'
; Note: Mandatory when pm is set to 'dynamic'
pm.min_spare_servers = 5

; The desired maximum number of idle server processes.
; Note: Used only when pm is set to 'dynamic'
; Note: Mandatory when pm is set to 'dynamic'
pm.max_spare_servers = 35

; The number of seconds after which an idle process will be killed.
; Note: Used only when pm is set to 'ondemand'
; Default Value: 10s
;pm.process_idle_timeout = 10s;

; The number of requests each child process should execute before respawning.
; This can be useful to work around memory leaks in 3rd party libraries. For
; endless request processing specify '0'. Equivalent to PHP_FCGI_MAX_REQUESTS.
; Default Value: 0
;pm.max_requests = 500

; The URI to view the FPM status page. If this value is not set, no URI will be
; recognized as a status page. It shows the following informations:
;   pool                 - the name of the pool;
;   process manager      - static, dynamic or ondemand;
;   start time           - the date and time FPM has started;
;   start since          - number of seconds since FPM has started;
;   accepted conn        - the number of request accepted by the pool;
;   listen queue         - the number of request in the queue of pending
;                          connections (see backlog in listen(2));
;   max listen queue     - the maximum number of requests in the queue
;                          of pending connections since FPM has started;
;   listen queue len     - the size of the socket queue of pending connections;
;   idle processes       - the number of idle processes;
;   active processes     - the number of active processes;
;   total processes      - the number of idle + active processes;
;   max active processes - the maximum number of active processes since FPM
;                          has started;
;   max children reached - number of times, the process limit has been reached,
;                          when pm tries to start more children (works only for
;                          pm 'dynamic' and 'ondemand');
; Value are updated in real time.
; Example output:
;   pool:                 www
;   process manager:      static
;   start time:           01/Jul/2011:17:53:49 +0200
;   start since:          62636
;   accepted conn:        190460
;   listen queue:         0
;   max listen queue:     1
;   listen queue len:     42
;   idle processes:       4
;   active processes:     11
;   total processes:      15
;   max active processes: 12
;   max children reached: 0
;
; By default the status page output is formatted as text/plain. Passing either
; 'html', 'xml' or 'json' in the query string will return the corresponding
; output syntax. Example:
;   http://www.foo.bar/status
;   http://www.foo.bar/status?json
;   http://www.foo.bar/status?html
;   http://www.foo.bar/status?xml
;
; By default the status page only outputs short status. Passing 'full' in the
; query string will also return status for each pool process.
; Example:
;   http://www.foo.bar/status?full
;   http://www.foo.bar/status?json&full
;   http://www.foo.bar/status?html&full
;   http://www.foo.bar/status?xml&full
; The Full status returns for each process:
;   pid                  - the PID of the process;
;   state                - the state of the process (Idle, Running, ...);
;   start time           - the date and time the process has started;
;   start since          - the number of seconds since the process has started;
;   requests             - the number of requests the process has served;
;   request duration     - the duration in µs of the requests;
;   request method       - the request method (GET, POST, ...);
;   request URI          - the request URI with the query string;
;   content length       - the content length of the request (only with POST);
;   user                 - the user (PHP_AUTH_USER) (or '-' if not set);
;   script               - the main script called (or '-' if not set);
;   last request cpu     - the %cpu the last request consumed
;                          it's always 0 if the process is not in Idle state
;                          because CPU calculation is done when the request
;                          pr