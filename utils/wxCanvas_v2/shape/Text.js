import Common from '../common.js';

class Text{
  constructor(opts){
    let _t = this;

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

    _t.pos = {
      tx: opts.pos.tx,
      ty: opts.pos.ty,
      scale: opts.pos.scale,
      rotate: opts.pos.rotate
    }

    _t.params = Common.extends(Common.commonParams(), opts.params, {
      fontSize: 12,
      align: "center",
      textBaseline: "middle",
      isShadow: false
    });

    _t.text = opts.text || "Hello World";

    //默认阴影参数
    _t.shadowConfig = {
      offsetX: 5,
      offsetY: 5,
      blur: 5,
      color: "#000000"
    };

    _t.realPoints = [];

    _t.defaultColor = "black";

    _t.offset = {
      minX: null,
      minY: null,
      maxX: null,
      maxY: null
    }

    _t.regxStr = /[\u4e00-\u9fa5]/; //中文编码范围

    _t.isSelected = opts.isSelected || false;

    _t.w = 0;

    _t.h = this.params.fontSize;
  }

  draw(context) {
    this.realPoints = this.getRealPoints();
    this.getRange();
    this.createPath(context, this.realPoints);
  }

  update(opts) {
    this.pos = {
      tx: opts.pos.tx,
      ty: opts.pos.ty,
      scale: opts.pos.scale,
      rotate: opts.pos.rotate,
    }
    this.isSelected = opts.isSelected;
  }

  getRealPoints() {
    let { tx, ty, scale, rotate } = this.pos;
    let text = this.text, fontSize = this.params.fontSize;

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

    w *= scale;
    h *= scale;

    this.w = w;
    this.h = h;

    points.push([tx - w / 2, ty - h / 2]);
    points.push([tx - w / 2, ty + h / 2]);
    points.push([tx + w / 2, ty + h / 2]);
    points.push([tx + w / 2, ty - h / 2]);

    return points;
  }

  createPath(context) {
    context.save();
    let {tx, ty, rotate, scale} = this.pos;
    let text = this.text;
    let { fontSize, isShadow, fillMode, align, fillColor, textBaseline} = this.params;

    //设置字体大小
    context.setFontSize(fontSize);

    //设置字体颜色
    context.setFillStyle(fillColor || this.defaultColor);
    context.fill();

    //设置文字对齐方式
    context.setTextAlign(align);

    //设置文字竖直对齐方式
    context.setTextBaseline(textBaseline);

    //旋转
    context.translate(tx, ty);
    context.rotate(rotate);
    context.translate(-tx, -ty);
     
    context.rect(tx - this.w / 2, ty - this.h / 2, this.w + 1, this.h + 1);

    //缩放
    context.translate(tx * (1 - scale), ty * (1 - scale));
    context.scale(scale, scale);

    context.fillText(text, tx, ty);

    //选中时的边框色
    if(this.isSelected){
      //设置变宽宽度
      context.setLineWidth(this.params.lineWidth);
      context.setStrokeStyle(this.isSelected ? this.params.selectedColor : this.params.fillColor || this.defaultColor);
      context.stroke();
    }

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
    let { minX, minY, maxX, maxY } = Common.geRange(options);

    this.offset.minX = minX;
    this.offset.minY = minY;
    this.offset.maxX = maxX;
    this.offset.maxY = maxY;
  }

  setSelected(flag) {
    this.isSelected = flag;
  }
}

export default Text;