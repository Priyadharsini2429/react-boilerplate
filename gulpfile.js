"use strict";

var gulp = require("gulp");
var connect = require("gulp-connect"); //Run a local dev server
var open = require("gulp-open"); //To fire up a web server to be able to see our application (Open a URL in a web browser)
var browserify = require("browserify"); //Bundles JS
var babelify = require("babelify"); // Transform React JSX to JS
var source = require("vinyl-source-stream"); //Use conventional text stream with Gulp
var concat = require("gulp-concat"); //Concatenates files

var config = {
  port: 5000,
  devBaseUrl: "http://localhost",
  paths: {
    html: "./src/*.html",
    js: "./src/**/*.js",
    css: ["./node_modules/bootstrap/dist/css/bootstrap.min.css"],
    mainJs: "./src/main.js",
    dist: "./dist"
  }
};

//Start a local development server
gulp.task("connect", function() {
  connect.server({
    root: ["dist"],
    port: config.port,
    base: config.devBaseUrl,
    livereload: true
  });
});

//Task to open a given file in the server
gulp.task("open", ["connect"], function() {
  gulp.src("./dist/index.html").pipe(
    open({
      uri: config.devBaseUrl + ":" + config.port + "/"
    })
  );
});

//Task to move the src files to dist folder
gulp.task("html", function() {
  gulp
    .src(config.paths.html)
    .pipe(gulp.dest(config.paths.dist))
    .pipe(connect.reload());
});

gulp.task("js", function() {
  browserify(config.paths.mainJs)
    .transform(babelify, {
      presets: ["@babel/preset-env", "@babel/preset-react"],
      global: true,
      ignore: ["./node_modules"]
    })
    .bundle()
    .on("error", console.error.bind(console))
    .pipe(source("bundle.js"))
    .pipe(gulp.dest(config.paths.dist + "/scripts"))
    .pipe(connect.reload());
});

gulp.task("css", function() {
  gulp
    .src(config.paths.css)
    .pipe(concat("bundle.css"))
    .pipe(gulp.dest(config.paths.dist + "/css"));
});

gulp.task("watch", function() {
  gulp.watch(config.paths.html, ["html"]);
  gulp.watch(config.paths.js, ["js"]);
});

gulp.task("default", ["html", "css", "js", "open", "watch"]);
