/**
 * Module dependencies.
 */

import Transport from '../transport';
import parser from 'engine.io-parser';
import parseqs from 'parseqs';
// let inherit = require('component-inherit');
import yeast from 'yeast';
import debug from 'debug';
debug('wxmp.engine.io-client:wxmp.websocket');

// console.log('in wxmp.engine.io-client.js!');

// let BrowserWebSocket, NodeWebSocket;
//
// if (typeof WebSocket !== 'undefined') {
//   BrowserWebSocket = WebSocket;
// } else if (typeof self !== 'undefined') {
//   BrowserWebSocket = self.WebSocket || self.MozWebSocket;
// }
//
// if (typeof window === 'undefined') {
//   try {
//     NodeWebSocket = require('ws');
//   } catch (e) { }
// }

/**
 * Get either the `WebSocket` or `MozWebSocket` globals
 * in the browser or try to resolve WebSocket-compatible
 * interface exposed by `ws` for Node-like environment.
 */

// let WebSocketImpl = BrowserWebSocket || NodeWebSocket;

/**
 * WebSocket transport constructor.
 *
 * @api {Object} connection options
 * @api public
 */

// function WS (opts) {
//   let forceBase64 = (opts && opts.forceBase64);
//   if (forceBase64) {
//     this.supportsBinary = false;
//   }
//   this.perMessageDeflate = opts.perMessageDeflate;
//   this.usingBrowserWebSocket = BrowserWebSocket && !opts.forceNode;
//   this.protocols = opts.protocols;
//   if (!this.usingBrowserWebSocket) {
//     WebSocketImpl = NodeWebSocket;
//   }
//   Transport.call(this, opts);
// }
/**
 * Inherits from Transport.
 */
export class WS extends Transport {
  constructor (opts) {
    super(opts);

    let forceBase64 = (opts && opts.forceBase64);
    if (forceBase64) {
      this.supportsBinary = false;
    }
    this.perMessageDeflate = opts.perMessageDeflate;
    this.protocols = opts.protocols;

    // this.name = 'websocket';
    // this.supportsBinary = true;
  }

  /**
   * Feature detection for WebSocket.
   *
   * @return {Boolean} whether this transport is available.
   * @api public
   */
// WS.prototype.check = function () {
//   return !!WebSocketImpl && !('__initialize' in WebSocketImpl && this.name === WS.prototype.name);
// };
  check () {
    return (this.name === WS.prototype.name) && ('function' === typeof wx.connectSocket);
  }

  /**
   * Generates uri for connection.
   *
   * @api private
   */
  // WS.prototype.uri = function () {
  //   let query = this.query || {};
  //   let schema = this.secure ? 'wss' : 'ws';
  //   let port = '';
  //
  //   // avoid port if default for schema
  //   if (this.port && (('wss' === schema && Number(this.port) !== 443) ||
  //     ('ws' === schema && Number(this.port) !== 80))) {
  //     port = ':' + this.port;
  //   }
  //
  //   // append timestamp to URI
  //   if (this.timestampRequests) {
  //     query[this.timestampParam] = yeast();
  //   }
  //
  //   // communicate binary support capabilities
  //   if (!this.supportsBinary) {
  //     query.b64 = 1;
  //   }
  //
  //   query = parseqs.encode(query);
  //
  //   // prepend ? to query
  //   if (query.length) {
  //     query = '?' + query;
  //   }
  //
  //   let ipv6 = this.hostname.indexOf(':') !== -1;
  //   return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
  // };
  uri () {
    let query = this.query || {};
    let schema = this.secure ? 'wss' : 'ws';
    let port = '';

    // avoid port if default for schema
    if (this.port && (('wss' === schema && Number(this.port) !== 443) ||
      ('ws' === schema && Number(this.port) !== 80))) {
      port = ':' + this.port;
    }

    // append timestamp to URI
    if (this.timestampRequests) {
      query[this.timestampParam] = yeast();
    }

    // communicate binary support capabilities
    if (!this.supportsBinary) {
      query.b64 = 1;
    }

    query = parseqs.encode(query);

    // prepend ? to query
    if (query.length) {
      query = '?' + query;
    }

    let ipv6 = this.hostname.indexOf(':') !== -1;
    return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
  }

