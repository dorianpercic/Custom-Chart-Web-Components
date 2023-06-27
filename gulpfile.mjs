import gulp from 'gulp';
import { exec } from 'child_process';

// Helper function for executing terminal commands
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

function rollup() {
  return Command.execute('rollup -c');
}

function serve() {
  return Command.execute('npm run serve');
}

gulp.task('copy-linechart', async function () {
  gulp
    .src('src/examples/linechart/**/*')
    .pipe(gulp.dest('dist/linechart/examples'));
});

gulp.task('copy-barchart', async function () {
  gulp
    .src('src/examples/barchart/**/*')
    .pipe(gulp.dest('dist/barchart/examples'));
});

gulp.task('copy-multilinechart', async function () {
  gulp
    .src('src/examples/multilinechart/**/*')
    .pipe(gulp.dest('dist/multilinechart/examples'));
});

// Default gulp task [npx gulp]
gulp.task(
  'default',
  gulp.series(
    'copy-linechart',
    'copy-barchart',
    'copy-multilinechart',
    rollup,
    serve
  )
);
