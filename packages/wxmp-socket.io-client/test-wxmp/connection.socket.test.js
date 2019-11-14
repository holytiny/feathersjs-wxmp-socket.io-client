const automator = require('miniprogram-automator')
const path = require('path');
const debug = require('debug')('wxmp-socket.io-client:test');

const cli = process.env.cli || '/Applications/wechatwebdevtools.app/Contents/MacOS/cli';
debug('cli: ', cli);
const projectPath = path.resolve(__dirname, 'wxmp');
debug('projectPath: ', projectPath);

function sleep (time) {
  return new Promise((resolve) => setTimeout(() => resolve(), time));
}

async function startServer () {
  debug('start server!');
  const server = require('./support/server');
  // wait for server started.
  await sleep(500);
  return server;
}

async function closeServer (server) {
  server.close();
  await sleep(500);
  debug('close server!');
}

let server = null;
let miniProgram = null;

beforeAll(async () => {
  server = await startServer();
  miniProgram = await automator.launch({
    cliPath: cli,
    projectPath
  });
  // debug('miniProgram: ', miniProgram);
}, 60 * 1000);

afterAll(async () => {
  await miniProgram.close();
  await closeServer(server);
}, 60 * 1000);

describe('connection', () => {
  debug('Start connection tests!');
  test('should connect to localhost', async () => {
    debug('connect to localhost');
  });
})
