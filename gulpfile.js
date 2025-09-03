const gulp = require('gulp');

gulp.task('build:icons', () => {
  // Copy node icons
  gulp.src('nodes/**/*.svg')
    .pipe(gulp.dest('dist/nodes'));
  
  // Copy credential icons (only root level SVGs, not subdirectories)
  return gulp.src('credentials/*.svg')
    .pipe(gulp.dest('dist/credentials'));
});
