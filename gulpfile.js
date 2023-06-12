const gulp = require('gulp');
const path = require('path');
const { exec } = require('child_process');

let Command = {
  execute: (command) => {
    const process = exec(command);
    process.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    process.stderr.on('data', (data) => {
      console.log(data.toString());
    });
    process.on('exit', (code) => {
      console.log('Process exited with code ' + code.toString());
    });
    return process;
  },
};

gulp.task('d3-barchart', async function () {
  return gulp
    .src(path.join('src', 'libs', 'd3.min.js'))
    .pipe(gulp.dest(path.join('dist', 'barchart', 'libs')));
});

gulp.task('d3-linechart', async function () {
  return gulp
    .src(path.join('src', 'libs', 'd3.min.js'))
    .pipe(gulp.dest(path.join('dist', 'linechart', 'libs')));
});

function rollup() {
  return Command.execute('rollup -c');
}

gulp.task('watch', function () {
  gulp.watch('src/**/*', gulp.series(rollup));
});

gulp.task(
  'default',
  gulp.series('d3-barchart', 'd3-linechart', rollup, 'watch')
);
