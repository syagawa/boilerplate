import gulp from 'gulp';

import webpackStream from "webpack-stream";
import webpack from "webpack";
import webpackConfig from "./webpack.config";

const notifier = require("node-notifier");

import browser from "browser-sync";
import plumber from "gulp-plumber";

import autoprefixer from "gulp-autoprefixer";

import pug from "gulp-pug";

import del from "del";

const paths = {
  styles: {
    src: 'src/styles/**/*.scss',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dist/js/'
  },
  pugs: {
    src: 'src/pug/**/*.pug',
    exclude: '!src/pug/**/_*.pug',
    dest: 'dist/'
  },
  dels: {
    jsincss: {
      src: "dist/css/**/*.js"
    }
  }
};

function errorHandler(error) {
  var message;
  if(error.message){
    message =  error.message;
  }else{
    message = error;
  }
  notifier.notify({
    title: 'Error occurred in gulp or Webpack processing.',
    wait: true,
    timeout: 30,
    message: message,
  }, function () {
    console.log(error);
  });
}

function webpackJSError(){
  errorHandler("Webpack Error : JS");
  this.emit("end");
}

function webpackCSSError(){
  errorHandler("Webpack Error : CSS / SCSS");
  this.emit("end");
}

function pugs(){
  return gulp.src([paths.pugs.src, paths.pugs.exclude])
    .pipe(pug())
    .pipe(gulp.dest(paths.pugs.dest));
}

function js2js(){
  return webpackStream(webpackConfig.js, webpack)
    .on('error', webpackJSError)
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browser.reload({stream:true}));
}

function sass2css(){
  return webpackStream(webpackConfig.css, webpack)
    .on("error", webpackCSSError)
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browser.reload({stream:true}));
}

function delfile(){
  return del([paths.dels.jsincss.src]);
}

function watch(){
  gulp.watch(paths.pugs.src, pugs);
  gulp.watch(paths.scripts.src, js2js);
  gulp.watch(paths.styles.src, sass2css);
  gulp.watch(paths.dels.jsincss.src, delfile);
}

function server(){
  return browser({
    server:{
      baseDir: "./dist/",
      index: "index.html"
    },
    port: 9000,
    browser: "chrome"
  });
}

const build = gulp.series(pugs, js2js, sass2css, delfile);
gulp.task('build', build);

const start = gulp.parallel( build, server, watch);
gulp.task("start", start);

export default start;
