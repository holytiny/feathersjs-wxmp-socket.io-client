const automator = require('miniprogram-automator')
const path = require('path');
const debug = require('debug')('wxmp-socket.io-client:test');

const cli = process.env.cli || '/Applications/wechatwebdevtools.app/Contents/MacOS/cli';
debug('cli: ', cli);
const projectPath = path.resolve(__dirname, '../wxmp');
debug('projectPath: ', projectPath);

const connectionTestCases = require('../wxmp/test-cases/connection.test');

function sleep (time) {
  return new Promise((resolve) => setTimeout(() => resolve(), time));
}

async function startServer () {
  debug('start server!');
  const server = require('../support/server');
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
  // debug('beforeAll miniProgram: ', miniProgram);
}, 60 * 1000);

afterAll(async () => {
  // debug('afterAll, miniProgram: ', miniProgram);
  await miniProgram.close();
  await closeServer(server);
}, 60 * 1000);

describe('connection', () => {
  // no async describe, so use beforeAll.
  // https://jestjs.io/docs/en/setup-teardown#scoping
  let page = null;
  beforeAll(async () => {
    const pageStack = await miniProgram.pageStack();
    page = pageStack[0];
    debug('page', page.path);
    // wait for all tests finished.
    const icons = await page.$$('icon');
    debug('iconsLength', icons.length);
    await page.waitFor(async () => {
      const icons = await page.$$('icon');
      return icons.length === connectionTestCases.length;
    });
  });

  for (let i = 0, length = connectionTestCases.length; i < length; ++i) {
    const testCase = connectionTestCases[i];
    test(testCase.description, async () => {
      const selectClass = `.test-res-${i}`;
      // debug('selectClass', selectClass);
      const icon = await page.$(selectClass);
      // debug('selected icon', icon);
      expect(await icon.attribute('type')).toBe('success_no_circle');
    });
  }
});
