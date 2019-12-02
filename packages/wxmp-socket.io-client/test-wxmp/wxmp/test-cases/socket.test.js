
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

function shouldHaveAnAccessibleSocketIdEqualToTheServerSideSocketId2 () {
 return new Promise((resolve, reject) => {
   const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
   let socket = io('http://localhost:3210/foo', {
     transports: ['websocket'],
     forceNew: true
   });
   socket.on('connect', function () {
     if (socket.id && socket.id === '/foo#' + socket.io.engine.id) {
       socket.disconnect();
       resolve(true);
     }
   });
 });
}
shouldHaveAnAccessibleSocketIdEqualToTheServerSideSocketId2.description = 'should have an accessible socket id equal to the server-side socket id (custom namespace)';

function shouldClearSocketIdUponDisconnection () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210', {
      transports: ['websocket'],
      forceNew: true
    });
    socket.on('connect', function () {
      socket.on('disconnect', function () {
        if (!socket.id) {
          resolve(true);
        }
      });
      socket.disconnect();
    });
  });
}
shouldClearSocketIdUponDisconnection.description = 'clears socket.id upon disconnection';

function shouldNotFireConnectErrorIfWeForceDisconnectInOpeningState () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210', {
      transports: ['websocket'],
      forceNew: true
    });
    socket.disconnect();
    socket.on('connect_error', function () {
      resolve(false);
    });
    setTimeout(function () {
      resolve(true);
    }, 300);
  });
}
shouldNotFireConnectErrorIfWeForceDisconnectInOpeningState.description = 'doesn\'t fire a connect_error if we force disconnect in opening state';

function shouldPingAndPongWithLatency () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210', {
      transports: ['websocket'],
      forceNew: true
    });
    socket.on('connect', function () {
      let pinged;
      socket.once('ping', function () {
        pinged = true;
      });
      socket.once('pong', function (ms) {
        if (pinged && typeof ms === 'number') {
          socket.disconnect();
          resolve(true);
        }
      });
    });
  });
}
shouldPingAndPongWithLatency.description = 'should ping and pong with latency';

function shouldChangeSocketIdUponReconnection () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210', {
      transports: ['websocket'],
      forceNew: true
    });
    socket.on('connect', function () {
      let id = socket.id;

      socket.on('reconnect_attempt', function () {
        // expect(socket.id).to.not.be.ok();
        if (socket.id) {
          resolve(false);
        }
      });

      socket.on('reconnect', function () {
        // expect(socket.id).to.not.eql(id);
        if (socket.id !== id) {
          socket.disconnect();
          resolve(true);
        }
      });
      socket.io.engine.close();
    });
  });
}
shouldChangeSocketIdUponReconnection.description = 'should change socket.id upon reconnection';

function shouldEnableCompressionByDefault () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210', {
      transports: ['websocket'],
      forceNew: true
    });
    socket.on('connect', function () {
      socket.io.engine.once('packetCreate', function (packet) {
        // expect(packet.options.compress).to.be(true);
        if (packet.options.compress === true) {
          socket.disconnect();
          resolve(true);
        }
      });
      socket.emit('hi');
    });
  });
}
shouldEnableCompressionByDefault.description = 'should enable compression by default';

function shouldCanDisableCompression () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210', {
      transports: ['websocket'],
      forceNew: true
    });
    socket.on('connect', function () {
      socket.io.engine.once('packetCreate', function (packet) {
        // expect(packet.options.compress).to.be(false);
        if (packet.options.compress === false) {
          socket.disconnect();
          resolve(true);
        }
      });
      socket.compress(false).emit('hi');
    });
  });
}
shouldCanDisableCompression.description = 'should can disable compression';

function shouldAcceptAnObject () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210', {
      transports: ['websocket'],
      forceNew: true,
      query: {
        e: 'f'
      }
    });
    socket.emit('getHandshake', function (handshake) {
      // expect(handshake.query.e).to.be('f');
      if (handshake.query.e === 'f') {
        socket.disconnect();
        resolve(true);
      }
    });
  });
}
shouldAcceptAnObject.description = 'should accept an object (default namespace)';

function shouldAcceptQueryString () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210/?c=d', {
      transports: ['websocket'],
      forceNew: true
    });
    socket.emit('getHandshake', function (handshake) {
      if (handshake.query.c === 'd') {
        socket.disconnect();
        resolve(true);
      }
    });
  });
}
shouldAcceptQueryString.description = 'should accept a query string (default namespace)';

function shouldAcceptObject2 () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210/abc', {
      transports: ['websocket'],
      forceNew: true,
      query: {
        a: 'b'
      }
    });
    socket.on('handshake', function (handshake) {
      // expect(handshake.query.a).to.be('b');
      if (handshake.query.a === 'b') {
        socket.disconnect();
        resolve(true);
      }
    });
  });
}
shouldAcceptObject2.description = 'should accept an object';

function shouldAcceptQueryString2 () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210/abc?b=c&d=e', {
      transports: ['websocket'],
      forceNew: true
    });
    socket.on('handshake', function (handshake) {
      if (handshake.query.b === 'c' && handshake.query.d === 'e') {
        socket.disconnect();
        resolve(true);
      }
    });
  });
}
shouldAcceptQueryString2.description = 'should accept a query string';

function shouldProperlyEncodeParameters () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210/abc', {
      transports: ['websocket'],
      forceNew: true,
      query: {'&a': '&=?a'}
    });
    socket.on('handshake', function (handshake) {
      // expect(handshake.query['&a']).to.be('&=?a');
      if (handshake.query['&a'] === '&=?a') {
        socket.disconnect();
        resolve(true);
      }
    });
  });
}
shouldProperlyEncodeParameters.description = 'should properly encode the parameters';

function shouldFireAnErrorEventOnMiddlewareFailureFromMainNamespace () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210/foo', {
      transports: ['websocket'],
      forceNew: true,
      query: { 'fail': true }
    });
    socket.on('error', function (err) {
      // expect(err).to.eql('Auth failed (main namespace)');
      if (err === 'Auth failed (main namespace)') {
        socket.disconnect();
        resolve(true);
      }
    });
  });
}
shouldFireAnErrorEventOnMiddlewareFailureFromMainNamespace.description = 'should fire an error event on middleware failure from main namespace';

function shouldFireAnErrorEventOnMiddlewareFailureFromCustomNamespace () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210/no', {
      transports: ['websocket'],
      forceNew: true
    });
    socket.on('error', function (err) {
      // expect(err).to.eql('Auth failed (custom namespace)');
      if (err === 'Auth failed (custom namespace)') {
        socket.disconnect();
        resolve(true);
      }
    });
  });
}
shouldFireAnErrorEventOnMiddlewareFailureFromCustomNamespace.description = 'should fire an error event on middleware failure from custom namespace';

module.exports = [
  shouldHaveAnAccessibleSocketIdEqualToTheServerSideSocketId,
  shouldHaveAnAccessibleSocketIdEqualToTheServerSideSocketId2,
  shouldClearSocketIdUponDisconnection,
  shouldNotFireConnectErrorIfWeForceDisconnectInOpeningState,
  shouldPingAndPongWithLatency,
  shouldChangeSocketIdUponReconnection,
  shouldEnableCompressionByDefault,
  shouldCanDisableCompression,
  shouldAcceptAnObject,
  shouldAcceptQueryString,
  shouldAcceptObject2,
  shouldAcceptQueryString2,
  shouldProperlyEncodeParameters,
  shouldFireAnErrorEventOnMiddlewareFailureFromMainNamespace,
  shouldFireAnErrorEventOnMiddlewareFailureFromCustomNamespace
];
