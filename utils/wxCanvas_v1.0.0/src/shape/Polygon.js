import Common from '../../common.js';

class Polygon {
  constructor(options, guid) {
    let _t = this;

    _t.guid = guid;

    /**
     * x - 多边形中心x轴坐标
     * y - 多边形中心y轴坐标
     * r - 多边形中垂线长度
     * sides - 多边形边数 （sides >=3）
     */
    options.sides = !options.sides || options.sides < 3 ? 3 : options.sides;

    _t.options = Common._extends({
      x: 0,
      y: 0,
      r: 40,
      sides: 3
    }, Common.commonParams(), options || {});

    _t.defaultColor = "black";

    _t.realPoints = []; //真实点

    _t.translate = {x: 0, y: 0}; //位移坐标

    _t.offset = {
      minX: null,
      minY: null,
      maxX: null,
      maxY: null
    }
  }

  getRealPoints() {
    let {x, y, r, sides} = this.options;
    let points = [], angel = 0;

    for(let i = 0; i< sides; i++){
      points.push([x + r * Math.sin(angel), y + r * Math.cos(angel)]);
      angel += Math.PI * 2 / sides;
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
    let {x, y, r, sides} = this.options;
    //小程序api绘制
    if (this.options.apiMode) {
      //暂时无法实现

    }else {
      context.save();
      context.beginPath();
      context.moveTo(points[0][0], points[0][1]);
      for(let i = 0; i < sides; i++){
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

export default Polygon;