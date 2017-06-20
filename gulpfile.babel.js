import path from 'path'
import gulp from 'gulp'
import stylus from 'gulp-stylus'
import convertBase64 from './index.js'

gulp.task('convert',function(){
  gulp.src('./test/images/')
    .pipe(convertBase64({output:'_image.styl',sass: false}))
    .pipe(gulp.dest(path.join(__dirname,'./test/style/')))
})

gulp.task('style',function(){
  return gulp.src([path.join(__dirname,'./test/style/**/*.styl'),"!"+path.join(__dirname,'./test/style/**/_*.styl')])
    .pipe(stylus())
    .pipe(gulp.dest(path.join(__dirname,'./test/dist/')))
})

gulp.task('default',['convert','style'])