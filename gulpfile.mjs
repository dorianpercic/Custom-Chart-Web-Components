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

// Execute rollup bundling
function rollup() {
  return Command.execute('rollup -c');
}

// Start local server for serving the project files
function serve() {
  return Command.execute('npm run serve');
}

// Copy examples folder from src/ to dist/
gulp.task('copy-examples', async function () {
  gulp.src('src/examples/**/*').pipe(gulp.dest('dist/examples'));
});

// Copy examples folder from src/ to dist/
gulp.task('copy-js', async function () {
  gulp
    .src('dist/easycharts.js')
    .pipe(gulp.dest('dist/examples/barchart'))
    .pipe(gulp.dest('dist/examples/linechart'))
    .pipe(gulp.dest('dist/examples/multilinechart'));
});

// Default gulp task [npx gulp]
gulp.task('default', gulp.series('copy-examples', rollup, 'copy-js', serve));
