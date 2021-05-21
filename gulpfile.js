var gulp = require('gulp'),
    sass = require('gulp-sass'),
    scsslint = require('gulp-scss-lint'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCss = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    eslint = require('gulp-eslint'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    notify = require('gulp-notify');

var sassFiles = 'assets/css/scss/**/*.scss',
    cssFolder = 'assets/css/',
    jsFolder = 'assets/js';

// Linting scss style to write better
gulp.task('scss-lint', function(){
    return gulp.src(sassFiles)
    .pipe(scsslint({
        'config': 'lint.yml'
    }));
});    

//Compile scss files
gulp.task('styles', function(done){
    return gulp.src(sassFiles)
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer]))
        .pipe(cleanCss({compatibility: 'ie10'}))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(cssFolder))
        .pipe(notify({message: 'sass compiled successfully'}))
});

//Es liting js to write better
gulp.task('es-lint', function(){
    return gulp.src(['assets/js/*.js','!assets/js/*.min.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
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
    gulp.watch(sassFiles, gulp.series('scss-lint','styles'));
    gulp.watch(['assets/js/*.js','!assets/js/*.min.js'], gulp.series('es-lint','minify-js'));
});