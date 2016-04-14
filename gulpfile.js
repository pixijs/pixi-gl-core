var gulp = require('gulp');
var jshint = require('gulp-jshint');
var reporter = require('jshint-stylish');

gulp.task('test', function() {
    return gulp.src('lib/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(reporter))
});