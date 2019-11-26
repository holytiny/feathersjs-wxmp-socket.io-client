
# @holytiny/wxmp-socket.io-client

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![npm version](https://img.shields.io/npm/v/@holytiny/wxmp-socket.io-client)](https://www.npmjs.com/package/@holytiny/wxmp-socket.io-client)
[![npm download rate](https://img.shields.io/npm/dw/@holytiny/wxmp-socket.io-client)](https://www.npmjs.com/package/@holytiny/wxmp-socket.io-client)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)

&emsp;&emsp;这个项目是微信小程序环境下[Socket.IO](http://github.com/socketio/socket.io)的客户端。

&emsp;&emsp;与[Socket.IO-client](https://socket.io/docs/client-api/)完全兼容，
支持微信小程序环境下多websocket链接。

## 使用
```shell script
npm install @holytiny/wxmp-socket.io-client --save
```
### 在使用webpack等打包程序的微信小程序Framework中
&emsp;&emsp;例如在支持webapck打包的uni-app等小程序Framework中。
```js
// 下面代码可以使能debug输出，看到通信的交互过程
import Debug from 'debug';
Debug.enable('*');
const io = require('@holytiny/wxmp-socket.io-client');
// or with import syntax
import io from '@holytiny/wxmp-socket.io-client';
let socket = io('http://localhost', {
  // 显式指定websocket传输层
  transports: ['websocket']
});
```

### 在支持npm的微信小程序开发环境中
&emsp;&emsp;因为微信小程序开发环境的npm打包工具不支持node.js的标准库打包，因此必须使用预先打包的程序。
```js
// 下面代码可以使能debug输出，看到通信的交互过程
import Debug from 'debug';
Debug.enable('*');
const io = require('@holytiny/wxmp-socket.io-client/socket.io');
let socket = io('http://localhost', {
  // 显式指定websocket传输层
  transports: ['websocket']
});
```

&emsp;&emsp;具体使用请参考[Socket.IO-client的文档](https://socket.io/docs/client-api/)

### 注意

- 接口兼容的Socket.IO-client版本：2.3.0。
- 只支持websocket传输层，需要在初始化的时候显式指定。
- 具体在微信小程序开发环境下的使用，可以参考本项目的测试用例代码。

# 源码相关

&emsp;&emsp;可以在`wxmp-socket.io-client/`目录下运行`npm run help`查看可以运行的脚本。

## 打包程序

&emsp;&emsp;在`wxmp-socket.io-client/dist`目录下，`*.dev.js`版本是有`.map`的程序，
带有`.slim.`版本是删除了debug输出的版本。
在`wxmp-socket.io-client/`目录下运行`npm run build`，
可在`wxmp-socket.io-client/dist/`目录下获得打包后的代码。

## 测试用例

&emsp;&emsp;测试用例程序在微信小程序环境下测试了除微信小程序环境不支持的功能（例如Blob）之外，
所有原socket.io-client的测试用例。

### 手动运行测试用例

&emsp;&emsp;首先运行`server.js`程序建立测试服务器。进入`wxmp-socket.io-client/test-wxmp/support`目录，然后运行：
```shell script
node server.js
```

&emsp;&emsp;然后将程序`wxmp-socket.io-client/test-wxmp/wxmp`导入微信小程序开发环境，在微信小程序环境中 **构建npm** 后刷新。
程序会自动执行connection测试用例。

![connection测试用例](https://github.com/holytiny/feathersjs-wxmp-socket.io-client/blob/master/asset/connection-test-cases.png)

当connection测试用例执行完成后，可以点击 **Socket Test** 按钮，对Socket进行测试。

![socket测试用例](https://github.com/holytiny/feathersjs-wxmp-socket.io-client/blob/master/asset/socket-test-cases.png)

## 联系
&emsp;&emsp;欢迎在github上提issue。也欢迎邮件<contact@holytiny.com>。

## 维护人员
- sake <77951530@qq.com>
- zzXiongFan <zzxiongfan@gmail.com>
- Ranco0929 <676667544@qq.com>
- xidianzyf <1143942196@qq.com>

## License

[MIT](/LICENSE)
