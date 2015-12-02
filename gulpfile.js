/**
 * Created by Rodey on 2015/12/2.
 */

var gulp    = require('gulp'),
    watch   = require('gulp-watch'),
    gulpTsc = require('gulp-tsc');


gulp.task('build.ts', function(){

    gulp.src('ts/*.ts')
        .pipe(gulpTsc({
            sourceMap: true,
            outDir: 'assets/js/',
            out: 'music.js'
        }))
        .pipe(gulp.dest('assets/js'));

});

gulp.task('build.watch', function(){
     gulp.watch('ts/*.ts', ['build.ts']);
});

gulp.task('default', ['build.ts', 'build.watch']);