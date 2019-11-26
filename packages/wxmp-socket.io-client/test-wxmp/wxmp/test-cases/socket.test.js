
function shouldHaveAnAccessibleSocketIdEqualToTheServerSideSocketId () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210', {
      transports: ['websocket'],
      forceNew: true
    });
    socket.on('connect', function () {
      if (socket.id && socket.id === socket.io.engine.id) {
        socket.disconnect();
        resolve(true);
      }
    });
  });
}
shouldHaveAnAccessibleSocketIdEqualToTheServerSideSocketId.description = 'should have an accessible socket id equal to the server-side socket id (default namespace)';

module.exports = [
  shouldHaveAnAccessibleSocketIdEqualToTheServerSideSocketId
];
