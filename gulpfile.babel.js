// Packages
import gulp from 'gulp'
import del from 'del'
import babel from 'gulp-babel'
import help from 'gulp-task-listing'
import {crop as cropExt} from 'gulp-ext'
import chmod from 'gulp-chmod'

gulp.task('help', help)

gulp.task('compile', [
  'compile-lib',
  'compile-bin'
])
gulp.task('compile-lib', () =>
  gulp.src('lib/**/*.js')
  .pipe(babel())
  .pipe(gulp.dest('build/lib')))
gulp.task('compile-bin', () =>
  gulp.src('bin/*')
  .pipe(babel())
  .pipe(cropExt())
  .pipe(chmod(0o755))
  .pipe(gulp.dest('build/bin')))

gulp.task('watch-lib', () => gulp.watch('lib/**/*.js', ['compile-lib']))
gulp.task('watch-bin', () => gulp.watch('bin/*', ['compile-bin']))
gulp.task('watch', ['watch-lib', 'watch-bin'])

gulp.task('clean', () => del(['build']))

gulp.task('default', ['compile', 'watch'])