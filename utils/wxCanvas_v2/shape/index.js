import Polygon from './Polygon.js';
import Rect from './Rect.js';
import Circle from './Circle.js';
import Ellipse from './Ellipse.js';
import Text from './Text.js';
import Image from './Image.js';

import Gesture from '../gesture.js';
import Common from '../common.js';

const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'; // GUID格式

class Shape {
  constructor(type, opts) {
    let _t = this;

    _t.type = type || "";

    _t.width = opts.width || 100;
    _t.height = opts.height || 100;

    _t.r = opts.r || 40;

    _t.sides = opts.sides || 3;

    _t.imageUrl = opts.imageUrl || '';

    _t.text = opts.text;

    _t.pos = {
      tx: opts.pos.tx || 0,
      ty: opts.pos.ty || 0,
      scale: opts.pos.scale || 1,
      rotate: opts.pos.rotate || 0
    };

    _t.params = opts.params || {};

    _t.zIndex = 0; //当前图层层级

    _t.isSelected = false; //是否被选中

    let {guid, shape, gesture} = _t.init({
      width: _t.width,
      height: _t.height,
      imageUrl: _t.imageUrl,
      r: _t.r,
      sides: _t.sides,
      pos: _t.pos,
      params: _t.params,
      isSelected: _t.isSelected
    });

    _t.shape = shape;
    _t.gesture = gesture;
    _t.guid = guid; //全局唯一guid
  }

  //初始化几何图形
  init(opts) {
    let Handle = null;

    switch (this.type) {
      case "Rect":
        Handle = Rect;
        break;
      case "Polygon":
        Handle = Polygon;
        break;
      case "Circle":
        Handle = Circle;
        break;
      case "Ellipse":
        Handle = Ellipse;
        break;
      case "Text":
        Handle = Text;
        break;
      case "Image":
        Handle = Image;
        break;
      default:
        throw Error("error: this type is no open!");
    }

    return {
      guid: this.getGuid(),
      shape: new Handle(opts),
      gesture: new Gesture({weightsAndMeasures: 'radius'})
    }
  }

  //随机获取全局guid
  getGuid() {
    return guid.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : r & 0x3 | 0x8;

      return v.toString(16);
    });
  }

  //设置图层层级
  setZIndex(zIndex) {
    this.zIndex = zIndex;
  }

  //设置图形选中状态
  setSelected(flag) {
    this.isSelected = flag;

    this.shape.setSelected(flag);
  }

  //绘制
  draw(context) {
    this.shape.draw(context);
  }

  //边缘检测
  detect(location){
    let {realPoints, offset} = this.shape;
    return Common.detect(realPoints, offset, location);
  }

  start(e) {
    this.gesture.start(e);
  }

  move(e, callback) {
    let _t = this;

    _t.gesture.move(e, function (params) {
      _t.pos.tx += params.deltaX;
      _t.pos.ty += params.deltaY;
      _t.pos.scale *= params.scale;
      _t.pos.rotate += params.rotate;
      callback();
    })
  }

  end(e) {
    this.gesture.end(e);
  }

  cancel(e) {

  }

  update(){
    this.shape.update({pos: this.pos, isSelected: this.isSelected});
  }
}

export default Shape;