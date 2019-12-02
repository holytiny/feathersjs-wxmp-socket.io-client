function shouldConnectToLocalhost () {
  return new Promise((resolve, reject) => {
    // 为了兼容微信小程序和jest环境，将require放到函数内，否则jest无法找到require文件的路径
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
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
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210', {
      transports: ['websocket'],
      forceNew: true,
      autoConnect: false
    });
    if (socket.io.engine === undefined || socket.io.engine === null) {
      socket.disconnect();
      resolve(true);
    } else {
      socket.disconnect();
      resolve(false);
    }
  });
}
shouldNotConnectWhenAutoConnectOptionSetToFalse.description = 'should not connect when autoConnect option set to false';

function shouldStartTwoConnectionsWithSamePath () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let s1 = io('http://localhost:3210', {
      transports: ['websocket']
    });
    let s2 = io('http://localhost:3210', {
      transports: ['websocket']
    });
    if (s1 !== s2) {
      s1.disconnect();
      s2.disconnect();
      resolve(true);
    } else {
      s1.disconnect();
      s2.disconnect();
      resolve(false);
    }
  });
}
shouldStartTwoConnectionsWithSamePath.description = 'should start two connections with same path';

function shouldStartTwoConnectionsWithSamePathAndDifferentQuerystrings () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let s1 = io('http://localhost:3210/?woot', {
      transports: ['websocket']
    });
    let s2 = io('http://localhost:3210', {
      transports: ['websocket']
    });
    if (s1 !== s2) {
      s1.disconnect();
      s2.disconnect();
      resolve(true);
    } else {
      s1.disconnect();
      s2.disconnect();
      resolve(false);
    }
  });
}
shouldStartTwoConnectionsWithSamePathAndDifferentQuerystrings.description = 'should start two connections with same path and different querystrings';

function shouldWorkWithAcks () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210', {
      transports: ['websocket'],
      forceNew: true
    });
    socket.emit('ack');
    socket.on('ack', function (fn) {
      fn(5, { test: true });
    });
    socket.on('got it', function () {
      socket.disconnect();
      resolve(true);
    });
  });
}
shouldWorkWithAcks.description = 'should work with acks';

function shouldReceiveDateWithAck () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210', {
      transports: ['websocket'],
      forceNew: true
    });
    socket.emit('getAckDate', { test: true }, function (data) {
      if (typeof (data) === 'string') {
        socket.disconnect();
        resolve(true);
      } else {
        socket.disconnect();
        resolve(false);
      }
    });
  });
}
shouldReceiveDateWithAck.description = 'should receive date with ack';

function shouldWorkWithFalse () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210', {
      transports: ['websocket'],
      forceNew: true
    });
    socket.emit('false');
    socket.on('false', function (f) {
      if (f === false) {
        socket.disconnect();
        resolve(true);
      } else {
        socket.disconnect();
        resolve(false);
      }
    });
  });
}
shouldWorkWithFalse.description = 'should work with false';

function shouldReceiveUtf8MultibyteCharacters () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    const correct = [
      'てすと',
      'Я Б Г Д Ж Й',
      'Ä ä Ü ü ß',
      'utf8 — string',
      'utf8 — string'
    ];

    let socket = io('http://localhost:3210', {
      transports: ['websocket'],
      forceNew: true
    });

    let i = 0;
    socket.on('takeUtf8', function (data) {
      if (data !== correct[i]) {
        socket.disconnect();
        resolve(false);
      } else {
        i++;
        if (i === correct.length) {
          socket.disconnect();
          resolve(true);
        }
      }
    });

    socket.emit('getUtf8');
  });
}
shouldReceiveUtf8MultibyteCharacters.description = 'should receive utf8 multibyte characters';

