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

gulp.task('copy-examples', async function () {
  gulp
    .src('src/examples/**/*')
    .pipe(gulp.dest('dist/examples'));
});

// Default gulp task [npx gulp]
gulp.task(
  'default',
  gulp.series(
    'copy-examples',
    rollup,
    serve
  )
);
