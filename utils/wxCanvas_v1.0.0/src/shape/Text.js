import Common from '../../common.js';

class Text {
  constructor(options, guid) {
    let _t = this;

    _t.guid = guid;

    /**
     * 自定义文字
     * x - 文字左上角x坐标
     * y - 文字左上y坐标
     * text - 文字内容
     * fontSize - 字体大小
     * rotate - 文字旋转角度
     * align - 文字位置
     * textBaseline -
     * isShadow - 是否加阴影效果，默认为false
     */
    _t.options = Common._extends({
      x: 0,
      y: 0,
      text: "Hello World",
      fillColor: "#0CA5B0",
      fontSize: 12,
      rotate: 0,
      align: "center",
      textBaseline: "middle",
      isShadow: false,
    }, Common.commonParams(), options || {});

    //默认阴影参数
    _t.shadowConfig = {
      offsetX: 5,
      offsetY: 5,
      blur: 5,
      color: "#000000"
    }

    _t.realPoints = [];

    _t.defaultColor = "black";

    _t.translate = {x: 0, y: 0}; //位移坐标

    _t.offset = {
      minX: null,
      minY: null,
      maxX: null,
      maxY: null
    }

    _t.regxStr = /[\u4e00-\u9fa5]/; //中文编码范围
  }

  //检查参数类似是否合法
  check() {
    let {text} = this.options;

    if (typeof text !== "string") {
      throw Error("error: text must be string type!");
    }
  }

  getRealPoints() {
    let {x, y, text, fontSize} = this.options;
    let points = []; //存储文字四边的坐标
    let len = text.length; //文字长度
    let w = 0, h = fontSize;

    //计算文字盒子的长宽
    for (let i = 0; i < len; i++) {
      let item = text[i];
      if (this.regxStr.test(item)) {
        w += fontSize;
      } else {
        w += fontSize / 2;
      }
    }

    points.push([x - w / 2, y - h / 2]);
    points.push([x - w / 2, y + h / 2]);
    points.push([x + w / 2, y + h / 2]);
    points.push([x + w / 2, y - h / 2]);

    return points;
  }

  _draw(context) {
    this.realPoints = this.getRealPoints();
    this.getRange();
    this.createPath(context);
  }

  createPath(context) {
    context.save();

    let {x, y, text, fontSize, isShadow, fillMode, align, fillColor, textBaseline} = this.options;

    //设置字体大小
    context.setFontSize(fontSize);

    //设置字体颜色
    context.setFillStyle(fillColor || this.defaultColor);
    context.fill();

    //设置文字对齐方式
    context.setTextAlign(align);

    //设置文字竖直对齐方式
    context.setTextBaseline(textBaseline);

    context.fillText(text, x, y);

    // if(isShadow){
    //   let {offsetX, offsetY, blur, color} = this.shadowConfig;
    //   context.setShadow(offsetX, offsetY, blur, color);
    // }

    context.restore();

  }

  baseline(type, value) {
    return {
      "normal": 2,
      "bottom": -value / 2,
      "middle": 0,
      "top": value / 2
    }[type]
  }

  align(type, value) {
    return {
      "left": value / 2,
      "center": 0,
      "right": -value / 2
    }[type]
  }

  getRange() {
    let options = this.realPoints;
    let {minX, minY, maxX, maxY} = Common.geRange(options);

    this.offset.minX = minX;
    this.offset.minY = minY;
    this.offset.maxX = maxX;
    this.offset.maxY = maxY;
  }

  //记录开始坐标
  getStartCoordinates(location){
    let {x, y} = this.options;
    this.translate.x = x - location.x;
    this.translate.y = y - location.y;
  }

  //移动
  move(location){
    this.options.x = location.x + this.translate.x;
    this.options.y = location.y + this.translate.y;
  }
}

export default Text;