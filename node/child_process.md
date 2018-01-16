## 1. 概述

```child_process```模块提供了衍生子进程的能力, 简单来说就是执行```cmd```命令的能力。

```js
const { spawn } = require('child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`子进程退出，退出码 ${code}`);
});
```

默认情况下，```stdin```、```stdout```和```stderr```的管道会在父```Node.js```进程和衍生的子进程之间建立。 这些管道具有有限的（且平台特定的）容量。 如果子进程写入```stdout```时超出该限制且没有捕获输出，则子进程会阻塞并等待管道缓冲区接受更多的数据。 这与```shell```中的管道的行为相同。 如果不消费输出，则使用```{ stdio: 'ignore' }```选项。

如果``