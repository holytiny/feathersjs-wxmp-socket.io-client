const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const server = require('./test/support/server');
const debug = require('debug')('wxmp-socket.io-client:test');

const cli = process.env.cli || '/Applications/wechatwebdevtools.app/Contents/MacOS/cli';

async function main () {
  debug('start wxmp test!');
  debug('cli: ', cli);
  const wxmpProjectPath = path.resolve(__dirname, 'wxmp');
  await openDevtools(cli, wxmpProjectPath);

  return 'Tests finished';
}

async function openDevtools (cli, wxmpProjectPath) {
  const cmd = `${cli} -o ${wxmpProjectPath}`;
  debug('exec :', cmd);
  try {
    const { stdout } = await exec(cmd);
    console.log('stdout:', stdout);
  } catch (e) {
    throw new Error(e);
  }
}

main()
  .then(r => {
    console.log('Result: ', r);
  })
  .catch(e => {
    console.log('An error occurred: ', e);
  });
