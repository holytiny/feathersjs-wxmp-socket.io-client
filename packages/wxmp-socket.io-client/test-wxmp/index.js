const automator = require('miniprogram-automator')
const path = require('path');
const debug = require('debug')('wxmp-socket.io-client:test');

const cli = process.env.cli || '/Applications/wechatwebdevtools.app/Contents/MacOS/cli';
debug('cli: ', cli);
const projectPath = path.resolve(__dirname, 'wxmp');
debug('projectPath: ', projectPath);

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function startServer () {
  debug('start server!');
  const server = require('./test/support/server');
  // wait for server started.
  await sleep(2000);
  return server;
}

async function closeServer (server) {
  server.close();
  await sleep(2000);
  debug('close server!');
}

automator.launch({
  cliPath: cli,
  projectPath
}).then(async miniProgram => {
  console.log('Open mini program');
  const server = await startServer();
  await miniProgram.close();
  await closeServer(server);
}).catch(e => {
  console.log('Error: ', e);
});
