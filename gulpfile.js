let source_folder = "#src";
let project_folder = "dist";

let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        json: project_folder + "/json/"
    },
    src: {
        html: source_folder + "/*.html",
        css: [source_folder + "/scss/**/*.scss", "!" + source_folder + "/scss/**/_*.scss"],
        js: [source_folder + "/js/**/*.js", "!" + source_folder + "/js/_*.js"],
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        json: source_folder + "/json/*.json"
    },
    watch: {
        html: source_folder + "/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        json: source_folder + "/json/*.json"
    },
    clean: "./" + project_folder + "/"
}

let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    del = require('del'),
    rename = require('gulp-rename'),
    fileinclude = require('gulp-file-include'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    group_media = require('gulp-group-css-media-queries'),
    clean_css = require('gulp-clean-css'),
    uglify = require('gulp-uglify-es').default,
    imagemin = require('gulp-imagemin'),
	webp = require('gulp-webp'),
	webphtml = require('gulp-webp-html'),
	webpcss = require('gulp-webpcss'),
    jeditor = require('gulp-json-editor');

//npm install webp-converter@2.2.3 --save-dev

function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 4444,
        notify: false
    })
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
    .pipe(browsersync.stream())
        .pipe(scss({ outputStyle: "expanded" }))
        .pipe(group_media())
        .pipe(autoprefixer({
            grid: true,
            overrideBrowserslist: ["last 5 versions"],
            cascade: true
        }))
        .pipe(webpcss())
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(rename({ extname: ".min.css" }))
        .pipe(dest(path.build.css))
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({ extname: ".min.js" }))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function images() {
    return src(path.src.img)
        .pipe(webp({
            quality: 70
        }))
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true,
            optimizationLevel: 7
        }))
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function json() {
    return src(path.src.json)
        .pipe(jeditor({}))
        .pipe(dest(path.build.json))
        .pipe(browsersync.stream())
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
    gulp.watch([path.watch.json], json);
}

function clean() {
    return del(path.clean)
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, json));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.json = json;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
