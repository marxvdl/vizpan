const { src, dest, series, parallel, watch } = require('gulp');
const del = require("del");
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const terser = require('gulp-terser');
const maps = require('gulp-sourcemaps');
const rename = require("gulp-rename");
const filter = require('gulp-filter');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

function compileTS() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(dest('tmp'));
}

function main() {
    return src(
        [
            'node_modules/easypz/easypz.js',
            'node_modules/fabric/dist/fabric.js',
            'tmp/lib/vizpan.js',
            'tmp/lib/components.js'
        ],
    )
        .pipe(maps.init())

        .pipe(concat('vizpan.js'))
        .pipe(maps.write('./'))
        .pipe(dest('dist/'))

        .pipe(filter('**/*.js'))
        .pipe(terser())
        .pipe(rename({ suffix: '.min' }))
        .pipe(maps.write('./'))
        .pipe(dest('dist/'));
}

function demo() {
    return src(['src/demo/demo.html', 'tmp/demo/demo.js'])
        .pipe(dest('dist/'));
}

function clean() {
    return del(['tmp', 'dist']);
}

function runBrowser() {
    browserSync.init({
        server: {
            baseDir: 'dist',
            index: 'demo.html'
        }
    });
};

function reloadBrowser(cb) {
    browserSync.reload();
    cb();
}

function doWatch() {
    watch('src/*.js',
        series(main, reloadBrowser)
    );

    watch('src/*.ts',
        series(compileTS, main, reloadBrowser)
    );
}

exports.ts = compileTS;
exports.clean = clean;
exports.demo = demo;
exports.build = series(compileTS, main, demo);
exports.default = series(compileTS, main, demo, parallel(runBrowser, doWatch));