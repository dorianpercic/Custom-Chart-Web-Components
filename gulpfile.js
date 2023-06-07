const gulp = require('gulp');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('transpile', function () {
  return gulp.src('src/**/*.ts')
    .pipe(tsProject())
    .pipe(gulp.dest('src/dist'));
});

gulp.task('default', gulp.series('transpile'));