  /**
   * Opens socket.
   *
   * @api private
   */
  // WS.prototype.doOpen = function () {
  //   if (!this.check()) {
  //     // let probe timeout
  //     return;
  //   }
  //
  //   let uri = this.uri();
  //   let protocols = this.protocols;
  //   let opts = {
  //     agent: this.agent,
  //     perMessageDeflate: this.perMessageDeflate
  //   };
  //
  //   // SSL options for Node.js client
  //   opts.pfx = this.pfx;
  //   opts.key = this.key;
  //   opts.passphrase = this.passphrase;
  //   opts.cert = this.cert;
  //   opts.ca = this.ca;
  //   opts.ciphers = this.ciphers;
  //   opts.rejectUnauthorized = this.rejectUnauthorized;
  //   if (this.extraHeaders) {
  //     opts.headers = this.extraHeaders;
  //   }
  //   if (this.localAddress) {
  //     opts.localAddress = this.localAddress;
  //   }
  //
  //   try {
  //     this.ws =
  //       this.usingBrowserWebSocket && !this.isReactNative
  //         ? protocols
  //         ? new WebSocketImpl(uri, protocols)
  //         : new WebSocketImpl(uri)
  //         : new WebSocketImpl(uri, protocols, opts);
  //   } catch (err) {
  //     return this.emit('error', err);
  //   }
  //
  //   if (this.ws.binaryType === undefined) {
  //     this.supportsBinary = false;
  //   }
  //
  //   if (this.ws.supports && this.ws.supports.binary) {
  //     this.supportsBinary = true;
  //     this.ws.binaryType = 'nodebuffer';
  //   } else {
  //     this.ws.binaryType = 'arraybuffer';
  //   }
  //
  //   this.addEventListeners();
  // };
  doOpen () {
    if (!this.check()) {
      // let probe timeout
      return;
    }

    const uri = this.uri();
    const protocols = this.protocols;
    console.log('wx.connectSocket');
    try {
      const self = this;
      let wxConnectSocketParam = {
        // success: () => {
        //   // console.log('wx.connectSocket success!: ', param);
        //   self.onOpenWrapper();
        // },
        // fail: (e) => {
        //   // console.log('wx.connectSocket fail: ', e);
        //   self.onError(e);
        // },
        url: uri
      };
      if (protocols) {
        wxConnectSocketParam.protocols = protocols;
      }
      this.ws = wx.connectSocket(wxConnectSocketParam);
    } catch (err) {
      return this.emit('error', err);
    }

    if (this.ws.binaryType === undefined) {
      this.supportsBinary = false;
    }

    if (this.ws.supports && this.ws.supports.binary) {
      this.supportsBinary = true;
      this.ws.binaryType = 'nodebuffer';
    } else {
      this.ws.binaryType = 'arraybuffer';
    }

    this.addEventListeners();
  }

  /**
   * Adds event listeners to the socket
   *
   * @api private
   */
  // WS.prototype.addEventListeners = function () {
  //   let self = this;
  //
  //   this.ws.onopen = function () {
  //     self.onOpen();
  //   };
  //   this.ws.onclose = function () {
  //     self.onClose();
  //   };
  //   this.ws.onmessage = function (ev) {
  //     self.onData(ev.data);
  //   };
  //   this.ws.onerror = function (e) {
  //     self.onError('websocket error', e);
  //   };
  // };
  addEventListeners () {
    const self = this;

    this.ws.onOpen(function () {
      self.onOpen();
    });
    this.ws.onError(function (e) {
      self.onError('websocket error', e);
    });
    this.ws.onClose(function () {
      self.onClose();
    });
    this.ws.onMessage(function (data) {
      self.onData(data);
    });
  }

