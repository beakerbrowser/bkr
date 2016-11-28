// Packages
import gulp from 'gulp'
import del from 'del'
import babel from 'gulp-babel'
import help from 'gulp-task-listing'
import {crop as cropExt} from 'gulp-ext'
import chmod from 'gulp-chmod'

gulp.task('help', help)

gulp.task('compile', () =>
  gulp.src('bin/*')
  .pipe(babel())
  .pipe(cropExt())
  .pipe(chmod(0o755))
  .pipe(gulp.dest('build/bin')))

gulp.task('watch', () => gulp.watch(['bin/*', 'lib/**/*.js'], ['compile']))

gulp.task('clean', () => del(['build']))

gulp.task('default', ['compile', 'watch'])