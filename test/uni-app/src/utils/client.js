import feathers from '@feathersjs/feathers';
import feathersSocketioClient from '../../../../packages/feathersjs-wxmp.socket.io-client';
import io from '../../../../packages/wxmp.socket.io-client';

const socketioInit = io('http://localhost:3030', {
  transports: ['websocket'],
  forceNew: true
});

const feathersClient = feathers();
feathersClient.configure(feathersSocketioClient(socketioInit, { timeout: 1000 * 20 }));

console.log('export feathersClient', feathersClient);
export default feathersClient;
