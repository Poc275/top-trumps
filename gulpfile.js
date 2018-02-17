var gulp = require('gulp');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var all_tasks = ['lint', 'icons', 'images', 'textures', 'css', 'home', 'html', 'js', 'vendor'];

var path = {
    // HTML templates
    HOME: [
        'public/*.html'
    ],
    HTML: [
        'public/templates/*.html'
    ],
    // My JS Source Code
    JS: [
        'public/javascripts/*.js',
        'public/javascripts/**/*.js'
    ],
    ICO: [
        'public/icons/**'
    ],
    IMAGES: [
        'public/images/**'
    ],
    CSS: [
        'public/stylesheets/*.css',
        'node_modules/angular-material/angular-material.min.css'
    ],
    VR: [
        'public/textures/**'
    ],
    // vendor js/css, Angular etc.
    VENDOR: [
        'node_modules/crypto-js/crypto-js.js',
        'node_modules/angular/angular.min.js',
        'node_modules/angular-animate/angular-animate.min.js',
        'node_modules/angular-aria/angular-aria.min.js',
        'node_modules/angular-material/angular-material.min.js',
        'node_modules/angular-ui-router/release/angular-ui-router.min.js',
        'node_modules/angular-sanitize/angular-sanitize.min.js',
        'node_modules/angular-file-upload/dist/angular-file-upload.min.js',
        'node_modules/socket.io-client/dist/socket.io.min.js'
    ],
    DIST: [
        './dist'
    ]
};

// Clean up distribution directory
gulp.task('clean', function() {
    return gulp.src('./dist/*', { force: true })
        .pipe(clean());
});

// JSHint for code quality
gulp.task('lint', function() {
    return gulp.src(path.JS)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

// Copy over icons, images, textures, css and html
gulp.task('icons', function() {
    gulp.src(path.ICO)  
        .pipe(gulp.dest(path.DIST + '/icons'));
});

gulp.task('images', function() {
    gulp.src(path.IMAGES)  
        .pipe(gulp.dest(path.DIST + '/images'));
});

gulp.task('textures', function() {
    gulp.src(path.VR)  
        .pipe(gulp.dest(path.DIST + '/textures'));
});

gulp.task('css', function() {
    gulp.src(path.CSS)  
        .pipe(gulp.dest(path.DIST + '/stylesheets'));
});

gulp.task('home', function() {
    gulp.src(path.HOME)
        .pipe(gulp.dest(path.DIST + '/'));
});

gulp.task('html', function() {
    gulp.src(path.HTML)
        .pipe(gulp.dest(path.DIST + '/templates'));
});

// Merge, uglify and copy JS files
gulp.task('js', function() {
    gulp.src(path.JS)
        .pipe(sourcemaps.init())
            .pipe(concat('app.js'))
            .pipe(ngAnnotate())
            .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.DIST + '/js'));
});

gulp.task('vendor', function() {
    gulp.src(path.VENDOR)
        .pipe(concat('vendor.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest(path.DIST + '/js'));
});

gulp.task('default', all_tasks);