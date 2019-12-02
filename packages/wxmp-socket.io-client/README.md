
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

&emsp;&emsp;当connection测试用例执行完成后，可以点击 **Socket Test** 按钮，对Socket进行测试。

![socket测试用例](https://github.com/holytiny/feathersjs-wxmp-socket.io-client/blob/master/asset/socket-test-cases.png)

&emsp;&emsp;当socket测试用例执行完成后，可以点击 **WSS Test** 按钮，对wss进行测试。此测试需要自行搭建服务器以及申请域名和进行备案。
本测试环境为ubuntu 18.04，用nginx作为反向代理，将wss反向代理到本机的ws服务。
可以参考`wxmp-socket.io-client/test-wxmp/nginx.sh`的脚本内容。

```shell script
#!/usr/bin/env bash

SITE=holytiny.com

echo 'Install or update nginx...'
apt-get update
apt-get install -y nginx

echo 'config nginx...'
cp -f ./support/${SITE} /etc/nginx/sites-available/

echo 'clean current enbalbed sites...'
rm /etc/nginx/sites-enabled/*

echo 'enable holytiny.com...'
ln -s /etc/nginx/sites-available/${SITE} /etc/nginx/sites-enabled/

echo 'restart nginx...'
systemctl restart nginx

echo 'start nginx automatically...'
systemctl enable nginx

echo 'start socket.io wss test server...'
pm2 start -f ./support/server.js
```
&emsp;&emsp;nginx的配置文件在`wxmp-socket.io-client/test-wxmp/support/holytiny.com`，
可以作为参考。
```nginx
server {
  listen              443 ssl;
  listen              [::]:443 ssl;
  ssl_certificate     /var/webapp/TowerMonitor/backend/support/holytiny.com.pem;
  ssl_certificate_key /var/webapp/TowerMonitor/backend/support/holytiny.com.key;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
  ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;

  location / {
    proxy_pass http://localhost:3030/;
  }

  location /socket.io/ {
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_pass "http://localhost:3210/socket.io/";
  }
}

server {
  listen 80;
  listen [::]:80;
  return 301 https://$host$request_uri;
}
```

![wss测试用例](https://github.com/holytiny/feathersjs-wxmp-socket.io-client/blob/master/asset/wss-test-cases.png)

&emsp;&emsp;测试代码在`wxmp-socket.io-client/test-wxmp/wxmp/test-cases/`目录下。
可以将测试代码作为应用参考。

### 自动运行测试用例
&emsp;&emsp;本项目采用了Jest和微信小程序的automator进行自动化测试。
Jest脚本位于`wxmp-cocket.io-client/test-wxmp/jest/`目录下。
Jest的配置脚本`wxmp-socket.io-client/jest.config.js`指定了运行Jest前使用.evn进行环境变量管理。

&emsp;&emsp;首先打开`wxmp-socket.io-client/.env`进行环境变量配置。

```editorconfig
# cli path
#cli='C:/Program Files (x86)/Tencent/微信web开发者工具/cli.bat'
# Debug
#DEBUG=wxmp-socket.io-client:test
```
&emsp;&emsp;环境变量在Jest脚本中起的作用：
```js
const automator = require('miniprogram-automator')
const path = require('path');
const debug = require('debug')('wxmp-socket.io-client:test');

const cli = process.env.cli || '/Applications/wechatwebdevtools.app/Contents/MacOS/cli';
debug('cli: ', cli);
```

&emsp;&emsp;然后打开微信小程序开发环境。

![微信小程序IDE](https://github.com/holytiny/feathersjs-wxmp-socket.io-client/blob/master/asset/wxmp-ide.png)

&emsp;&emsp;在命令行终端进入`wxmp-socket.io-client`目录后，执行`npm run test:wxmp`。

![自动测试](https://github.com/holytiny/feathersjs-wxmp-socket.io-client/blob/master/asset/automator-test-cases.gif)
## 联系
&emsp;&emsp;欢迎在github上提issue。也欢迎邮件<contact@holytiny.com>。

## 维护人员
- sake <77951530@qq.com>
- zzXiongFan <zzxiongfan@gmail.com>
- Ranco0929 <676667544@qq.com>
- xidianzyf <1143942196@qq.com>

## License

[MIT](/LICENSE)
