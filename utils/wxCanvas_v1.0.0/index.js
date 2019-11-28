import ShapeProto from './src/shape/index.js';
import Common from './common.js';

const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'; // GUID格式

class Store {
  constructor() {
    this.store = [];
  }

  //添加几何实例
  add(shape) {
    if (!shape || !shape.guid) {
      throw Error("error: Shape has not id!");
    }

    this.store.push(shape);
  }

  //删除某个几何
  delete(shape) {
    if (!this.store.length) {
      return;
    }
    let deleteIndex = null;

    for (let i = 0, len = this.store.length; i < len; i++) {
      if (this.store[i].guid === shape.guid) {
        deleteIndex = i;
        break;
      }
    }

    if (deleteIndex !== null) {
      this.store.splice(deleteIndex, 1);
    }
  }

  //清空仓库
  clear() {
    this.store = [];
  }

  //获取仓库存储的几何图形数量
  getLength() {
    return this.store.length;
  }

  //根据全局guid查找几何,返回当前几何实例, 若找不到，返回默认empty字符串提示
  find(guid) {
    if (guid && this.store.length > 0) {
      let aim = this.store.filter(v => {
        return v.guid === guid
      })
      return aim.length ? aim[0] : 'empty';
      // return this.store[guid] || 'empty';
    }
    return 'empty';
  }

  getIndex(shape) {
    let idx = null;
    for (let i = 0, len = this.store.length; i < len; i++) {
      if (this.store[i].guid === shape.guid) {
        idx = i;
        break;
      }
    }

    return idx;
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

    _t.isTouch = false; //是否被选中

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

  //检测点是否在几何内,返回true表示在几何内，否则为几何外
  detect(location) {
    let flag = Common._detect(this.shape, location);

    return flag;
  }

  start(location) {
    this.isTouch = true;
    this.shape.getStartCoordinates(location);
  }

  move(location) {
    let flag = Common._detect(this.shape, location)

    if (this.isTouch && flag) {
      this.shape.move(location);
    }
  }

  end() {
    this.isTouch = false;
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

    _t.touchShapes = []; //存储当前被选中的几何

    //启动该配置将每次被点击的图层几何不能置于最高级别,默认为false
    _t.preserveObjectStacking = options.preserveObjectStacking || false;
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
  }

  //更新Canvas状态
  update() {
    let {store} = this.store; //存储图层几何仓库

    if (!store.length) {
      return;
    }

    //清除画布内容
    let {x, y, w, h} = this.options;
    this.canvas.clearRect(x, y, w, h);

    //重新绘制
    store.forEach((v, index) => {
      v.setZIndex(index + 1); //设置初始图层层级
      v._draw(this.canvas);
    });

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
  start(e) {
    let _t = this;
    let location = {x: e.touches[0].x, y: e.touches[0].y}; //指尖触摸坐标
    let {store} = this.store;
    let touchRender = [], activeGroupObj = [], activeObjs = [], selectObj = null;

    //检查是在某个图形几何有效区域内
    if (store.length > 0) {
      for (let i = 0, len = store.length; i < len; i++) {
        let item = store[i];
        let flag = item.detect(location);
        activeObjs.push(item);

        if (flag) {
          _t.touchShapes.push(item);
        }
      }

      //判断被选中的图形哪个优先级最高
      if (this.touchShapes.length > 1) {
        let shape = this.getMostHighShape(this.touchShapes);
        shape.start(location);
      } else if (this.touchShapes.length === 1) {
        selectObj = this.touchShapes[0];

        if (this.preserveObjectStacking) {
          selectObj.start(location);
          return;
        }

        let idx = this.store.getIndex(selectObj);

        store.splice(idx, 1);

        store.push(selectObj);

        this.update();

        selectObj.start(location);
      }
    }
  }

  //触摸事件移动
  move(e) {
    let location = {x: e.touches[0].x, y: e.touches[0].y}; //指尖触摸坐标
    let {store} = this.store;

    //检查是在某个图形几何有效区域内
    if (store.length > 0) {
      for (let key in store) {
        if (store.hasOwnProperty(key)) {
          store[key].move(location);
        }
      }
    }

    this.update();
  }

  //触摸事件结束
  end(e) {
    let {store} = this.store;

    if (store.length > 0) {
      store.forEach(v => {
        v.end();
      });
    }

    this.touchShapes = [];
  }

  //触摸事件注销
  cancel() {

  }

  //获取最高优先级的几何实例
  getMostHighShape(shapes) {
    let highZIndexShape = shapes[0];

    for (let i = 1, len = shapes.length; i < len; i++) {
      if (highZIndexShape.zIndex < shapes[i].zIndex) {
        highZIndexShape = shapes[i];
      }
    }

    return highZIndexShape;
  }
}

module.exports = {
  WxCanvas,
  Shape
};