function shouldConnectToANamespaceAfterConnectionEstablished () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210', {
      transports: ['websocket'],
      forceNew: true
    });
    socket.on('connect', function () {
      let foo = io('http://localhost:3210/foo', {
        transports: ['websocket'],
        forceNew: true
      });
      foo.on('connect', function () {
        foo.close();
        socket.close();
        resolve(true);
      });
    });
  });
}
shouldConnectToANamespaceAfterConnectionEstablished.description = 'should connect to a namespace after connection established';

function shouldReconnectByDefault () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210', {
      transports: ['websocket'],
      forceNew: true
    });
    socket.io.on('reconnect', function () {
      socket.disconnect();
      resolve(true);
    });

    setTimeout(function () {
      socket.io.engine.close();
    }, 500);
  });
}
shouldReconnectByDefault.description = 'should reconnect by default';

function shouldReconnectManually () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210', {
      transports: ['websocket'],
      forceNew: true
    });
    socket.once('connect', function () {
      socket.disconnect();
    }).once('disconnect', function () {
      socket.once('connect', function () {
        socket.disconnect();
        resolve(true);
      });
      socket.connect();
    });
  });
}
shouldReconnectManually.description = 'should reconnect manually';

function shouldReconnectAutomaticallyAfterReconnectingManually () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210', {
      transports: ['websocket'],
      forceNew: true
    });
    socket.once('connect', function () {
      socket.disconnect();
    }).once('disconnect', function () {
      socket.on('reconnect', function () {
        socket.disconnect();
        resolve(true);
      });
      socket.connect();
      setTimeout(function () {
        socket.io.engine.close();
      }, 500);
    });
  });
}
shouldReconnectAutomaticallyAfterReconnectingManually.description = 'should reconnect automatically after reconnecting manually';

function shouldAttemptReconnectsAfterAFailedReconnect () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let manager = io.Manager({
      reconnection: true,
      timeout: 0,
      reconnectionAttempts: 2,
      reconnectionDelay: 10,
      transports: ['websocket']
    });
    let socket = manager.socket('/timeout');
    socket.once('reconnect_failed', function () {
      let reconnects = 0;
      let reconnectCb = function () {
        reconnects++;
      };

      manager.on('reconnect_attempt', reconnectCb);
      manager.on('reconnect_failed', function failed () {
        // expect(reconnects).to.be(2);
        if (reconnects === 2) {
          socket.close();
          manager.close();
          resolve(true);
        } else {
          socket.close();
          manager.close();
          resolve(false);
        }
      });
      socket.connect();
    });
  });
}
shouldAttemptReconnectsAfterAFailedReconnect.description = 'should attempt reconnects after a failed reconnect';

function shouldReconnectDelayIncreaseEveryTime () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let manager = io.Manager({
      reconnection: true,
      timeout: 0,
      reconnectionAttempts: 3,
      reconnectionDelay: 100,
      randomizationFactor: 0.2,
      transports: ['websocket']
    });
    let socket = manager.socket('/timeout');
    let reconnects = 0;
    let increasingDelay = true;
    let startTime;
    let prevDelay = 0;

    socket.on('connect_error', function () {
      startTime = new Date().getTime();
    });
    socket.on('reconnect_attempt', function () {
      reconnects++;
      let currentTime = new Date().getTime();
      let delay = currentTime - startTime;
      if (delay <= prevDelay) {
        increasingDelay = false;
      }
      prevDelay = delay;
    });

    socket.on('reconnect_failed', function failed () {
      if (reconnects === 3 && increasingDelay !== undefined && increasingDelay !== null) {
        socket.close();
        manager.close();
        resolve(true);
      } else {
        socket.close();
        manager.close();
        resolve(false);
      }
    });
  });
}
shouldReconnectDelayIncreaseEveryTime.description = 'reconnect delay should increase every time';

function shouldReconnectEventFiredInSocket () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210', {
      transports: ['websocket'],
      forceNew: true
    });
    socket.on('reconnect', function () {
      socket.disconnect();
      resolve(true);
    });

    setTimeout(function () {
      socket.io.engine.close();
    }, 500);
  });
}
shouldReconnectEventFiredInSocket.description = 'should reconnect event be fired in socket';

