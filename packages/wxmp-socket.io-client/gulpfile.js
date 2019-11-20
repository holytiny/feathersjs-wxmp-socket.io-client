const gulp = require('gulp');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const webpack = require('webpack-stream');
const child = require('child_process');
const eslint = require('gulp-eslint');
const del = require('del');

// //////////////////////////////////////
// BUILDING
// //////////////////////////////////////

const BUILD_TARGET_DIR = './dist/';
// gulp.task('build', function () {
//   return gulp.src('lib/*.js')
//     .pipe(webpack({
//       config: [
//         require('./support/webpack.config.js'),
//         require('./support/webpack.config.dev.js'),
//         require('./support/webpack.config.slim.js'),
//         require('./support/webpack.config.slim.dev.js')
//       ]
//     }))
//     .pipe(gulp.dest(BUILD_TARGET_DIR));
// });
const build = gulp.series(clean, () => {
  return gulp.src('lib/*.js')
    .pipe(webpack({
      config: [
        require('./support/webpack.config.js'),
        require('./support/webpack.config.dev.js'),
        require('./support/webpack.config.slim.js'),
        require('./support/webpack.config.slim.dev.js')
      ]
    }))
    .pipe(gulp.dest(BUILD_TARGET_DIR));
});
build.description = 'update the browser builds';

function clean () {
  return del([
    'dist/**'
  ]);
}
clean.description = 'remove all files in "dist" dir';

// //////////////////////////////////////
// TESTING
// //////////////////////////////////////

const REPORTER = 'dot';
const TEST_FILE = './test/index.js';
const TEST_SUPPORT_SERVER_FILE = './test/support/server.js';

// gulp.task('test', ['lint'], function () {
//   if (process.env.hasOwnProperty('BROWSERS')) {
//     return testZuul();
//   } else {
//     return testNode();
//   }
// });
const test = gulp.series(lint, () => {
  if (process.env.hasOwnProperty('BROWSERS')) {
    return testZuul();
  } else {
    return testNode();
  }
});
test.description = 'run tests either in the browser or in Node.js, based on the `BROWSERS` variable';

// gulp.task('lint', function () {
//   return gulp.src([
//     '*.js',
//     'lib/**/*.js',
//     'test/**/*.js',
//     'support/**/*.js'
//   ])
//     .pipe(eslint())
//     .pipe(eslint.format())
//     .pipe(eslint.failAfterError());
// });
function lint () {
  return gulp.src([
    '*.js',
    'lib/**/*.js',
    'test/**/*.js',
    'support/**/*.js'
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

// runs zuul through shell process
function testZuul () {
  const ZUUL_CMD = './node_modules/zuul/bin/zuul';
  const zuulChild = child.spawn(ZUUL_CMD, [TEST_FILE], { stdio: 'inherit' });
  zuulChild.on('exit', function (code) { process.exit(code); });
  return zuulChild;
}
testZuul.displayName = 'test:zuul';
testZuul.description = 'run tests in the browser';

function testNode () {
  const MOCHA_OPTS = {
    reporter: REPORTER,
    require: [TEST_SUPPORT_SERVER_FILE],
    bail: true
  };
  return gulp.src(TEST_FILE, { read: false })
    .pipe(mocha(MOCHA_OPTS))
    // following lines to fix gulp-mocha not terminating (see gulp-mocha webpage)
    .once('error', function (err) {
      console.error(err.stack);
      process.exit(1);
    })
    .once('end', function () {
      process.exit();
    });
}
testNode.displayName = 'test:node';
testNode.description = 'run tests in Node.js';

// gulp.task('istanbul-pre-test', function () {
//   return gulp.src(['lib/**/*.js'])
//     // Covering files
//     .pipe(istanbul())
//     // Force `require` to return covered files
//     .pipe(istanbul.hookRequire());
// });
function instanbulPreTest () {
  return gulp.src(['lib/**/*.js'])
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
}

// gulp.task('test-cov', ['istanbul-pre-test'], function () {
//   gulp.src(['test/*.js', 'test/support/*.js'])
//     .pipe(mocha({
//       reporter: REPORTER
//     }))
//     .pipe(istanbul.writeReports())
//     .once('error', function (err) {
//       console.error(err);
//       process.exit(1);
//     })
//     .once('end', function () {
//       process.exit();
//     });
// });
const testCov = gulp.series(instanbulPreTest, () => {
  gulp.src(['test/*.js', 'test/support/*.js'])
  .pipe(mocha({
    reporter: REPORTER
  }))
  .pipe(istanbul.writeReports())
  .once('error', function (err) {
    console.error(err);
    process.exit(1);
  })
  .once('end', function () {
    process.exit();
  });
});
testCov.displayName = 'test:cov';
testCov.description = 'run tests with coverage in Node.js';

// //////////////////////////////////////
// TASKS
// //////////////////////////////////////
exports.default = build;
exports.build = build;
exports.clean = clean;
exports.lint = lint;
exports.test = test;
exports.testNode = testNode;
exports.testZuul = testZuul;
exports.testCov = testCov;
