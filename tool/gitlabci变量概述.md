## 1. 概述

官方文档: https://docs.gitlab.com/ce/ci/variables/README.html

当```GitLab CI```接受到一个```job```后，```Runner```就开始准备构建环境。开始设置预定义的变量(环境变量)和用户自定义的变量。

变量可以被重写，并且是按照下面的顺序进行执行：

1. Trigger variables(优先级最高)

2. Secret variables

3. YAML-defined job-level variables

4. YAML-defined global variables

5. Deployment variables

6. Predefined variables (优先级最低)

例如如果你定义了私有变量```API_TOKEN=secure```，并且在```.gitlab-ci.yml```中定义了```API_TOKEN=yaml```，那么私有变量```API_TOKEN```的值将是```secure```，因为```secret variables```的优先级较高。

## 2. 预设变量

有部分预定义的环境变量仅仅只能在最小版本的```GitLab Runner```中使用。请参考下表查看对应的```Runner```版本要求。

注意：```从GitLab 9.0```开始，部分变量已经不提倡使用。请查看9.0Renaming部分来查找他们的替代变量。强烈建议使用新的变量，我们也会在将来的GitLab版本中将他们移除。

| Variable | gitlab version | Runner | Description |
| ---- | ---- | ---- | ---- |
| CI | all | 0.4 | 标识该job是在CI环境中执行 |
| CI_COMMIT_REF_NAME | 9.0 | all | 用于构建项目的分支或tag名称 |
| CI_COMMIT_REF_SLUG | 9.0 | all | 先将$CI_COMMIT_REF_NAME的值转换成小写，最大不能超过63个字节，然后把除了0-9和a-z的其他字符转换成-。在URLs和域名名称中使用。|
| CI_COMMIT_SHA | 9.0 | all | commit的版本号 |
| CI_COMMIT_TAG | 9.0 | 0.5 | commit的tag名称。只有创建了tags才会出现。 |
| CI_DEBUG_TRACE | 9.0 | 1.7 | debug tracing开启时才生效 |
| CI_ENVIRONMENT_NAME | 8.15 | all | job的环境名称 |
| CI_ENVIRONMENT_SLUG | 8.15 | all | 环境名称的简化版本，适用于DNS，URLs，Kubernetes labels等 |
| CI_JOB_ID | 9.0 | all | GItLab CI内部调用job的一个唯一ID |
| CI_JOB_MANUAL | 8.12 | all | 表示job启用的标识 |
| CI_JOB_NAME | 9.0 | 0.5 | .gitlab-ci.yml中定义的job的名称 |
| CI_JOB_STAGE | 9.0 | 0.5 | .gitlab-ci.yml中定义的stage的名称 |
| CI_JOB_TOKEN | 9.0 | 1.2 | 用于同GitLab容器仓库验证的token |
| CI_REPOSITORY_URL | 9.0 | all | git仓库地址，用于克隆 |
| CI_RUNNER_DESCRIPTION | 8.10 | 0.5 | GitLab中存储的Runner描述 |
| CI_RUNNER_ID | 8.10 | 0.5 | Runner所使用的唯一ID |
| CI_RUNNER_TAGS | 8.10 | 0.5 | Runner定义的tags |
| CI_PIPELINE_ID | 8.10 | 0.5 | GitLab CI 在内部使用的当前pipeline的唯一ID |
| CI_PIPELINE_TRIGGERED | all | all | 用于指示该job被触发的标识 |
| CI_PROJECT_DIR | all | all | 仓库克隆的完整地址和job允许的完整地址 |
| CI_PROJECT_ID | all | all | GitLab CI在内部使用的当前项目的唯一ID |
| CI_PROJECT_NAME | 8.10 | 0.5 | 当前正在构建的项目名称（事实上是项目文件夹名称） |
| CI_PROJECT_NAMESPACE | 8.10 | 0.5 | 当前正在构建的项目命名空间（用户名或者是组名称） |
| CI_PROJECT_PATH | 8.10 | 0.5 | 命名空间加项目名称 | 
| CI_PROJECT_PATH_SLUG | 9.3 | all | $CI_PROJECT_PATH小写字母、除了0-9和a-z的其他字母都替换成-。用于地址和域名名称。 |
| CI_PROJECT_URL | 8.10 | 0.5 | 项目的访问地址（http形式） |
| CI_REGISTRY | 8.10 | 0.5 | 如果启用了Container Registry，则返回GitLab的Container Registry的地址 | 
| CI_REGISTRY_IMAGE | 8.10 | 0.5 | 如果为项目启用了Container Registry，它将返回与特定项目相关联的注册表的地址 |
| CI_REGISTRY_PASSWORD | 9.0 | all | 用于push containers到GitLab的Container Registry的密码 |
| CI_REGISTRY_USER | 9.0 | all | 用于push containers到GItLab的Container Registry的用户名 |
| CI_SERVER | all | all | 标记该job是在CI环境中执行 |
| CI_SERVER_NAME | all | all | 用于协调job的CI服务器名称 |
| CI_SERVER_REVISION | all | all | 用于调度job的GitLab修订版 |
| CI_SERVER_VERSION | all | all | 用于调度job的GItLab版本 |
| ARTIFACT_DOWNLOAD_ATTEMPTS | 8.15 | 1.9 | 尝试运行下载artifacts的job的次数 |
| GET_SOURCES_ATTEMPTS | 8.15 | 1.9 | 尝试运行获取源的job次数 |
| GITLAB_CI | all | all | 用于指示该job是在GItLab CI环境中运行 |
| GITLAB_USER_ID | 8.12 | all | 开启该job的用户ID |
| GITLAB_USER_EMAIL | 8.12 | all | 开启该job的用户邮箱 |
| GITLAB_USER_NAME | 8.12 | all | 开启该job的用户名称 |
| RESTORE_CACHE_ATTEMPTS | 8.15 | 1.9 | 尝试运行存储缓存的job的次数 |