function shouldNotReconnectWhenForceClosed () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210/invalid', {
      transports: ['websocket'],
      forceNew: true,
      timeout: 0,
      reconnectionDelay: 10
    });
    socket.on('connect_error', function () {
      socket.on('reconnect_attempt', function () {
        resolve(false);
      });
      socket.disconnect();
      // set a timeout to let reconnection possibly fire
      setTimeout(function () {
        resolve(true);
      }, 500);
    });
  });
}
shouldNotReconnectWhenForceClosed.description = 'should not reconnect when force closed';

function shouldStopReconnectingWhenForceClosed () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210/invalid', {
      transports: ['websocket'],
      forceNew: true,
      timeout: 0,
      reconnectionDelay: 10
    });
    socket.once('reconnect_attempt', function () {
      socket.on('reconnect_attempt', function () {
        resolve(false);
      });
      socket.disconnect();
      // set a timeout to let reconnection possibly fire
      setTimeout(function () {
        resolve(true);
      }, 500);
    });
  });
}
shouldStopReconnectingWhenForceClosed.description = 'should stop reconnecting when force closed';

function shouldReconnectAfterStoppingReconnection () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('/invalid', {
      transports: ['websocket'],
      forceNew: true,
      timeout: 0,
      reconnectionDelay: 10
    });
    socket.once('reconnect_attempt', function () {
      socket.on('reconnect_attempt', function () {
        socket.disconnect();
        resolve(true);
      });
      socket.disconnect();
      socket.connect();
    });
  });
}
shouldReconnectAfterStoppingReconnection.description = 'should reconnect after stopping reconnection';

function shouldStopReconnectingOnaSocketAndKeepToReconnectOnAnother () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let manager = io.Manager('http://localhost:3210/invalid', {
      transports: ['websocket']
    });
    let socket1 = manager.socket('/');
    let socket2 = manager.socket('/asd');

    manager.on('reconnect_attempt', function () {
      socket1.on('connect', function () {
        resolve(false);
      });
      socket2.on('connect', function () {
        setTimeout(function () {
          socket2.disconnect();
          manager.disconnect();
          resolve(true);
        }, 500);
      });
      socket1.disconnect();
    });

    setTimeout(function () {
      manager.engine.close();
    }, 1000);
  });
}
shouldStopReconnectingOnaSocketAndKeepToReconnectOnAnother.description = 'should stop reconnecting on a socket and keep to reconnect on another';

function shouldTryToReconnectTwiceAndFail () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let manager = io.Manager({
      reconnection: true,
      timeout: 0,
      reconnectionAttempts: 2,
      reconnectionDelay: 10,
      transports: ['websocket']
    });
    let socket;

    let reconnects = 0;
    let reconnectCb = function () {
      reconnects++;
    };

    manager.on('reconnect_attempt', reconnectCb);
    manager.on('reconnect_failed', function failed () {
      // expect(reconnects).to.be(2);
      if (reconnects === 2) {
        socket.close();
        manager.close();
        resolve(true);
      } else {
        socket.close();
        manager.close();
        resolve(false);
      }
    });

    socket = manager.socket('/timeout');
  });
}
shouldTryToReconnectTwiceAndFail.description = 'should try to reconnect twice and fail when requested two attempts with immediate timeout and reconnect enabled';

function shouldFireReconnectEventsOnSocket () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let manager = io.Manager({
      reconnection: true,
      timeout: 0,
      reconnectionAttempts: 2,
      reconnectionDelay: 10,
      transports: ['websocket']
    });
    let socket = manager.socket('/timeout_socket');

    let reconnects = 0;
    let reconnectCb = function (attempts) {
      reconnects++;
      // expect(attempts).to.be(reconnects);
      if (attempts !== reconnects) {
        reject(false);
      }
    };

    socket.on('reconnect_attempt', reconnectCb);
    socket.on('reconnect_failed', function failed () {
      // expect(reconnects).to.be(2);
      socket.close();
      manager.close();
      resolve(true);
    });
  });
}
shouldFireReconnectEventsOnSocket.description = 'should fire reconnect_* events on socket';

