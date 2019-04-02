var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer');
var mainBowerFiles = require('gulp-main-bower-files');
var browserSync = require('browser-sync').create();
var minimist = require('minimist');



// gulp pug, sass --env develop | production
//gulp --env develop|production
var envOption = {
    string: 'env',
    default: { env: 'develop' }
}
var options = minimist(process.argv.slice(2), envOption)


$.sass.compiler = require('node-sass');

gulp.task('copyHTML', function() {
    return gulp.src('./source/**/*.html').pipe(plumber()).pipe(gulp.dest('./public/'))
})

gulp.task('pug', function buildHTML() {
    return gulp.src('./source/**/*.pug').pipe($.plumber())
    .pipe($.pug({
        pretty: true,
    })).pipe(gulp.dest('./public/'))
    .pipe(browserSync.reload({
        stream: true,
      }));
});

gulp.task('sass', function () {
    var processor = [
        autoprefixer({browsers: ['last 5 version', '> 5%']})
    ];
    return gulp.src('./source/sass/**/*.sass').pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe($.sass({
          outputStyle: 'nested',
          includePaths: ['./node_modules/bootstrap/scss']
      }).on('error', $.sass.logError))
      .pipe($.postcss(processor))
      .pipe($.if(options.env === 'production', $.cleanCss()))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('./public/css'))
      .pipe(browserSync.reload({
        stream: true,
      }));
});

gulp.task('babel', () =>
    gulp.src('./source/js/**/*.js')
        .pipe($.sourcemaps.init())
        .pipe($.concat('all.js'))
        .pipe($.babel({
            presets: ['@babel/env']
        }))
        .pipe($.if(options.env === 'production', $.uglify({
            compress: {
                drop_console: true, //移除console
            }
        })))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./public/js'))
        .pipe(browserSync.reload({
            stream: true,
        }))
);

gulp.task('vendorJS', function() {
    return gulp.src([
        './node_modules/jquery/dist/jquery.js',
        './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    ])
    .pipe($.concat('vendors.js'))
    .pipe($.if(options.env === 'production', $.uglify()))
    .pipe(gulp.dest('./public/js'))
})

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./public",
        },
        // open: false,
        browser: 'chrome',
        reloadDebounce: 2000, // 延遲秒數
    });
    // gulp.watch('./source/sass/**/*.sass', gulp.series('sass'));  //為了讓watch可以動貼到這裡
    // gulp.watch('./source/**/*.pug', gulp.series('pug'));  !!! 這是第二種方法 !!!
    // gulp.watch('./source/js/**/*.js', gulp.series('babel')); !!! 推薦請用 parallel !!!
});

gulp.task('image-min', () =>
	gulp.src('./source/images/*')
        .pipe($.if(options.env === 'production', $.imagemin()))
		.pipe(gulp.dest('./public/images'))
);

gulp.task('watch', function () {
    gulp.watch('./source/sass/**/*.sass', gulp.series('sass'));
    gulp.watch('./source/**/*.pug', gulp.series('pug'));
    gulp.watch('./source/js/**/*.js', gulp.series('babel'));
});

gulp.task('deploy', function() {
    return gulp.src('./public/**/*')
      .pipe($.ghPages());
});



gulp.task('default', gulp.parallel('pug', 'sass', 'babel', 'vendorJS', 'image-min', 'browser-sync', 'watch'));