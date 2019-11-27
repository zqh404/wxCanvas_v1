import Common from '../../common.js';

class Rect {
  constructor(options, guid) {
    var _t = this;

    /**
     * x - rect中心 x 坐标
     * y - rect中心 y 坐标
     * w - rect宽度
     * h - rect高度
     */
    _t.options = Common._extends({
      x: 0,
      y: 0,
      w: 50,
      h: 50,
    }, Common.commonParams(), options || {});

    _t.offset = {
      minX: null,
      minY: null,
      maxX: null,
      maxY: null
    }

    _t.guid = guid; //全局唯一标识号

    _t.realPoints = []; //四个点的真实坐标

    _t.defaultColor = "black";
  }

  _draw(context) {
    if(!this.options.apiMode){
      this.realPoints = this.getRealPoints();
    }

    this.createPath(context, this.realPoints);
  }

  //获取四个顶点坐标
  getRealPoints() {
    var {x, y, w, h} = this.options;

    var points = [];

    points.push([x - w / 2, y - h / 2]);
    points.push([x - w / 2, y + h / 2]);
    points.push([x + w / 2, y + h / 2]);
    points.push([x + w / 2, y - h / 2]);

    return points
  }

  //创建绘制
  createPath(context, points) {
    context.save();
    context.beginPath();

    //小程序api绘制模式
    if(this.options.apiMode){
      let {x, y, w, h} = this.options;
      context.rect(x -  w / 2, y - h / 2, w, h);

    }else{ //手动绘制模式
      context.moveTo(points[0][0], points[0][1]);

      for (let i = 0, len = points.length; i < len; i++) {
        context.lineTo(points[i][0], points[i][1]);
      }
    }

    context.closePath();

    //填充色
    if(this.options.fillMode === "fill"){
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
  },

  getRange() {
    let options = this.realPoints;

    options.forEach(point => {
      if(point[0].x > this.offset.maxX){
        this.offset.maxX = point[0].x;
      }
      if(!this.offset.minX && this.offset.minX !== 0){
        this.offset.minX = point[0].x;
      }
    })
  }
}

export default Rect;