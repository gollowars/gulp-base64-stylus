import path from 'path'
import fs from 'fs-extra'
import through from 'through2'
import sizeOf from 'image-size'
import base64Img from 'base64-img'
import gutil from 'gulp-util'

const IMAGE_KIND = ["png","jpeg","jpg","gif","svg"]

module.exports = function gulpBase64Stylus(option){
  let dir = null
  let stylusFlag = (option.sass != true)? true : false
  let extName = (stylusFlag == true)? "styl" : "sass"

  let detectImage = function (name,index){
    let flag = false
    for(let i=0;i<IMAGE_KIND.length;i++){
      if(name.indexOf("."+IMAGE_KIND[i]) != -1){
        flag = true
      }
    }
    return flag
  }

  let attachInfo = function (name,index){
    let absPath = path.join(dir,name)
    let dimensions = sizeOf(absPath)
    let w = dimensions.width
    let h = dimensions.height
    let retina = false
    let svgFlag = (name.indexOf('svg') !== -1)? true : false

    const quarityStrList = name.match(/@(.+)x./)

    if(quarityStrList !== null) {
      const quarityStr = quarityStrList[0]
      const quarity = parseInt(quarityStrList[1])
      retina = true
      w = w/quarity
      h = h/quarity
      name = name.replace(quarityStr,".")
    }

    let nameArray = name.split('.')
    let imageName = nameArray.slice(0,-1).join('.')
    let data = base64Img.base64Sync(absPath)
    // svg
    if(svgFlag && data.indexOf('data:image/svg;') !== -1) {
      data = data.replace('data:image/svg;','data:image/svg+xml;')
    }
    return {
      data: data,
      width: w,
      height: h,
      name: imageName
    }
  }

  let convertStylusStr = function(list){
    let str = ""
    for (var i = 0; i < list.length; i++) {
      let obj = list[i]
      let block = ""
      if(stylusFlag){
        block = `$${obj.name}()\n  width: ${obj.width}px\n  height: ${obj.height}px\n  background-image: url('${obj.data}')\n  background-size: 100% 100%\n`
      }else{
        block = `@mixin $${obj.name} {\n  width: ${obj.width}px;\n  height: ${obj.height}px;\n  background-image: url('${obj.data}');\n  background-size: 100% 100%;}\n`
      }
      str += block
    }
    return str
  }

  let main = function (file,enc,cb){
    dir = file.path
    let files = fs.readdirSync(dir)
    let imageDataList = files.filter(detectImage).map(attachInfo)
    let str = convertStylusStr(imageDataList)
    let fileName = (option.output != undefined)? option.output : "_image." + extName

    let newFile = new gutil.File({
      cwd: "",
      base: "",
      path: fileName,
      contents: new Buffer(str)
    })
    this.push(newFile)
    cb()
  }
  return through.obj(main)
}