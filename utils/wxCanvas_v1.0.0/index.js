import ShapeProto from './src/shape/index.js';
import Common from './common.js';

const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'; // GUID格式

class Store {
  constructor() {
    this.store = {}; //使用对象存储，字典查询更快捷
    this.length = 0;
  }

  //添加几何实例
  add(shape) {
    if (!shape || !shape.guid) {
      throw Error("error: Shape has not id!");
    }

    this.store[shape.guid] = shape;

    this.length++;
  }

  //删除某个几何
  delete(shape) {
    if (this.store[shape.guid]) {
      delete this.store[shape.guid];

      if (this.length > 0) {
        this.length--;
      }
    }
  }

  //清空仓库
  clear() {
    this.store = {};
    this.length = 0;
  }

  //获取仓库存储的几何图形数量
  getLength() {
    return this.length;
  }

  //根据全局guid查找几何,返回当前几何实例, 若找不到，返回默认empty字符串提示
  find(guid) {
    if (guid && this.length > 0) {
      return this.store[guid] || 'empty';
    }
    return 'empty';
  }
}

class EventBus {
  constructor() {
    //默认事件列表
    this.defaultEventList = {
      touchStart: function () {
      }, //触摸开始
      touchMove: function () {
      }, //触摸移动
      touchEnd: function () {
      }, //触摸结束
      touchCancel: function () {
      }, //触摸注销
      multipointStart: function () {
      }, //手势：双指点击开始
      multipointEnd: function () {
      }, //手势， 双指点击结束
      tap: function () {
      }, //手势， 点击
      doubleTap: function () {
      }, // 手势， 双击
      longTap: function () {
      }, // 手势， 长按
      singleTap: function () {
      }, // 手势， 单击
      rotate: function () {
      }, // 手势， 旋转
      pinch: function () {
      }, // 手势， 缩放 out  in
      pressMove: function () {
      },// 手势， 按住移动
      swipe: function () {
      },// 手势， 刷动
    }

    this.eventBus = {};
  }

  //初始化事件
  init() {
    var eventList = this.eventList;


  }

  //添加事件
  add(eventName, scope, isLocal) {

  }

  //删除事件
  delete(event, scope, isLocal) {

  }
}

class Shape {
  constructor(type, options) {
    var _t = this;

    _t.type = type;

    _t.options = options;

    _t.zIndex = 0 //当前图层的层级

    _t.eventBus = new EventBus();

    _t.guid = null;

    _t.shape = _t.init();

  }

  //全局唯一标识符，用于标识每一个几何实例
  getGuid() {
    return guid.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : r & 0x3 | 0x8;

      return v.toString(16);
    });
  }

  //初始化几何
  init() {
    var type = this.type, guid = this.getGuid(), options = this.options;
    this.guid = guid;

    switch (type) {
      //四边形
      case "rect":
        return new ShapeProto.Rect(options, guid);
      //圆
      case "circle":
        return new ShapeProto.Circle(options, guid);
      //椭圆
      case "ellipse":
        return new ShapeProto.Ellipse(options, guid);
      //多边形
      case "polygon":
        return new ShapeProto.Polygon(options, guid);
      //不规则图形
      case "cshape":
        return new ShapeProto.CShape(options, guid);
      case "line":
        return new ShapeProto.Line(options, guid);
      //文字
      case "text":
        return new ShapeProto.Text(options, guid);
      //图片
      case "img":
        return new ShapeProto.Img(options, guid);
      default:
        throw Error("error: this type is no open!");
    }
  }

  //绘制
  _draw(context) {
    this.shape._draw(context);
  }

  //更新几何
  update(options) {

  }

  //设置图层层级
  setZIndex(zIndex) {
    this.zIndex = zIndex;
  }

  //获取图层层级
  getZIndex() {
    return this.zIndex;
  }

  //获取当前图形类型
  getShapeType() {
    return this.type;
  }
  
  //检测点是否在几何内
  detect(location){
    let flag = Common._detect(this.shape, location);
    console.log(flag);
    // this.shape._detect(this.shape, location);
  }
}

/**
 *  注：
 *  1、out 对外方法
 *  2、in 对内方法
 */
class WxCanvas {
  constructor(canvas, options) {
    var _t = this;

    _t.canvas = canvas;

    _t.options = options || {
      x: 0, y: 0, w: 400, h: 500
    }

    _t.store = new Store(); //初始化仓库，用于存储当前Canvas实例所添加的Shape

    _t.checkStatus();
  }

  //检查状态
  checkStatus() {
    var _t = this;

    if (_t.canvas === undefined || !_t.canvas) {
      throw Error("canvas is no defined, please check it");
    }
  }

  //添加几何模型、文字、或图片
  add(shape) {
    this.store.add(shape);

    shape.setZIndex(this.store.length); //设置图层层级
  }

  //更新Canvas状态
  update() {
    let {length, store} = this.store; //存储图层几何仓库

    if (!length) {
      return;
    }

    for (let key in store) {
      if (store.hasOwnProperty(key)) {
        store[key]._draw(this.canvas);
      }
    }

    this.canvas.draw();
  }

  //移除指定Shape实例
  removeShape(shape) {
    this.store.delete(shape);
  }

  //清除Canvas所有内容
  clear() {
    this.canvas = null;
  }


  //获取Canvas实例（out）
  getCanvas() {
    return this.canvas;
  }

  //触摸事件开始
  touchStart(e){
    let location = {x: e.touches[0].x, y: e.touches[0].y}; //指尖触摸坐标
    let {store, length} = this.store;
    
    //检查是在某个图形几何有效区域内
    if(length > 0){
      for(let key in store){
        if(store.hasOwnProperty(key)){
          store[key].detect(location);
        }
      }
    }

  }

}

module.exports = {
  WxCanvas,
  Shape
};