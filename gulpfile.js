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

gulp.task('linechart-examples', async function () {
  return gulp
    .src(path.join('src', 'html', 'linechart-dataseries.html'))
    .pipe(gulp.dest(path.join('dist', 'linechart', 'esm', 'examples')));
});

/*gulp.task('barchart-css', function () {
  return gulp
    .src(path.join('src', 'css', 'style.css'))
    .pipe(gulp.dest(path.join('dist', 'barchart', 'esm', 'examples', 'css')));
});*/

gulp.task('barchart-html-examples', async function () {
  return gulp
    .src(path.join('src', 'html', 'barchart-table.html'))
    .pipe(gulp.dest(path.join('dist', 'barchart', 'esm', 'examples', 'html')));
});

/*gulp.task('linechart-css', function () {
  return gulp
    .src(path.join('src', 'css', 'style.css'))
    .pipe(gulp.dest(path.join('dist', 'linechart', 'esm', 'examples', 'css')));
});*/

gulp.task('linechart-html-examples', async function () {
  return gulp
    .src(path.join('src', 'html', 'linechart-dataseries.html'))
    .pipe(gulp.dest(path.join('dist', 'linechart', 'esm', 'examples', 'html')));
});

function rollup() {
  return Command.execute('rollup -c');
}

gulp.task('watchRollup', function () {
  gulp.watch('src/**/*', gulp.series(rollup));
});

// Default gulp task [npx gulp]
gulp.task(
  'default',
  gulp.series(
    'd3-barchart',
    'd3-linechart',
    'barchart-html-examples',
    'linechart-html-examples',
    rollup
  )
);

// Watching changes, if detected -> reload rollup [npx gulp watch]
gulp.task(
  'watch',
  gulp.series(
    'd3-barchart',
    'd3-linechart',
    'barchart-html-examples',
    'linechart-examples',
    'watchRollup'
  )
);