  /**
   * Called upon open, a tricky function
   * 不知道为什么，在微信小程序环境下，wx.connectSocket
   * 的success消息响应会打断后续程序的执行，所以导致初始化
   * 的程序没有执行完，就会抛出'open'事件。
   * 在这里用强制的手法，恢复主线程程序的执行，把'open'事件的抛出
   * 推后到主线程程序执行之后马上执行。 最新的sdk没有问题了已经。
   * @api private
   */
  // onOpenWrapper () {
  //   const self = this;
  //   setTimeout(() => {
  //     self.onOpen();
  //   }, 0);
  // }

  /**
   * Called upon close
   *
   * @api private
   */
  // WS.prototype.onClose = function () {
  //   Transport.prototype.onClose.call(this);
  // };
  onClose () {
    super.onClose();
  }

  /**
   * Closes socket.
   *
   * @api private
   */
  // WS.prototype.doClose = function () {
  //   if (typeof this.ws !== 'undefined') {
  //     this.ws.close();
  //   }
  // };
  doClose () {
    if (typeof this.ws !== 'undefined') {
      this.ws.close();
    }
  }

  /**
   * Writes data to socket.
   *
   * @param {Array} array of packets.
   * @api private
   */
  // WS.prototype.write = function (packets) {
  //   let self = this;
  //   this.writable = false;
  //
  //   // encodePacket efficient as it uses WS framing
  //   // no need for encodePayload
  //   let total = packets.length;
  //   for (let i = 0, l = total; i < l; i++) {
  //     (function (packet) {
  //       parser.encodePacket(packet, self.supportsBinary, function (data) {
  //         if (!self.usingBrowserWebSocket) {
  //           // always create a new object (GH-437)
  //           let opts = {};
  //           if (packet.options) {
  //             opts.compress = packet.options.compress;
  //           }
  //
  //           if (self.perMessageDeflate) {
  //             let len = 'string' === typeof data ? Buffer.byteLength(data) : data.length;
  //             if (len < self.perMessageDeflate.threshold) {
  //               opts.compress = false;
  //             }
  //           }
  //         }
  //
  //         // Sometimes the websocket has already been closed but the browser didn't
  //         // have a chance of informing us about it yet, in that case send will
  //         // throw an error
  //         try {
  //           if (self.usingBrowserWebSocket) {
  //             // TypeError is thrown when passing the second argument on Safari
  //             self.ws.send(data);
  //           } else {
  //             self.ws.send(data, opts);
  //           }
  //         } catch (e) {
  //           debug('websocket closed before onclose event');
  //         }
  //
  //         --total || done();
  //       });
  //     })(packets[i]);
  //   }
  //
  //   function done () {
  //     self.emit('flush');
  //
  //     // fake drain
  //     // defer to next tick to allow Socket to clear writeBuffer
  //     setTimeout(function () {
  //       self.writable = true;
  //       self.emit('drain');
  //     }, 0);
  //   }
  // };
  write (packets) {
    let self = this;
    this.writable = false;

    // encodePacket efficient as it uses WS framing
    // no need for encodePayload
    let total = packets.length;
    for (let i = 0, l = total; i < l; i++) {
      (function (packet) {
        parser.encodePacket(packet, self.supportsBinary, function (data) {
          // Sometimes the websocket has already been closed but the browser didn't
          // have a chance of informing us about it yet, in that case send will
          // throw an error
          try {
            self.ws.send({
              data
            });
          } catch (e) {
            debug('websocket closed before onclose event');
          }

          --total || done();
        });
      })(packets[i]);
    }

    function done () {
      self.emit('flush');

      // fake drain
      // defer to next tick to allow Socket to clear writeBuffer
      setTimeout(function () {
        self.writable = true;
        self.emit('drain');
      }, 0);
    }
  }
}

/**
 * Transport name.
 *
 * @api public
 */

WS.prototype.name = 'websocket';

/*
 * WebSockets support binary
 */

WS.prototype.supportsBinary = true;