### 8.x被移除的变量

| 8.x name | 9.0+ name |
| ---- | ---- |
| CI_BUILD_ID | CI_JOB_ID |
| CI_BUILD_REF | CI_COMMIT_SHA |
| CI_BUILD_TAG | CI_COMMIT_TAG |
| CI_BUILD_REF_NAME | CI_COMMIT_REF_NAME |
| CI_BUILD_REF_SLUG | CI_COMMIT_REF_SLUG |
| CI_BUILD_NAME | CI_JOB_NAME |
| CI_BUILD_STAGE | CI_JOB_STAGE |
| CI_BUILD_REPO | CI_REPOSITORY_URL |
| CI_BUILD_TRIGGERED | CI_PIPELINE_TRIGGERED |
| CI_BUILD_MANUAL | CI_JOB_MANUAL |
| CI_BUILD_TOKEN | CI_JOB_TOKEN |

## 3. 自定义变量

```GitLab Runner0.5```或更高版本，并且```GitLab CI 7.14```更高版本支持自定义变量。

```.gitlab-ci.yml```中可以添加自定义变量，这个变量在构建环境中设置。

如果将变量设置为全局下，则它将用于所有执行的命令脚本中。

```s
variables:
  DATABASE_URL: "postgres://postgres@postgres/my_database"
```

```YAML```中定义的变量也将应用到所有创建的服务容器中，因此可以对它进行微调。

变量可以定义为全局，同时也可以定义为job级别。若要关闭全局定义变量，请定义一个空```{}```

```s
job_name:
  variables: {}
```

变量定义中可以使用其他变量

```s
variables:
  LS_CMD: 'ls $FLAGS $$TMP_DIR'
  FLAGS: '-al'
script:
  - 'eval $LS_CMD'  # will execute 'ls -al $TMP_DIR'
```

## 4. 私有变量

```GitLab Runner0.4.0```或更高版本，支持。

私有变量不会隐藏，如果明确要这么做，他们的值可以显示在```job```日志中。

如果项目是公共的或内部的，可以在项目的```pipeline```中设置```pipeline```为私有的。

私有变量存储在```.gitlab-ci.yml```中，并被安全的传递给```GitLab Runner```。建议使用该方法存储诸如```密码```、```秘钥```和```凭据```之类的东西。

可在```Settings``` -> ```Pipelines```中增加私有变量，一旦设置，所有的后续pipeline是都可以使用。

## 5. 变量保护

此功能要求GitLab 9.3或更高版本。

私有变量可以被保护。当一个私有变量被保护时，它只会安全的传递到在受保护的分支或受保护的标签上运行的```pipeline```。其他的```pipeline```将不会得到该变量。

可用在私有变量时，添加```Protected```。

## 6. 使用变量

在构建环境变量时，所有的变量都会被设置为环境变量，可以使用普通方法访问这些变量。

在大多数情况下，用于执行```job```脚本都是通过```bash```或者是```sh```。

不同环境下使用方式不同。

| Shell | 用法 |
| ---- | ---- |
| bash/sh | $variable |
| windows batch | %variable% |
| PowerShell | $env:variable |

在```bash```中访问环境变量，需要给变量名称加上前缀```$```：

```s
job_name:
  script:
    - echo $CI_JOB_ID
```

在```Windows```系统的```PowerShell```中访问环境变量，需要给变量名称加上前缀```$env:```

```s
job_name:
  script:
    - echo $env:CI_JOB_ID
```

可以使用```export```命令来列出所有的环境变量。在使用此命令时要注意会在```job```记录中列出所有私有变量的值

```s
job_name:
  script:
    - export
```

日志如下:

```s
export CI_JOB_ID="50"
export CI_COMMIT_SHA="1ecfd275763eff1d6b4844ea3168962458c9f27a"
export CI_COMMIT_REF_NAME="master"
export CI_REPOSITORY_URL="https://gitlab-ci-token:abcde-1234ABCD5678ef@example.com/gitlab-org/gitlab-ce.git"
export CI_COMMIT_TAG="1.0.0"
export CI_JOB_NAME="spec:other"
export CI_JOB_STAGE="test"
export CI_JOB_MANUAL="true"
export CI_JOB_TRIGGERED="true"
export CI_JOB_TOKEN="abcde-1234ABCD5678ef"
export CI_PIPELINE_ID="1000"
export CI_PROJECT_ID="34"
export CI_PROJECT_DIR="/builds/gitlab-org/gitlab-ce"
export CI_PROJECT_NAME="gitlab-ce"
export CI_PROJECT_NAMESPACE="gitlab-org"
export CI_PROJECT_PATH="gitlab-org/gitlab-ce"
export CI_PROJECT_URL="https://example.com/gitlab-org/gitlab-ce"
export CI_REGISTRY="registry.example.com"
export CI_REGISTRY_IMAGE="registry.example.com/gitlab-org/gitlab-ce"
export CI_RUNNER_ID="10"
export CI_RUNNER_DESCRIPTION="my runner"
export CI_RUNNER_TAGS="docker, linux"
export CI_SERVER="yes"
export CI_SERVER_NAME="GitLab"
export CI_SERVER_REVISION="70