function shouldFireErrorOnSocket () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let manager = io.Manager('http://localhost:3210/invalid', {
      reconnection: true,
      transports: ['websocket']
    });

    let socket = manager.socket('/timeout_socket');
    socket.on('error', function (data) {
      // expect(data.code).to.be('test');
      if (data.code === 'test') {
        socket.close();
        manager.close();
        resolve(true);
      } else {
        socket.close();
        manager.close();
        resolve(false);
      }
    });

    socket.on('connect', function () {
      manager.engine.onPacket({ type: 'error', data: 'test' });
    });
  });
}
shouldFireErrorOnSocket.description = 'should fire error on socket';

function shouldFireReconnectingWithAttemptsNumber () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let manager = io.Manager({
      reconnection: true,
      timeout: 0,
      reconnectionAttempts: 2,
      reconnectionDelay: 10,
      transports: ['websocket']
    });
    let socket = manager.socket('/timeout_socket');

    let reconnects = 0;
    let reconnectCb = function (attempts) {
      reconnects++;
      // expect(attempts).to.be(reconnects);
      if (attempts !== reconnects) {
        reject(false);
      }
    };

    socket.on('reconnecting', reconnectCb);
    socket.on('reconnect_failed', function failed () {
      // expect(reconnects).to.be(2);
      if (reconnects === 2) {
        socket.close();
        manager.close();
        resolve(true);
      } else {
        socket.close();
        manager.close();
        resolve(false);
      }
    });
  });
}
shouldFireReconnectingWithAttemptsNumber.description = 'should fire reconnecting (on socket) with attempts number when reconnecting twice';

function shouldNotTryToReconnectAndShouldFormAConnection () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let manager = io.Manager('http://localhost:3210/', {
      reconnection: true,
      reconnectionDelay: 10,
      transports: ['websocket']
    });
    let cb = function () {
      socket.close();
      resolve(false);
    };
    manager.on('reconnect_attempt', cb);

    let socket = manager.socket('/valid');
    socket.on('connect', function () {
      // set a timeout to let reconnection possibly fire
      setTimeout(function () {
        socket.close();
        manager.close();
        resolve(true);
      }, 1000);
    });
  });
}
shouldNotTryToReconnectAndShouldFormAConnection.description = 'should not try to reconnect and should form a connection when connecting to correct port with default timeout';

function shouldConnectWhileDisconnectingAnotherSocket () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let manager = io.Manager('http://localhost:3210/', {
      transports: ['websocket']
    });
    let socket1 = manager.socket('/foo');
    socket1.on('connect', function () {
      let socket2 = manager.socket('/asd');
      socket2.on('connect', () => resolve(true));
      socket1.disconnect();
    });
  });
}
shouldConnectWhileDisconnectingAnotherSocket.description = 'should connect while disconnecting another socket';

function shouldEmitDateAsString () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210/', {
      forceNew: true,
      transports: ['websocket']
    });
    socket.on('takeDate', function (data) {
      socket.close();
      // expect(data).to.be.a('string');
      if (typeof (data) === 'string') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    socket.emit('getDate');
  });
}
shouldEmitDateAsString.description = 'should emit date as string';

function shouldEmitDateInObject () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210/', {
      forceNew: true,
      transports: ['websocket']
    });
    socket.on('takeDateObj', function (data) {
      socket.close();
      // expect(data).to.be.an('object');
      // expect(data.date).to.be.a('string');
      if (typeof (data) === 'object' && typeof (data.date) === 'string') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    socket.emit('getDateObj');
  });
}
shouldEmitDateInObject.description = 'should emit date in object';

