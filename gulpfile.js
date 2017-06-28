var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var prefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-minify-css');
var browserSync = require("browser-sync");
var reload = browserSync.reload;
var twig = require('gulp-twig');

var buildRoot = 'app/';
var srcRoot = 'src/';
var path = {
    src: {
        html: srcRoot + '*.twig',
        js: srcRoot + 'js/**/*.js',
        scss: srcRoot + 'scss/styles.scss'
    },
    build: {
        html: buildRoot,
        js: buildRoot + 'js/',
        css: buildRoot + 'css/'
    },
    watch: {
        html: srcRoot + '**/*.twig',
        js: srcRoot + 'js/**/*.js',
        scss: srcRoot + 'scss/**/*.scss'
    }
};

var config = {
    server: {
        baseDir: buildRoot
    },
    // proxy: 'localhost:8080',
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

gulp.task('html', function () {
    return reload({ stream: true });
    // gulp.src(path.src.html) //Выберем файлы по нужному пути
    //     .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
    //     .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('compile', function () {
    return gulp.src(path.src.html)
        .pipe(twig())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({ stream: true })); //И перезагрузим сервер
});

gulp.task('js', function () {
    return gulp.src(path.src.js)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({ stream: true })); //И перезагрузим сервер
});

gulp.task('scss', function () {
    return gulp.src(path.src.scss)
        .pipe(sass({
            // outputStyle: 'compressed',
            includePaths: ['node_modules/susy/sass']
        }))
        // .pipe(prefixer())
        // .pipe(cssmin())
        // .on('error', gutil.log)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({ stream: true })); //И перезагрузим сервер
});

gulp.task('watch', function () {
    watch([path.watch.html], function (event, cb) {
        gulp.start('compile');
    });
    watch([path.watch.scss], function (event, cb) {
        gulp.start('scss');
    });
    watch([path.watch.js], function (event, cb) {
        gulp.start('js');
    });
});

gulp.task('build', [
    // 'html',
    'compile',
    'js',
    'scss'
]);

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('default', [
    'build',
    'webserver',
    'watch'
]);
