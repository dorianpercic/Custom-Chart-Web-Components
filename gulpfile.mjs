import gulp from 'gulp';
import { exec } from 'child_process';

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

gulp.task('barchart-html-examples', async function () {
  return gulp
    .src('src/html/barchart-table.html')
    .pipe(gulp.dest('dist/barchart/esm/examples/html'));
});

gulp.task('css-barchart', async function () {
  return gulp
    .src('src/css/style.css')
    .pipe(gulp.dest('dist/barchart/esm/examples/html'));
});

gulp.task('css-linechart', async function () {
  return gulp
    .src('src/css/style.css')
    .pipe(gulp.dest('dist/linechart/esm/examples/html'));
});

gulp.task('linechart-html-examples', async function () {
  gulp
    .src([
      'src/html/linechart-dataseries.html',
      'src/html/multilinechart-dataseries.html',
      'src/html/multilinechart-table.html',
    ])
    .pipe(gulp.dest('dist/linechart/esm/examples/html'));
});

function rollup() {
  return Command.execute('rollup -c');
}

function serve() {
  return Command.execute('npm run serve');
}

// Default gulp task [npx gulp]
gulp.task(
  'default',
  gulp.series(
    'barchart-html-examples',
    'linechart-html-examples',
    'css-linechart',
    'css-barchart',
    rollup,
    serve
  )
);
