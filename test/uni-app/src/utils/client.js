import feathers from '@feathersjs/feathers';
import auth from '@feathersjs/authentication-client';
import feathersSocketioClient from '@feathersjs/socketio-client';
import io from '../../../../packages/wxmp-socket.io-client';
// import io from '@holytiny/wxmp-socket.io-client';
import wxmp from '@holytiny/wxmp-polyfill';

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
