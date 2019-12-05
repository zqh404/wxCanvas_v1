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

    _t.translate = {x: 0, y: 0}; //位移坐标

    _t.offset = {
      minX: null,
      minY: null,
      maxX: null,
      maxY: null
    }

    _t.heartCenterPoint = this.getHeartCenterPoint(_t.options.points); //获取几何重心
  }

  getRealPoints(){
    let {points} = this.options;

    return points;
  }

  _draw(context){
    this.realPoints = this.getRealPoints();
    this.getRange();
    this.createPath(context, this.realPoints);
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

  }

  getRange(){
    let options = this.realPoints;
    let {minX, minY, maxX, maxY} = Common.geRange(options);

    this.offset.minX = minX;
    this.offset.minY = minY;
    this.offset.maxX = maxX;
    this.offset.maxY = maxY;
  }

  //记录开始坐标
  getStartCoordinates(location){
    let {pointCenterX,pointCenterY } = this.heartCenterPoint;
    this.translate.x = pointCenterX - location.x;
    this.translate.y = pointCenterY - location.y;
  }

  //移动
  move(location){
    this.options.points.map(v=>{
      v[0] += location.x + this.translate.x;
      v[1] += location.y + this.translate.y;
    })
  }

  //获取几何重心
  getHeartCenterPoint(points){
    let pointCenterX = 0, pointCenterY = 0;
    let length = points.length;

    Array.prototype.forEach.call(points, item => {
      pointCenterX += item[0];
      pointCenterY += item[1];
    });

    return {
      pointCenterX: pointCenterX / length,
      pointCenterY: pointCenterY / length
    }
  }
}

export default CShape;