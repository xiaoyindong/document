## 1. 概述

测试用例首先要明确要测的到底是什么，比如下面的sum函数是计算两个参数的和。

```js
function sum(a, b) {
    return a + b;
}

module.exports = sum;
```

测试代码一般会写在一个单独的模块中，测试模块名称要和模块名称类似，比如模块加demo.js测试模块可以命名为demo.test.js。

测试规则很简单，被测的模块要和测试模块分文件存储，在测试模块中引入要测试的函数，给函数一个输入，定义预期的输出，检车函数是否返回了预期的输出结果。

```js
const { sum } = require('./demo');

const result = sum(1, 2);

const expected = 3;

if (result !== expected) {
    throw new Error(`sum(1, 2) 的结果应该是 ${expected}，但是现在是 ${result}`)
}
```

可以将上面这个测试过程封装成一个函数，希望这个函数的使用像中文一样，比如函数名称叫做expect就是期望的意思，期望sum运行的结果是3就希望这样来写。

```js
expect(sum(1, 2)).toBe(3);
```

这就像说话一样，可以按这样的方式去封装expect函数，这样就可以了。

```js
function expect(result) {
    return {
        toBe(expected) {
            if (result !== expected) {
                throw new Error(`期望的结果应该是 ${expected}，但是收到了 ${result}`)
            }
        }
    }
}
```

expect称之为断言函数，断定一个真实的结构是期望的结果。这里还可以加上一个测试的描述信息，让测试过程更清晰，比如增加一个test函数，接收两个参数，第一个是描述信息第二个是执行函数，一旦出问题需要把第一个参数的描述信息反馈出来。

```js
test('sum', () => {
    expect(sum(1, 2)).toBe(3);
})

function test(message, callback) {
    try {
        callback();
    } catch (err) {
        console.error(`${message}: ${err.message}`)
    }
}
```

## 2. jest测试框架

jest已经把上面我们封装的函数都封装好了，直接拿过来用就可以了。可以安装jest模块，然后通过jest命令运行就可以了。下面的代码直接就可以运行，不需要自己编写test和expect也不需要单独引入。jest会自动引入使用到的方法。可以使用@types/jest添加提示，否则并不知道如何编写。

```js
const { sum } = require('./demo');

test('sum', () => {
    expect(sum(1, 2)).toBe(3);
})
```
jest是Facebook出品的一个Javascript开源测试框架，相对其他测试框架，其一大特点是内置了常用的测试工具，比如零配置，自带断言，测试覆盖率，Mock模拟等功能，实现了开箱即用。

jest使用很多项目，比如Babel，TypeScript，Node，React，Angular，Vue等。

作为一个面向前端的测试框架，jest可以利用其特有的快照测试功能通过比对UI代码生成的快照文件，实现对React常见前端框架的自动测试。此外jest的测试用例是并行执行的，而且只执行发生改变的文件所对应的测试，这样一来效率就比较搞了。

## 2. 配置文件

默认情况下jest是零配置的，当然也支持通过配置文件自定义配置，首先需要生成配置文件。填写一些预设项就可以了，基本就是是否使用ts，是node还是浏览器，测试覆盖率，引擎建议选择babel因为比较稳定等等。

```s
npx jest --init
```

jest.config.js是jest所有的配置信息的列表，需要修改的可以直接放开注释进行修改就行了。

```js
export default {
  // All imported modules in your tests should be mocked automatically
  // automock: false,

  // Stop running tests after `n` failures
  // bail: 0,

  // The directory where jest should store its cached dependency information
  // cacheDirectory: "/private/var/folders/q8/81bhkkfn7d9czrdh5wk0k3m40000gn/T/jest_dx",

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  // collectCoverage: false,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  // collectCoverageFrom: undefined,

  // The directory where jest should output its coverage files
  // coverageDirectory: undefined,

  // An array of regexp pattern strings used to skip coverage collection
  // coveragePathIgnorePatterns: [
  //   "/node_modules/"
  // ],

  // Indicates which provider should be used to instrument code for coverage
  // coverageProvider: "babel",

  // A list of reporter names that jest uses when writing coverage reports
  // coverageReporters: [
  //   "json",
  //   "text",
  //   "lcov",
  //   "clover"
  // ],

  // An object that configures minimum threshold enforcement for coverage results
  // coverageThreshold: undefined,

  // A path to a custom dependency extractor
  // dependencyExtractor: undefined,

  // Make calling deprecated APIs throw helpful error messages
  // errorOnDeprecated: false,

  // Force coverage collection from ignored files using an array of glob patterns
  // forceCoverageMatch: [],

  // A path to a module which exports an async function that is triggered once before all test suites
  // globalSetup: undefined,

  // A path to a module which exports an async function that is triggered once after all test suites
  // globalTeardown: undefined,

  // A set of global variables that need to be available in all test environments
  // globals: {},

  // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
  // maxWorkers: "50%",

  // An array of directory names to be searched recursively up from the requiring module's location
  // moduleDirectories: [
  //   "node_modules"
  // ],

  // An array of file extensions your modules use
  // moduleFileExtensions: [
  //   "js",
  //   "jsx",
  //   "ts",
  //   "tsx",
  //   "json",
  //   "node"
  // ],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  // moduleNameMapper: {},

  // An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
  // modulePathIgnorePatterns: [],

  // Activates notifications for test results
  // notify: false,

  // An enum that specifies notification mode. Requires { notify: true }
  // notifyMode: "failure-change",

  // A preset that is used as a base for jest's configuration
  // preset: undefined,

  // Run tests from one or more projects
  // projects: undefined,

  // Use this configuration option to add custom reporters to jest
  // reporters: undefined,

  // Automatically reset mock state between every test
  // resetMocks: false,

  // Reset the module registry before running each individual test
  // resetModules: false,

  // A path to a custom resolver
  // resolver: undefined,

  // Automatically restore mock state between every test
  // restoreMocks: false,

  // The root directory that jest should scan for tests and modules within
  // rootDir: undefined,

  // A list of paths to directories that jest should use to search for files in
  // roots: [
  //   "<rootDir>"
  // ],

  // Allows you to use a custom runner instead of jest's default test runner
  // runner: "jest-runner",

  // The paths to modules that run some code to configure or set up the testing environment before each test
  // setupFiles: [],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  // setupFilesAfterEnv: [],

  // The number of seconds after which a test is considered as slow and reported as such in the results.
  // slowTestThreshold: 5,

  // A list of paths to snapshot serializer modules jest should use for snapshot testing
  // snapshotSerializers: [],

  // The test environment that will be used for testing
  testEnvironment: "jsdom",

  // Options that will be passed to the testEnvironment
  // testEnvironmentOptions: {},

  // Adds a location field to test results
  // testLocationInResults: false,

  // The glob patterns jest uses to detect test files
  // testMatch: [
  //   "**/__tests__/**/*.[jt]s?(x)",
  //   "**/?(*.)+(spec|test).[tj]s?(x)"
  // ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  // testPathIgnorePatterns: [
  //   "/node_modules/"
  /