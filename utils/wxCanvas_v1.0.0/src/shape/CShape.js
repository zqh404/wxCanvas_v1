import Common from '../../common.js';

class CShape{
  constructor(options, guid){
    let _t = this;

    _t.guid = guid;

    /**
     * 自定义图像存储多个points点，并将点进行连接绘制
     */
    _t.options = Common._extends(Common.commonParams(), options || {});

    _t.realPoints = [];

    _t.defaultColor = "black";
  }

  getRealPoints(){
    let {points} = this.options;

    return points;
  }

  _draw(context){
    let points = this.getRealPoints();

    this.createPath(context, points);
  }

  createPath(context, points){
    context.save();
    context.beginPath();

    context.moveTo(points[0][0],points[0][1]);
    for(let i = 0, len = points.length; i < len; i++){
      context.lineTo(points[i][0], points[i][1]);
    }

    context.closePath();


    //填充色
    if (this.options.fillMode === "fill") {
      context.setFillStyle(this.options.fillColor || this.defaultColor);
      context.fill();
    }

    //边框色
    context.setStrokeStyle(this.options.strokeColor || this.defaultColor);
    context.stroke();

    //设置边框宽度
    context.setLineWidth(this.options.lineWidth);

    //设置不透明度
    context.setGlobalAlpha(this.options.opacity);

    context.restore();
    // context.draw();
  }
}

export default CShape;