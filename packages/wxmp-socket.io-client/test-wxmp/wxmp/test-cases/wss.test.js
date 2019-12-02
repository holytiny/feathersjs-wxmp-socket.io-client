function shouldConnectToWssHost () {
  return new Promise((resolve, reject) => {
    // 为了兼容微信小程序和jest环境，将require放到函数内，否则jest无法找到require文件的路径
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('https://www.holytiny.com/', {
      transports: ['websocket'],
      forceNew: true
    });
    socket.on('connect', () => {
      socket.disconnect();
      resolve(true);
    });
  });
}
shouldConnectToWssHost.description = 'should connect to wss host';

module.exports = [
  shouldConnectToWssHost
];
