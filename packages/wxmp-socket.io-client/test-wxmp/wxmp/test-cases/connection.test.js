function shouldConnectToLocalhost () {
  // 为了兼容微信小程序和jest环境，将require放到函数内，否则jest无法找到require文件的路径
  const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
  return new Promise((resolve, reject) => {
    let socket = io('http://localhost:3210', {
      transports: ['websocket'],
      forceNew: true
    });
    socket.emit('hi');
    socket.on('hi', (data) => {
      socket.disconnect();
      resolve(true);
    });
  });
}
shouldConnectToLocalhost.description = 'should connect to localhost';

function shouldNotConnectWhenAutoConnectOptionSetToFalse () {
  const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
  return new Promise((resolve, reject) => {
    let socket = io('http://localhost:3210', {
      transports: ['websocket'],
      forceNew: true,
      autoConnect: false
    });
    console.log('socket.io.engine: ', socket.io.engine);
    if (socket.io.engine === undefined || socket.io.engine === null) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
}
shouldNotConnectWhenAutoConnectOptionSetToFalse.description = 'should not connect when autoConnect option set to false';

function shouldStartTwoConnectionsWithSamePath () {
  const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
  return new Promise((resolve, reject) => {
    let s1 = io('http://localhost:3210', {
      transports: ['websocket']
    });
    let s2 = io('http://localhost:3210', {
      transports: ['websocket']
    });
    console.log('s1: ', s1, 's2: ', s2);
    if (s1 !== s2) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
}
shouldStartTwoConnectionsWithSamePath.description = 'should start two connections with same path';

function shouldStartTwoConnectionsWithSamePathAndDifferentQuerystrings () {
  const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
  return new Promise((resolve, reject) => {
    let s1 = io('http://localhost:3210/?woot', {
      transports: ['websocket']
    });
    let s2 = io('http://localhost:3210', {
      transports: ['websocket']
    });
    console.log('s1: ', s1, 's2: ', s2);
    if (s1 !== s2) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
}
shouldStartTwoConnectionsWithSamePathAndDifferentQuerystrings.description = 'should start two connections with same path and different querystrings';


module.exports = [
  shouldConnectToLocalhost,
  shouldNotConnectWhenAutoConnectOptionSetToFalse,
  shouldStartTwoConnectionsWithSamePath,
  shouldStartTwoConnectionsWithSamePathAndDifferentQuerystrings
];
