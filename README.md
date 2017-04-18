# gulp-base64-stylus

gulp-base64-stylus is gulp plugin that convert image file into base64 stylus (or sass)


## install
```
npm install gulp-base64-stylus --save
```

## prepare
put all image in dir  
```
.
├── src ├── images
            ├── sample1@2x.png
            ├── sample2@2x.jpg
            ├── sample3@2x.png
```

## gulp task
```
gulp.task('convert',function(){
  gulp.src('./src/images/')
    .pipe(convertBase64({output:'_image.styl',sass: false}))
    .pipe(gulp.dest(path.join(__dirname,'./src/style/')))
})
```

## use on stylus
```
@import "./_image.styl"

.sample-class
  $sample1()
```


## for retina
```
sample_image.png // normal image size
sample_image@2x.png // retina image size
```