
# @holytiny/wxmp-socket.io-client

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![npm version](https://img.shields.io/npm/v/@holytiny/wxmp-socket.io-client)](https://www.npmjs.com/package/@holytiny/wxmp-socket.io-client)
[![npm download rate](https://img.shields.io/npm/dw/@holytiny/wxmp-socket.io-client)](https://www.npmjs.com/package/@holytiny/wxmp-socket.io-client)

&emsp;&emsp;这个项目是微信小程序环境下[Socket.IO](http://github.com/socketio/socket.io)的客户端。

&emsp;&emsp;与[Socket.IO-client](https://socket.io/docs/client-api/)完全兼容，
支持微信小程序环境下多websocket链接。

## 使用
```shell script
npm install @holytiny/wxmp-socket.io-client --save
```
&emsp;&emsp;在文件中：
```js
const io = require('@holytiny/wxmp-socket.io-client');
// or with import syntax
import io from '@holytiny/wxmp-socket.io-client';
```

&emsp;&emsp;具体使用请参考[Socket.IO-client的文档](https://socket.io/docs/client-api/)

## 注意

- 兼容的Socket.IO-client版本：2.3.0。
- 暂未提供打包的版本，请使用微信小程序开发环境的npm支持功能，或者使用支持npm的微信小程序前端框架。

## 联系
&emsp;&emsp;欢迎在github上提issue。也欢迎邮件<contact@holytiny.com>。

## 维护人员
- sake <77951530@qq.com>
- zzXiongFan <zzxiongfan@gmail.com>
- Ranco0929 <676667544@qq.com>
- xidianzyf <1143942196@qq.com>

## License

[MIT](/LICENSE)
