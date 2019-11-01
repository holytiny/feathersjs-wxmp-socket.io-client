import feathers from '@feathersjs/feathers';
import auth from '@feathersjs/authentication-client';
import feathersSocketioClient from '../../../../packages/feathersjs-wxmp.socket.io-client';
import io from '../../../../packages/wxmp.socket.io-client';

import Debug from 'debug';
if ('production'.localeCompare(process.env.NODE_ENV) !== 0) {
  Debug.enable('*');
}
const debug = Debug('uni-app-socket.io-client');
debug('create socketio init');

const socketioInit = io('http://localhost:3030', {
  transports: ['websocket'],
  forceNew: true,
  timeout: false
});

const feathersClient = feathers();
//feathersClient.configure(feathersSocketioClient(socketioInit, { timeout: 1000 * 20 }));
feathersClient.configure(feathersSocketioClient(socketioInit));
feathersClient.configure(auth());

// console.log('export feathersClient', feathersClient);
export default feathersClient;
