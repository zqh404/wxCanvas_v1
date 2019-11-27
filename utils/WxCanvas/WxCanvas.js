/**
 * @param canavs对象
 * @param 原点x轴坐标
 * @param 原点y轴坐标
 * @param canvas对象宽
 * @param canavs对象高
*/
const Shape = require("../WxCanvas/modules/shape.js")
const EventBus = require("./modules/eventBus.js");
const Store = require("../WxCanvas/store.js");

function WxCanvas(canvas, x, y, w, h){
  var t = this;
  t.canvas = canvas;
  t.x = x;
  t.y = y;
  t.w = w;
  t.h = h; 

  this.bus = new EventBus();
  Shape.bus = this.bus;


  this.store = new Store();

}

WxCanvas.prototype = {
  /**
   * 添加模型
   * @param {Shape} 几何模型
   */
  add(shape){

  }
}

module.exports = {
  WxCanvas,
  Shape
};