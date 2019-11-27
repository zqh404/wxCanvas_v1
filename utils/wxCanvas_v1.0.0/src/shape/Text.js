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
  }

  //检查参数类似是否合法
  check(){
    let {text} = this.options;

    if(typeof text !== "string"){
      throw Error("error: text must be string type!");
    }
  }

  getRealPoints(){

  }

  _draw(context){
    this.createPath(context);
  }

  createPath(context){
    context.save();

    let {x, y, text, fontSize, isShadow, fillMode, align, fillColor, textBaseline} = this.options;

    //设置字体大小
    context.setFontSize(fontSize);

    //设置字体颜色
    context.setFillStyle(fillColor|| this.defaultColor);
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


}

export default Text;