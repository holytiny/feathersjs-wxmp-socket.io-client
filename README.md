
# feathersjs-socketio-wxmp-client

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

&emsp;&emsp;Feathersjs框架的微信小程序websocket客户端。

## 使用说明
```shell script
 npm install @holytiny/wxmp-socket.io-client --save
```
&emsp;&emsp;在client.js中
```js
import feathers from '@feathersjs/feathers';
import auth from '@feathersjs/authentication-client';
import feathersSocketioClient from '@feathersjs/socketio-client';
import io from '@holytiny/wxmp-socket.io-client';

import Debug from 'debug';
if ('production'.localeCompare(process.env.NODE_ENV) !== 0) {
  Debug.enable('*');
}
const debug = Debug('@feathersjs/socketio-client');

export default function FeathersClient () {
  debug('create socketio client');
  const socketioInit = io('http://localhost:3030', {
    transports: ['websocket'],
    forceNew: true,
    timeout: false
  });

  const feathersClient = feathers();
//feathersClient.configure(feathersSocketioClient(socketioInit, { timeout: 1000 * 20 }));
  feathersClient.configure(feathersSocketioClient(socketioInit));
  feathersClient.configure(auth());

  return feathersClient;
}
```
&emsp;&emsp;在xxx.js中
```js
import FeathersClient from './client';
const feathersClient = FeathersClient();
```
&emsp;&emsp;具体使用请参考Feathersjs的[@feathersjs/socketio-client](https://docs.feathersjs.com/api/client/socketio.html)文档

## @holytiny/wxmp-socket.io-client

&emsp;&emsp;[@holytiny/wxmp-socket.io-client](https://github.com/holytiny/feathersjs-wxmp-socket.io-client/tree/master/packages/wxmp-socket.io-client#readme)是本项目的一个包，提供了[Socket.IO-client](https://socket.io/docs/client-api/)在微信小程序环境下的兼容版本。
这个包可以单独使用，具体请看[说明](https://github.com/holytiny/feathersjs-wxmp-socket.io-client/tree/master/packages/wxmp-socket.io-client)。

## License

[MIT](/LICENSE)