function shouldGetBinaryData () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210/', {
      forceNew: true,
      transports: ['websocket']
    });
    socket.emit('doge');
    socket.on('doge', function (buffer) {
      socket.disconnect();
      // expect(buffer instanceof ArrayBuffer).to.be(true);
      if (buffer instanceof ArrayBuffer) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}
shouldGetBinaryData.description = 'should get binary data (as an ArrayBuffer)';

function shouldSendBinaryData () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210/', {
      forceNew: true,
      transports: ['websocket']
    });

    const base64 = require('base64-arraybuffer');
    socket.on('buffack', function () {
      socket.disconnect();
      resolve(true);
    });
    // create ArrayBuffer object.
    const buf = base64.decode('asdfasdf');
    socket.emit('buffa', buf);
  });
}
shouldSendBinaryData.description = 'should send binary data (as an ArrayBuffer)';

function shouldSendBinaryDataMixedWithJson () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210/', {
      forceNew: true,
      transports: ['websocket']
    });

    const base64 = require('base64-arraybuffer');
    socket.on('jsonbuff-ack', function () {
      socket.disconnect();
      resolve(true);
    });
    const buf = base64.decode('howdy');
    socket.emit('jsonbuff', {hello: 'lol', message: buf, goodbye: 'gotcha'});
  });
}
shouldSendBinaryDataMixedWithJson.description = 'should send binary data (as an ArrayBuffer) mixed with json';

function shouldSendEventsWithArrayBuffersInTheCorrectOrder () {
  return new Promise((resolve, reject) => {
    const io = require('@holytiny/wxmp-socket.io-client/socket.io.dev');
    let socket = io('http://localhost:3210/', {
      forceNew: true,
      transports: ['websocket']
    });

    const base64 = require('base64-arraybuffer');
    socket.on('abuff2-ack', function () {
      socket.disconnect();
      resolve(true);
    });
    const buf = base64.decode('abuff1');
    socket.emit('abuff1', buf);
    socket.emit('abuff2', 'please arrive second');
  });
}
shouldSendEventsWithArrayBuffersInTheCorrectOrder.description = 'should send events with ArrayBuffers in the correct order';

module.exports = [
  // shouldConnectToLocalhost,
  // shouldNotConnectWhenAutoConnectOptionSetToFalse,
  // shouldStartTwoConnectionsWithSamePath,
  // shouldStartTwoConnectionsWithSamePathAndDifferentQuerystrings,
  // shouldWorkWithAcks,
  // shouldReceiveDateWithAck,
  // shouldWorkWithFalse,
  // shouldReceiveUtf8MultibyteCharacters,
  // shouldConnectToANamespaceAfterConnectionEstablished,
  // shouldReconnectByDefault,
  // shouldReconnectManually,
  // shouldReconnectAutomaticallyAfterReconnectingManually,
  // shouldAttemptReconnectsAfterAFailedReconnect,
  // shouldReconnectDelayIncreaseEveryTime,
  // shouldReconnectEventFiredInSocket,
  // shouldNotReconnectWhenForceClosed,
  // shouldStopReconnectingWhenForceClosed,
  // shouldReconnectAfterStoppingReconnection,
  // shouldStopReconnectingOnaSocketAndKeepToReconnectOnAnother,
  // shouldTryToReconnectTwiceAndFail,
  // shouldFireReconnectEventsOnSocket,
  // shouldFireErrorOnSocket,
  // shouldFireReconnectingWithAttemptsNumber,
  // shouldNotTryToReconnectAndShouldFormAConnection,
  // shouldConnectWhileDisconnectingAnotherSocket,
  // shouldEmitDateAsString,
  // shouldEmitDateInObject,
  // shouldGetBinaryData,
  // shouldSendBinaryData,
  // shouldSendBinaryDataMixedWithJson,
  shouldSendEventsWithArrayBuffersInTheCorrectOrder
];
