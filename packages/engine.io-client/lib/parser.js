
/**
 * Packet types.
 */

var packets = exports.packets = {
    open:     0    // non-ws
  , close:    1    // non-ws
  , ping:     2
  , pong:     3
  , message:  4
  , error:    5
  , noop:     6
};

var packetslist = Object.keys(packets);

/**
 * Premade error packet.
 */

var err = { type: 'error', data: 'parser error' }

/**
 * Encodes a packet.
 *
 *     <packet type id> [ `:` <data> ]
 *
 * Example:
 *
 *     5:hello world
 *     3
 *     4
 *
 * @api private
 */

exports.encodePacket = function (type, data) {
  var encoded = packets[type]

  // data fragment is optional
  if ('undefined' != typeof data) {
    encoded += ':' + data;
  }

  return encoded;
};

/**
 * Decodes a packet.
 *
 * @return {Object} with `type` and `data` (if any)
 * @api private
 */

exports.decodePacket = function (data) {
  if (~data.indexOf(':')) {
    var pieces = data.match(/([0-9]+):(.*)/)
      , type = pieces[1]
      , data = pieces[2]

    // if bad packet, return noop
    if (!packetslist[type]) {
      // parser error - ignoring packet
      return err;
    }

    return { type: packetslist[type], data: data };
  } else {
    if (!packetslist[data]) return err;
    return { type: packetslist[data] };
  }
};

/**
 * Encodes multiple messages (payload).
 * 
 *     <length>:data
 *
 * Example:
 *
 *     11:hello world2:hi
 *
 * @param {Array} messages
 * @api private
 */

exports.encodePayload = function (packets) {
  var encoded = '';

  for (var i = 0, l = packets.length; i < l; i++) {
    encoded += packets[i].length + ':' + packets[i];
  }

  return encoded;
};

/*
 * Decodes data when a payload is maybe expected.
 *
 * @param {String} data
 * @return {Array} messages
 * @api public
 */

exports.decodePayload = function (data) {
  if (undefined == data || null == data) {
    return [];
  }

  if (data[0] == '\ufffd') {
    var ret = [];

    for (var i = 1, length = ''; i < data.length; i++) {
      if (data[i] == '\ufffd') {
        ret.push(data.substr(i + 1).substr(0, length));
        i += Number(length) + 1;
        length = '';
      } else {
        length += data[i];
      }
    }

    return ret;
  } else {
    return [data];
  }
}
