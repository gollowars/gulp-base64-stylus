'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _imageSize = require('image-size');

var _imageSize2 = _interopRequireDefault(_imageSize);

var _base64Img = require('base64-img');

var _base64Img2 = _interopRequireDefault(_base64Img);

var _gulpUtil = require('gulp-util');

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IMAGE_KIND = ["png", "jpeg", "jpg", "gif"];

module.exports = function gulpBase64Stylus(option) {
  var dir = null;
  var stylusFlag = option.sass != true ? true : false;
  var extName = stylusFlag == true ? "styl" : "sass";

  var detectImage = function detectImage(name, index) {
    var flag = false;
    for (var i = 0; i < IMAGE_KIND.length; i++) {
      if (name.indexOf("." + IMAGE_KIND[i]) != -1) {
        flag = true;
      }
    }
    return flag;
  };

  var attachInfo = function attachInfo(name, index) {
    var absPath = _path2.default.join(dir, name);
    var dimensions = (0, _imageSize2.default)(absPath);
    var w = dimensions.width;
    var h = dimensions.height;
    var retina = false;
    if (name.indexOf("@2x.") != -1) {
      retina = true;
      w = w / 2;
      h = h / 2;
      name = name.replace("@2x.", ".");
    }

    if (name.indexOf("@3x.") != -1) {
      retina = true;
      w = w / 3;
      h = h / 3;
      name = name.replace("@3x.", ".");
    }

    var nameArray = name.split('.');
    var imageName = nameArray.slice(0, -1).join('.');

    var data = _base64Img2.default.base64Sync(absPath);

    return {
      data: data,
      width: w,
      height: h,
      name: imageName
    };
  };

  var convertStylusStr = function convertStylusStr(list) {
    var str = "";
    for (var i = 0; i < list.length; i++) {
      var obj = list[i];
      var block = "";
      if (stylusFlag) {
        block = '$' + obj.name + '()\n  width: ' + obj.width + 'px\n  height: ' + obj.height + 'px\n  background-image: url(\'' + obj.data + '\')\n  background-size: 100% 100%\n';
      } else {
        block = '@mixin $' + obj.name + ' {\n  width: ' + obj.width + 'px;\n  height: ' + obj.height + 'px;\n  background-image: url(\'' + obj.data + '\');\n  background-size: 100% 100%;}\n';
      }
      str += block;
    }
    return str;
  };

  var main = function main(file, enc, cb) {
    dir = file.path;
    var files = _fsExtra2.default.readdirSync(dir);
    var imageDataList = files.filter(detectImage).map(attachInfo);
    var str = convertStylusStr(imageDataList);
    var fileName = option.output != undefined ? option.output : "_image." + extName;

    var newFile = new _gulpUtil2.default.File({
      cwd: "",
      base: "",
      path: fileName,
      contents: new Buffer(str)
    });
    this.push(newFile);
    cb();
  };
  return _through2.default.obj(main);
};
