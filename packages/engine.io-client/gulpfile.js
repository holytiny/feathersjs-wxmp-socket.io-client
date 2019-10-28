const gulp = require('gulp');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const webpack = require('webpack-stream');
const child = require('child_process');
const del = require('del');
const eslint = require('gulp-eslint');
// gulp.task('help', help);

// //////////////////////////////////////
// BUILDING
// //////////////////////////////////////

const BUILD_TARGET_DIR = './';

function build () {
  return gulp.src('lib/**/*.js')
    .pipe(webpack(require('./support/webpack.config.js')))
    .pipe(gulp.dest(BUILD_TARGET_DIR));
}
build.description = 'update the browser build (engine.io.js)';

// gulp.task('default', ['build']);
//
// gulp.task('build', function () {
//   return gulp.src('lib/**/*.js')
//     .pipe(webpack(require('./support/webpack.config.js')))
//     .pipe(gulp.dest(BUILD_TARGET_DIR));
// });

// //////////////////////////////////////
// TESTING
// //////////////////////////////////////

const TEST_FILE = './test/index.js';
const MOCHA_OPTS = {
  reporter: 'dot',
  require: ['./test/support/server.js'],
  bail: true
};
const FILES_TO_CLEAN = [
  'test/support/public/engine.io.js'
];

const test = gulp.series(lint, () => {
  if (process.env.hasOwnProperty('BROWSERS')) {
    return testZuul();
  } else {
    return testNode();
  }
});
test.description = 'run tests either in the browser or in Node.js, based on the `BROWSERS` variable';

// gulp.task('test', ['lint'], function () {
//   if (process.env.hasOwnProperty('BROWSERS')) {
//     return testZuul();
//   } else {
//     return testNode();
//   }
// });

function lint () {
  return gulp.src([
    '*.js',
    'lib/**/*.js',
    'test/**/*.js',
    '!engine.io.js'
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

// gulp.task('lint', function () {
//   return gulp.src([
//     '*.js',
//     'lib/**/*.js',
//     'test/**/*.js',
//     '!engine.io.js'
//   ])
//     .pipe(eslint())
//     .pipe(eslint.format())
//     .pipe(eslint.failAfterError());
// });

// gulp.task('test-node', testNode);
// gulp.task('test-zuul', testZuul);

function testNode () {
  return gulp.src(TEST_FILE, { read: false })
    .pipe(mocha(MOCHA_OPTS))
    // following lines to fix gulp-mocha not terminating (see gulp-mocha webpage)
    .once('error', function (err) {
      console.error(err.stack);
      cleanFiles(FILES_TO_CLEAN);
      process.exit(1);
    })
    .once('end', function () {
      cleanFiles(FILES_TO_CLEAN);
      process.exit();
    });
}
testNode.displayName = 'test:node';
testNode.description = 'run tests in Node.js';

// runs zuul through shell process
function testZuul () {
  const ZUUL_CMD = './node_modules/zuul/bin/zuul';
  const zuulChild = child.spawn(ZUUL_CMD, [TEST_FILE], { stdio: 'inherit' });
  zuulChild.on('exit', function (code) {
    cleanFiles(FILES_TO_CLEAN);
    process.exit(code);
  });
}
testZuul.displayName = 'test:zuul';
testZuul.description = 'run tests in the browser';

function cleanFiles (globArray) {
  return del.sync(globArray);
}

function instanbulPreTest () {
  return gulp.src(['lib/**/*.js'])
  // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
}
// gulp.task('istanbul-pre-test', function () {
//   return gulp.src(['lib/**/*.js'])
//     // Covering files
//     .pipe(istanbul())
//     // Force `require` to return covered files
//     .pipe(istanbul.hookRequire());
// });

const testCov = gulp.series(instanbulPreTest, function () {
  return gulp.src(TEST_FILE)
    .pipe(mocha(MOCHA_OPTS))
    .pipe(istanbul.writeReports())
    .once('error', function (err) {
      cleanFiles(FILES_TO_CLEAN);
      console.error(err.stack);
      process.exit(1);
    })
    .once('end', function () {
      cleanFiles(FILES_TO_CLEAN);
      process.exit();
    });
});
testCov.displayName = 'test:cov';
testCov.description = 'run tests with coverage in Node.js';
// gulp.task('test-cov', ['istanbul-pre-test'], function () {
//   return gulp.src(TEST_FILE)
//     .pipe(mocha(MOCHA_OPTS))
//     .pipe(istanbul.writeReports())
//     .once('error', function (err) {
//       cleanFiles(FILES_TO_CLEAN);
//       console.error(err.stack);
//       process.exit(1);
//     })
//     .once('end', function () {
//       cleanFiles(FILES_TO_CLEAN);
//       process.exit();
//     });
// });

// //////////////////////////////////////
// TASKS
// //////////////////////////////////////
exports.default = build;
exports.build = build;
exports.lint = lint;
exports.test = test;
exports.testNode = testNode;
exports.testZuul = testZuul;
exports.testCov = testCov;
