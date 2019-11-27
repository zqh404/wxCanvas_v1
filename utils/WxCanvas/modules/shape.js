const Rect = require("./shape/rect.js");

/**
 * @param {String} 几何类型
 * @param {Object} 配置
 * @param {String} 填充类型(实体、边框)
 * @param {Boolean} 是否可拖拽
*/
function Shape(type, options, strokeOrfill = "fill", draggable = false) {
  var t = this;
  
  t.bus = null;

  t.type = type;
  t.shape = new shapeTypes[type](options);

  t._layerIndex = 0; //图层层级
  t._isChoosed = false; //是否选中

  t.eventStore = {}; //绑定默认事件

}


Shape.prototype = {
  //几何类型集合
  shapeTypes: {
    "Rect": function (options){
      return new Rect(options);
    }
  },
  
  //更新参数
  updateOptions(options) {
    if (!this.Shape.bus) {
      this.Shape.bus = this.bus;
    }

    this.shape.updateOptions(options);
  },

  //绘制
  paint() {

  }
}

module.exports = Shape;