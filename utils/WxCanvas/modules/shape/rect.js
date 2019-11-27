'use strict';

const { _extends, _extendCover, updateOptions} = require("../../common.js");
const {commonAttribute} = require("../constant.js");
/**
 * 四方形模型对象
 * @param {Object} 
 * 
*/

function Rect(options){
  var t = this;
  var constantOpts = commonAttribute();
  var originOpts = _extends({ x: 10, y: 10, w: 10, h: 10 }, constantOpts);
  var aimOpts = _extendCover(options, originOpts);

  t.type = "Rect";
  t.option = aimOpts;
  t.point = null;
  t.detectPoint = null;
  t.dirty = true;
}

Rect.prototype = _extends({
  draw(context){
    if (this.dirty){
      var { point, detectPoint } = this.getOriginPoints();
      t.point = point;
      t.detectPoint = detectPoint;
    }
  },

  getOriginPoints(){
    var point = [], detectPoint = [];
    var { x, y, w, h, lineWidth} = this.option;
    
    //以 (x,y) 为几何中心， w、h为长宽维度，计算四边形四方坐标和加上检测边框坐标
    point1.push(x - w /2, y - h /2);
    point1.push(x - w / 2, y + h / 2);
    point1.push(x + w / 2, y - h / 2);
    point1.push(x + w / 2, y + h / 2);

    detectPoint.push(x - w / 2 - lineWidth / 2, y - h / 2 - lineWidth / 2);
    detectPoint.push(x - w / 2 - lineWidth / 2, y + h / 2 + lineWidth / 2);
    detectPoint.push(x + w / 2 + lineWidth / 2, y - h / 2 - lineWidth / 2);
    detectPoint.push(x + w / 2 + lineWidth / 2, y + h / 2 + lineWidth / 2);

    return {point, detectPoint};
  }
}, updateOptions)


module.export = Rect;