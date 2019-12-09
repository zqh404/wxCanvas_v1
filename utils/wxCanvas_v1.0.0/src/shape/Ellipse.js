import Common from '../../common.js';

class Ellipse {
  constructor(options, guid) {
    let _t = this;

    _t.guid = guid;

    /**
     * x - 椭圆心x轴
     * y - 椭圆心y轴
     * a - 椭圆水平长轴
     * b - 椭圆垂直长轴
     */
    _t.options = Common._extends({
      x: 0,
      y: 0,
      a: 100,
      b: 50,
    }, Common.commonParams(), options || {});

    _t.defaultColor = "black";

    _t.realPoints = []; //真实点

    _t.pointsNumber = 100;

    _t.translate = {x: 0, y: 0}; //位移坐标

    _t.offset = {
      minX: null,
      minY: null,
      maxX: null,
      maxY: null
    }
  }

  getRealPoints() {
    let {x, y, a, b} = this.options;
    let points = [], angle = 0;

    for (let i = 0; i < this.pointsNumber; i++) {
      points.push([x + a / 2 * Math.sin(angle), y + b / 2 * Math.cos(angle)]);
      angle += Math.PI * 2 / 100;
    }

    return points;
  }

  _draw(context) {
    // if (!this.options.apiMode) {
    //   this.realPoints = this.getRealPoints();
    // }
    this.realPoints = this.getRealPoints();
    this.getRange();
    this.createPath(context, this.realPoints);
  }

  createPath(context, points) {
    context.save();
    context.beginPath();

    //小程序api绘制，贝塞尔曲线绘制(精确度度高，效率稍差)
    if (this.options.apiMode) {
      let {x, y, a, b} = this.options;

      let k = 0.5522848,
        ox = a * k,  //水平控制偏移量
        oy = b * k;  //垂直控制偏移量

      //从椭圆左端点开始顺时针绘制四条三次贝塞尔曲线
      context.moveTo(x - a, y);
      context.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
      context.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
      context.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
      context.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);

    } else {
      context.moveTo(points[0][0], points[0][1]);

      for (let i = 0; i < this.pointsNumber; i++) {
        context.lineTo(points[i][0], points[i][1]);
      }
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
  }

  //记录开始坐标
  getStartCoordinates(location){
    let {x, y} = this.options;
    this.translate.x = x - location.x;
    this.translate.y = y - location.y;
  }

  getRange(){
    let options = this.realPoints;
    let {minX, minY, maxX, maxY} = Common.geRange(options);

    this.offset.minX = minX;
    this.offset.minY = minY;
    this.offset.maxX = maxX;
    this.offset.maxY = maxY;
  }

  move(location){
    this.options.x = location.x + this.translate.x;
    this.options.y = location.y + this.translate.y;
  }
}

export default Ellipse;