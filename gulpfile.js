var gulp = require('gulp');
var gulpWatch = require('gulp-watch');
var del = require('del');
var runSequence = require('run-sequence');
var webpack = require('webpack');
var webpackConfig = require('./webpack-ionic.config.js');
var argv = process.argv;

/**
 * Ionic Gulp tasks, for more information on each see
 * https://github.com/driftyco/ionic-gulp-tasks
 *
 * Using these will allow you to stay up to date if the default Ionic 2 build
 * changes, but you are of course welcome (and encouraged) to customize your
 * build however you see fit.
 */
var isRelease = false;
if (argv.indexOf('--release') > -1) {
  isRelease = true;
  process.env.NODE_ENV = 'production';
}
var shouldWatch = argv.indexOf('-l') > -1 || argv.indexOf('--livereload') > -1;

gulp.task('lint', require('ionic-gulp-tslint'));
gulp.task('clean', function(){
  // return del('www/build');
});

/**
 * Ionic hooks
 * Add ':before' or ':after' to any Ionic project command name to run the specified
 * tasks before or after the command.
 */
//gulp.task('serve:before', ['watch']);
gulp.task('serve:before', ['build']);
gulp.task('emulate:before', ['build']);
gulp.task('deploy:before', ['build']);
gulp.task('build:before', ['build']);

// we want to 'watch' when livereloading
gulp.task('run:before', [shouldWatch ? 'watch' : 'build']);

/*
 *
 */
gulp.task('watch', [], function(done){
  var compiler = webpack(webpackConfig);

  compiler.watch({
    aggregateTimeout: 300
  }, function(err, stats) {
    if (err) {
      console.log('webpack', stats.toString({}));
    }
    done();
  });
});

/*
 *
 */
gulp.task('build', [], function(done){
  var compiler = webpack(webpackConfig);

  compiler.run(function(err, stats) {
    if (err) {
      console.log('webpack', stats.toString({}));
    }
    done();
  });
});

function fixConfigFile() {
  return es.map(function(file, cb) {
    var fileContent = file.contents.toString();

    var madameHost = 'localhost:3080';

    var hostSwitch = argv.indexOf('--host');
    if (hostSwitch > -1 && argv.length >= hostSwitch) {
      madameHost = argv[hostSwitch+1];
    }

    // determine if certain file contains certain lines...
    // if line is not found, insert the line.
    // optionally, delete some lines found in the file.

    // Replace _madameService
    fileContent = fileContent.replace(/private\s_madameService\s=\s'(.*)';/gi, "private _madameService = 'http://" + madameHost + "/';");

    // Replace _madameSocket
    fileContent = fileContent.replace(/private\s_madameSocket\s=\s'(.*)';/gi, "private _madameSocket = '" + madameHost + "';");

    // Replace isRelease
    fileContent = fileContent.replace(/private\s_isRelease\s=\s(.*);/gi, "private _isRelease = " + ((isRelease) ? 'true' : 'false') + ";")
    // update the vinyl file
    file.contents = new Buffer(fileContent);

    // send the updated file down the pipe
    cb(null, file);
  });
}

gulp.task('configs', function() {
  return gulp.src('./config.app.ts')
    .pipe(fixConfigFile())
    .pipe(gulp.dest('./'));
})
