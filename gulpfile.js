const { src, dest, series, parallel, watch } = require('gulp');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const terser = require('gulp-terser');
const maps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

function compileTS() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(dest('tmp'));
}


function main(cb) {
    return src(
        [
            'node_modules/easypz/easypz.js',
            'node_modules/fabric/dist/fabric.js',
            'tmp/components.js',
            'tmp/vizpan.js',            
            'tmp/main.js'            
        ],
    )
        .pipe(maps.init())
        .pipe(concat('vizpan.js'))
        // .pipe(terser())
        .pipe(maps.write('./'))
        .pipe(dest('dist/'));
}

function runBrowser() {
    browserSync.init({
        server: {
            baseDir: "./"
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
exports.default = series(compileTS, main, parallel(runBrowser, doWatch));