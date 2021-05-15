var gulp = require('gulp'),
    sass = require('gulp-sass'),
    scsslint = require('gulp-scss-lint'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCss = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    notify = require('gulp-notify');

var sassFiles = 'assets/css/scss/**/*.scss',
    cssFolder = 'assets/css/',
    jsFolder = 'assets/js';

//Compile scss files
gulp.task('styles', function(done){
    return gulp.src(sassFiles)
        .pipe(scsslint())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer]))
        .pipe(cleanCss({compatibility: 'ie10'}))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(cssFolder))
        .pipe(notify({message: 'sass compiled successfully'}))
});

//Minification javascript
gulp.task('minify-js', function () {
    return gulp.src(['assets/js/*.js','!assets/js/*.min.js'])
        .pipe(rename({ extname: '.min.js' }))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(jsFolder))
        .pipe(notify({message: 'js compiled successfully'}))
});

//Default task
gulp.task('default', function(){
    gulp.watch(sassFiles, gulp.series('styles'));
    gulp.watch(['assets/js/*.js','!assets/js/*.min.js'], gulp.series('minify-js'));
});